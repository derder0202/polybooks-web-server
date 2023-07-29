//gán dữ liệu cho gender
document.addEventListener("DOMContentLoaded", function() {
    const genderElements = document.querySelectorAll("#genderValue"); //querySelectorAll để lấy tất cả các phần tử trong bảng có id là "genderValue" và lưu chúng vào biến genderElements
    genderElements.forEach(function(genderElement) {
    const gender = genderElement.textContent.trim(); // Lấy nội dung của phần tử hiện tại bằng textContent,trim để loại bỏ khoảng trắng thừa từ đầu và cuối chuỗi.
    if (gender === "male") {
        genderElement.textContent = "Nam";
    } else {
        genderElement.textContent = "Nữ";
    }
    });
});
//gán dữ liệu cho role
document.addEventListener("DOMContentLoaded", function() {
    const roleElements = document.querySelectorAll("#roleValue"); //querySelectorAll để lấy tất cả các phần tử trong bảng có id là "genderValue" và lưu chúng vào biến genderElements
    roleElements.forEach(function(roleElement) {
    const role = roleElement.textContent.trim(); // Lấy nội dung của phần tử hiện tại bằng textContent,trim để loại bỏ khoảng trắng thừa từ đầu và cuối chuỗi.
    if (role === "0") {
        roleElement.textContent = "Thường";
    } else {
        roleElement.textContent = "Vip";
    }
    });
});
//gán dữ liệu cho status
document.addEventListener("DOMContentLoaded", function() {
    const statusElements = document.querySelectorAll("#statussValue"); //querySelectorAll để lấy tất cả các phần tử trong bảng có id là "genderValue" và lưu chúng vào biến genderElements
    statusElements.forEach(function(statusElement) {
    const bookStatus = statusElement.textContent.trim(); // Lấy nội dung của phần tử hiện tại bằng textContent,trim để loại bỏ khoảng trắng thừa từ đầu và cuối chuỗi.
    if (bookStatus === "0") {
        statusElement.textContent = "Mới";
    } else {
        statusElement.textContent = "Cũ";
    }
    });
});
//logic phân chia gender
