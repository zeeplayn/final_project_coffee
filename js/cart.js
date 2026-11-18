(function () {
  var KEY = 'beanCart';
  var DISCOUNT = 0.10;

  var body = document.getElementById('cart-body');
  if (!body) return;

  var cart = loadCart();

  function loadCart() {
    try {
      var data = JSON.parse(localStorage.getItem(KEY));
      var clean = {};
      if (data && typeof data === 'object') {
        Object.keys(data).forEach(function (name) {
          var item = data[name];
          if (item && item.price > 0 && item.qty > 0) {
            clean[name] = { price: Number(item.price), qty: Math.floor(item.qty) };
          }
        });
      }
      return clean;
    } catch (e) {
      return {};
    }
  }

  function saveCart() {
    try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {}
  }

  function money(n) {
    return Math.round(n) + ' ₸';
  }

  function makeCell(text) {
    var td = document.createElement('td');
    td.textContent = text;
    return td;
  }

  function makeButton(text, action, name, label) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn btn-sm btn-outline-brown qty-btn';
    b.textContent = text;
    b.dataset.action = action;
    b.dataset.name = name;
    b.setAttribute('aria-label', label + ' ' + name);
    return b;
  }

  function renderCart() {
    var names = Object.keys(cart);
    var subtotal = 0;
    body.textContent = '';

    names.forEach(function (name) {
      var item = cart[name];
      var rowTotal = item.price * item.qty;
      subtotal += rowTotal;

      var tr = document.createElement('tr');
      tr.appendChild(makeCell(name));
      tr.appendChild(makeCell(money(item.price)));

      var qtyCell = document.createElement('td');
      var qtyControl = document.createElement('div');
      qtyControl.className = 'qty-control';
      qtyControl.appendChild(makeButton('−', 'minus', name, 'Decrease'));
      var qtyText = document.createElement('span');
      qtyText.className = 'qty-number';
      qtyText.textContent = item.qty;
      qtyControl.appendChild(qtyText);
      qtyControl.appendChild(makeButton('+', 'plus', name, 'Increase'));
      qtyCell.appendChild(qtyControl);
      tr.appendChild(qtyCell);

      tr.appendChild(makeCell(money(rowTotal)));

      var removeCell = document.createElement('td');
      var remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'btn btn-sm btn-danger';
      remove.textContent = 'Remove';
      remove.dataset.action = 'remove';
      remove.dataset.name = name;
      removeCell.appendChild(remove);
      tr.appendChild(removeCell);

      body.appendChild(tr);
    });

    var user = window.BeanAuth ? window.BeanAuth.getUser() : null;
    var discount = user ? subtotal * DISCOUNT : 0;
    var total = subtotal - discount;

    document.getElementById('cart-subtotal').textContent = money(subtotal);
    document.getElementById('discount-label').textContent =
      user ? 'Member discount (10%)' : 'Member discount (sign in to get 10% off)';
    document.getElementById('cart-discount').textContent = discount > 0 ? '−' + money(discount) : '0 ₸';
    document.getElementById('cart-total').textContent = money(total);

    var isEmpty = names.length === 0;
    document.getElementById('cart-empty').hidden = !isEmpty;
    document.getElementById('cart-table-wrap').hidden = isEmpty;
    document.getElementById('cart-actions').hidden = isEmpty;
  }

  function showMessage(text, type) {
    var box = document.getElementById('cart-message');
    box.textContent = '';
    if (!text) return;
    var alert = document.createElement('div');
    alert.className = 'alert alert-' + type;
    alert.textContent = text;
    box.appendChild(alert);
  }

  document.querySelectorAll('.add-cart').forEach(function (button) {
    button.addEventListener('click', function () {
      var card = button.closest('.card-item');
      var name = card.querySelector('h3').textContent;
      var price = Number(card.dataset.price);

      if (cart[name]) {
        cart[name].qty++;
      } else {
        cart[name] = { price: price, qty: 1 };
      }
      saveCart();
      renderCart();
      showMessage('', '');

      button.textContent = 'Added ✓';
      setTimeout(function () { button.textContent = 'Add to cart'; }, 800);
    });
  });

  body.addEventListener('click', function (e) {
    var button = e.target.closest('button');
    if (!button) return;
    var name = button.dataset.name;
    if (!cart[name]) return;

    if (button.dataset.action === 'plus') {
      cart[name].qty++;
    } else if (button.dataset.action === 'minus') {
      cart[name].qty--;
      if (cart[name].qty <= 0) delete cart[name];
    } else if (button.dataset.action === 'remove') {
      delete cart[name];
    }
    saveCart();
    renderCart();
  });

  document.getElementById('clear-cart').addEventListener('click', function () {
    cart = {};
    saveCart();
    renderCart();
    showMessage('', '');
  });

  document.getElementById('checkout-btn').addEventListener('click', function () {
    var user = window.BeanAuth ? window.BeanAuth.getUser() : null;
    if (!user) {
      showMessage('Please sign in to place your order.', 'warning');
      if (window.BeanAuth) window.BeanAuth.openSignIn();
      return;
    }
    var count = 0;
    Object.keys(cart).forEach(function (n) { count += cart[n].qty; });
    var totalText = document.getElementById('cart-total').textContent;

    showMessage('Thank you, ' + user + '! Your order (' + count + ' items, ' + totalText +
      ') is accepted,', 'success');
    cart = {};
    saveCart();
    renderCart();
  });

  window.addEventListener('authchange', renderCart);

  renderCart();
})();
