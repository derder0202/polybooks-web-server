document.addEventListener("DOMContentLoaded", function () {
    const approveButton = document.querySelector("button[value='reply']");
    const rejectButton = document.querySelector("button[value='reject']");

    approveButton.addEventListener("click", function () {
    // Set the cookie to store the toast message
    document.cookie = "toastMessage=✅ Gửi phản hồi thành công!; expires=; path=/";

    // Redirect to the /BookApproval page
   
    });

    rejectButton.addEventListener("click", function () {
    // Set the cookie to store the toast message
    document.cookie = "toastMessage=ℹ️  Bài đăng sách không được duyệt!; expires=; path=/";

    // Redirect to the /BookApproval page
    
    });
});