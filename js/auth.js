(function () {
  var KEY = 'beanUser';
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var modal = null;

  function getUser() {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
  }

  function setUser(name) {
    try { localStorage.setItem(KEY, name); } catch (e) { }
    window.dispatchEvent(new Event('authchange'));
  }

  function clearUser() {
    try { localStorage.removeItem(KEY); } catch (e) { }
    window.dispatchEvent(new Event('authchange'));
  }

  var area = null;

  function renderAuth() {
    if (!area) return;
    area.textContent = '';
    var user = getUser();

    if (user) {
      var hello = document.createElement('span');
      hello.className = 'auth-greeting';
      hello.textContent = 'Hi, ' + user;   

      var out = document.createElement('button');
      out.type = 'button';
      out.className = 'tool-btn';
      out.id = 'signout-btn';
      out.textContent = 'Sign out';
      out.addEventListener('click', clearUser);

      area.appendChild(hello);
      area.appendChild(out);
    } else {
      var inBtn = document.createElement('button');
      inBtn.type = 'button';
      inBtn.className = 'tool-btn';
      inBtn.id = 'signin-btn';
      inBtn.textContent = 'Sign in';
      inBtn.addEventListener('click', openSignIn);
      area.appendChild(inBtn);
    }
  }

  var MODAL_HTML =
    '<div class="modal fade" id="signin-modal" tabindex="-1" aria-labelledby="signin-title" aria-hidden="true">' +
    '<div class="modal-dialog"><div class="modal-content">' +
    '<form id="signin-form" novalidate>' +
    '<div class="modal-header"><h2 class="modal-title fs-5" id="signin-title">Sign in</h2>' +
    '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>' +
    '<div class="modal-body">' +
    '<p class="small">Demo only: nothing is sent to a server and your password is not saved.</p>' +
    '<div class="mb-3"><label for="signin-name" class="form-label">Display name</label>' +
    '<input type="text" id="signin-name" class="form-control" autocomplete="nickname">' +
    '<div class="invalid-feedback"></div></div>' +
    '<div class="mb-3"><label for="signin-email" class="form-label">Email</label>' +
    '<input type="email" id="signin-email" class="form-control" autocomplete="email">' +
    '<div class="invalid-feedback"></div></div>' +
    '<div class="mb-3"><label for="signin-password" class="form-label">Password</label>' +
    '<input type="password" id="signin-password" class="form-control" autocomplete="current-password">' +
    '<div class="invalid-feedback"></div></div>' +
    '</div>' +
    '<div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>' +
    '<button type="submit" class="btn btn-brown">Sign in</button></div>' +
    '</form></div></div></div>';

  var checks = {
    'signin-name': function (v) {
      v = v.trim();
      if (v === '') return 'Please enter your name.';
      if (v.length < 2) return 'Name must have at least 2 characters.';
      if (v.length > 30) return 'Name is too long (max 30 characters).';
      return '';
    },
    'signin-email': function (v) {
      v = v.trim();
      if (v === '') return 'Please enter your email.';
      if (!emailRegex.test(v)) return 'Email format is wrong (example: name@mail.com).';
      return '';
    },
    'signin-password': function (v) {
      if (v === '') return 'Please enter your password.';
      if (v.length < 6) return 'Password must have at least 6 characters.';
      return '';
    }
  };

  function validateField(input) {
    var error = checks[input.id](input.value);
    var feedback = input.parentNode.querySelector('.invalid-feedback');
    input.classList.toggle('is-invalid', error !== '');
    input.classList.toggle('is-valid', error === '');
    feedback.textContent = error;
    return error === '';
  }

  function openSignIn() {
    if (modal) {
      var form = document.getElementById('signin-form');
      form.reset();
      form.querySelectorAll('input').forEach(function (i) {
        i.classList.remove('is-valid', 'is-invalid');
      });
      modal.show();
    }
  }

  function setupModal() {
    document.body.insertAdjacentHTML('beforeend', MODAL_HTML);
    modal = new bootstrap.Modal(document.getElementById('signin-modal'));

    var form = document.getElementById('signin-form');
    var inputs = form.querySelectorAll('input');

    inputs.forEach(function (input) {
      input.addEventListener('input', function () { validateField(input); });
      input.addEventListener('blur', function () { validateField(input); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var allOk = true;
      inputs.forEach(function (input) {
        if (!validateField(input)) allOk = false;
      });
      if (!allOk) return;

      setUser(document.getElementById('signin-name').value.trim());
      modal.hide();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var tools = document.getElementById('header-tools');
    if (tools) {
      area = document.createElement('div');
      area.className = 'auth-area';
      tools.appendChild(area);
      renderAuth();
    }
    if (window.bootstrap) setupModal();
  });

  window.addEventListener('authchange', renderAuth);
  window.addEventListener('storage', function (e) {
    if (e.key === KEY) {
      renderAuth();
      window.dispatchEvent(new Event('authchange'));
    }
  });

  window.BeanAuth = { getUser: getUser, openSignIn: openSignIn };
})();
