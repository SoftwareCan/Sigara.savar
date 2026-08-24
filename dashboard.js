import { auth, db } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import {
  sanitizeText,
  escapeHTML,
  safeNumber,
  preventClickjacking,
  startIdleTimer,
  logSecEvent,
} from "./security.js";

// ─── Clickjacking koruması ─────────────────────────────────────────────────────
preventClickjacking();

// ─── Sağlık zaman çizelgesi verileri ──────────────────────────────────────────
const HEALTH_MILESTONES = [
  { minutes: 20,             label: "20 dakika", summary: "Kalp atışı ve kan basıncı normale döner.",                   icon: "❤️" },
  { minutes: 60,             label: "1 saat",    summary: "Nikotin etkisi büyük ölçüde azalır.",                        icon: "🫁" },
  { minutes: 8 * 60,        label: "8 saat",    summary: "Karbon monoksit seviyesi düşer.",                            icon: "💨" },
  { minutes: 12 * 60,       label: "12 saat",   summary: "Karbon monoksit seviyesi normale döner.",                    icon: "✅" },
  { minutes: 24 * 60,       label: "1 gün",     summary: "Kalp krizi riski azalmaya başlar.",                          icon: "🫀" },
  { minutes: 48 * 60,       label: "2 gün",     summary: "Koku ve tat alma duyuları güçlenmeye başlar.",               icon: "👃" },
  { minutes: 72 * 60,       label: "3 gün",     summary: "Bronşlar gevşer, nefes almak kolaylaşır.",                   icon: "🌬️" },
  { minutes: 14 * 1440,     label: "2 hafta",   summary: "Akciğer kapasitesi artmaya başlar.",                         icon: "💪" },
  { minutes: 30 * 1440,     label: "1 ay",      summary: "Öksürük ve sinüs sorunları azalır.",                         icon: "🟢" },
  { minutes: 90 * 1440,     label: "3 ay",      summary: "Akciğer fonksiyonu belirgin şekilde iyileşir.",              icon: "🏃" },
  { minutes: 180 * 1440,    label: "6 ay",      summary: "Stres yönetimi kolaylaşır, enerji artar.",                   icon: "⚡" },
  { minutes: 365 * 1440,    label: "1 yıl",     summary: "Kalp hastalığı riski yarı yarıya düşer.",                   icon: "🏆" },
  { minutes: 5 * 365 * 1440,label: "5 yıl",    summary: "İnme riski sigara içmeyenlerle aynı seviyeye gelir.",        icon: "🎯" },
  { minutes: 10 * 365 * 1440,label: "10 yıl",  summary: "Akciğer kanseri riski yarı yarıya düşer.",                  icon: "💎" },
  { minutes: 15 * 365 * 1440,label: "15 yıl",  summary: "Kalp hastalığı riski hiç içmemiş biriyle aynı.",            icon: "🌟" },
];

// ─── Başarı kataloğu ───────────────────────────────────────────────────────────
const ACHIEVEMENTS = [
  { id: "first_decision_30m",     title: "İlk Karar",          cat: "Zaman",  emoji: "🌱", minutes: 30  },
  { id: "first_threshold_1h",     title: "İlk Saat",           cat: "Zaman",  emoji: "⏰", hours: 1     },
  { id: "body_clock_3h",          title: "Vücut Saati",        cat: "Zaman",  emoji: "🕐", hours: 3     },
  { id: "deep_breath_6h",         title: "Derin Nefes",        cat: "Zaman",  emoji: "🌬️",hours: 6     },
  { id: "half_day_12h",           title: "Yarım Gün",          cat: "Zaman",  emoji: "🌓", hours: 12    },
  { id: "first_dawn_24h",         title: "İlk Şafak",          cat: "Zaman",  emoji: "🌅", hours: 24    },
  { id: "resistance_36h",         title: "Direniş",            cat: "Zaman",  emoji: "💪", hours: 36    },
  { id: "peak_patience_48h",      title: "Sabır Zirvesi",      cat: "Zaman",  emoji: "⛰️", hours: 48   },
  { id: "warrior_72h",            title: "Savaşçı",            cat: "Zaman",  emoji: "⚔️", hours: 72   },
  { id: "first_week_star",        title: "Hafta Yıldızı",      cat: "Zaman",  emoji: "⭐", days: 7      },
  { id: "ten_days_determination", title: "10 Günlük Azim",     cat: "Zaman",  emoji: "🔟", days: 10     },
  { id: "two_weeks_victory",      title: "2 Hafta Zaferi",     cat: "Zaman",  emoji: "🎖️",days: 14     },
  { id: "twenty_one_days",        title: "21 Gün Mucizesi",    cat: "Zaman",  emoji: "✨", days: 21     },
  { id: "first_month_champion",   title: "Aylık Şampiyon",     cat: "Zaman",  emoji: "🏅", days: 30     },
  { id: "forty_five_days",        title: "45 Gün Güçlü",       cat: "Zaman",  emoji: "💫", days: 45     },
  { id: "two_months_stability",   title: "2 Aylık Denge",      cat: "Zaman",  emoji: "⚖️", days: 60    },
  { id: "ninety_days_master",     title: "90 Gün Ustası",      cat: "Zaman",  emoji: "🎓", days: 90     },
  { id: "six_months_hero",        title: "6 Aylık Kahraman",   cat: "Zaman",  emoji: "🦸", days: 180    },
  { id: "nine_months_steadfast",  title: "9 Aylık Kararlılık", cat: "Zaman",  emoji: "🔒", days: 270    },
  { id: "one_year_legend",        title: "Efsane — 1 Yıl",    cat: "Zaman",  emoji: "🏆", days: 365    },
  { id: "first_clean_breath_week",title: "Temiz Nefes",        cat: "Sağlık", emoji: "🫁", days: 7      },
  { id: "lungs_spring",           title: "Akciğer Baharı",     cat: "Sağlık", emoji: "🌿", days: 14     },
  { id: "no_morning_cough",       title: "Öksürüksüz Sabah",   cat: "Sağlık", emoji: "☀️", days: 21    },
  { id: "deep_sleep_explorer",    title: "Derin Uyku",         cat: "Sağlık", emoji: "😴", days: 30     },
  { id: "energy_champion",        title: "Enerji Şampiyonu",   cat: "Sağlık", emoji: "⚡", days: 45     },
  { id: "stair_climber",          title: "Merdiven Tırmanışı", cat: "Sağlık", emoji: "🏃", days: 60     },
  { id: "oxygen_warrior",         title: "Oksijen Savaşçısı",  cat: "Sağlık", emoji: "💨", days: 90     },
  { id: "long_term_health_gain",  title: "Uzun Vadeli Sağlık", cat: "Sağlık", emoji: "💪", days: 180    },
  { id: "journal_first_note",     title: "İlk Not",            cat: "Günlük", emoji: "📝", journals: 1  },
  { id: "journal_started_thinking",title:"Düşünmeye Başladım", cat: "Günlük", emoji: "🤔", journals: 2  },
  { id: "journal_listening_self", title: "Kendimi Dinliyorum", cat: "Günlük", emoji: "👂", journals: 3  },
  { id: "journal_awareness_growing",title:"Farkındalık Büyüyor",cat:"Günlük",emoji: "🌱", journals: 5  },
  { id: "journal_gaining_clarity",title: "Netlik Kazanıyorum", cat: "Günlük", emoji: "🔍", journals: 7  },
  { id: "journal_knowing_yourself",title:"Kendini Tanıyorum",  cat: "Günlük", emoji: "🪞", journals: 10 },
];

// ─── Yardımcı hesaplamalar ─────────────────────────────────────────────────────
function minutesSince(date) {
  return Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
}

function formatMoney(amount, currency = "TRY") {
  const symbols = { TRY: "₺", EUR: "€", USD: "$", AZN: "₼", RUB: "₽" };
  const sym = symbols[currency] || (currency.slice(0, 3) + " ");
  const num = Math.max(0, Math.min(amount, 1e10)); // Saçma büyük değerleri sınırla
  return sym + num.toLocaleString("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function formatLifeGained(cigarettesNotSmoked) {
  const minutes = Math.max(0, cigarettesNotSmoked) * 11;
  if (minutes < 60)   return `${minutes} dakika`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)} saat`;
  return `${Math.floor(minutes / 1440)} gün`;
}

function isUnlocked(ach, msQ, journalCount = 0) {
  if (ach.minutes  !== undefined) return msQ >= ach.minutes;
  if (ach.hours    !== undefined) return msQ >= ach.hours * 60;
  if (ach.days     !== undefined) return msQ >= ach.days * 1440;
  if (ach.journals !== undefined) return journalCount >= ach.journals;
  return false;
}

function pad(n) { return String(n).padStart(2, "0"); }

// ─── Gerçek zamanlı sayaç ─────────────────────────────────────────────────────
let _rafId = null;

function startCounter(quitDate) {
  const daysEl   = document.getElementById("counter-days");
  const timeEl   = document.getElementById("counter-time");
  const ringFill = document.getElementById("ring-fill");
  const CIRC     = 2 * Math.PI * 86;

  function tick() {
    const totalSecs = Math.max(0, Math.floor((Date.now() - quitDate.getTime()) / 1000));
    const days = Math.floor(totalSecs / 86400);
    const hrs  = Math.floor((totalSecs % 86400) / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    daysEl.textContent = days;

    // Yeni HTML: 3 ayrı <span> içinde saat:dakika:saniye
    const spans = timeEl.querySelectorAll("span:not(.counter-time-sep)");
    if (spans.length >= 3) {
      spans[0].textContent = pad(hrs);
      spans[1].textContent = pad(mins);
      spans[2].textContent = pad(secs);
    }

    const progress = Math.min(days / 100, 1);
    ringFill.style.strokeDasharray  = String(CIRC);
    ringFill.style.strokeDashoffset = String(CIRC * (1 - progress));

    _rafId = requestAnimationFrame(tick);
  }

  if (_rafId) cancelAnimationFrame(_rafId);
  tick();
}

// ─── Sağlık zaman çizelgesi ───────────────────────────────────────────────────
// ✅ Güvenlik: inline style="..." kullanılmıyor (CSP uyumlu)
// ✅ Güvenlik: tüm içerik hardcoded — kullanıcı verisi yok
function renderHealthTimeline(msQ) {
  const container = document.getElementById("health-timeline");
  container.textContent = ""; // innerHTML = "" yerine textContent temizleme

  HEALTH_MILESTONES.forEach((m, i) => {
    const done      = msQ >= m.minutes;
    const isCurrent = !done && (i === 0 || msQ >= HEALTH_MILESTONES[i - 1].minutes);
    const progress  = Math.min((msQ / m.minutes) * 100, 100);

    const item = document.createElement("div");
    item.className = `timeline-item${done ? " done" : ""}${isCurrent ? " current" : ""}`;

    // İkon
    const iconDiv = document.createElement("div");
    iconDiv.className = "timeline-icon";
    iconDiv.textContent = m.icon; // Emoji güvenli

    // Gövde
    const body = document.createElement("div");
    body.className = "timeline-body";

    const header = document.createElement("div");
    header.className = "timeline-header";

    const label = document.createElement("strong");
    label.className = "timeline-label";
    label.textContent = m.label; // Hardcoded

    const badge = document.createElement("span");
    if (done) {
      badge.className = "timeline-check";
      badge.textContent = "✓ Tamamlandı";
    } else {
      badge.className = "timeline-pct";
      badge.textContent = `${progress.toFixed(1)}%`;
    }

    header.appendChild(label);
    header.appendChild(badge);

    const summary = document.createElement("p");
    summary.className = "timeline-summary";
    summary.textContent = m.summary; // Hardcoded

    body.appendChild(header);
    body.appendChild(summary);

    if (!done) {
      const bar = document.createElement("div");
      bar.className = "timeline-bar";
      const fill = document.createElement("div");
      fill.className = "timeline-bar-fill";
      fill.style.width = `${progress}%`; // ✅ JS ile set → CSP'yi ihlal etmez
      bar.appendChild(fill);
      body.appendChild(bar);
    }

    item.appendChild(iconDiv);
    item.appendChild(body);
    container.appendChild(item);
  });
}

// ─── Başarılar ────────────────────────────────────────────────────────────────
// ✅ Güvenlik: tüm veriler hardcoded katalogdan geliyor
function renderAchievements(msQ, journalCount = 0) {
  const grid      = document.getElementById("achievements-grid");
  const activeCat = document.querySelector(".ach-filter.active")?.dataset.cat || "all";

  const filtered  = activeCat === "all" ? ACHIEVEMENTS : ACHIEVEMENTS.filter((a) => a.cat === activeCat);
  const unlocked  = filtered.filter((a) =>  isUnlocked(a, msQ, journalCount));
  const locked    = filtered.filter((a) => !isUnlocked(a, msQ, journalCount));

  const totalUnlocked = ACHIEVEMENTS.filter((a) => isUnlocked(a, msQ, journalCount)).length;
  document.getElementById("ach-unlocked-count").textContent = totalUnlocked;
  document.getElementById("ach-total-count").textContent    = ACHIEVEMENTS.length;
  document.getElementById("ach-progress-fill").style.width  =
    `${Math.round((totalUnlocked / ACHIEVEMENTS.length) * 100)}%`;

  grid.textContent = ""; // Güvenli temizleme

  [...unlocked, ...locked].forEach((ach) => {
    const earned = isUnlocked(ach, msQ, journalCount);
    const card   = document.createElement("article");
    card.className = `ach-card ${earned ? "earned" : "locked"}`;

    const emojiDiv = document.createElement("div");
    emojiDiv.className = "ach-emoji";
    emojiDiv.textContent = ach.emoji;

    const bodyDiv = document.createElement("div");
    bodyDiv.className = "ach-body";

    const titleEl = document.createElement("strong");
    titleEl.className = "ach-title";
    titleEl.textContent = ach.title;

    const catEl = document.createElement("span");
    catEl.className = "ach-cat";
    catEl.textContent = ach.cat;

    bodyDiv.appendChild(titleEl);
    bodyDiv.appendChild(catEl);

    const statusEl = document.createElement("div");
    statusEl.className = earned ? "ach-check" : "ach-lock";
    statusEl.textContent = earned ? "✓" : "🔒";

    card.appendChild(emojiDiv);
    card.appendChild(bodyDiv);
    card.appendChild(statusEl);
    grid.appendChild(card);
  });
}

// ─── Profil bilgi ızgarası ────────────────────────────────────────────────────
// ✅ Güvenlik: kullanıcı verisi escapeHTML() ile sanitize ediliyor
function renderInfoGrid(userData, user) {
  const grid = document.getElementById("info-grid");

  const genderMap = { Erkek: "Erkek", Kadın: "Kadın", Diğer: "Diğer" };
  const currencyNames = {
    TRY: "Türk Lirası (₺)", EUR: "Euro (€)", USD: "Dolar ($)",
    AZN: "Azerbaycan Manatı (₼)", RUB: "Ruble (₽)",
  };

  // Değerleri sanitize et
  const rows = [
    { label: "Ad Soyad",         value: sanitizeText(userData.name || user.displayName || "—") },
    { label: "Doğum Yılı",       value: sanitizeText(userData.birthYear || "—") },
    { label: "Cinsiyet",         value: sanitizeText(genderMap[userData.gender] || "—") },
    { label: "Günlük Sigara",    value: userData.dailyCigarettes
        ? `${safeNumber(userData.dailyCigarettes, "—")} adet` : "—" },
    { label: "Paket Fiyatı",     value: userData.packPrice
        ? formatMoney(parseFloat(userData.packPrice), userData.currencyCode) : "—" },
    { label: "Paketteki Sigara", value: userData.cigarettesPerPack
        ? `${safeNumber(userData.cigarettesPerPack, "—")} adet` : "—" },
    { label: "Para Birimi",      value: sanitizeText(
        currencyNames[userData.currencyCode] || userData.currencyCode || "—") },
    { label: "Bırakma Süresi",   value: sanitizeText(userData.smokingDuration || "—") },
  ];

  // ✅ innerHTML kullanılıyor, ancak TÜM değerler sanitize edildi
  grid.innerHTML = rows.map(r => `
    <div class="info-item">
      <span class="info-label">${escapeHTML(r.label)}</span>
      <span class="info-value">${escapeHTML(r.value)}</span>
    </div>
  `).join("");
}

// ─── Firestore okuma ──────────────────────────────────────────────────────────
async function loadUserData(uid) {
  // Güvenlik: uid'yi doğrula (Firebase UID formatı)
  if (!uid || typeof uid !== "string" || uid.length > 128) return null;

  const snap = await getDoc(doc(db, "users", uid));
  if (snap.exists()) {
    const data = snap.data();
    if (data.userData && typeof data.userData === "object") return data.userData;
    if (data.quitDate) return data;
  }
  const legacySnap = await getDoc(doc(db, "userData", uid));
  if (legacySnap.exists()) {
    const d = legacySnap.data();
    return d.userData || d;
  }
  return null;
}

function parseQuitDate(raw) {
  if (!raw) return null;
  if (raw && typeof raw.toDate === "function") {
    const d = raw.toDate();
    // Gelecek tarih mi? (geçersiz veri koruması)
    return d > new Date() ? null : d;
  }
  if (typeof raw === "string") {
    const d = new Date(raw);
    return isNaN(d.getTime()) || d > new Date() ? null : d;
  }
  if (typeof raw === "number" && raw > 0 && raw < Date.now()) {
    return new Date(raw);
  }
  return null;
}

// ─── UI Yardımcıları ──────────────────────────────────────────────────────────
function showDashboard() {
  document.getElementById("dash-loading").hidden = true;
  document.getElementById("dashboard-content").hidden = false;
}
function showLoading(v)  { document.getElementById("dash-loading").hidden = !v; }

// ─── Ana Auth State Handler ─────────────────────────────────────────────────────────────────
let _authResolved = false;

onAuthStateChanged(auth, async (user) => {
  // Firebase başlangıçta null çıkarabilir — 800ms bekle, sonra karar ver
  if (!user && !_authResolved) {
    await new Promise(r => setTimeout(r, 800));
    user = auth.currentUser; // Yeniden kontrol et
  }
  _authResolved = true;

  if (!user) {
    // Giriş yapılmamış — auth sayfasına yönlendir
    logSecEvent("dashboard_unauthorized_access");
    window.location.replace("auth.html");
    return;
  }

  logSecEvent("dashboard_access", { uid: user.uid.slice(0, 8) + "..." });

  // ── 30 dk session timeout ────────────────────────────────────────────────────
  startIdleTimer(async () => {
    logSecEvent("session_timeout_signout");
    await signOut(auth);
    window.location.replace("auth.html");
  }, 30 * 60 * 1000);

  // ── Profil ────────────────────────────────────────────────────────────────────
  const displayName = sanitizeText(user.displayName || "Kullanıcı");
  document.getElementById("profile-name").textContent  = displayName;
  document.getElementById("profile-email").textContent = sanitizeText(user.email || "");
  document.getElementById("profile-avatar-letter").textContent = displayName[0].toUpperCase();

  if (user.photoURL) {
    const img = document.getElementById("profile-avatar-img");
    // Güvenlik: yalnızca googleapis.com ve googleusercontent.com'dan avatar kabul et
    const allowedOrigins = ["https://lh3.googleusercontent.com", "https://googleusercontent.com"];
    const isAllowedPhoto = allowedOrigins.some((o) => user.photoURL.startsWith(o)) ||
      user.photoURL.startsWith("https://graph.facebook.com") ||
      user.photoURL.startsWith("https://platform-lookaside.fbsbx.com");

    if (isAllowedPhoto) {
      img.src = user.photoURL;
      img.hidden = false;
      document.getElementById("profile-avatar-letter").hidden = true;
    }
  }

  // ── Firestore verisi ──────────────────────────────────────────────────────────
  let userData = null;
  try {
    userData = await loadUserData(user.uid);
  } catch (err) {
    // Hata detayını kullanıcıya sızdırma
    logSecEvent("firestore_read_error", { code: err.code });
    console.warn("[Dashboard] Veri yükleme hatası.");
  }

  if (!userData) {
    showLoading(false);
    showDashboard();
    document.getElementById("profile-quit-since").textContent =
      "Mobil uygulamada henüz veri oluşturulmamış.";
    return;
  }

  const quitDate = parseQuitDate(userData.quitDate);
  const msQ      = quitDate ? minutesSince(quitDate) : 0;
  const days     = Math.floor(msQ / 1440);
  const currency = (typeof userData.currencyCode === "string" && userData.currencyCode.length === 3)
    ? userData.currencyCode : "TRY";

  // ── Profil meta ────────────────────────────────────────────────────────────────
  if (quitDate) {
    document.getElementById("profile-quit-since").textContent =
      `Bırakma: ${quitDate.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}`;
    document.getElementById("profile-smoke-badge").textContent = days;
    startCounter(quitDate);
  }

  // ── İstatistikler ─────────────────────────────────────────────────────────────
  const daily   = Math.max(0, Math.min(parseInt(userData.dailyCigarettes)  || 0, 200));
  const perPack = Math.max(1, Math.min(parseInt(userData.cigarettesPerPack) || 20, 100));
  const price   = Math.max(0, Math.min(parseFloat(userData.packPrice)       || 0, 10000));

  const cigarettesNotSmoked = Math.floor((msQ / 1440) * daily);
  const moneySaved          = price > 0 ? (cigarettesNotSmoked / perPack) * price : 0;
  const hoursFree           = Math.floor(msQ / 60);

  document.getElementById("val-cigarettes").textContent = cigarettesNotSmoked.toLocaleString("tr-TR");
  document.getElementById("val-money").textContent      = moneySaved > 0 ? formatMoney(moneySaved, currency) : "—";
  document.getElementById("val-life").textContent       = formatLifeGained(cigarettesNotSmoked);
  document.getElementById("val-hours").textContent      = hoursFree.toLocaleString("tr-TR");

  // ── Bölümler ──────────────────────────────────────────────────────────────────
  renderHealthTimeline(msQ);
  renderAchievements(msQ);

  document.querySelectorAll(".ach-filter").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".ach-filter").forEach((b) => {
        b.classList.remove("active"); b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      renderAchievements(msQ);
    });
  });

  renderInfoGrid(userData, user);
  showLoading(false);
  showDashboard();
});

// ─── Çıkış ───────────────────────────────────────────────────────────────────
async function doSignOut() {
  logSecEvent("manual_signout");
  if (_rafId) cancelAnimationFrame(_rafId);
  await signOut(auth);
  window.location.replace("index.html");
}

document.getElementById("btn-signout").addEventListener("click", doSignOut);
