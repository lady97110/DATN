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
                    document.querySelector("#select-password-edit").value = select.password;
                    document.querySelector("#select-phoneStd").textContent = select.phoneStd;
                    document.querySelector("#select-nameStd").textContent = select.nameStd;
                    document.querySelector("#select-emailStd").textContent = select.emailStd;
                    document.querySelector("#select-datebirthStd").textContent = select.datebirthStd;
                    document.querySelector("#select-idClass-faculty").textContent = select.faculty;
                    document.querySelector("#select-idClass-faculty").setAttribute("data-value", select.idFaculty);  //mã khoa
                    document.querySelector("#select-genderStd").textContent = select.genderStd;
                    document.querySelector("#select-addressStd").textContent = select.addressStd;
                    document.querySelector("#select-identityStd").textContent = select.identityStd;
                    document.querySelector("#select-ethnicityStd").textContent = select.ethnicityStd;
                    document.querySelector("#select-idClass-department").textContent = select.department;
                    document.querySelector("#select-idClass-idCourse").setAttribute("data-value", select.idCourse);  //Mã khóa
                    document.querySelector("#select-idClass-idCourse").textContent = select.nameCourse;
                    document.querySelector("#select-idClass").textContent = select.idClass;
                    var graduate = document.querySelector("#select-graduate");

                    
                    if (select.graduate) {
                        graduate.textContent = "Chưa tốt nghiệp";
                        document.querySelector("#select-graduate").setAttribute("data-value", "True");
                    } else {
                        graduate.textContent = "Đã tốt nghiệp";
                        document.querySelector("#select-graduate").setAttribute("data-value", "False");
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
                                url : 'get-class/' + idDepartment + '/' ,
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

        //nut tim kiem
        const resultstable = document.getElementById("results-table");
        const vluecount = document.getElementById("avc");
        if (vluecount != null){
            resultstable.style.display = "flex";
        }
        else{
            resultstable.style.display = "none";
        };
        


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
        const titlecard = document.getElementById("title-card");
        const hidden_idStd = document.getElementById("value-idStd");
        const text_Std = document.getElementById("select-idStd-edit");
        const graduate = document.getElementById("gradutelb");
        addprofileBtn.addEventListener("click", function() {
            clearFormInputs();
            graduate.style.display = "none";
            hidden_idStd.style.display = "";
            refreshBtn.style.display="";
            text_Std.style.display="none";
            profiledetail.style.display = "none";
            titlecard.textContent = "Thêm mới hồ sơ";
            profileedit.style.display = "flex";
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
                    document.getElementById("select-idClass-faculty-edit").value = "abc";
                },
                error: function(){
                    alert('Có lỗi trong quá trình lấy dữ liệu');
                }
            });
        });

        // Nút sửa hồ sơ
        const editprofileBtn = document.getElementById("editprofile");
        editprofileBtn.addEventListener("click", function() {
            hidden_idStd.style.display = "none";
            graduate.style.display = "";
            titlecard.textContent = "Chỉnh sửa hồ sơ";
            text_Std.style.display="";
            refreshBtn.style.display="none";
            profileedit.style.display = "flex";
            profiledetail.style.display = "none";
            document.getElementById("select-idStd-edit").textContent =  document.getElementById("select-idStd").textContent;
            document.getElementById("value-idStd").value =  document.getElementById("select-idStd").textContent;
            document.getElementById("select-phoneStd-edit").value =  document.getElementById("select-phoneStd").textContent;
            document.getElementById("select-nameStd-edit").value =  document.getElementById("select-nameStd").textContent;
            document.getElementById("select-emailStd-edit").value =  document.getElementById("select-emailStd").textContent;
            document.getElementById("select-datebirthStd-edit").value =  document.getElementById("select-datebirthStd").textContent;
            document.getElementById("select-idClass-faculty-edit").value = document.querySelector("#select-idClass-faculty").getAttribute("data-value");
            document.getElementById("select-genderStd-edit").value =  document.getElementById("select-genderStd").textContent;
            document.getElementById("select-identityStd-edit").value =  document.getElementById("select-identityStd").textContent;
            document.getElementById("select-ethnicityStd-edit").value =  document.getElementById("select-ethnicityStd").textContent;
            document.getElementById("select-idClass-department-edit").value = document.querySelector("#select-idClass-department").getAttribute("data-value");
            document.getElementById("select-addressStd-edit").value =  document.getElementById("select-addressStd").textContent;
            document.getElementById("select-idClass-idCourse-edit").value =  document.getElementById("select-idClass-idCourse").getAttribute("data-value");
            document.getElementById("select-idClass-edit").value =  document.querySelector("#select-idClass").getAttribute("data-value");
            document.getElementById("select-graduate-edit").value =  document.querySelector("#select-graduate").getAttribute("data-value");
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



        //hàm cập nhật class
        function updateselectClass() {
            const optionClass = document.getElementById("select-idClass-edit");
            const selectidCourseValue = document.getElementById("select-idClass-idCourse-edit").value;
            const selectDepartmentValue = onchangeDepartment.value;
            $.ajax({
                url : 'get-class-add-course/' + selectDepartmentValue + '/' + selectidCourseValue + '/',
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
            });     
        }

        // cập nhật select class khi thay đổi department

        const onchangeDepartment = document.getElementById("select-idClass-department-edit");
        onchangeDepartment.addEventListener("change", updateselectClass);

        //cập nhật select khi thay đổi khóa

        const onchangeidCourse = document.getElementById("select-idClass-idCourse-edit");
        onchangeidCourse.addEventListener("change", updateselectClass);



        


      

        
        //danh sách khóa và select box lần đầu

        const optionidCourse = document.getElementById("select-idClass-idCourse-edit");
        $.ajax({
            url: 'get-idCourse',
            method: 'get',
            typeData: 'json',
            success : function (data) {
                    optionidCourse.innerHTML = "";
                    data.idCourses.forEach(function (idCourse) {
                       const option = document.createElement("option");
                       option.value = idCourse.idCourse;
                       option.textContent = idCourse.nameCourse;
                       optionidCourse.appendChild(option); 
                    });
                },
            error: function(){
                    alert('Có lỗi trong quá trình lấy dữ liệu');
            },
        });
        
        //hàm làm mới
        function clearFormInputs() {
            const inputs = document.querySelectorAll(".edit-profile input");
            inputs.forEach(function(input) {
                input.value = "";
            });
            
            const selects = document.querySelectorAll(".edit-profile select");
            selects.forEach(function(select){
                select.value = "0";
            });
        }

        const refreshBtn = document.getElementById("button-refresh");
        refreshBtn.addEventListener("click", function() {
            clearFormInputs();
        });




        // Nút  lưu
        const saveBtn = document.getElementById("saveprofile");
        saveBtn.addEventListener("click", function(event) {
            const csrfToken = getCSRFToken();
            var profile_data = {
                idStd : $("#value-idStd").val(),
                password : $("#select-password-edit").val(),
                phoneStd : $("#select-phoneStd-edit").val(),
                nameStd : $("#select-nameStd-edit").val(),
                emailStd : $("#select-emailStd-edit").val(),
                datebirthStd : $("#select-datebirthStd-edit").val(),
                genderStd : $("#select-genderStd-edit").val(),
                addressStd : $("#select-addressStd-edit").val(),
                idClass : $("#select-idClass-edit").val(),
                identityStd : $("#select-identityStd-edit").val(),
                ethnicityStd : $("#select-ethnicityStd-edit").val(),
                graduate : $("#select-graduate-edit").val(),
            };

            var requiredFields = document.querySelectorAll(".not-empty");
            var passed = true;
            requiredFields.forEach(function(field){
                if (field.value.trim() === ""){
                    passed = false;
                    return;
                };
            });

            if (passed){
            $.ajax({
                url: 'update-or-create-profile/',
                method: 'post',
                data: profile_data,
                dataType: 'json',
                headers: {
                    'X-CSRFToken': csrfToken
                },
                success: function(data) {
                    if (data.success === '1') {
                        alert('Cập nhật hồ sơ thành công');
                    }
                    else if (data.success === '2') {
                        alert('Tạo hồ sơ thành công');
                    }
                    else {
                        alert('Đã có hồ sơ được tạo với MSSV này');
                    }
                },
                error: function() {
                    alert('Có lỗi, vui lòng kiểm tra lại !');
                },
            });
        }
        else {
            alert("Hãy nhập đủ các trường bắt buộc !")
        };
        });
});


