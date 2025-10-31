// === QUẢN LÝ TÀI KHOẢN ===

// Lấy các phần tử
const loginForm = document.getElementById("login");
const registerForm = document.getElementById("register");
const customerInfo = document.getElementById("customer-info");
const loginBtn = document.querySelectorAll(".action .btn")[0];
const userIcon = document.querySelector(".action .icon");
const userNameDisplay = document.getElementById("user-name");
const containerLoginRegister = document.querySelectorAll(
  ".container-login-register"
);

// Hiển thị form đăng nhập
function showLoginForm() {
  loginForm.style.display = "block";
  registerForm.style.display = "none";
  customerInfo.style.display = "none";
}

// Hiển thị form đăng ký
function showRegisterForm() {
  registerForm.style.display = "block";
  loginForm.style.display = "none";
  customerInfo.style.display = "none";
}

// Ẩn tất cả form
function hideAllForms() {
  loginForm.style.display = "none";
  registerForm.style.display = "none";
  customerInfo.style.display = "none";
}

// Khi click vào nút "Đăng nhập" hoặc icon user
loginBtn.addEventListener("click", function (e) {
  e.preventDefault();
  showLoginForm();
});

userIcon.addEventListener("click", function (e) {
  e.preventDefault();
  showLoginForm();
});

// Khi click vào link "Đăng ký"
const registerLink = document.querySelector("#login-form p a");
registerLink.addEventListener("click", function (e) {
  e.preventDefault();
  showRegisterForm();
});

// Khi click vào link "Đăng nhập" trong form đăng ký
const loginLink = document.querySelector("#register-form p a");
loginLink.addEventListener("click", function (e) {
  e.preventDefault();
  showLoginForm();
});

// Khi click ra ngoài form thì ẩn
containerLoginRegister.forEach(function (container) {
  container.addEventListener("click", function (e) {
    if (e.target === container) hideAllForms();
  });
});

// Xử lý Đăng ký
const formRegister = document.getElementById("form-2");
formRegister.addEventListener("submit", function (e) {
  e.preventDefault();

  const username = formRegister.querySelector('input[name="username"]').value;
  const email = formRegister.querySelector('input[name="email"]').value;
  const password = formRegister.querySelector('input[name="password"]').value;

  if (username && email && password) {
    const user = { username, email, password };
    localStorage.setItem("user", JSON.stringify(user));
    alert("Đăng ký thành công! Bạn có thể đăng nhập ngay.");
    hideAllForms();
    formRegister.reset();
  } else {
    alert("Vui lòng điền đầy đủ thông tin!");
  }
});

// Xử lý Đăng nhập
const formLogin = document.getElementById("form-1");
formLogin.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (!storedUser) {
    alert("Bạn chưa có tài khoản! Vui lòng đăng ký.");
    showRegisterForm();
    return;
  }

  if (email === storedUser.email && password === storedUser.password) {
    alert("Đăng nhập thành công!");
    hideAllForms();
    showUserName(storedUser.username);
    formLogin.reset();
  } else {
    alert("Email hoặc mật khẩu không chính xác!");
  }
});

// Hiển thị tên người dùng trên header
function showUserName(name) {
  loginBtn.style.display = "none";
  userIcon.style.display = "block";
  userNameDisplay.textContent = name;
  userNameDisplay.style.display = "inline-block";
}

// Khi click vào icon user và tên khách hàng => mở form thông tin
userIcon.addEventListener("click", function () {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (storedUser) showCustomerInfo(storedUser);
});

userNameDisplay.addEventListener("click", function () {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (storedUser) showCustomerInfo(storedUser);
});

// Hiển thị thông tin khách hàng
function showCustomerInfo(user) {
  document.getElementById("info-name").value = user.username;
  document.getElementById("info-email").value = user.email;
  document.getElementById("info-password").value = user.password;

  customerInfo.style.display = "block";
  loginForm.style.display = "none";
  registerForm.style.display = "none";
}

// Nút Sửa / Lưu / Đăng xuất
const editBtn = document.getElementById("edit-btn");
const saveBtn = document.getElementById("save-btn");
const logoutBtn = document.getElementById("logout-btn");

// Khi bấm Sửa
editBtn.addEventListener("click", function () {
  document.getElementById("info-name").disabled = false;
  document.getElementById("info-email").disabled = false;
  document.getElementById("info-password").disabled = false;
});

// Khi bấm Lưu
saveBtn.addEventListener("click", function () {
  const updatedUser = {
    username: document.getElementById("info-name").value,
    email: document.getElementById("info-email").value,
    password: document.getElementById("info-password").value,
  };

  localStorage.setItem("user", JSON.stringify(updatedUser));
  alert("Cập nhật thông tin thành công!");
  document.getElementById("info-name").disabled = true;
  document.getElementById("info-email").disabled = true;
  document.getElementById("info-password").disabled = true;
  showUserName(updatedUser.username);
});

// Khi bấm Đăng xuất
logoutBtn.addEventListener("click", function () {
  hideAllForms();
  loginBtn.style.display = "inline-block";
  userIcon.style.display = "inline-block";
  userNameDisplay.style.display = "none";
  alert("Bạn đã đăng xuất!");
});

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

// Khi click vào logo ở góc trái => reload trang
const logo = document.querySelector(".logo");
if (logo) {
  // thể hiện là có thể click
  logo.style.cursor = "pointer";
  logo.addEventListener("click", function () {
    // reload trang hiện tại
    location.reload();
  });
}

// === QUẢN LÝ SẢN PHẨM ===

// - Xem danh danh sách theo loại (phân trang)

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
      if (filter === "tat-ca" || category.includes(filter)) {
        //ktr mảng có chứa loại đc chọn không
        product.style.display = "block";
      } else {
        product.style.display = "none";
      }
    });
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

// Hàm tìm kiếm (đã chỉnh: gọi refreshPagination sau khi tìm)
function searchProducts() {
  const keyword = removeVietnameseTones(searchInput.value.trim().toLowerCase());

  // Nếu ô tìm rỗng -> reset về "Tất cả"
  if (!keyword) {
    // Hiện tất cả product-list và product-item, xoá class ẩn của phân trang
    productLists.forEach((pl) => {
      pl.style.display = "";
      const item = pl.querySelector(".product-item");
      if (item) item.style.display = "";
      pl.classList.remove("hidden-by-pagination");
    });

    // Đặt danh mục "Tất cả" thành active (nếu có)
    categoryItems.forEach((ci) => {
      if (ci.getAttribute("data-filter") === "tat-ca") {
        ci.classList.add("active");
      } else {
        ci.classList.remove("active");
      }
    });

    // Làm mới phân trang
    refreshPagination();
    return;
  }

  // Nếu có từ khóa -> lọc như cũ
  productLists.forEach((productList) => {
    const nameEl = productList.querySelector(".product-name");
    const companyEl = productList.querySelector(".product-company");

    const name = nameEl
      ? removeVietnameseTones(nameEl.textContent.toLowerCase())
      : "";
    const company = companyEl
      ? removeVietnameseTones(companyEl.textContent.toLowerCase())
      : "";
    const match = name.includes(keyword) || company.includes(keyword);

    productList.style.display = match ? "block" : "none";
  });

  // làm mới phân trang sau khi tìm
  refreshPagination();
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
const productItemsFilter = document.querySelectorAll(".product-item");

// khi click áp dụng (đã chỉnh: gọi refreshPagination ở cuối)
applyBtn.addEventListener("click", () => {
  // mảng lưu các thương hiệu
  const selectedBrands = [];
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      // thay tất cả dấu '-' bằng khoảng trắng rồi uppercase
      selectedBrands.push(checkbox.id.replace(/-/g, " ").toUpperCase());
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

  // lọc sản phẩm (dùng .product-item)
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

    product.style.display = matchBrand && matchPrice ? "block" : "none";
  });

  // Dồn sản phẩm lọc được lên trên (giữ như cũ)
  const productContainer = document.querySelector(".product");
  const allProducts = Array.from(
    productContainer.querySelectorAll(".product-item")
  );

  const matched = [];
  const unmatched = [];

  allProducts.forEach((item) => {
    if (item.style.display !== "none") {
      matched.push(item); // sản phẩm hiển thị
    } else {
      unmatched.push(item); // sản phẩm bị ẩn
    }
  });

  // thay đổi vị trí
  matched.reverse().forEach((item) => {
    productContainer.prepend(item.closest(".product-list"));
  });

  // làm mới phân trang sau khi áp dụng filter
  refreshPagination();
});

// ===== PHÂN TRANG SẢN PHẨM =====

// chọn đúng phần tử pagination (ưu tiên trong container-right)
const pagination =
  document.querySelector(".container-right .pagination") ||
  document.querySelector(".pagination");

let currentPage = 1;
const itemsPerPage = 15;

function showPage(page) {
  // Tính các product-list "khả dụng" dựa vào inline style (lọc/search set inline style)
  const visibleProducts = Array.from(productLists).filter((pl) => {
    // nếu filter/search đã set inline display = 'none' => loại bỏ
    if (pl.style.display === "none") return false;
    // nếu bên trong có .product-item và item bị ẩn inline => loại bỏ
    const child = pl.querySelector(".product-item");
    if (child && child.style.display === "none") return false;
    return true;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(visibleProducts.length / itemsPerPage)
  );

  // điều chỉnh page hợp lệ
  if (page > totalPages) page = totalPages;
  if (page < 1) page = 1;
  currentPage = page;

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  // Ẩn tất cả bằng class, sau đó mở những phần trong trang hiện tại
  productLists.forEach((pl) => pl.classList.add("hidden-by-pagination"));
  visibleProducts
    .slice(start, end)
    .forEach((pl) => pl.classList.remove("hidden-by-pagination"));

  // cập nhật phân trang UI
  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  if (!pagination) return;
  pagination.innerHTML = "";

  if (totalPages <= 1) return;

  // Prev
  const prevBtn = document.createElement("button");
  prevBtn.textContent = "«";
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => showPage(currentPage - 1);
  pagination.appendChild(prevBtn);

  // pages
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.classList.toggle("active", i === currentPage);
    btn.onclick = () => showPage(i);
    pagination.appendChild(btn);
  }

  // Next
  const nextBtn = document.createElement("button");
  nextBtn.textContent = "»";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => showPage(currentPage + 1);
  pagination.appendChild(nextBtn);
}

// lần đầu load
window.addEventListener("load", () => {
  showPage(currentPage);
});

// làm mới phân trang
const refreshPagination = () => {
  currentPage = 1;
  showPage(currentPage);
};

// gọi refreshPagination sau khi thay đổi danh mục (đã có filter/search gọi)
// thêm gọi này vào handler danh mục:
/* 
  Nếu file của bạn đang có 2 đoạn categoryItems.forEach(...) — XÓA đoạn nằm ở trên (đoạn không gọi refreshPagination),
  chỉ giữ đoạn bên dưới.
*/
categoryItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    categoryItems.forEach((i) => i.classList.remove("active"));
    item.classList.add("active");

    const filter = item.getAttribute("data-filter");

    products.forEach((product) => {
      const category = product.getAttribute("data-category").split(" ");
      if (filter === "tat-ca" || category.includes(filter)) {
        product.style.display = ""; // để CSS quyết định (hiện)
      } else {
        product.style.display = "none";
      }
    });

    // làm mới phân trang về trang 1 sau khi chọn danh mục
    refreshPagination();
  });
});
