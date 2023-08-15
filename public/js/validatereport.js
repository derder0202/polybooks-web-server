function validateFormReport() {
    var name = document.getElementById('name').value;

    // Xóa thông báo lỗi trước đó
    clearErrorMessages();

    // Kiểm tra nếu có trường nào bị để trống
    var isValid = true;
    
    if (name === '') {
        displayErrorMessage('nameError', 'Vui lòng nhập phản hồi');
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