// header-auth.js — Header'da dinamik Giriş/Profil butonu
import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  const actions = document.querySelector(".header-actions");
  if (!actions) return;

  const existing = document.getElementById("header-auth-btn");
  if (existing) existing.remove();

  const btn = document.createElement("a");
  btn.id = "header-auth-btn";
  btn.className = "nav-cta";

  if (user) {
    btn.href = "dashboard.html";
    btn.style.cssText = "display:inline-flex;align-items:center;gap:8px;";

    // Avatar
    const avatarEl = document.createElement("span");
    avatarEl.style.cssText =
      "width:26px;height:26px;border-radius:50%;background:rgba(255,255,255,0.25);display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:900;overflow:hidden;";

    if (user.photoURL) {
      const img = document.createElement("img");
      img.src = user.photoURL;
      img.style.cssText = "width:100%;height:100%;object-fit:cover;border-radius:50%;";
      img.alt = user.displayName || "";
      avatarEl.appendChild(img);
    } else {
      avatarEl.textContent = (user.displayName || user.email || "U")[0].toUpperCase();
    }

    const label = document.createElement("span");
    label.textContent = "Profilim";

    btn.appendChild(avatarEl);
    btn.appendChild(label);
  } else {
    btn.href = "auth.html";
    btn.textContent = "Giriş Yap";
  }

  // "Yasal" linkinden önce ekle
  const legalLink = actions.querySelector("a.nav-link");
  if (legalLink) {
    actions.insertBefore(btn, legalLink);
  } else {
    actions.prepend(btn);
  }
});
