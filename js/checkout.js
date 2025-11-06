// checkout.js - hiển thị form thanh toán, kiểm tra đăng nhập và lưu đơn hàng

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch (e) {
    return null;
  }
}

function getCart() {
  const user = getCurrentUser();
  if (!user) return [];
  return JSON.parse(localStorage.getItem("cart_" + user.email)) || [];
}

function saveOrderForUser(order) {
  const user = getCurrentUser();
  if (!user) return;
  const key = "orders_" + user.email;
  const arr = JSON.parse(localStorage.getItem(key)) || [];
  arr.push(order);
  localStorage.setItem(key, JSON.stringify(arr));
}

function formatVND(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
}

// create form
function renderCheckout() {
  const user = getCurrentUser();
  if (!user) {
    alert("Vui lòng đăng nhập để thanh toán.");
    window.location.href = "index.html";
    return;
  }

  const cart = getCart();
  if (cart.length === 0) {
    alert("Giỏ hàng trống.");
    window.location.href = "cart.html";
    return;
  }

  const container = document.getElementById("checkout-area");
  container.innerHTML = "";

  const total = cart.reduce((s, it) => s + it.price * it.quantity, 0);
  // Hiển thị tóm tắt mục hàng gọn cho trang thanh toán (ảnh nhỏ, mỗi dòng một mục)
  const itemsWrap = document.createElement("div");
  itemsWrap.className = "checkout-items";
  cart.forEach((it) => {
    const row = document.createElement("div");
    row.className = "checkout-item-row";

    const img = document.createElement("img");
    img.className = "checkout-img";
    img.src = it.img || "./assest/img/StepLab_Logo.svg";

    const info = document.createElement("div");
    info.className = "checkout-item-info";
    info.innerHTML = `
      <div class="cart-name">${it.name}</div>
      <div class="product-company">${it.company || ""}</div>
      <div class="price">${formatVND(it.price)}</div>
    `;

    const right = document.createElement("div");
    right.className = "checkout-item-right";
    right.innerHTML = `<div>Qty: ${
      it.quantity
    }</div><div style="margin-top:6px; font-weight:700">${formatVND(
      it.price * it.quantity
    )}</div>`;

    row.appendChild(img);
    row.appendChild(info);
    row.appendChild(right);
    itemsWrap.appendChild(row);
  });

  container.appendChild(itemsWrap);

  const form = document.createElement("form");
  form.innerHTML = `
    <h3>Địa chỉ giao hàng</h3>
    <label><input type="radio" name="addr_opt" value="existing" checked> Sử dụng địa chỉ đã lưu</label><br>
    <label><input type="radio" name="addr_opt" value="new"> Nhập địa chỉ giao hàng</label>
    <div id="new-addr" style="display:none; margin-top:10px;">
      <input type="text" id="rec-name" placeholder="Họ tên người nhận" style="width:100%; padding:8px; margin-bottom:8px" required>
      <input type="text" id="rec-phone" placeholder="Số điện thoại" style="width:100%; padding:8px; margin-bottom:8px" required>
      <input type="text" id="rec-address" placeholder="Địa chỉ chi tiết" style="width:100%; padding:8px; margin-bottom:8px" required>
      <textarea id="rec-note" placeholder="Ghi chú (tuỳ chọn)" style="width:100%; padding:8px; margin-bottom:8px"></textarea>
    </div>
    <h3>Phương thức thanh toán</h3>
    <label><input type="radio" name="pay" value="cod" checked> Tiền mặt khi nhận hàng</label><br>
    <label><input type="radio" name="pay" value="bank"> Chuyển khoản ngân hàng</label><br>
    <label><input type="radio" name="pay" value="online"> Thanh toán trực tuyến (mô phỏng)</label>
    <div style="margin-top:12px; text-align:right; font-weight:600">Tổng đơn hàng: ${formatVND(
      total
    )}</div>
    <div style="margin-top:12px; display:flex; justify-content:space-between;">
      <a href="cart.html" class="btn" style="width:auto; padding:8px 12px">Quay lại giỏ hàng</a>
      <button type="submit" class="btn">Xác nhận đặt hàng</button>
    </div>
  `;

  container.appendChild(form);

  const addrRadios = form.querySelectorAll('input[name="addr_opt"]');
  addrRadios.forEach((r) =>
    r.addEventListener("change", () => {
      const newAddr = document.getElementById("new-addr");
      newAddr.style.display = form.querySelector(
        'input[name="addr_opt"][value="new"]'
      ).checked
        ? "block"
        : "none";
    })
  );

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const useNew = form.querySelector(
      'input[name="addr_opt"][value="new"]'
    ).checked;
    const address = useNew
      ? document.getElementById("rec-address").value.trim()
      : getCurrentUser().address || "";
    if (useNew) {
      const name = document.getElementById("rec-name").value.trim();
      const phone = document.getElementById("rec-phone").value.trim();
      if (!name || !phone || !address) {
        alert("Vui lòng nhập đầy đủ thông tin địa chỉ.");
        return;
      }
    }

    const pay = form.querySelector('input[name="pay"]:checked').value;
    const order = {
      id: "ORD" + Date.now(),
      date: new Date().toISOString(),
      items: cart,
      total: total,
      address: address,
      payment: pay,
      status: "mới đặt",
    };

    // lưu đơn hàng
    saveOrderForUser(order);

    // xoá giỏ hàng
    localStorage.removeItem("cart_" + getCurrentUser().email);
    updateCartDisplay();

    alert(
      "Đơn hàng của bạn đã được ghi nhận. Cảm ơn bạn đã mua sắm tại STEPLAB!"
    );
    window.location.href = "orders.html";
  });
}

// init
document.addEventListener("DOMContentLoaded", () => {
  renderCheckout();
});
