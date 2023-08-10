function validateFormBanner() {

    var name = document.getElementById('name').value;
    var phone = document.getElementById('phone').value;
    var mota = document.getElementById('mota').value;
    var diachi = document.getElementById('diachi').value;
    // var link = document.getElementById('link').value;
    var price = document.getElementById('price').value;
    var endTime = document.getElementById('endTime').value;
    
    

    // Xóa thông báo lỗi trước đó
    clearErrorMessages();

    // Kiểm tra nếu có trường nào bị để trống
    var isValid = true;
    
    if (name === '') {
        displayErrorMessage('nameError', 'Vui lòng nhập tên khách hàng');
        isValid = false;
    }
    if (phone === '') {
        displayErrorMessage('phoneError', 'Vui lòng nhập số điện thoại');
        isValid = false;
    }
    // if (link === '') {
    //     displayErrorMessage('linkError', 'Vui lòng nhập liên kết');
    //     isValid = false;
    // }
    if (mota === '') {
        displayErrorMessage('motaError', 'Vui lòng nhập mô tả');
        isValid = false;
    }
    if (diachi === '') {
        displayErrorMessage('diachiError', 'Vui lòng nhập địa chỉ');
        isValid = false;
    }
    if (price === '') {
        displayErrorMessage('priceError', 'Vui lòng nhập giá');
        isValid = false;
    }
    if (endTime === '') {
        displayErrorMessage('endTimeError', 'Vui lòng nhập thời gian hết hạn');
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