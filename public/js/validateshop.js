function validateFormShop() {
    

    var nameshop = document.getElementById('shop').value;
    var phone1 = document.getElementById('phoneshop1').value;
    var phone2 = document.getElementById('phoneshop2').value;
    var mota = document.getElementById('motashop').value;
    var diachishop = document.getElementById('shopdiachi').value;
    

    // Xóa thông báo lỗi trước đó
    clearErrorMessages();

    // Kiểm tra nếu có trường nào bị để trống
    var isValid = true;
    
    if (nameshop === '') {
        displayErrorMessage('nameshopError', 'Vui lòng nhập tên cửa hàng');
        isValid = false;
    }
    if (phone1 === '') {
        displayErrorMessage('phone1Error', 'Vui lòng nhập số điện thoại');
        isValid = false;
    }
    if (phone2 === '') {
        displayErrorMessage('phone2Error', 'Vui lòng nhập số điện thoại');
        isValid = false;
    }
    if (mota === '') {
        displayErrorMessage('motaError', 'Vui lòng nhập mô tả');
        isValid = false;
    }
    if (diachishop === '') {
        displayErrorMessage('diachishopError', 'Vui lòng nhập số địa chỉ cửa hàng');
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