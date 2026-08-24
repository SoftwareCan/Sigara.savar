// header-auth.js — Ana sayfa header'ında dinamik auth butonu
// Giriş yapılmışsa: "Profilim" (avatar ile)
// Giriş yapılmamışsa: "Giriş Yap"
// "Başla" (store menu) giriş yapılmışsa gizlenir

import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// Sayfa yüklenince önce her şeyi gizle — auth state bilinene kadar flash olmasın
const headerActions = document.querySelector(".header-actions");
if (headerActions) {
  headerActions.hidden = true;
}

onAuthStateChanged(auth, (user) => {
  const actions = document.querySelector(".header-actions");
  if (!actions) return;

  // Önceki auth butonunu temizle
  const existing = document.getElementById("header-auth-btn");
  if (existing) existing.remove();

  // "Başla" store menüsü
  const storeMenu = actions.querySelector(".store-menu");

  if (user) {
    // ── Giriş yapılmış ──────────────────────────────────────────
    if (storeMenu) storeMenu.hidden = true;

    // "Profilim" butonu — CSS class'ları ile stilli
    const btn = document.createElement("a");
    btn.id        = "header-auth-btn";
    btn.href      = "dashboard.html";
    btn.className = "nav-cta header-profile-btn";

    // Avatar
    const avatarEl = document.createElement("span");
    avatarEl.className = "header-avatar";

    if (user.photoURL) {
      const img = document.createElement("img");
      img.src       = user.photoURL;
      img.alt       = user.displayName || "";
      img.className = "header-avatar-img";
      avatarEl.appendChild(img);
    } else {
      avatarEl.textContent = (user.displayName || user.email || "U")[0].toUpperCase();
    }

    const label = document.createElement("span");
    label.textContent = "Profilim";

    btn.appendChild(avatarEl);
    btn.appendChild(label);
    actions.appendChild(btn);

  } else {
    // ── Giriş yapılmamış ────────────────────────────────────────
    if (storeMenu) storeMenu.hidden = false;

    // "Giriş Yap" butonu
    const btn = document.createElement("a");
    btn.id          = "header-auth-btn";
    btn.href        = "auth.html";
    btn.className   = "nav-cta";
    btn.textContent = "Giriş Yap";

    // "Yasal" linkinden önce ekle
    const legalLink = actions.querySelector("a.nav-link");
    if (legalLink) {
      actions.insertBefore(btn, legalLink);
    } else {
      actions.prepend(btn);
    }
  }

  // Auth state belli oldu — header'ı göster
  actions.hidden = false;
});
