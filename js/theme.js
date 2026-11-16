(function () {
  var KEY = 'beanTheme';

  function getSavedTheme() {
    try {
      var t = localStorage.getItem(KEY);
      return (t === 'dark' || t === 'light') ? t : 'light';
    } catch (e) {
      return 'light';   
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-bs-theme', theme);
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

    var button = document.createElement('button');
    button.type = 'button';
    button.id = 'theme-toggle';
    button.className = 'tool-btn';
    tools.appendChild(button);

    function updateButton() {
      var dark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (dark) {
        var icon = document.createElement('img');
        icon.src = 'https://i.pinimg.com/736x/bd/90/80/bd9080b283a6ea3cf127746ba63c8594.jpg';
        icon.alt = '';
        icon.className = 'theme-icon';
        button.textContent = '';
        button.appendChild(icon);
        button.appendChild(document.createTextNode(' Light'));
      } else {
        var icon = document.createElement('img');
        icon.src = 'https://i.pinimg.com/736x/f1/60/99/f16099d13bee6e3dc2b8b3ccf6d1b4c7.jpg';
        icon.alt = '';
        icon.className = 'theme-icon';
        button.textContent = '';
        button.appendChild(icon);
        button.appendChild(document.createTextNode(' Dark'));
      }
      button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
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
})();
