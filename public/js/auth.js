// public/js/auth.js
// Included on every page. Handles the authenticated account state in the navigation
// and on the account page, without exposing the removed login/register screens.

(function () {
  async function getCurrentUser() {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) return null;
      const data = await res.json();
      return data.user;
    } catch (err) {
      console.error('Could not check login state:', err);
      return null;
    }
  }

  function renderNavAuth(user) {
    const area = document.getElementById('navAuthArea');
    if (!area) return;

    if (user) {
      area.innerHTML =
        '<span class="nav-user">Hi, ' + escapeHtml(user.name.split(' ')[0]) + '</span>' +
        '<a href="account.html">Account</a>' +
        '<button type="button" class="navlink-btn" id="navLogoutBtn">Log out</button>';

      const logoutBtn = document.getElementById('navLogoutBtn');
      logoutBtn.addEventListener('click', async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = 'index.html';
      });
    } else {
      area.innerHTML = '';
    }
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  async function wireAccountPage(user) {
    const card = document.getElementById('accountCard');
    if (!card) return;

    if (!user) {
      card.innerHTML = `
        <h1>Account access is unavailable</h1>
        <p class="sub">This account page is not currently available on this site.</p>
      `;
      return;
    }

    document.getElementById('accountName').textContent = user.name;
    document.getElementById('accountEmail').textContent = user.email;
    document.getElementById('accountSince').textContent = new Date(user.created_at).toLocaleDateString();
    const logoutBtn = document.getElementById('accountLogoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = 'index.html';
      });
    }
  }

  document.addEventListener('DOMContentLoaded', async () => {
    const user = await getCurrentUser();
    renderNavAuth(user);
    wireAccountPage(user);
  });
})();
