document.addEventListener("DOMContentLoaded", function () {


    const idStd = document.getElementById("idStd").getAttribute("idStd");

    //du lieu mac dinh khi mo trang
    get_moduleclass(idStd)
        .then(function (data) {
            data.moduleclasses.forEach(function (moduleclass) {
                const this_idModuleClass = moduleclass.idModuleClass;
                get_detail_schedule(this_idModuleClass)
                    .then(function (data) {
                        const schedule = data.schedule;
                        table_info_moduleclass(moduleclass, schedule);
                    })
                    .catch(function () {
                        alert("Lỗi khi lấy dữ liệu thời khóa biểu");
                    });
            });
        })
        .catch(function () {
            alert("Lỗi khi lấy dữ liệu lớp học phần");
        });


    //nut hoc phan theo tien do
    const btnProcess = document.getElementById('btn-process');
    let isButtonLocked = false;
    btnProcess.addEventListener('click', function () {
        if (!isButtonLocked) {
            isButtonLocked = true;
            document.getElementById("moduleclass").innerHTML = "";

            get_moduleclass(idStd)
                .then(function (data) {
                    data.moduleclasses.forEach(function (moduleclass) {
                        const this_idModuleClass = moduleclass.idModuleClass;
                        get_detail_schedule(this_idModuleClass)
                            .then(function (data) {
                                const schedule = data.schedule;
                                table_info_moduleclass(moduleclass, schedule);
                                setTimeout(function () {
                                    isButtonLocked = false;
                                }, 3000);
                            })
                            .catch(function () {
                                alert("Lỗi khi lấy dữ liệu thời khóa biểu");
                                isButtonLocked = false;
                            });
                    });
                })
                .catch(function () {
                    alert("Lỗi khi lấy dữ liệu lớp học phần");
                    isButtonLocked = false;
                });
        };
    });



    //nut luu hoc phan vao csdl
    const saveBtn = document.getElementById("save-btn");
    saveBtn.addEventListener("click", function () {
        const moduleclass = document.getElementById("moduleclass");
        const checkedboxs = moduleclass.querySelectorAll("input[type='checkbox']:checked");

        var listModuleClass = [];
        for (const checkedbox of checkedboxs) {
            const row = checkedbox.closest("tr");
            const idModuleClass = row.getAttribute("idModuleClass");
            listModuleClass.push(idModuleClass);
        }
        save_moduleclass(idStd, listModuleClass);
    });



    //tim kiem hoc phan
    const searchBtn = document.getElementById("search-btn");
    const searchValue = document.getElementById("search-value");
});











//lay danh sach hoc phan theo tien trinh hoc tap
function get_moduleclass(idStd) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: 'get-moduleclass/' + idStd + '/',
            method: 'get',
            dataType: 'json',
            success: function (data) {
                resolve(data);
            },
            error: function () {
                reject();
            },
        });
    });
}

// lay thong tin ve lich hoc, lich thi
function get_detail_schedule(idModuleClass) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: 'get-detail-schedule/' + idModuleClass + '/',
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                resolve(data);
            },
            error: function () {
                reject();
            }
        });
    });
}

// tao bang thong tin lop hoc phan
function table_info_moduleclass(data, schedule) {
    const tbody = document.getElementById("moduleclass");

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
    cell6.textContent = data.slot + "/" + data.max_slot;
    tr.appendChild(cell6);

    const cell7 = document.createElement("td");
    table_schedule(schedule, cell7);
    cell7.classList.add("td-schedule");
    tr.appendChild(cell7);

    tbody.appendChild(tr);
    tr.setAttribute("idModuleClass", data.idModuleClass);
}



// ham tao thoi khoa bieu trong  bang lop hoc phan
function table_schedule(datas, td_parent) {
    const table = document.createElement("table");
    table.classList.add("tb-schedule");

    datas.forEach(function (data) {
        const tr = document.createElement("tr");

        const cell1 = document.createElement("td");
        cell1.textContent = data.class_room;
        cell1.classList.add("cell1");
        tr.appendChild(cell1);


        const cell2 = document.createElement("td");
        cell2.textContent = data.days_of_week;
        cell2.classList.add("cell2");
        tr.appendChild(cell2);

        const cell3 = document.createElement("td");
        cell3.textContent = data.period_start;
        cell3.classList.add("cell3");
        tr.appendChild(cell3);

        table.appendChild(tr);
    });

    td_parent.appendChild(table);
}


//ham gui du lieu danh sach lop hoc phan
function save_moduleclass(idStd, listModuleClass) {
    const csrfToken = getCSRFToken();
    $.ajax({
        url: 'save-moduleclass/' + idStd + '/',
        method: 'POST',
        data: JSON.stringify(listModuleClass),
        contentType: 'application/json',
        dataType: 'json',
        headers: {
            'X-CSRFToken': csrfToken
        },
        success: function (data) {
            if (data.success) {
                alert("Lưu học phần vào CSDL thành công");
            }
            else {
                var message = "Không được đăng ký nhiều hơn một lớp cùng môn trong một học kỳ: \n ";
                for (var mess in data.exist) {
                    message += data.exist[mess] + "\n";
                }
                alert(message);
            }
        },
        error: function (data) {

        }
    });
}




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