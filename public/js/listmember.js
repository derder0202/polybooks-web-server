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
//logic phân chia gender
document.addEventListener("DOMContentLoaded", function() {
    const genderSelect = document.getElementById('gender'); // Lấy phần tử select
    genderSelect.addEventListener('change', function() {
        var selectedGender = this.value; // Lấy giá trị giới tính đã chọn
        var tableRows = document.querySelectorAll('#datatablesSimple tbody tr'); // Lấy tất cả các hàng trong bảng
        tableRows.forEach(function(row) {
            var genderCell = row.querySelector('td:nth-child(6)'); // Lấy ô chứa thông tin giới tính
            var gender = genderCell.textContent.trim();
            // Kiểm tra giới tính và ẩn/hiện hàng tương ứng
            if (selectedGender === 'Tất cả') {
                row.style.display = 'table-row'; // Hiện hàng
            } else if (selectedGender === 'Nam' && gender.toLowerCase() === 'nam') { //so sánh không phụ thuộc vào viết hoa hay viết thường
                row.style.display = 'table-row'; // Hiện hàng nếu là nam
            } else if (selectedGender === 'Nữ' && gender.toLowerCase() === 'nữ') {
                row.style.display = 'table-row'; // Hiện hàng nếu là nữ
            } else {
                row.style.display = 'none'; // Ẩn hàng
            }
        });
    });
});