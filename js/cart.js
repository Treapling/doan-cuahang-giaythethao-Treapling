// cart.js - hiển thị trang giỏ hàng, cho phép thay đổi số lượng, xóa và chuyển tới thanh toán

function formatVND(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
}

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

function saveCart(cart) {
  const user = getCurrentUser();
  if (!user) return;
  localStorage.setItem("cart_" + user.email, JSON.stringify(cart));
}

function renderCart() {
  const list = document.getElementById("cart-list");
  const summary = document.getElementById("cart-summary");
  list.innerHTML = "";
  const cart = getCart();
  if (cart.length === 0) {
    list.innerHTML =
      '<p style="padding:20px; background:#fff">Giỏ hàng trống.</p>';
    summary.innerHTML = "";
    return;
  }

  let total = 0;
  cart.forEach((item, idx) => {
    const row = document.createElement("div");
    // dùng lại lớp product-list để tận dụng style, thêm cart-row cho bối cảnh giỏ hàng
    row.className = "product-list cart-row";

    // Cột 1: ảnh (+ tên bên dưới)
    const colImage = document.createElement("div");
    colImage.className = "cart-col cart-col-image";

    const img = document.createElement("img");
    img.className = "cart-img";
    img.src = item.img || "./assest/img/StepLab_Logo.svg";

    const nameDiv = document.createElement("div");
    nameDiv.className = "cart-name";
    nameDiv.style.fontWeight = "600";
    nameDiv.style.overflow = "hidden";
    nameDiv.style.textOverflow = "ellipsis";
    nameDiv.style.whiteSpace = "nowrap";
    nameDiv.textContent = item.name;

    colImage.appendChild(img);

    // Khu vực bên phải: tên, giá đơn vị, điều khiển số lượng, xóa, tổng dòng
    const rightArea = document.createElement("div");
    rightArea.className = "cart-right-area";

    // Tên (đầy đủ, cho phép xuống hàng)
    const colName = document.createElement("div");
    colName.className = "cart-col cart-col-name";
    const nameFull = document.createElement("div");
    nameFull.className = "cart-name-full";
    nameFull.textContent = item.name;
    colName.appendChild(nameFull);

    // Giá đơn vị
    const colPrice = document.createElement("div");
    colPrice.className = "cart-col cart-col-price";
    colPrice.innerHTML = `<div class="unit-price">${formatVND(
      item.price
    )}</div>`;

    // Số lượng
    const colQty = document.createElement("div");
    colQty.className = "cart-col cart-col-qty";
    const qtyWrap2 = document.createElement("div");
    qtyWrap2.className = "qty-controls";
    const minus2 = document.createElement("button");
    minus2.textContent = "-";
    minus2.className = "qty-btn";
    const qty2 = document.createElement("span");
    qty2.textContent = item.quantity;
    qty2.className = "qty-count";
    const plus2 = document.createElement("button");
    plus2.textContent = "+";
    plus2.className = "qty-btn";
    qtyWrap2.appendChild(minus2);
    qtyWrap2.appendChild(qty2);
    qtyWrap2.appendChild(plus2);
    colQty.appendChild(qtyWrap2);

    // Nút xóa (cột nhỏ)
    const colDelete = document.createElement("div");
    colDelete.className = "cart-col cart-col-delete";
    const del2 = document.createElement("button");
    del2.textContent = "Xóa";
    del2.className = "cart-delete";
    colDelete.appendChild(del2);

    // Tổng của dòng sản phẩm
    const colTotal = document.createElement("div");
    colTotal.className = "cart-col cart-col-total";
    const lineTotal = document.createElement("div");
    lineTotal.className = "cart-total";
    lineTotal.textContent = formatVND(item.price * item.quantity);
    colTotal.appendChild(lineTotal);

    rightArea.appendChild(colName);
    rightArea.appendChild(colPrice);
    rightArea.appendChild(colQty);
    rightArea.appendChild(colDelete);
    rightArea.appendChild(colTotal);

    row.appendChild(colImage);
    row.appendChild(rightArea);
    list.appendChild(row);

    total += item.price * item.quantity;

    // Gắn sự kiện cho các điều khiển mới (plus2/minus2/del2 là các phần tử vừa tạo)
    plus2.addEventListener("click", () => {
      item.quantity += 1;
      saveCart(cart);
      renderCart();
      updateCartDisplay();
    });
    minus2.addEventListener("click", () => {
      if (item.quantity > 1) {
        item.quantity -= 1;
        saveCart(cart);
        renderCart();
        updateCartDisplay();
      }
    });
    del2.addEventListener("click", () => {
      cart.splice(idx, 1);
      saveCart(cart);
      renderCart();
      updateCartDisplay();
    });
  });

  summary.innerHTML = `<div style="font-size:1.6rem; font-weight:600">Tổng: ${formatVND(
    total
  )}</div>`;
}

// xử lý nút chuyển tới thanh toán
const btnCheckout = document.getElementById("to-checkout");
if (btnCheckout) {
  btnCheckout.addEventListener("click", () => {
    const user = getCurrentUser();
    if (!user) {
      alert("Vui lòng đăng nhập để tiếp tục thanh toán.");
      window.location.href = "index.html";
      return;
    }
    window.location.href = "checkout.html";
  });
}

// khởi tạo
document.addEventListener("DOMContentLoaded", () => {
  renderCart();
});
