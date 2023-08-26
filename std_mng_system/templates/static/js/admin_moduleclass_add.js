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



    //thêm các học phần vào danh sách mở lớp
    //xử lý bất đồng bộ

const addBtn = document.getElementById("button-add");
addBtn.addEventListener("click", async function() {
    document.getElementById("popup").style.display = "none";
    const checkboxes = document.querySelectorAll("#tbody-module input[type='checkbox']:checked");
    const choosen_module = document.getElementById("choosen-module");
    choosen_module.innerHTML = "";
    var index = 0;

    for (const checkbox of checkboxes) {
        const row = checkbox.closest("tr");
        const idModule = row.getAttribute("idModule-value");

        try {
            const response = await fetch('get-module-byidModule/' + idModule + '/');
            if (response.ok) {
                const data = await response.json();
                index = index + 1;
                add_row_choosen_module(data, index);
            } else {
                throw new Error('Không có phản hồi từ sever');
            }
        } catch (error) {
            alert('Lỗi xử lý dữ liệu');
        }
    }

    //nut cap nhat lich hoc
    const btnSchedules = document.querySelectorAll(".btn-schedule");
    btnSchedules.forEach(function (btnSchedule) {
        btnSchedule.addEventListener("click", function(){
            document.getElementById("popup-schedule").style.display = "block";
            document.getElementById("tbody-schedule").innerHTML = "";
            });
        });   
    });   
  

    //nut them hang cho lich hoc
    const btnAddRowSchedule = document.getElementById("btn-addrowschedule");
    btnAddRowSchedule.addEventListener("click",function(){
        add_rows_schedule();
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
function add_row_choosen_module(module, index) {
    const choosen_module = document.getElementById("choosen-module");
    const newRow = document.createElement("tr");
    newRow.classList.add("result-row");

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
    const cell5_input = document.createElement("input");
    cell5_input.classList.add("max_slot");
    cell5_input.type = "number";
    cell5.appendChild(cell5_input);
    newRow.appendChild(cell5);

    const cell6 = document.createElement("td");
    const btnschedule = document.createElement("button");
    btnschedule.textContent= "Cập nhật";
    btnschedule.classList.add("btn-schedule");
    cell6.appendChild(btnschedule);
    newRow.appendChild(cell6);

    choosen_module.appendChild(newRow);
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