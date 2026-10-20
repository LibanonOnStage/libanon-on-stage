# LOS Backstage – Einrichtung

Diese Anleitung bringt LOS Backstage einmalig online. Danach melden sich alle mit ihrem Google-Konto an und sehen genau das, was ihre Rolle sehen darf. Programmierkenntnisse braucht ihr nicht; alles läuft über Webseiten. Rechnet mit etwa einer Stunde.

**Was ihr braucht**

- Ein Google-Konto, das bei LOS bleibt, auch wenn Personen wechseln. Wir starten mit dem Positionskonto **interne.leitung.los@gmail.com**. Später nehmt ihr info@libanon-on-stage.de als zweite Inhaberin dazu (Schritt 10).
- Ein GitHub-Konto (kostenlos), ebenfalls mit interne.leitung.los@gmail.com. Darüber läuft die Webadresse.
- Die Dateien aus diesem Ordner.

**Was es kostet:** Für den Probelauf nichts. Bevor ihr echte Leute einladet, braucht ihr den Firebase-Tarif „Blaze“ mit Budget-Warnung (Schritt 8). Bei rund 60 Personen bleibt ihr damit bei wenigen Euro im Jahr.

---

## 1. Firebase-Projekt anlegen

1. Mit **interne.leitung.los@gmail.com** auf **console.firebase.google.com** gehen.
2. „Projekt erstellen“ › Name: `los-leitstand` › Google Analytics **ausschalten** › Erstellen.

## 2. Anmeldung einschalten (Google und Anmelde-Link)

1. Links: **Build › Authentication** › „Los geht’s“.
2. Reiter „Anmeldemethode“ › **Google** › Aktivieren › Support-E-Mail: interne.leitung.los@gmail.com › Speichern.
3. „Neuen Anbieter hinzufügen“ › **E-Mail-Adresse/Passwort** › oberen Schalter **und** den Schalter **„E-Mail-Link (Anmeldung ohne Passwort)“** aktivieren › Speichern.
   Damit können sich auch Leute ohne Google-Konto anmelden: Sie geben ihre Adresse ein und bekommen eine Mail mit einem Link. Passwörter gibt es in LOS Backstage nicht.
4. Optional: Reiter **Vorlagen** › Stift beim Absender › Absendername `LOS Backstage`. Die Mails kommen von `noreply@…firebaseapp.com` und landen anfangs manchmal im Spam-Ordner.

## 3. Datenbank anlegen und absichern

1. Links: **Build › Firestore Database** › „Datenbank erstellen“.
2. Standort: **europe-west3 (Frankfurt)**. Diese Wahl lässt sich später nicht ändern.
3. „Im Produktionsmodus starten“ › Erstellen.
4. Reiter **Regeln**: alles löschen und den kompletten Inhalt von `firestore.rules` einfügen.
5. In der Zeile `function ADMINS()` die Adressen eintragen, die immer zur Leitung gehören (Notzugang), z. B.
   `return ['interne.leitung.los@gmail.com', 'info@libanon-on-stage.de'];` (so ist es schon vorbereitet).
6. **Veröffentlichen**.

Diese Regeln entscheiden auf dem Server, wer was lesen und ändern darf. Selbst wer die Seite manipuliert, kommt nicht an Finanzen, Anmeldungen oder Vorjahre.

## 4. Web-App registrieren und config.js ausfüllen

1. Zahnrad oben links › **Projekteinstellungen** › Allgemein › unten „Meine Apps“ › Symbol **</>** (Web).
2. Name: `LOS Backstage`. Firebase Hosting **nicht** anhaken › App registrieren.
3. Es erscheint ein Block `const firebaseConfig = { apiKey: "...", ... }`. Diese Werte in `config.js` bei `firebase:` übernehmen.
4. In `config.js` unter `admins` dieselben Adressen eintragen wie in Schritt 3.5.

Die Werte in `config.js` sind nicht geheim. Geschützt werden die Daten durch die Regeln aus Schritt 3.

## 5. Online stellen (GitHub Pages)

1. Auf **github.com** › „Sign up“ mit interne.leitung.los@gmail.com. Als Benutzernamen etwas Kurzes wählen, z. B. `libanon-on-stage` – er wird Teil der Webadresse.
   Danach oben rechts „+“ › **New repository**.
2. Name: `los-leitstand`, Sichtbarkeit **Public** › Create repository.
3. „uploading an existing file“ › `index.html` und `config.js` hineinziehen › Commit changes.
   Die übrigen Dateien (Anleitung, Regeln, Skript) könnt ihr zur Ablage mit hochladen; nötig sind sie dort nicht.
4. Im Repository: **Settings › Pages** › Source: „Deploy from a branch“ › Branch `main`, Ordner `/ (root)` › Save.
5. Nach 1–2 Minuten steht oben die Adresse, z. B. `https://libanon-on-stage.github.io/los-leitstand/`.
6. Zurück in Firebase: **Authentication › Einstellungen › Autorisierte Domains** › Domain hinzufügen › `libanon-on-stage.github.io` (euer GitHub-Name + `.github.io`).

„Public“ heißt nur, dass der Programmcode sichtbar ist. Eure Daten liegen nicht dort, sondern geschützt in Firebase.

## 6. Erste Anmeldung

1. Die Adresse aus Schritt 5 öffnen › „Mit Google anmelden“ mit einer Adresse aus `admins`.
2. Die Datenbank ist leer, deshalb fragt LOS Backstage nach eurem Namen und eurer Position und bietet zwei Wege an:
   - **Erst ausprobieren: mit Beispieldaten.** Ideal für den Probelauf (Schritt 7).
   - **Echt starten: LOS 2027 – Les Misérables.** Legt 2027 mit den echten Terminen an (Probewoche 12.–21.03., Tour 01.–04.04., 08.–11.04. und 01.–03.05.), außerdem Gewerke, Vorlage-Aufgaben, Kostenposten (Plan 0 €) und den Feedback-Bogen.
3. Unter **Zugänge & Rechte** die anderen aus der Leitung, Regie und Regieassistenz mit ihrer Google-Adresse eintragen. Mehrere Adressen pro Person mit Komma trennen, z. B. private Adresse und `marketing.fundraising.los@gmail.com`.

Wer zugelassen wird (Anmeldungen › Neu › Zulassen), bekommt automatisch Zugang mit der Adresse aus dem Formular. Die Zusage-Mail enthält die Adresse von LOS Backstage und erklärt die Anmeldung: mit Google oder per Anmelde-Link, beides mit genau dieser Adresse. Meldet sich jemand mit einer anderen Adresse an, sieht er „Noch nicht freigeschaltet“ mit genau dieser Adresse. Die tragt ihr dann bei der Person ein, und es geht bei ihr sofort weiter.

## 7. Probelauf mit vier Rollen

1. Mit Beispieldaten starten (Schritt 6).
2. Unter **Zugänge & Rechte** echte Google-Adressen von Testpersonen eintragen:
   - Konrad Albers → Regie
   - Pia Sommer → Regieassistenz
   - Lea Brandt → Ensemble
3. Jede Testperson öffnet die Adresse auf ihrem Handy und meldet sich an. Ihr seht dann live, was jede Rolle sieht und darf. Ändert die Regie einen Probentag, erscheint das bei allen anderen ohne Neuladen.
4. Als Leitung könnt ihr auch selbst oben über **Vorschau** in jede Rolle schauen.
5. Danach aufräumen: **Projektjahre** › bei 2026 „Wieder öffnen“ › dann 2026 und 2027 „Löschen“. Sobald kein Jahr mehr da ist, erscheint wieder der Start-Bildschirm › „Echt starten“.

Tipp fürs Handy: Seite im Browser öffnen › Teilen › „Zum Home-Bildschirm“. Dann liegt LOS Backstage wie eine App auf dem Handy. Links aus Instagram bitte im normalen Browser öffnen, weil Google den Login in manchen App-Browsern blockiert.

## 8. Bevor ihr das Team einladet: Tarif „Blaze“ mit Budget-Warnung

Im kostenlosen Tarif verschickt Firebase nur **5 Anmelde-Links pro Tag**. Für den Probelauf reicht das, für 60 Leute nicht. Mit Blaze sind es 25.000 pro Tag, und die Links selbst kosten nichts.

Außerdem erlaubt der kostenlose Tarif 50.000 Lesevorgänge pro Tag. An Tour-Tagen, wenn 60 Leute mehrmals am Tag ihren Tag und ihre Fahrt nachschauen, kann es knapp werden. Dann würde LOS Backstage für den Rest des Tages keine Daten mehr laden.

1. Firebase › unten links „Upgrade“ › **Blaze** › Zahlungsmittel hinterlegen (das Konto des Werke e.V. oder eine LOS-Karte).
2. Ein **Budget** von z. B. 5 € pro Monat mit E-Mail-Warnung anlegen.

Die ersten 50.000 Lesevorgänge pro Tag bleiben kostenlos. Darüber kosten 100.000 Lesevorgänge wenige Cent.

## 9. Google-Formular anbinden

So kommen neue Anmeldungen automatisch in LOS Backstage. Am Formular selbst ändert sich nichts.

1. Das **Antwort-Sheet** des Formulars öffnen, mit interne.leitung.los@gmail.com oder info@ (das Konto braucht Bearbeitungsrechte am Sheet).
2. **Erweiterungen › Apps Script** › den Inhalt von `apps-script/Formular-Abgleich.gs` einfügen › Speichern.
3. Oben die Funktion **einrichten** auswählen › Ausführen › Zugriff erlauben. Unten im Protokoll steht der **Schlüssel** – kopieren.
4. **Bereitstellen › Neue Bereitstellung** › Zahnrad › **Web-App** › Ausführen als: **Ich** › Zugriff: **Jeder** › Bereitstellen › **Web-App-URL** kopieren.
5. Im LOS Backstage: **Anmeldungen › Google-Formular › Automatischer Abgleich** › URL und Schlüssel eintragen › Speichern › **Jetzt abgleichen**.

Danach gleicht LOS Backstage automatisch ab, sobald jemand aus der Leitung ihn öffnet, und dann alle 15 Minuten. Doppelte Anmeldungen erkennt er an der E-Mail-Adresse. Eure Entscheidungen (zugelassen, Warteliste, abgesagt) schreibt er zusätzlich in die Spalte „Status LOS“ im Sheet.

„Zugriff: Jeder“ bedeutet: Wer die URL **und** den Schlüssel hat, kann die Antworten abrufen. Ohne Schlüssel gibt das Skript nichts heraus. Der Schlüssel liegt in LOS Backstage nur für die Leitung lesbar. Falls er doch einmal weitergegeben wurde, im Skript **neuerSchluessel** ausführen und den neuen Schlüssel in LOS Backstage eintragen.

Wichtig: Das Skript läuft unter dem Konto, das es bereitstellt. Verliert dieses Konto den Zugriff auf das Sheet, stoppt der Abgleich. Deshalb gehört es zu einem Positions- oder LOS-Konto und nicht zu einer Privatperson. Bei einem neuen Formular für 2028 die Schritte 1–5 am neuen Sheet wiederholen.

## 9b. Regiondo anbinden (Ticketverkauf)

Die verkauften Online-Tickets holt LOS Backstage über dasselbe Google-Skript aus Regiondo. Der geheime Regiondo-Schlüssel bleibt dabei im Skript und kommt nie in den Browser.

1. Im **Regiondo-Dashboard**: Connectivity › API configuration › **Generate keys**. Es gibt einen öffentlichen und einen privaten Schlüssel.
2. Im **Apps-Script-Editor** am Antwort-Sheet: den neuen Inhalt von `apps-script/Formular-Abgleich.gs` einfügen (er enthält jetzt auch Regiondo) › speichern.
3. Links das **Zahnrad (Projekteinstellungen)** › ganz unten **Skripteigenschaften** › zwei Eigenschaften hinzufügen:
   - `REGIONDO_PUBLIC` = öffentlicher Schlüssel
   - `REGIONDO_PRIVATE` = privater Schlüssel
4. Oben die Funktion **regiondoTesten** ausführen. Im Protokoll stehen die gefundenen Vorstellungen mit Anzahl Tickets.
5. **Bereitstellen › Bereitstellungen verwalten** › Stift › Version: **Neue Version** › Bereitstellen. (So bleibt die Web-App-Adresse gleich.)
6. In LOS Backstage: **Tour › Spielorte › Jetzt abgleichen**. Danach gleicht LOS Backstage automatisch alle 15 Minuten ab.

Zugeordnet wird über das Datum der Vorstellung. Gibt es an einem Tag zwei Vorstellungen, zusätzlich über die Uhrzeit. Verkauft ihr in Regiondo mehrere Produkte für denselben Tag, tragt beim Spielort die **Regiondo-Produkt-ID** ein. Die Abendkasse tragt ihr wie bisher von Hand ein.

## 10. Später: info@ als zweite Inhaberin

Damit das Projekt nicht an einem einzigen Konto hängt:

1. Firebase › Zahnrad › **Nutzer und Berechtigungen** › Mitglied hinzufügen › `info@libanon-on-stage.de` › Rolle **Inhaber**.
2. GitHub › Repository › Settings › **Collaborators** › info@ (bzw. dessen GitHub-Konto) einladen.

---

## Im laufenden Betrieb

| Was | Wo |
|---|---|
| Neues LOS-Jahr anlegen | Projektjahre › Neues Jahr anlegen. Leitung, Regie, Fahrzeuge, Vorlage-Aufgaben und Kostenposten werden übernommen. |
| Altes Jahr abschließen | Projektjahre › Einfrieren. Danach können es nur noch die Leitung lesen und niemand mehr ändern. Ensemble-Mitglieder, die nicht auch im neuen Jahr eingetragen sind, verlieren damit ihren Zugang. Deshalb erst einfrieren, wenn das Feedback durch ist. |
| Leitungswechsel | Zugänge & Rechte › bei der Position die neue Google-Adresse eintragen, die alte entfernen. |
| Jemand kommt nicht rein | Die Adresse aus „Noch nicht freigeschaltet“ bei der Person unter Zugänge & Rechte eintragen. |
| Notzugang | Die Adressen in `admins` (config.js) und `ADMINS()` (Regeln) sind immer Leitung. |
| Sicherung | Projektjahre › „Sicherung herunterladen“ und die Datei in Drive ablegen, z. B. nach jedem Einfrieren. |

## Wer darf was (vom Server erzwungen)

| | Leitung | Regie | Regieassistenz | Ensemble |
|---|---|---|---|---|
| Vorjahre | lesen | – | – | – |
| Aufgaben, Finanzen, Anmeldungen, Formular-Zugang | lesen & ändern | – | – | – |
| Meetings | lesen & ändern | lesen | lesen | – |
| Probentage im Ablaufplan | ändern | ändern | ändern | lesen |
| Tour-Tage, Fahrten, Unterkünfte, Spielorte | ändern | lesen | lesen | lesen |
| Besetzung | ändern | ändern & bestätigen | vorschlagen | – |
| Bewerber für die Besetzung | alles | Name, Foto, Wunsch | Name, Foto, Wunsch | – |
| Dashboard-Summen | alles | Summen | Summen | Summen |
| Feedback | auswerten | – | – | abgeben, wenn freigeschaltet |

## Dateien in diesem Ordner

- `index.html` – LOS Backstage (eine Datei, keine Installation)
- `config.js` – eure Firebase-Werte und Notzugänge
- `firestore.rules` – die Sicherheitsregeln (Schritt 3)
- `apps-script/Formular-Abgleich.gs` – das Skript fürs Antwort-Sheet (Schritt 9)
- `firebase.json` – nur nötig, falls ihr später lieber mit dem Firebase-Werkzeug statt GitHub arbeitet
