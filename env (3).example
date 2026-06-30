(function () {
  window.API_BASE_URL = window.API_BASE_URL || (
    window.location.hostname === 'localhost'
      ? 'http://localhost:3000'
      : 'https://aboutmelol-1.onrender.com'
  );

  function getStoredToken() {
    try {
      return localStorage.getItem('token');
    } catch {
      return null;
    }
  }

  function isLoggedIn() {
    return Boolean(getStoredToken());
  }

  window.authManager = {
    isLoggedIn,
    getStoredToken
  };
})();
