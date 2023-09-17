document.addEventListener("DOMContentLoaded", function(){
    const tbody = document.getElementById("tbody-tuitionfee");
    get_tuitionfee()
    .then(function (data) {
        console.log(data);
        data.semester_tuitionfees.forEach(function(semester_tuitionfee) {
            fill_data_to_table(tbody, semester_tuitionfee);
        });      
    });

        
});



//lay du lieu ve hoc phi
function get_tuitionfee() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: 'get_tuitionfee/',
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                resolve(data);
            },
            error: function (){
                alert("Có lỗi trong quá trình xử lý");
            }
        }); 
    });
}


//dien du lieu vao bang
function fill_data_to_table(tbody, data) {
    const semester = data.semester;
    const moduleclasses = data.moduleclasses;
    const tuitionfee = data.tuitionfee;
    console.log(data.tuitionfee);

    const row_title = document.createElement("tr");
    const td_colspan = document.createElement("td");
    td_colspan.colSpan = 8;
    td_colspan.textContent = semester;
    row_title.appendChild(td_colspan);
    row_title.classList.add("name-semester-row", "not-data");
    tbody.appendChild(row_title);
    moduleclasses.forEach(function (moduleclass) {
        const row = document.createElement("tr");

        const cell1 = document.createElement("td");
        row.appendChild(cell1);
    
        const cell2 = document.createElement("td");
        cell2.textContent = moduleclass.idModule;
        row.appendChild(cell2);
    
        const cell3 = document.createElement("td");
        cell3.textContent = moduleclass.nameModule;
        row.appendChild(cell3);
    
        const cell4 = document.createElement("td");
        cell4.textContent = moduleclass.idClass;
        row.appendChild(cell4);
    
        const cell5 = document.createElement("td");
        cell5.textContent = moduleclass.credit;
        row.appendChild(cell5)
    
        const cell6 = document.createElement("td");
        cell6.textContent = moduleclass.credit * 325000;
        row.appendChild(cell6); 

        const cell7 = document.createElement("td");
        cell7.textContent = "";
        row.appendChild(cell7);

        const cell8 = document.createElement("td");
        cell8.textContent = "";
        row.appendChild(cell8);

        tbody.appendChild(row);
    });
    const row = document.createElement("tr");

    const cell1 = document.createElement("td");
    row.appendChild(cell1);

    const cell2 = document.createElement("td");
    cell2.textContent = "";
    row.appendChild(cell2);

    const cell3 = document.createElement("td");
    cell3.textContent = "";
    row.appendChild(cell3);

    const cell4 = document.createElement("td");
    cell4.textContent = "";
    row.appendChild(cell4);

    const cell5 = document.createElement("td");
    cell5.textContent = tuitionfee.totalcredit;
    row.appendChild(cell5)

    const cell6 = document.createElement("td");
    cell6.textContent = tuitionfee.total_tuitionfee;
    row.appendChild(cell6); 

    const cell7 = document.createElement("td");
    cell7.textContent = tuitionfee.paid_tuitionfee;
    row.appendChild(cell7);

    const cell8 = document.createElement("td");
    cell8.textContent = tuitionfee.unpaid_tuitionfee;
    row.appendChild(cell8);

    tbody.appendChild(row);
    
    auto_number(tbody);
}


//ham auto danh so thu tu
function auto_number(tbody) {
    const rows = tbody.querySelectorAll("tr");
    index = 0;
    rows.forEach(function (row) {
      if (!row.classList.contains("not-data")) {
        const numberCell = row.querySelector("td:first-child");
        numberCell.textContent = index + 1;
        index += 1;
      };
    });
  }