
document.addEventListener("DOMContentLoaded", function() {
    var cancelButton = document.getElementById("cancelButton");
    cancelButton.addEventListener("click", clearInputs);
});
function confirmRedirectToRegularMembers() {
    var confirmLeave = confirm("Bạn có chắc chắn muốn rời khỏi trang này không?"); // Hiển thị hộp thoại xác nhận

    if (confirmLeave) {
        window.location.href = "/RegularMembers"; // Nếu người dùng đồng ý, chuyển hướng tới "list_regular_member"
    }
}
function confirmRedirectToVipMembers() {
    var confirmLeave = confirm("Bạn có chắc chắn muốn rời khỏi trang này không?"); // Hiển thị hộp thoại xác nhận

    if (confirmLeave) {
        window.location.href = "/VipMembers"; 
    }
}
function confirmRedirectBookApproval() {
    var confirmLeave = confirm("Bạn có chắc chắn muốn rời khỏi trang này không?"); // Hiển thị hộp thoại xác nhận

    if (confirmLeave) {
        window.location.href = "/BookApproval"; 
    }
}
function confirmRedirectShop() {
    var confirmLeave = confirm("Bạn có chắc chắn muốn rời khỏi trang này không?"); // Hiển thị hộp thoại xác nhận

    if (confirmLeave) {
        window.location.href = "/Shop"; 
    }
}
function clearInputs() {
    var inputs = document.querySelectorAll('input'); // Lấy tất cả các trường input
    var hasValue = false; // Biến để kiểm tra xem có trường input nào có giá trị không

    inputs.forEach(function(input) {
        if (input.value !== "") {
            hasValue = true; // Đánh dấu là có trường input có giá trị
        }
    });

    if (hasValue) {
        var confirmClear = confirm("Bạn có chắc chắn muốn xóa thông tin đã nhập không?"); // Hiển thị hộp thoại xác nhận

        if (confirmClear) {
            inputs.forEach(function(input) {
                input.value = ""; // Đặt giá trị của trường input về rỗng
            });
        }
    }
}
function validateForm() {
    // Lấy giá trị từ các trường nhập liệu
    var fullName = document.getElementById('inputUsername').value;
    var email = document.getElementById('email').value;
    // var address = document.getElementById('address').value;
    var gender = document.getElementById('gender').value;
    var birthday = document.getElementById('inputBirthday').value;
    var role = document.getElementById('role').value;
    
  

 
    

    // Xóa thông báo lỗi trước đó
    clearErrorMessages();

    // Kiểm tra nếu có trường nào bị để trống
    var isValid = true;
    if (fullName === '') {
        displayErrorMessage('fullNameError', 'Vui lòng nhập họ tên');
        isValid = false;
    }
    if (email === '') {
        displayErrorMessage('emailError', 'Vui lòng nhập email');
        isValid = false;
    }
    
    // if (address === '') {
    //     displayErrorMessage('addressError', 'Vui lòng nhập địa chỉ');
    //     isValid = false;
    // }
    if (gender === 'Mời bạn chọn giới tính') {
        displayErrorMessage('genderError', 'Vui lòng nhập giới tính');
        isValid = false;
    }
    if (birthday === '') {
        displayErrorMessage('birthdayError', 'Vui lòng nhập ngày sinh');
        isValid = false;
    }
    if (role === 'Mời bạn chọn vai trò') {
        displayErrorMessage('roleError', 'Vui lòng chọn vai trò');
        isValid = false;
    }
   
    return isValid;
}

function displayErrorMessage(elementId, message) {
    var errorElement = document.getElementById(elementId);
    errorElement.innerText = message;
}

function clearErrorMessages() {
    var errorElements = document.getElementsByClassName('error-message');
    for (var i = 0; i < errorElements.length; i++) {
        errorElements[i].innerText = '';
    }
}


