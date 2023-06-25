function validateForm() {
    // Lấy giá trị từ các trường nhập liệu
    var newpass = document.getElementById('newpass').value;
    var confirmpass = document.getElementById('confirmpass').value;
    
    // Xóa thông báo lỗi trước đó
    clearErrorMessages();
    
    // Kiểm tra nếu có trường nào bị để trống
    var isValid = true;
    
    if (newpass.trim() === '') {
        displayErrorMessage('newpassError', 'Vui lòng nhập mật khẩu mới');
        isValid = false;
    }
    
    if (confirmpass.trim() === '') {
        displayErrorMessage('confirmpassError', 'Vui lòng xác nhận mật khẩu mới');
        isValid = false;
    }
    
    return isValid;
    }
    window.addEventListener('DOMContentLoaded', function() {
        var newPasswordInput = document.getElementById('newpass');
        newPasswordInput.value = '';
    });
    
    //Ẩn hiện password
    function togglePasswordVisibility(inputId, toggleId) {
        var passwordInput = document.getElementById(inputId);
        var toggleButton = document.getElementById(toggleId);
    
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            toggleButton.innerHTML = '<i class="far fa-eye-slash"></i>';
        } else {
            passwordInput.type = "password";
            toggleButton.innerHTML = '<i class="far fa-eye"></i>';
        }
    }
    
    