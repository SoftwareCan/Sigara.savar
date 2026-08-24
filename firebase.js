// firebase.js – Firebase SDK init + App Check (reCAPTCHA v3)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import {
  initializeAppCheck,
  ReCaptchaV3Provider,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app-check.js";

// ─── Firebase Config ───────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyBaSUgzmXpwTUFb0VBH4rb_U9m0ayQKOXE",
  authDomain: "sigara-savar.firebaseapp.com",
  databaseURL: "https://sigara-savar-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sigara-savar",
  storageBucket: "sigara-savar.firebasestorage.app",
  messagingSenderId: "995009915126",
  appId: "1:995009915126:web:546f5e1d5b64ae4340e4d7",
  measurementId: "G-0BCDQ9PJPY",
};

const app = initializeApp(firebaseConfig);

// ─── Firebase App Check (reCAPTCHA v3) ────────────────────────────────────────
// KURULUM:
//   1. https://www.google.com/recaptcha/admin → Site ekle → reCAPTCHA v3
//      Yetkili alan adları: sigarasavar.com ve softwarecan.github.io
//   2. Firebase Console → App Check → Web uygulamanızı kaydet
//      Aynı reCAPTCHA anahtar çiftinin SECRET KEY'ini Firebase Console'a girin
//   3. Aşağıdaki sabite tarayıcıda kullanılacak PUBLIC SITE KEY'i girin
//   4. Firebase Console → App Check → "Enforce" butonuna tıklayın (zorunlu hale getir)
//
const RECAPTCHA_V3_SITE_KEY = "6LdzYIQtAAAAAOdTScU4YVGIJfdrWwq_pt62RGFz";
const APP_CHECK_HOSTS = new Set([
  "sigarasavar.com",
  "www.sigarasavar.com",
  "softwarecan.github.io",
]);

if (RECAPTCHA_V3_SITE_KEY && APP_CHECK_HOSTS.has(window.location.hostname)) {
  try {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(RECAPTCHA_V3_SITE_KEY),
      isTokenAutoRefreshEnabled: true,
    });
  } catch (err) {
    console.warn("[App Check] Başlatılamadı:", err.code || "unknown");
  }
} else {
  console.info(
    "[App Check] Yerel veya tanımsız alan adında reCAPTCHA başlatılmadı."
  );
}

export const auth = getAuth(app);
export const db = getFirestore(app);
