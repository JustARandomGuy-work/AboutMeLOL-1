<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Profile - About Me.LOL</title>
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%239b4dff%22 stroke-width=%222.5%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71%22></path><path d=%22M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71%22></path></svg>">
    <link rel="stylesheet" href="../styles.css" />
    <style>
      body { background: #000; }
      .profile-background { position: fixed; top: 0; left: 0; width: 100%; height: 40vh; background-size: cover; background-position: center; z-index: 1; }
      .profile-background.default { background: linear-gradient(135deg, rgba(182,112,255,.2), rgba(108,246,255,.2)); }
      .profile-container { position: relative; z-index: 2; padding-top: 35vh; }
      .profile-card { max-width: 500px; margin: 0 auto 40px; background: rgba(13,7,20,.95); border: 1px solid rgba(182,112,255,.2); border-radius: 16px; padding: 40px 20px; text-align: center; }
      .profile-avatar { width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--accent2)); margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 50px; overflow: hidden; border: 3px solid var(--accent); }
      .profile-avatar img { width: 100%; height: 100%; object-fit: cover; }
      .profile-username { font-size: 24px; font-weight: 700; margin: 0 0 8px; }
      .profile-username.glow { text-shadow: 0 0 20px var(--accent), 0 0 40px var(--accent); }
      .profile-bio { color: rgba(233,236,255,.7); font-size: 14px; margin: 0 0 24px; line-height: 1.6; }
      .profile-links { display: flex; flex-direction: column; gap: 12px; }
      .link-btn { padding: 14px 20px; background: rgba(182,112,255,.1); border: 1px solid rgba(182,112,255,.3); border-radius: 8px; color: var(--accent2); text-decoration: none; font-size: 14px; font-weight: 600; transition: all 200ms; }
      .link-btn:hover { background: rgba(182,112,255,.2); border-color: var(--accent); }
      .cosmetics-section { max-width: 500px; margin: 40px auto; }
      .cosmetics-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 12px; }
      .cosmetic-badge { background: rgba(182,112,255,.15); border: 1px solid rgba(182,112,255,.3); border-radius: 8px; padding: 12px; text-align: center; font-size: 12px; }
      .cosmetic-badge.active { background: rgba(108,246,255,.2); border-color: var(--accent2); }
      @media (max-width: 600px) {
        .profile-container { padding-top: 30vh; }
        .profile-card { padding: 30px 16px; }
        .profile-avatar { width: 100px; height: 100px; font-size: 40px; }
        .profile-username { font-size: 20px; }
      }
    </style>
  </head>
  <body>
    <div class="profile-background default" id="background"></div>

    <div class="profile-container">
      <div class="profile-card">
        <div class="profile-avatar" id="avatar">👤</div>
        <h1 class="profile-username" id="username"></h1>
        <p class="profile-bio" id="bio">No bio yet</p>

        <div class="profile-links" id="links"></div>
      </div>

      <div class="cosmetics-section" id="cosmeticsSection" style="display: none;">
        <h2 style="text-align: center; margin-top: 0;">Cosmetics</h2>
        <div class="cosmetics-list" id="cosmeticsList"></div>
      </div>
    </div>

    <script>
      window.API_BASE_URL = window.API_BASE_URL || (
        window.location.hostname === 'localhost'
          ? 'http://localhost:3000'
          : 'https://aboutmelol-1.onrender.com'
      );

      async function loadProfile() {
        const pathParts = window.location.pathname.split('/');
        const username = pathParts[pathParts.length - 1].replace('@', '');

        try {
          const response = await fetch(window.API_BASE_URL + '/api/profiles/@' + username);
          const profile = await response.json();

          if (!response.ok) {
            document.querySelector('.profile-card').innerHTML = '<h1>Profile not found</h1>';
            return;
          }

          // Update title
          document.title = '@' + username + ' - About Me.LOL';

          // Avatar
          if (profile.avatarUrl) {
            document.getElementById('avatar').innerHTML = `<img src="${profile.avatarUrl}" alt="Avatar" />`;
          }

          // Username
          const usernameEl = document.getElementById('username');
          usernameEl.textContent = '@' + username;
          if (profile.badgeTextGlow) {
            usernameEl.classList.add('glow');
          }

          // Bio
          document.getElementById('bio').textContent = profile.bio || 'No bio yet';

          // Background
          if (profile.backgroundUrl) {
            const bg = document.getElementById('background');
            bg.style.backgroundImage = `url('${profile.backgroundUrl}')`;
            bg.classList.remove('default');
          }

          // Links
          const linksContainer = document.getElementById('links');
          if (profile.links && profile.links.length > 0) {
            linksContainer.innerHTML = profile.links
              .sort((a, b) => a.position - b.position)
              .map(link => `<a href="${link.url}" class="link-btn" target="_blank">${link.title}</a>`)
              .join('');
          } else {
            linksContainer.innerHTML = '<p style="color: rgba(233,236,255,.5);">No links yet</p>';
          }

          // Cosmetics
          if (profile.cosmetics && profile.cosmetics.length > 0) {
            document.getElementById('cosmeticsSection').style.display = 'block';
            const cosmeticsList = document.getElementById('cosmeticsList');
            cosmeticsList.innerHTML = profile.cosmetics
              .map(c => `<div class="cosmetic-badge active">${c.name}</div>`)
              .join('');
          }

          // Track visit
          await fetch(window.API_BASE_URL + '/api/analytics/track-visit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profileId: profile.id })
          });
        } catch (error) {
          console.error('Error loading profile:', error);
          document.querySelector('.profile-card').innerHTML = '<h1>Error loading profile</h1>';
        }
      }

      loadProfile();
    </script>
  </body>
</html>
