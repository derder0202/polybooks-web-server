function validateFormAddMember() {
    // Lấy giá trị từ các trường nhập liệu
    var fullName = document.getElementById('inputUsername').value;
    var email = document.getElementById('email').value;
    // var address = document.getElementById('address').value;
    var gender = document.getElementById('gender').value;
    var birthday = document.getElementById('inputBirthday').value;
    var role = document.getElementById('role').value;
    var phone = document.getElementById('phoneNumber').value;
    var password = document.getElementById('password').value;
    
    
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
    if (phone.trim() === '') {
        displayErrorMessage('phoneError', 'Vui lòng nhập số điện thoại');
        isValid = false;
    }
    if (password.trim() === '') {
        displayErrorMessage('passwordError', 'Vui lòng nhập password');
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