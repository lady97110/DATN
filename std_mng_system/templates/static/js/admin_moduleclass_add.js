document.addEventListener("DOMContentLoaded", function(){


    //lấy danh sách các môn trong cơ sở dữ liệu
    const idClass = document.getElementById("choosen-class").getAttribute("data-value");
    const get_list_modulBtn = document.getElementById("get-list-module");
    get_list_modulBtn.addEventListener("click", function(){
        const idClass = document.getElementById("choosen-class").getAttribute("data-value");
        if(idClass !== null && idClass !== ""){
            $.ajax({
                url : 'get-list-module/' + idClass +'/',
                method : 'get',
                dataType : 'json',
                success : function(data){
                    const tbody_module = document.getElementById("tbody-module");
                    document.getElementById("popup").style.display = "block";
                    tbody_module.innerHTML = "";
                    data.module_departments.forEach(function(module){
                        const newRow = document.createElement("tr");
                        newRow.classList.add("result-row");
                        newRow.setAttribute("idModule-value", module.idModule);

                        const cell1 = document.createElement("td");
                        const checkbox = document.createElement("input");
                        checkbox.type = "checkbox";
                        cell1.appendChild(checkbox);
                        newRow.appendChild(cell1);
                        
                        const cell2 = document.createElement("td");
                        cell2.textContent = module.idModule;
                        newRow.appendChild(cell2);

                        const cell3 = document.createElement("td");
                        cell3.textContent = module.nameModule;
                        newRow.appendChild(cell3);

                        const cell4 = document.createElement("td");
                        cell4.textContent = module.credits;
                        newRow.appendChild(cell4);

                        const cell5 = document.createElement("td");
                        cell5.textContent = module.department;
                        newRow.appendChild(cell5);

                        tbody_module.appendChild(newRow);
                    });
                },
            });
        }
        else{
            alert("Hãy xác định lớp cần thêm học phần");
        };
    });


    //danh sach phong
    const room_td = document.getElementById("room-exam");
    get_room(room_td);

    //danh sach kỳ
    const semesterSelect = document.getElementById("list-semester");
    get_semester(semesterSelect);
    semesterSelect.addEventListener("change",function(){
    const idClass = document.getElementById("choosen-class").getAttribute("data-value");
    const idSemester = semesterSelect.value;
    get_moduleclass(idClass, idSemester);
    });




    //thêm các học phần vào danh sách mở lớp
    //xử lý bất đồng bộ

const addBtn = document.getElementById("button-add");
addBtn.addEventListener("click", async function() {
    document.getElementById("popup").style.display = "none";
    const checkboxes = document.querySelectorAll("#tbody-module input[type='checkbox']:checked");
    const choosen_module = document.getElementById("choosen-module");
    var index = 0;

    for (const checkbox of checkboxes) {
        const row = checkbox.closest("tr");
        const idModule = row.getAttribute("idModule-value");

        try {
            const response = await fetch('get-module-byidModule/' + idModule + '/');
            if (response.ok) {
                const data = await response.json();
                var index = index + 1;
                const exist_in_db = false;
                add_row_choosen_module(data, index, exist_in_db);
            } else {
                throw new Error('Không có phản hồi từ server');
            }
        } catch (error) {
            alert('Lỗi xử lý dữ liệu');
        }
    }

    //nut cap nhat lich hoc
    const btnSchedules = document.querySelectorAll(".btn-schedule");
    btnSchedules.forEach(function (btnSchedule) {
            const row_choosen_module = btnSchedule.closest("tr");
            btnSchedule.addEventListener("click", function(){
                btnAddSchedule(row_choosen_module);
            });
        });   
    });   
  

    //nut them hang cho lich hoc
    const btnAddRowSchedule = document.getElementById("btn-addrowschedule");
    btnAddRowSchedule.addEventListener("click",function(){
        add_rows_schedule();
    });




    //nut luu thong tin lich hoc va lich thi
    //lay du lieu tu bang lich hoc de gui ve views
    
    const btnSaveSchedule = document.getElementById("button-save-schedule");
    btnSaveSchedule.addEventListener("click",function(){
        var tableSchedule = [];
        var tableScheduleExam = [];

        var rows_schedule = document.getElementById("tbody-schedule").rows;
        
        for (var i=0; i < rows_schedule.length; i++){
            var rowData = [];
            var cells = rows_schedule[i].cells;

            for (var j=0; j < cells.length; j++) {
                var inputElement = cells[j].querySelector("input");
                var selectElement = cells[j].querySelector("select");
                if (inputElement) {
                    rowData.push(inputElement.value);
                } else if (selectElement) {
                    rowData.push(selectElement.value);
                }
            };
            tableSchedule.push(rowData);
        };
        
        var rows_schedule_exam = document.getElementById("tbody-finalexam").rows;
        var date_exam = rows_schedule_exam[0].cells[0].querySelector("input").value;
        tableScheduleExam.push(date_exam);
        var start_period_exam = rows_schedule_exam[0].cells[2].querySelector("select").value;
        tableScheduleExam.push(start_period_exam);
        var room_exam = rows_schedule_exam[0].cells[3].querySelector("select").value;
        tableScheduleExam.push(room_exam);
       
        const idClass = document.getElementById("info-moduleclass").getAttribute("data-value");
        const idModule = document.getElementById("info-module").getAttribute("data-value");
        const idSemester = document.getElementById("list-semester").value;
        var max_slot = document.getElementById("max-slots").value;

        const csrfToken = getCSRFToken();
        var data_json = JSON.stringify({
            'tableSchedule' : tableSchedule,
            'tableScheduleExam' : tableScheduleExam,
            'max_slot' : max_slot
        });

        $.ajax({
            url : 'save-moduleclass/' + idClass + '/' + idModule + '/' + idSemester + '/',
            method : 'post',
            data : data_json,
            contentType : 'application/json',
            dataType : 'json',
            headers: {
                'X-CSRFToken': csrfToken
            },
            success: function(data){

            },
            error: function(){

            }
        });
    });



    //popup close button
      
      document.getElementById("closePopup").addEventListener("click", function() {
        document.getElementById("popup").style.display = "none";
      });

      document.getElementById("closePopup-schedule").addEventListener("click", function() {
        document.getElementById("popup-schedule").style.display = "none";
        document.getElementById("tbody-schedule").innerHTML = "";
      });


});


//them row cho bang hoc phan da chon
function add_row_choosen_module(module, index, exist_in_db) {
    const choosen_module = document.getElementById("choosen-module");
    const newRow = document.createElement("tr");
    newRow.classList.add("row-choosen-module");

    const cell1 = document.createElement("td");
    cell1.textContent = index;
    newRow.appendChild(cell1);

    const cell2 = document.createElement("td");
    cell2.textContent = module.idModule;
    newRow.appendChild(cell2);

    const cell3 = document.createElement("td");
    cell3.textContent = module.nameModule;
    newRow.appendChild(cell3);

    const cell4 = document.createElement("td");
    cell4.textContent = module.credits;
    newRow.appendChild(cell4);

    const cell5 = document.createElement("td");
    const btnschedule = document.createElement("button");
    btnschedule.textContent= "Cập nhật";
    btnschedule.classList.add("btn-schedule");
    cell5.appendChild(btnschedule);
    newRow.appendChild(cell5);


    const cell6 = document.createElement("td");
    if(exist_in_db){
        cell6.textContent = "đã lưu";
    }
    else{
        cell6.textContent = "chưa lưu";
    };
    newRow.appendChild(cell6);



    const cell7 = document.createElement("td");
    cell7.classList.add("action");
    const btndelete = document.createElement("button");
    btndelete.classList.add("btn-custom");
    const icontrash = document.createElement("i");
    icontrash.classList.add("fa","fa-trash", "trash-icon");
    btndelete.appendChild(icontrash);
    cell7.appendChild(btndelete);
    newRow.appendChild(cell7);

    choosen_module.appendChild(newRow);

    newRow.setAttribute("idModule", module.idModule);
    newRow.setAttribute("nameModule", module.nameModule);


    const idClass = document.getElementById("choosen-class").getAttribute("data-value");
    const idModule = module.idModule;
    btndelete.addEventListener("click", function () {
    delete_moduleclass(idClass, idModule, newRow);
    });
        
}


//lay danh sach ky tu database
function get_semester(semesterSelect) {
    $.ajax({
        url : 'get-semester/',
        method : 'get',
        dataType : 'json',
        success : function(data){
            data.semesters.forEach(function (semester) {
                const option = document.createElement("option");
                option.value = semester.idSemester;
                option.textContent = semester.nameSemester;
                semesterSelect.appendChild(option);
            });
        },
        error: function(){
            alert("Lỗi khi lấy danh sách kỳ học");
        },
    });
}


//lay danh sách phong tu database
function get_room(td_room) {
    $.ajax({
        url: 'get-room/',
        method: 'get',
        dataType: 'json',
        success: function(data){
            const roomSelect = document.createElement("select");

            data.rooms.forEach(function (room) {
                const option = document.createElement("option");
                option.value = room.idRoom;
                option.textContent = room.nameRoom;
                roomSelect.appendChild(option);
            });
            td_room.appendChild(roomSelect);
        },
        error : function(){

        },
    });
}


//ham tao them row cho lich hoc chi tiet
function add_rows_schedule() {
    const period_start = document.getElementById("period-start").querySelector("select");
    const dayofweek = document.getElementById("dayofweek").querySelector("select");
    const tbody_schedule = document.getElementById("tbody-schedule");
    
    const tr_schedule = document.createElement("tr");

    const cell1 = document.createElement("td");
    const dayofweekclone = dayofweek.cloneNode(true);
    cell1.appendChild(dayofweekclone);
    tr_schedule.appendChild(cell1);

    
    const cell2 = document.createElement("td");
    const period_startclone = period_start.cloneNode(true);
    cell2.appendChild(period_startclone);
    tr_schedule.appendChild(cell2);

    const cell3 = document.createElement("td");
    const input_period = document.createElement("input");
    input_period.type = "number";
    input_period.value = "3";
    cell3.appendChild(input_period);
    tr_schedule.appendChild(cell3);

    const cell4 = document.createElement("td");
    const input_startdate = document.createElement("input");
    input_startdate.type = "date";
    cell4.appendChild(input_startdate);
    tr_schedule.appendChild(cell4);

    const cell5 = document.createElement("td");
    const input_enddate = document.createElement("input");
    input_enddate.type = "date";
    cell5.appendChild(input_enddate);
    tr_schedule.appendChild(cell5);

    const cell6 = document.createElement("td");
    tr_schedule.appendChild(cell6);
    get_room(cell6);

    tbody_schedule.appendChild(tr_schedule);

}



//nut cap nhat  lịch học
function btnAddSchedule(row){
    document.getElementById("popup-schedule").style.display = "block";
    document.getElementById("tbody-schedule").innerHTML = "";

    const choosen_class_value = document.getElementById("choosen-class").getAttribute("data-value");
    const idModuleClass = document.getElementById("info-moduleclass");
    idModuleClass.textContent = "Lớp " + choosen_class_value;
    idModuleClass.setAttribute("data-value",choosen_class_value);

    const choosen_module_value = document.getElementById("info-module");
    choosen_module_value.setAttribute("data-value", row.getAttribute("idModule"));
    choosen_module_value.textContent = row.getAttribute("idModule") + " - " + row.getAttribute("nameModule");

};


//tao xac nhan csrftoken
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


//lay danh sach mon hoc theo lop + hoc ky

function get_moduleclass(idClass, idSemester) {
    $.ajax({
    url : 'get-moduleclass/' + idClass + '/' + idSemester + '/',
    method : 'GET',
    dataType : 'json',
    success : function(data){
        const module = document.getElementById("choosen-module");
        module.innerHTML = "";
        var index = 0;
        data.modules.forEach(function (module) {
            var index = index + 1;
            const exist_in_db = true;
            add_row_choosen_module(module, index, exist_in_db);
        });
    },
    error : function(){
    }
    });
}


//xoa mon hoc tu danh sach mon hoc thuoc lop
function delete_moduleclass(idClass, idModule, row) {
    console.log(idClass);
    $.ajax({
        url : 'delete-moduleclass/'+idClass+'/'+idModule+'/',
        method : 'get',
        dataType : 'json',
        success: function(data){
            if (data.result == "deleted"){
                alert("Xóa thành công");
                row.remove();
            }
            else {
                row.remove();
            };
        },
        error: function () {
            alert("có lỗi trong quá trình xử lý");
        }
    });
}


function check_moduleclass_exist(idClass, idMoudle) {
    $.ajax({
        url: 'check-moduleclass-exist/' + idClass + '/' + idMoudle + '/',
        method: 'get',
        dataType: 'json',
        success: function(data){

        },
        error: function(){

        }
    });
}