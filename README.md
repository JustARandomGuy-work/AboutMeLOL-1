(() => {
  // Force browser to always scroll to top on page refresh/reload
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const authDashboard = document.getElementById("authDashboard");
  const authSignedOut = document.getElementById("authSignedOut");

  function isLoggedIn() {
    const url = new URL(window.location.href);
    const fromQuery = url.searchParams.get("loggedIn");
    if (fromQuery !== null) return fromQuery === "1" || fromQuery === "true";

    try {
      return localStorage.getItem("aboutme_logged_in") === "1" || Boolean(localStorage.getItem("token"));
    } catch {
      return false;
    }
  }

  try {
    const loggedIn = isLoggedIn();
    if (authDashboard) authDashboard.hidden = !loggedIn;
    if (authSignedOut) authSignedOut.hidden = loggedIn;
  } catch {
    if (authDashboard) authDashboard.hidden = true;
    if (authSignedOut) authSignedOut.hidden = false;
  }

  const toggleScrolled = () => {
    const scrolled = window.scrollY > 24;
    document.body.classList.toggle("scrolled", scrolled);
  };

  window.addEventListener("scroll", toggleScrolled, { passive: true });
  toggleScrolled();

  const copyBtn = document.getElementById("copyDomain");
  copyBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    const domain = location.hostname || "about-me.lol";
    try {
      await navigator.clipboard.writeText(domain);
      copyBtn.textContent = "Copied!";
      setTimeout(() => (copyBtn.textContent = "Copy domain"), 900);
    } catch {
      window.prompt("Copy domain:", domain);
    }
  });
})();
