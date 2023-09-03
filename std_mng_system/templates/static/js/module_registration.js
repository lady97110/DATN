document.addEventListener("DOMContentLoaded", function(){
    const idStd = document.getElementById("idStd").getAttribute("idStd");

    get_moduleclass(idStd)
        .then(function (data) {
            
        });
});

//lay danh sach hoc phan theo tien trinh hoc tap
function get_moduleclass(idStd) {   
    return new Promise(function(resolve, reject){
        $.ajax({
            url : 'get-moduleclass/' + idStd + '/',
            method: 'get',
            dataType: 'json',
            success: function(data){
                resolve(data);
            },
            error: function(){
                reject();
            },
        });
    });
}

// lay thong tin ve lich hoc, lich thi
function get_detail_schedule(idModuleClass) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url : 'get-detail-schedule/'+idModuleClass+'/',
            method : 'GET',
            dataType : 'json',
            success : function(data){
                resolve(data);
            },
            error: function(){
                reject();
            }
        });
    });
}

// tao bang thong tin lop hoc phan
function table_schedule(data, data_exam) {
    const tbody = document.getElementById("moduleclass-schedule");

    const tr = document.createElement("tr");

    const cell1 = document.createElement("td");
    cell1.innerHTML = '<input type="checkbox">';
    tr.appendChild(cell1);

    const cell2 = document.createElement("td");
    cell2.textContent = data.idModule;
    tr.appendChild(cell2);

    const cell3 = document.createElement("td");
    cell3.textContent = data.nameModule;
    tr.appendChild(cell3);

    const cell4 = document.createElement("td");
    cell4.textContent = data.credit;
    tr.appendChild(cell4);

    const cell5 = document.createElement("td");
    cell5.textContent = data.idClass;
    tr.appendChild(cell5);

    const cell6 = document.createElement("td");
    cell6.textContent = data.slot+"/"+data.max_slot;
    tr.appendChild(cell6);

    const cell7 = document.createElement("td");
    table_schedule_exam(data_exam, cell7);
    tr.appendChild(cell7);
    
    tbody.appendChild(tr);
}



// ham tao thoi khoa bieu trong  bang lop hoc phan
function table_schedule_exam(datas, td_parent) {
    const table = document.createElement("table");
    
    datas.forEach(function (data) {
        const tr = document.createElement("tr");

        const cell1 = document.createElement("td");
        cell1.textContent = data.class_room;
        tr.appendChild(cell1);

        const cell2 = document.createElement("td");
        cell2.textContent = data.days_of_week;
        tr.appendChild(cell2);

        const cell3 = document.createElement("td");
        cell3.textContent = data.period_start;
        tr.appendChild(cell3);

        table.appendChild(tr);
    });

    td_parent.appendChild(table);
}