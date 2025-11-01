function CheckLogin(username, password) {
    if (!username || !password) return false;
    else if (username === "admin@gmail.com" && password === "123456") return true;
    else return false;
  }
  
  function GetOrderStatus(shipped) {
    if (shipped) return "Đã giao hàng";
    else return "Đang chờ giao hàng";
  }
  
  function ValidateLogin(username, password) {
    if (username && password.length >= 6) return true;
    else return false;
  }
  
  module.exports = { CheckLogin, GetOrderStatus, ValidateLogin };
  