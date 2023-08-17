function rowClick(row) {
    const showProfile = document.querySelector(".showprofile");
    const profileedit = document.querySelector(".edit-profile");
    profileedit.style.display = "none";
    showProfile.style.display = "flex";
        var idStd = row.getAttribute("data-idStd");
        $.ajax({
            url: 'detail-profile-std/' + idStd + '/',
            method: 'get',
            dataType: 'json',
            success: function (data) {
                var select = data;
                document.querySelector("#select-idStd").textContent = select.idStd;
                document.querySelector("#select-phoneStd").textContent = select.phoneStd;
                document.querySelector("#select-nameStd").textContent = select.nameStd;
                document.querySelector("#select-emailStd").textContent = select.emailStd;
                document.querySelector("#select-datebirthStd").textContent = select.datebirthStd;
                document.querySelector("#select-idFacultyClas-faculty").textContent = select.faculty;
                document.querySelector("#select-genderStd").textContent = select.genderStd;
                document.querySelector("#select-addressStd").textContent = select.addressStd;
                document.querySelector("#select-idFacultyClass-department").textContent = select.department;
                document.querySelector("#select-idFacultyClass-idCourse").textContent = select.idCourse;
                document.querySelector("#select-idFacultyClass").textContent = select.idFacultyClass;
                var graduate = document.querySelector("#select-graduate");
                if (select.graduate) {
                    graduate.textContent = "Chưa tốt nghiệp";
                } else {
                    graduate.textContent = "Đã tốt nghiệp";
                }
            },
            error: function () {
                alert("Không thể lấy thông tin sinh viên.");
            }
        });
}


function deleteProfile() {
    const csrfToken = getCSRFToken();
    $.ajax({
        url: 'delete-profile/',
        method: 'post',
        dataType: 'json',
        headers: {
            'X-CSRFToken': csrfToken
        },
        success: function(data) {
            if (data.confirm) {
                location.reload();
                alert('Xóa thành công');
            }
            else {
                alert('Xóa không thành công, thử lại');
            }
        },
        error: function() {
            alert('Lỗi trong quá trình xử lý.');
        },
    }); 
}


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
    document.addEventListener("DOMContentLoaded", function() {
    const rows = document.querySelectorAll(".table-body");
    rows.forEach(function(row) {
        row.addEventListener("click", function(){
            rowClick(this);
        });
    });

    const confirmDeleteButton = document.querySelector("#confirmDeleteButton");
    if (confirmDeleteButton) {
        confirmDeleteButton.addEventListener("click", function (event){
            event.preventDefault();
            deleteProfile();
        });           
    };
// Nút đóng detail
    const closeBtnDetail = document.getElementById("closedetail");
    const profiledetail = document.querySelector(".showprofile");
    closeBtnDetail.addEventListener("click", function() {
        profiledetail.style.display = "none";
    });

// Nút đóng edit
    const closeBtnEdit = document.getElementById("closeedit");
    const profileedit = document.querySelector(".edit-profile");
    closeBtnEdit.addEventListener("click", function() {
        profileedit.style.display = "none";
    });

// Nút thêm mới
    const addprofileBtn = document.getElementById("addprofile");
    addprofileBtn.addEventListener("click", function() {
        profileedit.style.display = "flex";
    });

// Nút sửa hồ sơ
    const editprofileBtn = document.getElementById("editprofile");
    editprofileBtn.addEventListener("click", function() {
        profileedit.style.display = "flex";
        profiledetail.style.display = "none";
    });
});