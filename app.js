const defaultCategories = {
  id: 1,
  name: "ăn uống",
  limit: 1000000,
  id: 2,
  name: "xăng xe",
  limit: 500000,
  id: 3,
  name: "đi chơi",
  limit: 3000000,
};

const defaultTransactions = [];

 function getData(key) {
  const chuoiString = localStorage.getItem(key);
  if (chuoiString) {
    saveData("categories", defaultCategories);
    return JSON.parse(chuoiString);
  } else {
    //Nếu chưa có dữ liệu, phải lưu dữ liệu trước
    if (key == "categories") saveData("categories", defaultCategories);
    else if (key == "transactions") return defaultCategories;
    else return defaultTransactions;
  }
}

export function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
