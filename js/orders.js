// orders.js - hiển thị các đơn hàng của người dùng lưu trong localStorage

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch (e) {
    return null;
  }
}

function getOrders() {
  const user = getCurrentUser();
  if (!user) return [];
  return JSON.parse(localStorage.getItem("orders_" + user.email)) || [];
}

function renderOrders() {
  const user = getCurrentUser();
  if (!user) {
    alert("Vui lòng đăng nhập để xem đơn hàng.");
    window.location.href = "index.html";
    return;
  }
  const list = document.getElementById("orders-list");
  list.innerHTML = "";
  const orders = getOrders();
  if (orders.length === 0) {
    list.innerHTML = '<p style="padding:20px">Bạn chưa có đơn hàng nào.</p>';
    return;
  }

  orders
    .slice()
    .reverse()
    .forEach((order) => {
      const wrap = document.createElement("div");
      wrap.style.borderBottom = "1px solid rgba(0,0,0,0.05)";
      wrap.style.padding = "8px 0";
      wrap.innerHTML = `<div style="display:flex; justify-content:space-between; align-items:center;"><div>
      <div style="font-weight:700">Mã đơn: ${order.id}</div>
      <div style="font-size:1.2rem; color:rgba(0,0,0,0.6)">Ngày: ${new Date(
        order.date
      ).toLocaleString()}</div>
    </div>
    <div style="text-align:right">
      <div style="font-weight:700">Tổng: ${order.total
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}đ</div>
      <div style="margin-top:8px">Trạng thái: ${order.status}</div>
      <div style="margin-top:8px"><button class="btn" style="padding:6px 8px">Xem chi tiết</button></div>
    </div></div>`;

      const btn = wrap.querySelector("button");
      btn.addEventListener("click", () => {
        // hiển thị chi tiết dạng modal
        let s = '<div style="padding:10px">';
        order.items.forEach((it) => {
          s += `<div style="display:flex; gap:10px; padding:6px 0; border-bottom:1px solid rgba(0,0,0,0.03)"><img src="${
            it.img || ""
          }" style="width:60px"/><div><div style="font-weight:600">${
            it.name
          }</div><div>${it.quantity} x ${it.price
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}đ</div></div></div>`;
        });
        s += `<div style="margin-top:8px; font-weight:700">Tổng: ${order.total
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}đ</div>`;
        s += "</div>";
        alert("Chi tiết đơn hàng:\n\n" + s.replace(/<[^>]+>/g, "\n"));
      });

      list.appendChild(wrap);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  renderOrders();
});
