// LOS Leitstand – Konfiguration
//
// 1) Die Werte unter "firebase" kommen aus der Firebase-Konsole:
//    Projekteinstellungen › Allgemein › Meine Apps › Web-App › "Konfiguration".
//    Diese Werte sind nicht geheim – geschützt werden die Daten durch firestore.rules.
// 2) Unter "admins" die Adressen eintragen, die immer zur Leitung gehören (Notzugang).
//    Genau dieselben Adressen auch in firestore.rules bei ADMINS() eintragen.
//
// Solange hier noch Platzhalter (DEIN_…) stehen, läuft die Seite als Prototyp mit Beispieldaten.

window.LOS_CONFIG = {
  firebase: {
    apiKey: "AIzaSyDnwTlwNgX27j_Yx7RzJImxzber9TWbBfM",
    authDomain: "los-leitstand.firebaseapp.com",
    projectId: "los-leitstand",
    storageBucket: "los-leitstand.firebasestorage.app",
    messagingSenderId: "1098812961422",
    appId: "1:1098812961422:web:6c6cd0f037da4e5e444fdf"
  },
  admins: ["interne.leitung.los@gmail.com", "info@libanon-on-stage.de", "marketing.fundraising.los@gmail.com"]
};
