document.addEventListener("DOMContentLoaded", function () {
    const saveButton = document.getElementById("addshop");
    saveButton.addEventListener("click", function () {
        document.cookie = "toastMessage=🏪 Thêm cửa hàng thành công!; expires=; path=/";
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const saveButton = document.getElementById("editshop");
    saveButton.addEventListener("click", function () {
        document.cookie = "toastMessage=✏️ Sửa thông tin cửa hàng thành công!; expires=; path=/";
    });
});