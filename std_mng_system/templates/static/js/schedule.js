document.addEventListener("DOMContentLoaded", function () {
    const current_date = new Date();
    const idStd = document.getElementById("idStd").getAttribute("idStd");

    const tbody = document.getElementById("tbody-schedule");

    const tbody_exam = document.getElementById("tbody-exam-schedule");

    var year = current_date.getFullYear();
    var month = (current_date.getMonth() + 1).toString().padStart(2, '0');
    var day = current_date.getDate().toString().padStart(2, '0');


    var date_now = year + '-' + month + '-' + day;
    //tao bang cho
    create_table(tbody);

    blank_table(tbody_exam, 5, 6);


    //gan gia tri mac dinh cho lich
    const calender = document.getElementById("calender1");
    calender.value = date_now;


    //toggle swap table 
    const toggle_btn = document.getElementById("toggle-btn");
    toggle_btn.addEventListener("click", function () {
        const table_exam = document.getElementById("table-exam");
        const table_schedule = document.getElementById("table-schedule");
        const title_page = document.getElementById("title");
        if (table_exam.style.display == "block") {
            table_exam.style.display = "none";
            table_schedule.style.display = "block";
            calender.style.display = "block";
            toggle_btn.textContent = "Lịch thi";
            title_page.textContent = "Lịch học";
        } else {
            calender.style.display = "none";
            table_exam.style.display = "block";
            table_schedule.style.display = "none";
            toggle_btn.textContent = "Lịch học";
            title_page.textContent = "Lịch thi";
        };

        const date_check = new Date(calender.value);
        tbody.innerHTML = "";
        get_schedule(idStd)
            .then(function (data) {
                create_table(tbody);

                fill_schedule_to_table(tbody, data.schedules, date_check);

                fill_schedule_exam_to_table(tbody_exam, data.schedules);

            })
            .catch(function (error) {
                alert(error);
            });

});



    //lay ngay tu input
    calender.addEventListener("change", function () {
        const date_check = new Date(calender.value);
        tbody.innerHTML = "";
        get_schedule(idStd)
            .then(function (data) {
                create_table(tbody);
                fill_schedule_to_table(tbody, data.schedules, date_check);


                fill_schedule_exam_to_table(tbody_exam, data.schedules);

            })
            .catch(function (error) {
                alert(error);
            });

    });


    get_schedule(idStd)
        .then(function (data) {

            fill_schedule_to_table(tbody, data.schedules, current_date);

        })
        .catch(function (error) {
            alert(error);
        });




    
        //nut ngay hien tai
        const now_btn = document.getElementById("today-btn");
        now_btn.addEventListener("click", function(){
            location.reload();
        });


        
});






//khoi tao bang
function create_table(tbody) {
    var periods = ["1-3", "4-6", "7-9", "10-12", "13-15"];
    var days_of_week = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
    for (var i = 0; i < periods.length; i++) {
        var row = document.createElement("tr");
        var cell1 = document.createElement("td");
        cell1.classList.add("period-column");
        cell1.textContent = periods[i];
        row.appendChild(cell1);
        for (var j = 0; j < days_of_week.length; j++) {
            var cell = document.createElement("td");
            var schedule_time = days_of_week[j] + "-" + periods[i];
            cell.setAttribute("schedule", schedule_time);
            row.appendChild(cell);
        };
        tbody.appendChild(row);
    };
}




//dien lich hoc vao bang
function fill_schedule_to_table(tbody, data, date_check) {
    const boxes = tbody.querySelectorAll("td");

    data.forEach(function (schedule) {
        const moduleclass = schedule.moduleclass;
        const schedule_data = schedule.schedule;
        schedule_data.forEach(function (sche) {
            const start_date = new Date(sche.start_date);
            const end_date = new Date(sche.end_date);

            if (date_check >= start_date && date_check <= end_date) {
                const days_of_week = sche.days_of_week;
                const period_start = sche.period_start;
                var period = "";
                if (period_start == "1") {
                    period = "1-3";
                }
                else if (period_start == "4") {
                    period = "4-6";
                }
                else if (period_start == "7") {
                    period = "7-9";
                }
                else if (period_start == "10") {
                    period = "10-12";
                }
                else {
                    period = "13-15";
                };
                const box_check = days_of_week + "-" + period;
                boxes.forEach(function (box) {

                    const box_attr_check = box.getAttribute("schedule");
                    if (box_check == box_attr_check) {
                        box.innerHTML = '<div class="block-box"><div class="div-text"><span class="text1">' + moduleclass.idClass + '</span></div><div class="div-text"><span class="text1">' + moduleclass.nameModule + '</span></div><div class="div-text"><span class="text1">' + sche.classroom + '</span></div></div>'
                        box.classList.add("exist-schedule");
                    };
                });
            };
        });
    });
}




//dien du lieu vao bang lich thi
function fill_schedule_exam_to_table(tbody, data) {
    tbody.innerHTML = "";
    data.forEach(function (schedule) {
        const moduleclass = schedule.moduleclass;
        const schedule_exam = schedule.schedule_exam;
        var part = moduleclass.nameModule.split("-");
        const idModule = part[0];
        const nameModule = part[1];
        const row = document.createElement("tr");
        const cell1 = document.createElement("td");
        cell1.textContent = idModule;
        row.appendChild(cell1);

        const cell2 = document.createElement("td");
        cell2.textContent = nameModule;
        row.appendChild(cell2);

        const cell3 = document.createElement("td");
        cell3.textContent = moduleclass.idClass;
        row.appendChild(cell3);

        const cell4 = document.createElement("td");
        cell4.textContent = schedule_exam.date_exam;
        row.appendChild(cell4);

        const cell5 = document.createElement("td");
        cell5.textContent = schedule_exam.period;
        row.appendChild(cell5);

        const cell6 = document.createElement("td");
        cell6.textContent = schedule_exam.classroom;
        row.appendChild(cell6);

        tbody.appendChild(row);
    });
}

//lay du lieu lich hoc cua sinh vien theo idStd
function get_schedule(idStd) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: 'get-schedule/' + idStd + '/',
            method: 'get',
            dataType: 'json',
            success: function (data) {
                if (data.schedules) {
                    resolve(data);
                }
                else {
                    reject(data.error);
                };
            },
            error: function () {
                alert("Có lỗi trong quá trình xử lý");
            }
        });
    });
}



//tao bang trong
function blank_table(tbody, number_row, number_cell) {
    for (let i = 0; i < number_row; i++) {
        const row = document.createElement("tr");
        for (let i = 0; i < number_cell; i++) {
            const cell = document.createElement("td");
            row.appendChild(cell);
        };
        tbody.appendChild(row);
    }
}