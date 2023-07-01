document.addEventListener("DOMContentLoaded", function() {
    const salesTypeElements = document.querySelectorAll("#salesType"); //querySelectorAll để lấy tất cả các phần tử trong bảng có id là "genderValue" và lưu chúng vào biến genderElements
    salesTypeElements.forEach(function(salesTypeElements) {
        const salesType = salesTypeElements.textContent.trim(); // Lấy nội dung của phần tử hiện tại bằng textContent,trim để loại bỏ khoảng trắng thừa từ đầu và cuối chuỗi.
        if (salesType === "0") {
            salesTypeElements.textContent = "Bán";
        } else {
            salesTypeElements.textContent = "Miễn phí";
        }
    });
});