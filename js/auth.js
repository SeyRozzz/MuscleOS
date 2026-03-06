'use strict';

/* ═══════════════════════════════════════════════════════════
   MuscleOS — Module Authentification
   Gère login/register/logout et sync données
═══════════════════════════════════════════════════════════ */

const AUTH = (() => {

  // Config
  const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://muscleos-api.herokuapp.com'; // À remplacer par ton URL backend production

  const TOKEN_KEY = 'mos-token';
  const USER_KEY = 'mos-user';

  // ═══════════════════════════════════════════════════════════
  // TOKEN MANAGEMENT
  // ═══════════════════════════════════════════════════════════

  function setAuthToken(token) {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  function getAuthToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function clearAuthToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  function getAuthHeaders() {
    const token = getAuthToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  // ═══════════════════════════════════════════════════════════
  // AUTH FUNCTIONS
  // ═══════════════════════════════════════════════════════════

  async function register(username, email, password) {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setAuthToken(data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));

      return data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  async function login(email, password) {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setAuthToken(data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));

      // Sync logbook after login
      const logbook = JSON.parse(localStorage.getItem('mos-logbook') || '[]');
      if (logbook.length > 0) {
        await syncLogbook(logbook);
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  function logout() {
    clearAuthToken();
    updateAuthUI();
  }

  function isAuthenticated() {
    return !!getAuthToken();
  }

  function getUser() {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  // ═══════════════════════════════════════════════════════════
  // SYNC FUNCTIONS
  // ═══════════════════════════════════════════════════════════

  async function syncLogbook(logbook) {
    if (!isAuthenticated()) return false;

    try {
      const response = await fetch(`${API_URL}/api/sync/logbook`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ logbook })
      });

      if (!response.ok) throw new Error('Sync failed');

      return true;
    } catch (error) {
      console.error('Logbook sync error:', error);
      return false;
    }
  }

  async function syncCalculations(calculations) {
    if (!isAuthenticated()) return false;

    try {
      const response = await fetch(`${API_URL}/api/sync/calculations`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ calculations })
      });

      if (!response.ok) throw new Error('Sync failed');

      return true;
    } catch (error) {
      console.error('Calculations sync error:', error);
      return false;
    }
  }

  // ═══════════════════════════════════════════════════════════
  // UI FUNCTIONS
  // ═══════════════════════════════════════════════════════════

  function toggleAuthForm() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm && registerForm) {
      loginForm.style.display = loginForm.style.display === 'none' ? 'block' : 'none';
      registerForm.style.display = registerForm.style.display === 'none' ? 'block' : 'none';
    }
  }

  function updateAuthUI() {
    const authForms = document.getElementById('auth-forms');
    const userProfile = document.getElementById('user-profile');
    const user = getUser();

    if (authForms && userProfile) {
      if (user && isAuthenticated()) {
        authForms.style.display = 'none';
        userProfile.style.display = 'block';
        updateUserProfile(user);
      } else {
        authForms.style.display = 'block';
        userProfile.style.display = 'none';
      }
    }
  }

  function updateUserProfile(user) {
    const username = user.username || user.email;
    const initial = username.charAt(0).toUpperCase();

    document.getElementById('user-avatar').textContent = initial;
    document.getElementById('user-name').textContent = username;
    document.getElementById('user-email').textContent = user.email || '';

    // Update counts
    const logbook = JSON.parse(localStorage.getItem('mos-logbook') || '[]');
    const calculations = JSON.parse(localStorage.getItem('mos-calc-history') || '[]');

    document.getElementById('logbook-count').textContent = logbook.length;
    document.getElementById('calc-count').textContent = calculations.length;
  }

  // ═══════════════════════════════════════════════════════════
  // EVENT LISTENERS & INIT
  // ═══════════════════════════════════════════════════════════

  function init() {
    // Login button
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
      loginBtn.addEventListener('click', async () => {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const errorDiv = document.getElementById('login-error');

        if (!email || !password) {
          errorDiv.textContent = 'Veuillez remplir tous les champs';
          errorDiv.style.display = 'block';
          return;
        }

        try {
          await login(email, password);
          updateAuthUI();
          // Clear forms
          document.getElementById('login-email').value = '';
          document.getElementById('login-password').value = '';
          errorDiv.style.display = 'none';
        } catch (error) {
          errorDiv.textContent = error.message;
          errorDiv.style.display = 'block';
        }
      });
    }

    // Register button
    const registerBtn = document.getElementById('register-btn');
    if (registerBtn) {
      registerBtn.addEventListener('click', async () => {
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const errorDiv = document.getElementById('register-error');

        if (!username || !email || !password) {
          errorDiv.textContent = 'Veuillez remplir tous les champs';
          errorDiv.style.display = 'block';
          return;
        }

        if (password.length < 8) {
          errorDiv.textContent = 'Le mot de passe doit faire au minimum 8 caractères';
          errorDiv.style.display = 'block';
          return;
        }

        try {
          await register(username, email, password);
          updateAuthUI();
          // Clear forms
          document.getElementById('register-username').value = '';
          document.getElementById('register-email').value = '';
          document.getElementById('register-password').value = '';
          errorDiv.style.display = 'none';
        } catch (error) {
          errorDiv.textContent = error.message;
          errorDiv.style.display = 'block';
        }
      });
    }

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        logout();
      });
    }

    // Initialize UI based on auth state
    updateAuthUI();
  }

  // ═══════════════════════════════════════════════════════════
  // PUBLIC API
  // ═══════════════════════════════════════════════════════════

  return {
    init,
    register,
    login,
    logout,
    isAuthenticated,
    getUser,
    getAuthToken,
    setAuthToken,
    getAuthHeaders,
    toggleAuthForm,
    updateAuthUI,
    syncLogbook,
    syncCalculations
  };
})();

// Initialize auth on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => AUTH.init());
} else {
  AUTH.init();
}
