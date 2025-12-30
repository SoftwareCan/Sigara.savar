function showSection(id) {
    document.querySelectorAll('.content').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// Language switching is handled in `lang.js` to centralize behaviour.
