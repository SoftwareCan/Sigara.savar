import { auth } from "./firebase.js";
import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {
  checkRateLimit,
  clearRateLimit,
  validateEmail,
  validatePassword,
  validateName,
  logSecEvent,
  preventClickjacking,
  RateLimitError,
} from "./security.js";

// ─── Clickjacking ─────────────────────────────────────────────────────────────────
preventClickjacking();

// ─── Sayfa başlangıçta gizli — auth state belli olana kadar hiçbir şey görünmez ─────
document.body.hidden = true;

// ─── Giriş yapılmışsa sessizce dashboard'a yönlendir ────────────────────────────────────
const _unsubscribeAuthCheck = onAuthStateChanged(auth, (user) => {
  _unsubscribeAuthCheck(); // Tek seferlik — dinlemeyi hemen bırak
  if (user) {
    // Zaten giriş yapmış — form hiç gösterilmeden dashboard'a geç
    window.location.replace("dashboard.html");
    return;
  }
  // Giriş yapılmamış — formu göster
  document.body.hidden = false;
});


// ─── DOM referansları ─────────────────────────────────────────────────────────
const tabs = document.querySelectorAll(".auth-tab");
const forms = {
  login:    document.getElementById("panel-login"),
  register: document.getElementById("panel-register"),
  forgot:   document.getElementById("panel-forgot"),
};
const msgBox = document.getElementById("auth-message");

// ─── Tab mantığı ─────────────────────────────────────────────────────────────
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => { t.classList.remove("active"); t.setAttribute("aria-selected", "false"); });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    clearMsg();
    showForm(tab.id === "tab-login" ? "login" : "register");
  });
});

function showForm(name) {
  Object.entries(forms).forEach(([key, el]) => {
    el.hidden = key !== name;
    el.classList.toggle("active", key === name);
  });
}

// ─── Mesaj yardımcıları ───────────────────────────────────────────────────────
function showMsg(text, type = "error") {
  msgBox.textContent = text; // textContent: XSS-safe
  msgBox.className = `auth-message ${type}`;
  msgBox.hidden = false;
  msgBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function clearMsg() {
  msgBox.hidden = true;
  msgBox.textContent = "";
}

// ─── Spinner yardımcıları ─────────────────────────────────────────────────────
function setLoading(btn, loading) {
  btn.disabled = loading;
  const span    = btn.querySelector("span");
  const spinner = btn.querySelector(".btn-spinner");
  if (span)    span.hidden    = loading;
  if (spinner) spinner.hidden = !loading;
}

// ─── Firebase hata → Türkçe mesaj ────────────────────────────────────────────
const TR_ERRORS = {
  "auth/invalid-email":                        "Geçersiz e-posta adresi.",
  "auth/user-not-found":                       "Bu e-posta ile kayıtlı hesap bulunamadı.",
  "auth/wrong-password":                       "Şifre hatalı. Lütfen tekrar deneyin.",
  "auth/invalid-credential":                   "E-posta veya şifre hatalı.",
  "auth/email-already-in-use":                 "Bu e-posta adresi zaten kullanımda.",
  "auth/weak-password":                        "Şifre en az 6 karakter olmalıdır.",
  "auth/too-many-requests":                    "Çok fazla deneme yapıldı. Birkaç dakika bekleyip tekrar deneyin.",
  "auth/network-request-failed":               "Bağlantı hatası. İnternet bağlantınızı kontrol edin.",
  "auth/popup-closed-by-user":                 "Giriş penceresi kapatıldı.",
  "auth/cancelled-popup-request":              "",
  "auth/account-exists-with-different-credential":
    "Bu e-posta farklı bir yöntemle kayıtlı. Google veya Apple ile giriş deneyin.",
  "auth/operation-not-allowed":                "Bu giriş yöntemi etkin değil.",
  "auth/user-disabled":                        "Bu hesap devre dışı bırakılmış.",
  "auth/requires-recent-login":                "Bu işlem için yeniden giriş yapmanız gerekiyor.",
  "auth/app-check-token-error":                "Güvenlik doğrulaması başarısız. Sayfayı yenileyip tekrar deneyin.",
};

function trError(err) {
  if (err instanceof RateLimitError) return err.message;
  // Hata kodu bilgisi sızdırmaktan kaçın — sadece whitelist'tekileri döndür
  return TR_ERRORS[err.code] || "Bir hata oluştu. Lütfen tekrar deneyin.";
}

// ─── Google ile Giriş ────────────────────────────────────────────────────────
document.getElementById("btn-google").addEventListener("click", async () => {
  const btn = document.getElementById("btn-google");
  clearMsg();
  try {
    checkRateLimit("social_auth", 8, 10 * 60 * 1000); // 10 dk'da 8 deneme
    setLoading(btn, true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    await signInWithPopup(auth, provider);
    clearRateLimit("social_auth");
    logSecEvent("auth_success", { method: "google" });
  } catch (err) {
    const msg = trError(err);
    if (msg) showMsg(msg);
    if (err.code) logSecEvent("auth_failure", { method: "google", code: err.code });
    setLoading(btn, false);
  }
});

// ─── Apple ile Giriş ─────────────────────────────────────────────────────────
document.getElementById("btn-apple").addEventListener("click", async () => {
  const btn = document.getElementById("btn-apple");
  clearMsg();
  try {
    checkRateLimit("social_auth", 8, 10 * 60 * 1000);
    setLoading(btn, true);
    const provider = new OAuthProvider("apple.com");
    provider.addScope("email");
    provider.addScope("name");
    provider.setCustomParameters({ locale: "tr" });
    await signInWithPopup(auth, provider);
    clearRateLimit("social_auth");
    logSecEvent("auth_success", { method: "apple" });
  } catch (err) {
    const msg = trError(err);
    if (msg) showMsg(msg);
    if (err.code) logSecEvent("auth_failure", { method: "apple", code: err.code });
    setLoading(btn, false);
  }
});

// ─── E-posta ile Giriş ───────────────────────────────────────────────────────
forms.login.addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = document.getElementById("btn-login");
  clearMsg();

  // Doğrulama
  const emailRaw    = document.getElementById("login-email").value;
  const passwordRaw = document.getElementById("login-password").value;

  const emailV = validateEmail(emailRaw);
  if (!emailV.ok) { showMsg(emailV.msg); return; }

  const passV = validatePassword(passwordRaw);
  if (!passV.ok) { showMsg(passV.msg); return; }

  try {
    checkRateLimit("login", 5, 15 * 60 * 1000); // 15 dk'da 5 deneme
    setLoading(btn, true);
    await signInWithEmailAndPassword(auth, emailV.value, passwordRaw);
    clearRateLimit("login");
    logSecEvent("auth_success", { method: "email" });
  } catch (err) {
    showMsg(trError(err));
    logSecEvent("auth_failure", { method: "email", code: err.code });
    setLoading(btn, false);
  }
});

// ─── Kayıt ───────────────────────────────────────────────────────────────────
forms.register.addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = document.getElementById("btn-register");
  clearMsg();

  const nameRaw     = document.getElementById("reg-name").value;
  const emailRaw    = document.getElementById("reg-email").value;
  const passwordRaw = document.getElementById("reg-password").value;

  const nameV = validateName(nameRaw);
  if (!nameV.ok) { showMsg(nameV.msg); return; }

  const emailV = validateEmail(emailRaw);
  if (!emailV.ok) { showMsg(emailV.msg); return; }

  const passV = validatePassword(passwordRaw);
  if (!passV.ok) { showMsg(passV.msg); return; }

  try {
    checkRateLimit("register", 3, 30 * 60 * 1000); // 30 dk'da 3 kayıt denemesi
    setLoading(btn, true);
    const cred = await createUserWithEmailAndPassword(auth, emailV.value, passwordRaw);
    await updateProfile(cred.user, { displayName: nameV.value });
    clearRateLimit("register");
    logSecEvent("auth_success", { method: "register" });
  } catch (err) {
    showMsg(trError(err));
    logSecEvent("auth_failure", { method: "register", code: err.code });
    setLoading(btn, false);
  }
});

// ─── Şifremi Unuttum ─────────────────────────────────────────────────────────
document.getElementById("btn-forgot").addEventListener("click", () => {
  clearMsg();
  showForm("forgot");
  tabs.forEach((t) => { t.classList.remove("active"); t.setAttribute("aria-selected", "false"); });
});

document.getElementById("btn-back-login").addEventListener("click", () => {
  clearMsg();
  showForm("login");
  document.getElementById("tab-login").classList.add("active");
  document.getElementById("tab-login").setAttribute("aria-selected", "true");
});

forms.forgot.addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = document.getElementById("btn-reset");
  clearMsg();

  const emailRaw = document.getElementById("forgot-email").value;
  const emailV = validateEmail(emailRaw);
  if (!emailV.ok) { showMsg(emailV.msg); return; }

  try {
    checkRateLimit("reset", 3, 30 * 60 * 1000); // 30 dk'da 3 reset isteği
    setLoading(btn, true);
    await sendPasswordResetEmail(auth, emailV.value);
    clearRateLimit("reset");
    // Güvenlik: başarı/başarısız ayrımı yapma (email enumeration önleme)
    showMsg("Kayıtlı ise sıfırlama bağlantısı gönderildi. Gelen kutunuzu kontrol edin.", "success");
  } catch (err) {
    // Email enumeration: hata detayını gizle
    showMsg("Kayıtlı ise sıfırlama bağlantısı gönderildi. Gelen kutunuzu kontrol edin.", "success");
    logSecEvent("password_reset_attempt", { code: err.code });
  } finally {
    setLoading(btn, false);
  }
});

// ─── Şifre göster/gizle ──────────────────────────────────────────────────────
document.querySelectorAll(".toggle-pw").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = document.getElementById(btn.dataset.target);
    if (input) {
      input.type = input.type === "password" ? "text" : "password";
      btn.setAttribute("aria-label", input.type === "password" ? "Şifreyi göster" : "Şifreyi gizle");
    }
  });
});

// ─── Enter tuşu güvenliği: sosyal butonlarda form submit'i tetikleme ─────────
document.querySelectorAll(".social-btn").forEach((btn) => {
  btn.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); btn.click(); }
  });
});
