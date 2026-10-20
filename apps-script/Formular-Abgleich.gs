/**
 * LOS Leitstand – Formular-Abgleich
 *
 * Dieses Skript hängt am Google Sheet mit den Antworten des Anmeldeformulars.
 * Es gibt die Antworten an den LOS Leitstand weiter (nur mit dem richtigen Schlüssel)
 * und trägt auf Wunsch den Status aus dem Leitstand in die Spalte "Status LOS" ein.
 *
 * Einrichtung (einmalig, am besten mit dem LOS-Konto info@):
 *  1. Antwort-Sheet öffnen › Erweiterungen › Apps Script.
 *  2. Den gesamten Inhalt dieser Datei dort einfügen und speichern.
 *  3. Oben die Funktion "einrichten" auswählen › Ausführen › Zugriff erlauben.
 *     Unten im Ausführungsprotokoll steht der Schlüssel – kopieren.
 *  4. Bereitstellen › Neue Bereitstellung › Typ "Web-App":
 *       Ausführen als: Ich        Zugriff: Jeder
 *     › Bereitstellen › die Web-App-URL kopieren.
 *  5. Im LOS Backstage: Anmeldungen › Google-Formular › Automatischer Abgleich:
 *     URL und Schlüssel eintragen › Speichern › Jetzt abgleichen.
 *
 * Regiondo (Ticketverkauf, optional):
 *  1. Im Regiondo-Dashboard: Connectivity › API configuration › Generate keys.
 *  2. Hier im Skript: Zahnrad links (Projekteinstellungen) › Skripteigenschaften ›
 *       REGIONDO_PUBLIC  = öffentlicher Schlüssel
 *       REGIONDO_PRIVATE = privater Schlüssel
 *  3. Funktion "regiondoTesten" ausführen – im Protokoll stehen die gefundenen Vorstellungen.
 *  4. Bereitstellen › Bereitstellungen verwalten › Stift › Version: Neue Version › Bereitstellen.
 *  Der private Schlüssel bleibt im Skript und geht nie an den Browser.
 *
 * Schlüssel verloren oder weitergegeben? Funktion "neuerSchluessel" ausführen und
 * den neuen Schlüssel im Leitstand eintragen. Der alte gilt dann nicht mehr.
 */

const BLATT = '';               // leer = erstes Tabellenblatt (dort landen die Formularantworten)
const STATUS_SPALTE = 'Status LOS';

function einrichten() {
  const props = PropertiesService.getScriptProperties();
  let t = props.getProperty('LOS_TOKEN');
  if (!t) {
    t = (Utilities.getUuid() + Utilities.getUuid()).replace(/-/g, '').slice(0, 40);
    props.setProperty('LOS_TOKEN', t);
  }
  const sh = blatt_();
  Logger.log('Schlüssel für den Leitstand: ' + t);
  Logger.log('Tabellenblatt: "' + sh.getName() + '" mit ' + Math.max(0, sh.getLastRow() - 1) + ' Antworten');
}

function neuerSchluessel() {
  PropertiesService.getScriptProperties().deleteProperty('LOS_TOKEN');
  einrichten();
}

/** Leitstand holt die Antworten */
function doGet(e) {
  if (!erlaubt_(e && e.parameter && e.parameter.token)) return json_({ ok: false, error: 'Falscher Schlüssel' });
  if (e.parameter.action === 'regiondo') return regiondo_(e.parameter.from, e.parameter.to);
  const sh = blatt_();
  const werte = sh.getDataRange().getDisplayValues();
  const kopf = werte[0] || [];
  const sc = kopf.indexOf(STATUS_SPALTE);
  const ohneStatus = r => (sc < 0 ? r : r.filter((_, i) => i !== sc));
  const zeilen = werte.slice(1).filter(r => r.some(c => String(c).trim() !== ''));
  return json_({ ok: true, blatt: sh.getName(), header: ohneStatus(kopf), rows: zeilen.map(ohneStatus) });
}

/** Leitstand meldet Entscheidungen zurück (zugelassen / Warteliste / abgesagt) */
function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); } catch (x) { return json_({ ok: false, error: 'Ungültige Anfrage' }); }
  if (!erlaubt_(body.token)) return json_({ ok: false, error: 'Falscher Schlüssel' });
  if (body.action !== 'status') return json_({ ok: false, error: 'Unbekannte Aktion' });
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sh = blatt_();
    const werte = sh.getDataRange().getDisplayValues();
    const kopf = werte[0] || [];
    const ec = kopf.findIndex(h => /^e-?mail/i.test(String(h).trim()));
    if (ec < 0) return json_({ ok: false, error: 'Spalte "E-Mail" nicht gefunden' });
    let sc = kopf.indexOf(STATUS_SPALTE);
    if (sc < 0) { sc = sh.getLastColumn(); sh.getRange(1, sc + 1).setValue(STATUS_SPALTE); }
    let n = 0;
    (body.items || []).forEach(it => {
      const mail = String(it.email || '').trim().toLowerCase();
      if (!mail) return;
      for (let i = 1; i < werte.length; i++) {
        if (String(werte[i][ec]).trim().toLowerCase() === mail) { sh.getRange(i + 1, sc + 1).setValue(String(it.status || '')); n++; }
      }
    });
    return json_({ ok: true, aktualisiert: n });
  } finally {
    lock.releaseLock();
  }
}

function blatt_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return (BLATT && ss.getSheetByName(BLATT)) || ss.getSheets()[0];
}
function erlaubt_(t) {
  const soll = PropertiesService.getScriptProperties().getProperty('LOS_TOKEN');
  return !!soll && !!t && String(t) === soll;
}
function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

/** Regiondo: verkaufte Tickets je Vorstellung (ohne Käuferdaten) */
function regiondo_(from, to) {
  const props = PropertiesService.getScriptProperties();
  const pub = props.getProperty('REGIONDO_PUBLIC'), priv = props.getProperty('REGIONDO_PRIVATE');
  if (!pub || !priv) return json_({ ok: false, error: 'Regiondo ist im Skript noch nicht eingerichtet' });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(from || '') || !/^\d{4}-\d{2}-\d{2}$/.test(to || '')) return json_({ ok: false, error: 'Zeitraum fehlt' });
  const summe = {};
  for (let offset = 0; offset < 10000; offset += 250) {
    const params = [['date_range', from + ',' + to], ['date_range_by', 'date_of_event'], ['limit', '250'], ['offset', String(offset)]];
    const qs = params.map(p => encodeURIComponent(p[0]) + '=' + encodeURIComponent(p[1])).join('&');
    const time = String(Math.floor(Date.now() / 1000));
    const hash = Utilities.computeHmacSha256Signature(time + pub + qs, priv)
      .map(b => ('0' + (b & 0xff).toString(16)).slice(-2)).join('');
    const res = UrlFetchApp.fetch('https://api.regiondo.com/v1/supplier/bookings?' + qs, {
      headers: { 'X-API-ID': pub, 'X-API-TIME': time, 'X-API-HASH': hash, 'Accept-Language': 'de-DE' },
      muteHttpExceptions: true
    });
    if (res.getResponseCode() !== 200) return json_({ ok: false, error: 'Regiondo antwortet mit ' + res.getResponseCode() + ': ' + res.getContentText().slice(0, 200) });
    const body = JSON.parse(res.getContentText());
    const liste = Array.isArray(body) ? body : (body.data || []);
    liste.forEach(b => {
      if (['canceled', 'rejected'].indexOf(String(b.status)) > -1) return;
      const when = String(b.event_date_time || b.date_applied_for || '');
      const k = when + '|' + (b.product_id || '');
      summe[k] = summe[k] || { when: when, product: String(b.product_id || ''), name: b.ticket_name || b.product_name || '', qty: 0 };
      summe[k].qty += Number(b.qty) || 0;
    });
    if (liste.length < 250) break;
  }
  return json_({ ok: true, events: Object.keys(summe).map(k => summe[k]) });
}

function regiondoTesten() {
  const heute = new Date(), bis = new Date(heute.getTime() + 365 * 864e5);
  const f = d => Utilities.formatDate(d, 'Europe/Berlin', 'yyyy-MM-dd');
  Logger.log(regiondo_(f(heute), f(bis)).getContent());
}
