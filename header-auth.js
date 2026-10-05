// header-auth.js — Header'daki hesap bağlantısı (web girişi şu an duraklatıldı).
// Yalnızca _build/site.config.mjs içinde AUTH_UI_ENABLED: true iken yüklenir;
// o durumda header'a [data-auth-slot] alanı eklenir ve CSP Firebase'e izin verir.
// Giriş yapılmışsa: "Profilim" (avatar ile) → dashboard.html
// Giriş yapılmamışsa: "Giriş Yap" → auth.html

import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const slot = document.querySelector("[data-auth-slot]");

if (slot) {
  onAuthStateChanged(auth, (user) => {
    slot.replaceChildren();

    const btn = document.createElement("a");
    btn.id = "header-auth-btn";
    btn.className = "nav-cta";

    if (user) {
      // ── Giriş yapılmış ──────────────────────────────────────────
      btn.href = "/dashboard.html";
      btn.classList.add("header-profile-btn");

      const avatarEl = document.createElement("span");
      avatarEl.className = "header-avatar";
      if (user.photoURL) {
        const img = document.createElement("img");
        img.src = user.photoURL;
        img.alt = "";
        img.className = "header-avatar-img";
        avatarEl.appendChild(img);
      } else {
        avatarEl.textContent = (user.displayName || user.email || "U")[0].toUpperCase();
      }

      const label = document.createElement("span");
      label.textContent = "Profilim";
      btn.append(avatarEl, label);
    } else {
      // ── Giriş yapılmamış ────────────────────────────────────────
      btn.href = "/auth.html";
      btn.textContent = "Giriş Yap";
    }

    slot.appendChild(btn);
    // Auth durumu belli oldu — alanı göster (öncesinde boş bir buton parlamasın).
    slot.hidden = false;
  });
}
