document.addEventListener("DOMContentLoaded", function () {
    const approveButton = document.querySelector("button[value='duyet']");
    const rejectButton = document.querySelector("button[value='khongduyet']");

    approveButton.addEventListener("click", function () {
    // Set the cookie to store the toast message
    document.cookie = "toastMessage=✅ Bài đấu giá đã được duyệt!; expires=; path=/";

    // Redirect to the /BookApproval page
  
    });

    rejectButton.addEventListener("click", function () {
    // Set the cookie to store the toast message
    document.cookie = "toastMessage=ℹ️ Bài đấu giá không được duyệt!; expires=; path=/";

    // Redirect to the /BookApproval page
    
    });
});
//check trống reply
function approvePost() {
    // Cho phép người dùng duyệt bài mà không cần nhập lý do
    document.getElementById('reasonInput').setCustomValidity('');
    document.getElementById('reasonError').textContent = '';
}

function rejectPost() {
    const reasonInput = document.getElementById('reasonInput');
    const reasonError = document.getElementById('reasonError');
    const reason = reasonInput.value.trim();

    if (reason === '') {
    reasonInput.setCustomValidity(''); // Xóa thông báo lỗi mặc định
    reasonInput.setCustomValidity('Vui lòng nhập lý do không duyệt bài.');
    reasonError.textContent = 'Vui lòng nhập lý do không duyệt bài.'; // Hiển thị thông báo lỗi dưới ô input
    } else {
    reasonInput.setCustomValidity(''); // Xóa thông báo lỗi nếu trường nhập liệu hợp lệ
    reasonError.textContent = ''; // Xóa thông báo lỗi dưới ô input nếu trường nhập liệu hợp lệ
    }
}