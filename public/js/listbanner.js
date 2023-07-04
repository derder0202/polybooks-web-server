// document.addEventListener("DOMContentLoaded", function() {
//     const isActiveElements = document.querySelectorAll("#isActiveValue"); //querySelectorAll để lấy tất cả các phần tử trong bảng có id là "genderValue" và lưu chúng vào biến genderElements
//     isActiveElements.forEach(function (isActiveElements) {
//         const isActive = isActiveElements.textContent; // Lấy nội dung của phần tử hiện tại bằng textContent,trim để loại bỏ khoảng trắng thừa từ đầu và cuối chuỗi.
//         if (isActive === true) {
//             isActiveElements.textContent = "Đang sử dụng";
//         } else {
//             isActiveElements.textContent = "Chưa sử dụng";
//         }
//     })
// });
const data = { "isActive": true };
document.addEventListener("DOMContentLoaded", function() {
    const isActiveElements = document.querySelector("#isActiveValue"); // Sử dụng querySelector thay vì querySelectorAll nếu id là duy nhất

    // Giả định rằng dữ liệu từ API đã được gán vào biến data
    const isActive = data.isActive;

    if (isActive.toString() === true) {
        isActiveElements.textContent = "Đang sử dụng";
    } else {
        isActiveElements.textContent = "Chưa sử dụng";
    }
});