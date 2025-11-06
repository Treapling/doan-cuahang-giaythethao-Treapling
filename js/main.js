// === QUẢN LÝ TÀI KHOẢN ===

// Lấy các phần tử
const loginForm = document.getElementById("login");
const registerForm = document.getElementById("register");
const customerInfo = document.getElementById("customer-info");
const loginBtn = document.querySelectorAll(".action .btn")[0];
const registerBtn = document.querySelectorAll(".action .btn")[1];
const userIcon = document.querySelector(".action .icon");
const userNameDisplay = document.getElementById("user-name");
const containerLoginRegister = document.querySelectorAll(
  ".container-login-register"
);

// === Hiển thị / Ẩn form ===
function showLoginForm() {
  loginForm.style.display = "block";
  registerForm.style.display = "none";
  customerInfo.style.display = "none";
}

function showRegisterForm() {
  registerForm.style.display = "block";
  loginForm.style.display = "none";
  customerInfo.style.display = "none";
}

function hideAllForms() {
  loginForm.style.display = "none";
  registerForm.style.display = "none";
  customerInfo.style.display = "none";
}

// === Xử lý sự kiện click ===
loginBtn.addEventListener("click", function (e) {
  e.preventDefault();
  showLoginForm();
});

registerBtn.addEventListener("click", function (e) {
  e.preventDefault();
  showRegisterForm();
});

// Khi click vào icon user
userIcon.addEventListener("click", function (e) {
  e.preventDefault();
  const storedUser = localStorage.getItem("user");

  // Nếu chưa có user hoặc đã bị xóa => mở form đăng nhập
  if (!storedUser || storedUser === "null" || storedUser === "undefined") {
    showLoginForm();
    return;
  }

  // Nếu có user thật => mở thông tin khách hàng
  const user = JSON.parse(storedUser);
  if (user && user.username) {
    showCustomerInfo(user);
  } else {
    showLoginForm();
  }
});

// Khi click vào link "Đăng ký" (chỉ nếu tồn tại)
const registerLink = document.querySelector("#login-form p a");
if (registerLink) {
  registerLink.addEventListener("click", function (e) {
    e.preventDefault();
    showRegisterForm();
  });
}

// Khi click vào link "Đăng nhập" trong form đăng ký (chỉ nếu tồn tại)
const loginLink = document.querySelector("#register-form p a");
if (loginLink) {
  loginLink.addEventListener("click", function (e) {
    e.preventDefault();
    showLoginForm();
  });
}

// Khi click ra ngoài form thì ẩn
containerLoginRegister.forEach(function (container) {
  container.addEventListener("click", function (e) {
    if (e.target === container) hideAllForms();
  });
});

// === Đăng ký ===
const formRegister = document.getElementById("form-2");
if (formRegister) {
  formRegister.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = formRegister.querySelector('input[name="username"]').value;
    const email = formRegister.querySelector('input[name="email"]').value;
    const password = formRegister.querySelector('input[name="password"]').value;

    if (username && email && password) {
      // Lấy danh sách khách hàng từ localStorage (nếu chưa có thì tạo mảng rỗng)
      let customers = JSON.parse(localStorage.getItem("customers")) || [];

      // Kiểm tra trùng email
      const exists = customers.some((c) => c.email === email);
      if (exists) {
        alert("Email này đã được sử dụng! Vui lòng chọn email khác.");
        return;
      }

      // Thêm khách hàng mới
      const newUser = { username, email, password };
      customers.push(newUser);
      localStorage.setItem("customers", JSON.stringify(customers));

      alert("Đăng ký thành công! Bạn có thể đăng nhập ngay.");
      formRegister.reset();

      registerForm.style.display = "none";
      loginForm.style.display = "block";
    } else {
      alert("Vui lòng điền đầy đủ thông tin!");
    }
  });
}

// === Đăng nhập ===
const formLogin = document.getElementById("form-1");
if (formLogin) {
  formLogin.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Lấy danh sách khách hàng
    const customers = JSON.parse(localStorage.getItem("customers")) || [];

    // Tìm khách hàng khớp email và mật khẩu
    const user = customers.find(
      (c) => c.email === email && c.password === password
    );

    if (user) {
      // Lưu thông tin người đăng nhập hiện tại
      localStorage.setItem("user", JSON.stringify(user));
      alert("Đăng nhập thành công!");
      hideAllForms();
      showUserName(user.username);
      formLogin.reset();
    } else {
      alert("Email hoặc mật khẩu không chính xác!");
    }
  });
}

// === Hiển thị tên người dùng trên header ===
function showUserName(name) {
  loginBtn.style.display = "none";
  registerBtn.style.display = "none";
  userIcon.style.display = "inline-block";
  userNameDisplay.textContent = name;
  userNameDisplay.style.display = "inline-block";
}

// === Khi click vào tên người dùng => mở thông tin khách hàng ===
if (userNameDisplay) {
  userNameDisplay.addEventListener("click", function () {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) showCustomerInfo(storedUser);
  });
}

// === Hiển thị thông tin khách hàng ===
function showCustomerInfo(user) {
  document.getElementById("info-name").value = user.username;
  document.getElementById("info-email").value = user.email;
  document.getElementById("info-password").value = user.password;

  customerInfo.style.display = "block";
  loginForm.style.display = "none";
  registerForm.style.display = "none";
}

// === Nút Sửa / Lưu / Đăng xuất ===
const editBtn = document.getElementById("edit-btn");
const saveBtn = document.getElementById("save-btn");
const logoutBtn = document.getElementById("logout-btn");

if (editBtn) {
  editBtn.addEventListener("click", function () {
    const nameEl = document.getElementById("info-name");
    const emailEl = document.getElementById("info-email");
    const passEl = document.getElementById("info-password");
    if (nameEl) nameEl.disabled = false;
    if (emailEl) emailEl.disabled = false;
    if (passEl) passEl.disabled = false;
  });
}

if (saveBtn) {
  saveBtn.addEventListener("click", function () {
    const nameEl = document.getElementById("info-name");
    const emailEl = document.getElementById("info-email");
    const passEl = document.getElementById("info-password");
    const updatedUser = {
      username: nameEl ? nameEl.value : "",
      email: emailEl ? emailEl.value : "",
      password: passEl ? passEl.value : "",
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    alert("Cập nhật thông tin thành công!");
    if (nameEl) nameEl.disabled = true;
    if (emailEl) emailEl.disabled = true;
    if (passEl) passEl.disabled = true;
    showUserName(updatedUser.username);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("user");
    hideAllForms();
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (registerBtn) registerBtn.style.display = "inline-block";
    if (userIcon) userIcon.style.display = "inline-block";
    if (userNameDisplay) userNameDisplay.style.display = "none";
    alert("Bạn đã đăng xuất!");
  });
}

// Khi reload trang mà user vẫn trong localStorage => tự hiển thị tên
window.addEventListener("load", function () {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (storedUser) showUserName(storedUser.username);
});

// Menu mobile
const navBars = document.querySelector(".nav_bars a");
const nav = document.querySelector(".nav");
navBars.addEventListener("click", function (e) {
  e.preventDefault();
  nav.style.display = nav.style.display === "block" ? "none" : "block";
});
// === HEADER NAV ===
const homeLink = document.getElementById("home-link");
const productLink = document.getElementById("product-link");
const containerLeft = document.querySelector(".container-left");
const containerRight = document.querySelector(".container-right");
const slider = document.querySelector(".slider");

// Khi bấm Trang Chủ => ẩn phần bên trái và canh giữa phần bên phải
homeLink.addEventListener("click", function (e) {
  e.preventDefault();
  containerLeft.style.display = "none";
  slider.style.display = "block";

  // Thêm màu cho Trang Chủ, bỏ màu ở Sản Phẩm
  homeLink.classList.add("active");
  productLink.classList.remove("active");
});

// Khi bấm Sản Phẩm => hiện lại phần bên trái, bỏ canh giữa
productLink.addEventListener("click", function (e) {
  e.preventDefault();
  containerLeft.style.display = "block";
  slider.style.display = "none";

  // Thêm màu cho Sản Phẩm, bỏ màu ở Trang Chủ
  productLink.classList.add("active");
  homeLink.classList.remove("active");
});

// Khi vừa vào trang => hiển thị Trang Chủ trước
window.addEventListener("load", function () {
  containerLeft.style.display = "none";
});

// === SLIDER ===
const sliderContent = document.querySelector(".slider-content");
const slides = document.querySelectorAll(".slider-item");
const prev = document.querySelector(".fa-chevron-left");
const next = document.querySelector(".fa-chevron-right");

let index = 0;
let interval;

// Clone slide đầu và cuối để tạo vòng lặp mượt
const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slides.length - 1].cloneNode(true);

sliderContent.appendChild(firstClone);
sliderContent.prepend(lastClone);

const allSlides = document.querySelectorAll(".slider-item");
let slideCount = allSlides.length;
sliderContent.style.transform = `translateX(-100%)`; // bắt đầu từ slide đầu thật

// Hiển thị slide dựa trên index
function showSlide(i) {
  sliderContent.style.transition = "transform 0.5s ease-in-out";
  sliderContent.style.transform = `translateX(${-100 * (i + 1)}%)`;
}

// Khi chuyển tiếp slide
next.addEventListener("click", () => {
  index++;
  showSlide(index);
  resetInterval();
});

// Khi chuyển lùi slide
prev.addEventListener("click", () => {
  index--;
  showSlide(index);
  resetInterval();
});

// Khi transition kết thúc, reset vị trí nếu tới clone
sliderContent.addEventListener("transitionend", () => {
  if (index >= slides.length) {
    // đi tới clone đầu
    sliderContent.style.transition = "none";
    index = 0;
    sliderContent.style.transform = `translateX(-100%)`;
  }
  if (index < 0) {
    // đi tới clone cuối
    sliderContent.style.transition = "none";
    index = slides.length - 1;
    sliderContent.style.transform = `translateX(${-100 * slides.length}%)`;
  }
});

// Tự động chạy slider
function startInterval() {
  interval = setInterval(() => {
    index++;
    showSlide(index);
  }, 5000);
}

// Dừng khi hover
document
  .querySelector(".slider-container")
  .addEventListener("mouseenter", () => clearInterval(interval));
document
  .querySelector(".slider-container")
  .addEventListener("mouseleave", startInterval);

// Reset interval khi bấm nút
function resetInterval() {
  clearInterval(interval);
  startInterval();
}

// Khởi tạo
showSlide(index);
startInterval();

// === QUẢN LÝ SẢN PHẨM ===

// - Xem danh danh sách theo loại

// lấy tất cả các thẻ a trong danh mục và các sản phẩm
const categoryItems = document.querySelectorAll(".category-list");
const products = document.querySelectorAll(".product-list");

// lặp qua từng danh mục
categoryItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault(); // trách load lại trang khi click <a>

    // bỏ im đậm
    categoryItems.forEach((i) => i.classList.remove("active"));

    // thêm in đậm khi click vào danh mục bất kì
    item.classList.add("active");

    const filter = item.getAttribute("data-filter");

    products.forEach((product) => {
      const category = product.getAttribute("data-category").split(" "); //tách thành mảng
      const keep = filter === "tat-ca" || category.includes(filter);
      product.classList.toggle("filter-hidden", !keep);
    });
    // cập nhật phân trang sau khi lọc theo danh mục
    currentPage = 1;
    renderPagination();
    showPage(currentPage);
    // persist filters
    saveFiltersState();
  });
});

// - Xem chi tiết sản phẩm

const productItems = document.querySelectorAll(".product-item");
const productDetails = document.querySelectorAll(".product-detail");
// Bắt sự kiện click vào từng sản phẩm
productItems.forEach((item) => {
  item.addEventListener("click", () => {
    const id = item.getAttribute("data-id");

    // Ẩn tất cả chi tiết
    productDetails.forEach((detail) => {
      detail.style.display = "none";
    });

    // Hiện đúng chi tiết có data-id trùng
    const targetDetail = document.querySelector(
      `.product-detail[data-id="${id}"]`
    );
    if (targetDetail) {
      targetDetail.style.display = "flex";
    }
  });
});

// Đóng chi tiết sản phẩm khi click ra ngoài
const allProductDetails = document.querySelectorAll(".product-detail");

allProductDetails.forEach((detail) => {
  const container = detail.querySelector(".product-detail-container");

  detail.addEventListener("click", (e) => {
    // nếu click không nằm trong container thì ẩn chi tiết
    if (!container.contains(e.target)) {
      detail.style.display = "none";
    }
  });
});

// === Đóng khi bấm vào nút X ===
const closeBtns = document.querySelectorAll(".close");
closeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const productDetail = btn.closest(".product-detail");
    const loginRegister = btn.closest(".login-register");

    // nút close ở chi tiết sản phẩm
    if (productDetail) {
      productDetail.style.display = "none";
    }

    // nút close ở đăng nhập, đăng ký, thông tin khách hàng
    if (loginRegister) {
      loginRegister.style.display = "none";
    }
  });
});

// - Tìm kiếm cơ bản theo tên
const searchInput = document.getElementById("basic-search");
const searchBtn = document.querySelector(".basic-btn");
const productLists = document.querySelectorAll(".product-list");

// Hàm xóa dấu tiếng Việt
function removeVietnameseTones(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

// Hàm tìm kiếm
function searchProducts() {
  const keyword = removeVietnameseTones(searchInput.value.trim().toLowerCase());

  productLists.forEach((productList) => {
    const name = removeVietnameseTones(
      productList.querySelector(".product-name").textContent.toLowerCase()
    );
    const company = removeVietnameseTones(
      productList.querySelector(".product-company").textContent.toLowerCase()
    );
    const match = name.includes(keyword) || company.includes(keyword);

    productList.classList.toggle("filter-hidden", !match);
  });

  // cập nhật phân trang sau khi tìm kiếm
  currentPage = 1;
  renderPagination();
  showPage(currentPage);
}

// Nhấn nút tìm
searchBtn.addEventListener("click", searchProducts);

// Nhấn Enter cũng tìm
searchInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    searchProducts();
  }
});

// - Tìm kiếm nâng cao (bộ lọc tìm kiếm)
const checkboxes = document.querySelectorAll(
  '.search-filter-item input[type="checkbox"]'
);
const applyBtn = document.querySelector(".search-filter-btn");
// thao tác trên cùng các wrapper dùng cho phân trang
const productItemsFilter = document.querySelectorAll(".product-list");

// khi click áp dụng (guarded in case this page doesn't have the filter UI)
if (applyBtn) {
  applyBtn.addEventListener("click", () => {
    // mảng lưu các thương hiệu
    const selectedBrands = [];
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        selectedBrands.push(checkbox.id.toUpperCase().replace("-", " "));
      }
    });

    // lấy khoảng giá từ 2 ô input
    const priceInputs = document.querySelectorAll(".search-filter-price input");
    const minPrice =
      priceInputs[0].value.trim() === ""
        ? 0
        : parseInt(priceInputs[0].value.replace(/\D/g, ""));
    const maxPrice =
      priceInputs[1].value.trim() === ""
        ? Infinity
        : parseInt(priceInputs[1].value.replace(/\D/g, ""));

    // lọc sản phẩm
    productItemsFilter.forEach((product) => {
      const brand = product
        .querySelector(".product-company")
        .textContent.trim()
        .toUpperCase();
      const priceText = product
        .querySelector(".price-current")
        .textContent.trim()
        .replace(/\./g, "")
        .replace("đ", "");
      const price = parseInt(priceText);

      const matchBrand =
        selectedBrands.length === 0 || selectedBrands.includes(brand);
      const matchPrice = price >= minPrice && price <= maxPrice;

      // hiện thị or ẩn sản phẩm (mark as filtered)
      product.classList.toggle("filter-hidden", !(matchBrand && matchPrice));
    });

    // Dồn sản phẩm lọc được lên trên
    const productContainer = document.querySelector(".product");
    // thao tác trên các wrapper .product-list để việc lọc theo class được nhất quán
    const allProducts = Array.from(
      productContainer.querySelectorAll(".product-list")
    );

    const matched = [];
    const unmatched = [];

    allProducts.forEach((item) => {
      if (!item.classList.contains("filter-hidden")) {
        matched.push(item); // sản phẩm hiển thị
      } else {
        unmatched.push(item); // sản phẩm bị ẩn
      }
    });

    // thay đổi vị trí
    matched.reverse().forEach((item) => {
      productContainer.prepend(item.closest(".product-list"));
    });

    // cập nhật phân trang sau khi áp dụng bộ lọc
    currentPage = 1;
    renderPagination();
    showPage(currentPage);
  });
}

// === PHÂN TRANG SẢN PHẨM & GIỎ HÀNG ĐỘNG ===
const PRODUCTS_PER_PAGE = 15;
let currentPage = 1;

function getAllProductLists() {
  return Array.from(document.querySelectorAll(".product-list"));
}

function getVisibleProductLists() {
  // Items eligible for pagination are those NOT hidden by filters/search
  return getAllProductLists().filter(
    (p) => !p.classList.contains("filter-hidden")
  );
}

function renderPagination() {
  const productContainer = document.querySelector(".product");
  if (!productContainer) return;

  const visible = getVisibleProductLists();
  const totalPages = Math.max(1, Math.ceil(visible.length / PRODUCTS_PER_PAGE));

  let pag = document.querySelector(".pagination");
  if (!pag) {
    pag = document.createElement("div");
    pag.className = "pagination";
    productContainer.parentNode.insertBefore(pag, productContainer.nextSibling);
  }

  // clear
  pag.innerHTML = "";

  if (totalPages <= 1) {
    pag.style.display = "none";
    return;
  } else {
    pag.style.display = "flex";
  }

  // phân trang gọn: Prev, cửa sổ các trang (tối đa 5), Next
  const maxButtons = 5;

  const addButton = (text, cls, disabled, onClick) => {
    const btn = document.createElement("button");
    btn.textContent = text;
    if (cls) btn.classList.add(cls);
    if (disabled) btn.classList.add("disabled");
    if (!disabled && onClick) btn.addEventListener("click", onClick);
    pag.appendChild(btn);
    return btn;
  };

  // Prev
  addButton("<", null, currentPage === 1, () => {
    if (currentPage > 1) {
      currentPage -= 1;
      showPage(currentPage);
      renderPagination();
    }
  });

  let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  let end = start + maxButtons - 1;
  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - maxButtons + 1);
  }

  if (start > 1) {
    addButton("1", null, false, () => {
      currentPage = 1;
      showPage(currentPage);
      renderPagination();
    });
    if (start > 2) {
      const ell = document.createElement("span");
      ell.className = "ellipsis";
      ell.textContent = "...";
      pag.appendChild(ell);
    }
  }

  for (let i = start; i <= end; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.dataset.page = i;
    if (i === currentPage) btn.classList.add("active");
    btn.addEventListener("click", function () {
      currentPage = i;
      showPage(currentPage);
      renderPagination();
    });
    pag.appendChild(btn);
  }

  if (end < totalPages) {
    if (end < totalPages - 1) {
      const ell = document.createElement("span");
      ell.className = "ellipsis";
      ell.textContent = "...";
      pag.appendChild(ell);
    }
    addButton(String(totalPages), null, false, () => {
      currentPage = totalPages;
      showPage(currentPage);
      renderPagination();
    });
  }

  // Next
  addButton(">", null, currentPage === totalPages, () => {
    if (currentPage < totalPages) {
      currentPage += 1;
      showPage(currentPage);
      renderPagination();
    }
  });
}

function showPage(page) {
  const visible = getVisibleProductLists();
  const all = getAllProductLists();

  // hide all first
  all.forEach((p) => (p.style.display = "none"));

  const start = (page - 1) * PRODUCTS_PER_PAGE;
  const end = start + PRODUCTS_PER_PAGE;
  const toShow = visible.slice(start, end);
  toShow.forEach((p) => (p.style.display = "block"));

  // update active button
  const pag = document.querySelector(".pagination");
  if (pag) {
    pag.querySelectorAll("button").forEach((btn) => {
      btn.classList.toggle("active", parseInt(btn.dataset.page, 10) === page);
    });
  }
}

// CART: persist count in localStorage and show toast
const cartBtn = document.querySelectorAll(".action .btn")[2];

// Trợ giúp: người dùng đang đăng nhập hiện tại (đối tượng) hoặc null
function getCurrentUser() {
  try {
    const u = JSON.parse(localStorage.getItem("user"));
    return u && u.email ? u : null;
  } catch (e) {
    return null;
  }
}

function getCurrentUserKey() {
  const user = getCurrentUser();
  return user ? `cart_${user.email}` : null;
}

function getCartForCurrentUser() {
  const key = getCurrentUserKey();
  if (!key) return [];
  return JSON.parse(localStorage.getItem(key)) || [];
}

function setCartForCurrentUser(cart) {
  const key = getCurrentUserKey();
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(cart));
}

function updateCartDisplay() {
  const user = getCurrentUser();
  if (!user) {
    if (cartBtn) cartBtn.textContent = "Giỏ hàng";
    return;
  }
  const cart = getCartForCurrentUser();
  const count = cart.reduce((s, it) => s + (it.quantity || 0), 0);
  if (cartBtn) cartBtn.textContent = `Giỏ hàng (${count})`;
}

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  if (toast._timeout) clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

// Attach add-to-cart listeners
function attachAddToCart() {
  const addCartButtons = document.querySelectorAll(".add-cart");
  addCartButtons.forEach((btn) => {
    if (btn.dataset.cartAttached) return;
    btn.dataset.cartAttached = "1";
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const user = getCurrentUser();
      if (!user) {
        showToast("Vui lòng đăng nhập để sử dụng giỏ hàng.");
        return;
      }

      // find product context (detail or list)
      const productEl =
        btn.closest(".product-detail-container") ||
        btn.closest(".product-list") ||
        btn.closest(".product-item");
      if (!productEl) {
        showToast("Không tìm thấy thông tin sản phẩm.");
        return;
      }

      // try gather info
      const nameEl = productEl.querySelector(".product-name");
      const companyEl = productEl.querySelector(".product-company");
      const priceEl = productEl.querySelector(".price-current");
      const imgEl = productEl.querySelector("img");

      const name = nameEl ? nameEl.textContent.trim() : "Sản phẩm";
      const company = companyEl ? companyEl.textContent.trim() : "";
      const priceText = priceEl
        ? priceEl.textContent.trim().replace(/\./g, "").replace(/đ/g, "").trim()
        : "0";
      const price = parseInt(priceText) || 0;
      const img = imgEl ? imgEl.getAttribute("src") : "";

      const id =
        (productEl.closest(".product-list") || productEl).getAttribute(
          "data-id"
        ) || name + "_" + price;

      // add to user's cart
      const cart = getCartForCurrentUser();
      const existing = cart.find((it) => it.id === id);
      if (existing) {
        existing.quantity = (existing.quantity || 0) + 1;
      } else {
        cart.push({ id, name, company, price, img, quantity: 1 });
      }
      setCartForCurrentUser(cart);
      updateCartDisplay();
      showToast("Đã thêm vào giỏ hàng thành công!");
    });
  });
}

// Initialize pagination and cart on load
window.addEventListener("load", function () {
  // pagination
  currentPage = 1;
  renderPagination();
  showPage(currentPage);

  // cart
  updateCartDisplay();
  attachAddToCart();
  // restore filters state (if any)
  loadFiltersState();
});

// Gắn lại (re-attach) khi chi tiết sản phẩm hoặc DOM thay đổi (nỗ lực tốt nhất)
document.addEventListener("click", function () {
  // không cần debounce nhỏ; gắn lại đơn giản
  attachAddToCart();
});

// Đảm bảo điều khiển giỏ hàng điều hướng tới trang giỏ và hiển thị đúng trên các trang
function attachCartNavigation() {
  try {
    // any anchor or button in .action that links to cart.html (robust matching)
    const sel =
      '.action a[href*="cart.html"], .action a[href*="/cart.html"], .action .icon';
    const cartElems = document.querySelectorAll(sel);
    cartElems.forEach((el) => {
      // không ghi đè hành vi của anchor nếu có logic khác, nhưng đảm bảo điều hướng
      el.addEventListener("click", function (e) {
        // cho phép hành vi mặc định cho anchor; đảm bảo chuyển tới trang giỏ nếu cần
        // if it's an anchor without href or a JS-handled element, force navigate
        const href = el.getAttribute && el.getAttribute("href");
        if (!href || href === "#") {
          e.preventDefault();
          window.location.href = "cart.html";
        }
      });
    });
  } catch (err) {
    // silent fail - non critical
  }
}

// gọi một lần khi tải để kết nối điều hướng giỏ hàng
window.addEventListener("load", attachCartNavigation);
