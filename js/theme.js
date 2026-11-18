(function () {
  var KEY = 'beanTheme';

  function getSavedTheme() {
    try {
      var saved = localStorage.getItem(KEY);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch (e) {}

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-bs-theme', theme);
    document.documentElement.style.colorScheme = theme;

    var themeColor = document.querySelector('meta[name="theme-color"]');
    if (!themeColor) {
      themeColor = document.createElement('meta');
      themeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(themeColor);
    }
    themeColor.setAttribute('content', theme === 'dark' ? '#1c1410' : '#f5ebe0');
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(KEY, theme);
    } catch (e) {}
  }

  applyTheme(getSavedTheme());

  document.addEventListener('DOMContentLoaded', function () {
    var tools = document.getElementById('header-tools');
    if (!tools) return;

    var button = document.getElementById('theme-toggle');
    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.id = 'theme-toggle';
      button.className = 'tool-btn';
      tools.appendChild(button);
    }

    function updateButton() {
      var dark = document.documentElement.getAttribute('data-theme') === 'dark';
      var icon = document.createElement('img');
      icon.src = dark
        ? 'https://i.pinimg.com/736x/bd/90/80/bd9080b283a6ea3cf127746ba63c8594.jpg'
        : 'https://i.pinimg.com/736x/f1/60/99/f16099d13bee6e3dc2b8b3ccf6d1b4c7.jpg';
      icon.alt = '';
      icon.className = 'theme-icon';
      button.textContent = '';
      button.appendChild(icon);
      button.appendChild(document.createTextNode(dark ? ' Light' : ' Dark'));
      button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      button.setAttribute('aria-pressed', dark ? 'true' : 'false');
      button.title = dark ? 'Switch to light theme' : 'Switch to dark theme';
    }

    button.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      saveTheme(next);
      updateButton();
    });

    updateButton();
  });

  if (window.matchMedia) {
    var media = window.matchMedia('(prefers-color-scheme: dark)');
    var onSystemThemeChange = function (event) {
      try {
        if (localStorage.getItem(KEY)) return;
      } catch (e) {}
      applyTheme(event.matches ? 'dark' : 'light');

      var button = document.getElementById('theme-toggle');
      if (button) {
        var dark = event.matches;
        var icon = document.createElement('img');
        icon.src = dark
          ? 'https://i.pinimg.com/736x/bd/90/80/bd9080b283a6ea3cf127746ba63c8594.jpg'
          : 'https://i.pinimg.com/736x/f1/60/99/f16099d13bee6e3dc2b8b3ccf6d1b4c7.jpg';
        icon.alt = '';
        icon.className = 'theme-icon';
        button.textContent = '';
        button.appendChild(icon);
        button.appendChild(document.createTextNode(dark ? ' Light' : ' Dark'));
        button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
        button.setAttribute('aria-pressed', dark ? 'true' : 'false');
        button.title = dark ? 'Switch to light theme' : 'Switch to dark theme';
      }
    };
    if (media.addEventListener) media.addEventListener('change', onSystemThemeChange);
  }
})();
