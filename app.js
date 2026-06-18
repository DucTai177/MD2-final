//lấy dữ liệu từ localStorage
let Categories = [];
let Transactions = [];

// let locNgay = new Date().toISOString().substring(0, 7);

function getData() {
  Categories = JSON.parse(localStorage.getItem("Categories")) || [];
  Transactions = JSON.parse(localStorage.getItem("Transactions")) || [];

  saveData("Categories", Categories);
  saveData("Transactions", Transactions);
}

function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
getData();
renderCategory();
renderTransaction();

//render danh mục
function renderCategory() {
  const listEL = document.querySelector("#categoryList");
  const listTransEL = document.querySelector("#transCategory");
  listEL.innerHTML = "";
  listTransEL.innerHTML = "";
  Categories.forEach((cat) => {
    listEL.innerHTML += `
    <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding: 10px; border-bottom: 1px solid #ccc;">
      <span><strong>${cat.name}</strong></span>
      <span>Hạn mức: ${cat.Limit} (VNĐ) </span>
      <button onclick="deleteCategory(${cat.id})">Xóa</button>
    </div>
    `;

    listTransEL.innerHTML += `
    <option value="${cat.id}">${cat.name}</option>
    `;
  });
}

//thêm danh mục
document.querySelector("#formCategory").addEventListener("submit", (e) => {
  e.preventDefault();
  getData();

  const name = document.querySelector("#catName").value;
  const limit = +document.querySelector("#catLimit").value;

  if( limit <=0){
    alert("Hạn mức không được âm")
    return;
  }

  const newCategory = {
    id: Categories.length + 1,
    name: name,
    Limit: limit,
  };
  Categories.push(newCategory);
  saveData("Categories", Categories);

  e.target.reset();
  renderCategory();
});

//render giao dịch
function renderTransaction() {
  const listEL = document.querySelector("#transactionList");
  listEL.innerHTML = "";

  [...Transactions].reverse().forEach((trans) => {
    const categoryTr = Categories.find((cat) => cat.id == trans.categoryId);
    const catName = categoryTr ? categoryTr.name : "";
    const thu = trans.giaoDich == "Thu";
    const color = thu ? "green" : "red";
    const dau = thu ? "+" : "-";

    listEL.innerHTML += ` 
<div style="border-bottom: 1px dashed #ccc; padding: 5px 0;">
        <strong>${catName}</strong> - (${trans.date}) - <i>${trans.note}</i> <br>
        <strong style="color: ${color}">${dau} ${trans.amount} (VNĐ)</strong>
        <button onClick="deleteTransaction('${trans.id}')" style="margin-left: 10px;">Xóa</button>
        </div>
  `;
  });
  totalMoney();
}

//thêm gia dịch
document.querySelector("#formTransaction").addEventListener("submit", (e) => {
  e.preventDefault();
  getData();
  const type = document.querySelector("#transType").value;
  const amount = document.querySelector("#transAmount").value;
  const date = document.querySelector("#transDate").value;
  const categoryId = document.querySelector("#transCategory").value;
  const note = document.querySelector("#transNote").value;

  const newTransaction = {
    id: Transactions.length + 1,
    amount: amount,
    date: date,
    categoryId: categoryId,
    note: note,
    giaoDich: type === "thuTien" ? "Thu" : "Chi",
  };
  Transactions.push(newTransaction);
  saveData("Transactions", Transactions);

  e.target.reset();
  renderTransaction();
  notifi();
});

//Xóa danh mục
function deleteCategory(id) {
  if (confirm("Bạn muốn xóa không?")) {
    const newLiCates = Categories.filter((cat) => cat.id != id);
    Categories = newLiCates;
    saveData("Categories", Categories);
    renderCategory();
  }
}

//Xóa giao dịch
function deleteTransaction(id) {
  if (confirm("Bạn muốn xóa không?")) {
    const newLiTrans = Transactions.filter((trans) => trans.id != id);
    Transactions = newLiTrans;
    saveData("Transactions", Transactions);
    renderTransaction();
  }
}

// Đẩy số dư lên màn
function totalMoney() {
  let Thu = 0;
  let Chi = 0;
  Transactions.forEach((trans) => {
    const soTien = Number(trans.amount);
    if (trans.giaoDich == "Thu") {
      Thu += soTien;
    } else {
      Chi += soTien;
    }
  });
  const tinhToan = Thu - Chi;

  document.querySelector("#totalThu").innerHTML = Thu + "(VNĐ)";
  document.querySelector("#totalChi").innerHTML = Chi + "(VNĐ)";

  const tinhEL = document.querySelector("#totalBalance");
  tinhEL.innerHTML = tinhToan + "(VNĐ)";
  tinhEL.style.color = tinhToan > 0 ? "green" : "red";
}

// //THông báo vướt quá hạn mức
function notifi() {
  Categories.forEach((cat) => {
    let tongChi = 0;
    Transactions.forEach((trans) => {
      if (+trans.categoryId == cat.id && trans.giaoDich == "Chi") {
        tongChi += +trans.amount;
      }
    });
    if (tongChi > +cat.Limit) {
      alert(
        `Cảnh báo: Danh mục "${cat.name}" đã vượt quá hạn mức!\n- Hạn mức: ${cat.Limit}\n- Đã chi: ${tongChi}`,
      );
    }
  });
}
