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
//   1. https://www.google.com/recaptcha/admin → Site ekle → reCAPTCHA v3 → Site Key kopyala
//   2. Firebase Console → App Check → Web uygulamanızı kaydet → reCAPTCHA site key'i girin
//   3. Aşağıdaki sabiti kendi site key'inizle değiştirin
//   4. Firebase Console → App Check → "Enforce" butonuna tıklayın (zorunlu hale getir)
//
// NOT: Site key ayarlanana kadar App Check isteğe bağlı modda çalışır (bloklamaz).
const RECAPTCHA_V3_SITE_KEY = "6LdzYIQtAAAAAOdTScU4YVGIJfdrWwq_pt62RGFz";

if (RECAPTCHA_V3_SITE_KEY) {
  try {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(RECAPTCHA_V3_SITE_KEY),
      isTokenAutoRefreshEnabled: true,
    });
  } catch (err) {
    console.warn("[App Check] Başlatılamadı:", err.message);
  }
} else {
  // Geliştirme ortamında debug token kullanılabilir
  // self.FIREBASE_APPCHECK_DEBUG_TOKEN = true; // Sadece local dev için
  console.info(
    "[App Check] RECAPTCHA_V3_SITE_KEY tanımlanmamış. " +
    "Üretim ortamında App Check etkinleştirilmeli: SECURITY.md dosyasına bakın."
  );
}

export const auth = getAuth(app);
export const db = getFirestore(app);
