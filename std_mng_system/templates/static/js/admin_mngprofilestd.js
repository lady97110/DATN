function rowClick(row) {
    const showProfile = document.querySelector(".showprofile");
    showProfile.style.display = "";
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

    document.addEventListener("DOMContentLoaded", function() {
    const rows = document.querySelectorAll(".table-body");
    rows.forEach(function(row) {
        row.addEventListener("click", function(){
            rowClick(this);
        });
    });
});