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
                    document.querySelector("#select-idClass-faculty").textContent = select.faculty;
                    document.querySelector("#select-idClass-faculty").setAttribute("data-value", select.idFaculty);  //mã khoa
                    document.querySelector("#select-genderStd").textContent = select.genderStd;
                    document.querySelector("#select-addressStd").textContent = select.addressStd;
                    document.querySelector("#select-idClass-department").textContent = select.department;
                    document.querySelector("#select-idClass-idCourse").textContent = select.idCourse;
                    document.querySelector("#select-idClass").textContent = select.idClass;
                    var graduate = document.querySelector("#select-graduate");

                    
                    if (select.graduate) {
                        graduate.textContent = "Chưa tốt nghiệp";
                    } else {
                        graduate.textContent = "Đã tốt nghiệp";
                    }

                    //tạo select box department từ idFaculty (dung de hien thi gia tri mac dinh)
                    const idFaculty = select.idFaculty;
                    const optionDepartment = document.getElementById("select-idClass-department-edit");
                    $.ajax({
                        url: 'get-department/' + idFaculty +'/',
                        method: 'GET',
                        dataType: 'json',
                        success: function (data) {
                            optionDepartment.innerHTML = '';
                            data.departments.forEach(function(department) {
                            const option = document.createElement("option");
                            option.value = department.idDepartment;
                            option.textContent = department.nameDepartment;
                            optionDepartment.appendChild(option);
                            });

                            //tao select class từ idDepartment(dung de hien thi gia tri mac dinh)
                            const idDepartment = select.idDepartment;
                            const optionClass = document.getElementById("select-idClass-edit");
                            $.ajax({
                                url : 'get-class/' + idDepartment + '/',
                                method : 'get',
                                typeData : 'json',
                                success : function (data){
                                    optionClass.innerHTML = '';
                                    data.classes.forEach(function (classe) {
                                        const option = document.createElement('option');
                                        option.value = classe.idClass;
                                        option.textContent = classe.idClass;
                                        optionClass.appendChild(option);
                                    });
                                    document.querySelector("#select-idClass").setAttribute("data-value", select.idClass);
                                    console.log(select.idClass);
                                },
                                error: function(){
                                    alert('Có lỗi trong quá trình lấy dữ liệu');
                                },
                            });
                        },
                        error: function () {
                            alert("Không thể lấy thông tin sinh viên.");
                        },
                    });
                    document.querySelector("#select-idClass-department").setAttribute("data-value", select.idDepartment);  //mã ngành
                },
                error: function () {
                    alert("Không thể lấy thông tin sinh viên.");
                }
            });

            //lấy thông tin về khoa và tạo select box
            const optionFaculty = document.getElementById("select-idClass-faculty-edit");
            $.ajax({
                url: 'get-faculty/',
                method: 'get',
                dataType: 'json',
                success: function(data){
                    optionFaculty.innerHTML = '';
                    data.faculties.forEach(function(faculty) {
                        const option = document.createElement("option");
                        option.value = faculty.idFaculty;
                        option.textContent = faculty.nameFaculty;
                        optionFaculty.appendChild(option);
                    });
                },
                error: function(){
                    alert('Có lỗi trong quá trình lấy dữ liệu');
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

    //khi cả trang web được load
        document.addEventListener("DOMContentLoaded", function() {
        const rows = document.querySelectorAll(".table-body");
        rows.forEach(function(row) {
            row.addEventListener("click", function(){
                rowClick(this);
            });
        });


        //nút xác nhận xóa
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
            document.getElementById("select-idStd-edit").textContent =  document.getElementById("select-idStd").textContent;
            document.getElementById("select-phoneStd-edit").value =  document.getElementById("select-phoneStd").textContent;
            document.getElementById("select-nameStd-edit").value =  document.getElementById("select-nameStd").textContent;
            document.getElementById("select-emailStd-edit").value =  document.getElementById("select-emailStd").textContent;
            document.getElementById("select-datebirthStd-edit").value =  document.getElementById("select-datebirthStd").textContent;
            document.getElementById("select-idClass-faculty-edit").value = document.querySelector("#select-idClass-faculty").getAttribute("data-value");
            document.getElementById("select-genderStd-edit").value =  document.getElementById("select-genderStd").textContent;
            document.getElementById("select-idClass-department-edit").value = document.querySelector("#select-idClass-department").getAttribute("data-value");
            document.getElementById("select-addressStd-edit").value =  document.getElementById("select-addressStd").textContent;
            document.getElementById("select-idClass-idCourse-edit").textContent =  document.getElementById("select-idClass-idCourse").textContent;
            document.getElementById("select-idClass-edit").value =  document.querySelector("#select-idClass").getAttribute("data-value");
            document.getElementById("select-graduate-edit").value =  document.getElementById("select-graduate").textContent;
        });




        //cập nhật select deparment khi thay đổi faculty
        const onchangeFaculty = document.getElementById("select-idClass-faculty-edit");
        onchangeFaculty.addEventListener("change", function () {
        const selectFacultyValue = onchangeFaculty.value;
        const optionDepartment = document.getElementById("select-idClass-department-edit");
        $.ajax({
                url: 'get-department/'+ selectFacultyValue + '/',
                method: 'get',
                dataType: 'json',
                success: function (data) {
                    optionDepartment.innerHTML = '';
                    data.departments.forEach(function(department) {
                        const option = document.createElement("option");
                        option.value = department.idDepartment;
                        option.textContent = department.nameDepartment;
                        optionDepartment.appendChild(option);
                    });
                },
                error: function(){
                    alert('Có lỗi trong quá trình lấy dữ liệu');
                },
        });
        });


        // cập nhật select class khi thay đổi department

        const onchangeDepartment = document.getElementById("select-idClass-department-edit");
        onchangeDepartment.addEventListener("change", function () {
            const optionClass = document.getElementById("select-idClass-edit");
            const selectDepartmentValue = onchangeDepartment.value;
            $.ajax({
                url : 'get-class/' + selectDepartmentValue + '/',
                method : 'get',
                typeData : 'json',
                success : function (data){
                    optionClass.innerHTML = '';
                    data.classes.forEach(function (classe) {
                        const option = document.createElement('option');
                        option.value = classe.idClass;
                        option.textContent = classe.idClass;
                        optionClass.appendChild(option);
                    });
                },
                error: function(){
                    alert('Có lỗi trong quá trình lấy dữ liệu');
                },
            });     
        });
        
    });


