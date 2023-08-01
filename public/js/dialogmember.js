document.addEventListener("DOMContentLoaded", function () {
    const saveButton = document.getElementById("addButton");

    saveButton.addEventListener("click", function () {
        document.cookie = "toastMessage=➕ Thêm tài khoản thành công!; expires=; path=/";
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const saveButton = document.getElementById("saveButton");

    saveButton.addEventListener("click", function () {
        // Set the cookie to store the toast message
        document.cookie = "toastMessage=✏️ Thông tin đã được lưu!; expires=; path=/";

        
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const saveButton = document.getElementById("saveVip");

    saveButton.addEventListener("click", function () {
        // Set the cookie to store the toast message
        document.cookie = "toastMessage=✏️ Thông tin đã được lưu!; expires=; path=/"; 
    });
});