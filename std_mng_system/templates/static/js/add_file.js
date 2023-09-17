document.addEventListener("DOMContentLoaded", function () {
    //tai len file excel
    const file_input = document.getElementById("input-excel-file");
    const btn_upload = document.getElementById("uploadBtn");
    btn_upload.addEventListener("click", function () {
        upload_excel(file_input);
    });
});

//gui excel toi views
function upload_excel_to_view(formData) {
    return new Promise(function (resolve, reject) {
        const csrfToken = getCSRFToken();
        $.ajax({
            url: 'add-data1/',
            method: 'POST',
            dataType: 'json',
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'X-CSRFToken': csrfToken
            },
            success: function (data) {
              
            },
            error: function (data) {
            }
        });
    });
}



//upload excel + action
function upload_excel(file_input) {
    file = file_input.files[0];
    if (file) {
        const formData = new FormData();
        formData.append("excel_file", file);
        upload_excel_to_view(formData)
            .then(function (data) {    
        });
    };   
}









//token
function getCSRFToken() {
    const cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].split('=');
        if (cookie[0] === 'csrftoken') {
            return cookie[1];
        }
    }
    return null;
}