<<<<<<< HEAD
(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // (Background cursor glow removed — mesh background is now non-interactive)

  // Auth-aware navbar (client-side only)
  // Uses localStorage flag: aboutme_logged_in = "1"
  // Also supports URL param: ?loggedIn=1
  const authDashboard = document.getElementById("authDashboard");
  const authSignedOut = document.getElementById("authSignedOut");

  function isLoggedIn() {
    const url = new URL(window.location.href);
    const fromQuery = url.searchParams.get("loggedIn");
    if (fromQuery !== null) return fromQuery === "1" || fromQuery === "true";

    try {
      return localStorage.getItem("aboutme_logged_in") === "1";
    } catch {
      return false;
    }
  }

  try {
    const loggedIn = isLoggedIn();
    if (authDashboard) authDashboard.hidden = !loggedIn;
    if (authSignedOut) authSignedOut.hidden = loggedIn;
  } catch {
    // If storage/query fails, default to signed-out view
    if (authDashboard) authDashboard.hidden = true;
    if (authSignedOut) authSignedOut.hidden = false;
  }

  // Navbar scroll behavior (premium separation)
  const toggleScrolled = () => {
    const scrolled = window.scrollY > 24;
    document.body.classList.toggle("scrolled", scrolled);
  };

  window.addEventListener("scroll", toggleScrolled, { passive: true });
  toggleScrolled();

  // Copy domain button (footer)
  const copyBtn = document.getElementById("copyDomain");
  copyBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    const domain = location.hostname || "about-me.lol";
    try {
      await navigator.clipboard.writeText(domain);
      copyBtn.textContent = "Copied!";
      setTimeout(() => (copyBtn.textContent = "Copy domain"), 900);
    } catch {
      // Fallback
      window.prompt("Copy domain:", domain);
    }
  });
})();
=======
(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // (Background cursor glow removed — mesh background is now non-interactive)

  // Auth-aware navbar (client-side only)
  // Uses localStorage flag: aboutme_logged_in = "1"
  // Also supports URL param: ?loggedIn=1
  const authDashboard = document.getElementById("authDashboard");
  const authSignedOut = document.getElementById("authSignedOut");

  function isLoggedIn() {
    const url = new URL(window.location.href);
    const fromQuery = url.searchParams.get("loggedIn");
    if (fromQuery !== null) return fromQuery === "1" || fromQuery === "true";

    try {
      return localStorage.getItem("aboutme_logged_in") === "1";
    } catch {
      return false;
    }
  }

  try {
    const loggedIn = isLoggedIn();
    if (authDashboard) authDashboard.hidden = !loggedIn;
    if (authSignedOut) authSignedOut.hidden = loggedIn;
  } catch {
    // If storage/query fails, default to signed-out view
    if (authDashboard) authDashboard.hidden = true;
    if (authSignedOut) authSignedOut.hidden = false;
  }

  // Navbar scroll behavior (premium separation)
  const toggleScrolled = () => {
    const scrolled = window.scrollY > 24;
    document.body.classList.toggle("scrolled", scrolled);
  };

  window.addEventListener("scroll", toggleScrolled, { passive: true });
  toggleScrolled();

  // Copy domain button (footer)
  const copyBtn = document.getElementById("copyDomain");
  copyBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    const domain = location.hostname || "about-me.lol";
    try {
      await navigator.clipboard.writeText(domain);
      copyBtn.textContent = "Copied!";
      setTimeout(() => (copyBtn.textContent = "Copy domain"), 900);
    } catch {
      // Fallback
      window.prompt("Copy domain:", domain);
    }
  });
})();
>>>>>>> aee9477181ceb519ab7930d588f6fed3b340e70c
