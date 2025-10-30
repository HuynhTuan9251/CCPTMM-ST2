const { CheckLogin, GetOrderStatus, ValidateLogin } = require("../utils/validate");

describe("White-box Testing", () => {
  // 🧠 CheckLogin - Phủ nhánh (Branch Coverage)
  test("CheckLogin - username rỗng", () => {
    expect(CheckLogin("", "123456")).toBe(false);
  });

  test("CheckLogin - đúng tài khoản", () => {
    expect(CheckLogin("admin@gmail.com", "123456")).toBe(true);
  });

  test("CheckLogin - sai mật khẩu", () => {
    expect(CheckLogin("admin@gmail.com", "abc")).toBe(false);
  });

  // 🚚 GetOrderStatus - Phủ đường đi (Path Coverage)
  test("GetOrderStatus - đã giao hàng", () => {
    expect(GetOrderStatus(true)).toBe("Đã giao hàng");
  });

  test("GetOrderStatus - đang chờ giao hàng", () => {
    expect(GetOrderStatus(false)).toBe("Đang chờ giao hàng");
  });

  // 🔐 ValidateLogin - Phủ nhánh và điều kiện (Branch & Condition Coverage)
  test("ValidateLogin - hợp lệ", () => {
    expect(ValidateLogin("thai", "123456")).toBe(true);
  });

  test("ValidateLogin - username rỗng", () => {
    expect(ValidateLogin("", "123456")).toBe(false);
  });

  test("ValidateLogin - password ngắn", () => {
    expect(ValidateLogin("thai", "123")).toBe(false);
  });

  test("ValidateLogin - cả 2 sai", () => {
    expect(ValidateLogin("", "123")).toBe(false);
  });
});
