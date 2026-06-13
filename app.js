//lấy dữ liệu từ localStorage
let Categories = [];
let Transactions = [];

let locNgay = new Date().toISOString().substring(0, 7);
function getData() {
  Categories = JSON.parse(localStorage.getItem("Categories")) || [];
  Transactions = JSON.parse(localStorage.getItem("Transactions")) || [];

  if (Categories.length == 0) {
    Categories = [
      { id: 1, name: "ăn uống", Limit: 200000 },
      { id: 2, name: "Đi chơi", Limit: 300000 },
      { id: 3, name: "Lương", Limit: 500000 },
    ];
  }

  if (Transactions.length == 0) {
    Transactions = [
      {
        id: 1,
        name: "ăn uống",
        amount: 20000,
        date: "2024-06",
        categoryId: 1,
        giaoDich: "Thu",
      },
      {
        id: 2,
        name: "Đi chơi",
        amount: 50000,
        date: "2024-06",
        categoryId: 2,
        giaoDich: "Thu",
      },
      {
        id: 3,
        name: "Lương",
        amount: 100000,
        date: "2024-06",
        categoryId: 3,
        giaoDich: "Thu",
      },
    ];
  }
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
      <span>Hạn mức: ${cat.Limit} </span>
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
  const limit = document.querySelector("#catLimit").value;

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
  Transactions.forEach((trans) => {
    const categoryTr = Categories.find((cat) => cat.id == trans.categoryId);
    const catName = categoryTr ? categoryTr.name : "";
    const thu = trans.giaoDich == "Thu";
    const color = thu ? "green" : "red";
    const dau = thu ? "+" : "-";

    listEL.innerHTML += ` 
<div style="border-bottom: 1px dashed #ccc; padding: 5px 0;">
        <strong>${catName}</strong> - (${trans.date}) - <i>${trans.note}</i> <br>
        <strong style="color: ${color}">${dau} ${trans.amount}</strong>
        <button onClick="deleteTransaction('${trans.id}')" style="margin-left: 10px;">Xóa</button>
        </div>
  `;
  });
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
});
