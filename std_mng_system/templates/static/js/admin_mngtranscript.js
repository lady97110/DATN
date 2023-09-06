document.addEventListener("DOMContentLoaded",function() {

    const search_classBtn = document.getElementById("search-class-btn");
    const div_list_module = document.getElementById("list-module");
    const inputbox = document.getElementById("search-module-input");

    //nut tim lop
    search_classBtn.addEventListener("click",function(){
        const class_value = document.getElementById("search-class-input").value;
        get_search_class(class_value)
            .then(function (data) {
                table_class(data);
            })
            .catch(function (error) {
                alert(error);
            });
    });


    //tim hoc pha
    const searchbox = document.getElementById("search-module-input");
    searchbox.addEventListener("click", function (event){
        div_list_module.style.display = "block";
        if(inputbox.classList.contains("inputbox-module")){
            inputbox.classList.remove("inputbox-module");
            inputbox.classList.add("inputbox-module-clicked");
        }
    });

    
    searchbox.addEventListener("keyup", function(){
        var value = searchbox.value.toLowerCase();
        var options = div_list_module.getElementsByTagName("option");
        for (var i = 0; i < options.length; i++){
            var text_option = options[i].textContent.toLowerCase();
            if (text_option.indexOf(value) > -1){
                options[i].style.display = "";
            }
            else{
                options[i].style.display = "none";
            }
        };
    });

   
    //nut hien danh sach  sinh vien
   const btn_show_list_std = document.getElementById("btn-show-std");
   const tbody_std = document.getElementById("tbody-std");
   btn_show_list_std.addEventListener("click", function() {
    const idClass = document.getElementById("choosen-class").getAttribute("idClass");
    const idModule = document.getElementById("choosen-module").getAttribute("idModule");
    get_list_std(idClass, idModule)
        .then(function(data){
            fill_transcript_to_table(tbody_std, data);
        })
        .catch(function(error){
            alert(error);
        });
   });


    //bang danh sach lop
    const tbody_class = document.getElementById("tb-class");
   blank_table(tbody_class, 4, 4);

    //bang danh sach sinh vien
    
    blank_table(tbody_std, 20, 10);
    auto_close_tag();
});



//tim kiem lop hoc phan
function get_search_class(value) {
    return new Promise(function(resolve, reject){
        $.ajax({
            url : 'get-search-class/'+value+'/',
            method: 'GET',
            dataType: 'json',
            success: function(data){
                if(data.classes){
                resolve(data);
                }
                else{
                    reject("Không có kết quả phù hợp");
                };
            },
            error: function(){
            
            }
        });
    }); 
}


//tao bang lop hoc phan
function table_class(data) {
    const tbody_class = document.getElementById("tb-class");
    tbody_class.innerHTML = "";
    const table_class = document.getElementById("table-class");
    table_class.style.display = "block";
    data.classes.forEach(function(classe) {

    const tr = document.createElement("tr");

    const cell1 = document.createElement("td");
    cell1.textContent = classe.idClass;
    tr.appendChild(cell1);

    const cell2 = document.createElement("td");
    cell2.textContent = classe.faculty;
    tr.appendChild(cell2);

    const cell3 = document.createElement("td");
    cell3.textContent = classe.department;
    tr.appendChild(cell3);

    const cell4 = document.createElement("td");
    cell4.textContent = classe.idCourse;
    tr.appendChild(cell4);

    tr.setAttribute("idClass", classe.idClass);

    tbody_class.appendChild(tr);

    tr.addEventListener("click", function(event) {
        const idClass = tr.getAttribute("idClass");
        const show_idClass = document.getElementById("choosen-class");
        show_idClass.textContent = idClass;
        show_idClass.setAttribute("idClass",idClass);
        choosen_row(event, tbody_class);
        get_list_module(idClass)
            .then(function (data) {
                selectbox_module(data);
            });
        });
    });
}


//lay thong tin ve mon hoc thuoc lop
function get_list_module(idClass) {
    return new Promise(function(resolve,reject) {
        $.ajax({
            url: 'get-list-module/'+idClass+'/',
            method: 'GET',
            dataType: 'json',
            success: function(data){
                resolve(data);
            },
            error: function(){
                reject();
            }
        });
    });    
}


//tao list search mon hoc
function selectbox_module(data){
    const div_options = document.getElementById("list-module");
    div_options.innerHTML = "";
    data.modules.forEach(function(module) {
        const option = document.createElement("option");
        option.value = module.idModule;
        option.textContent = module.idModule+" - "+module.nameModule;
        option.classList.add("option-moduleclass");
        div_options.appendChild(option);
        
        option.addEventListener("click", function(){
            const show_module = document.getElementById("choosen-module");
            show_module.textContent = option.textContent;
            show_module.setAttribute("idModule",option.value);
            div_options.style.display = "none";
            const inputbox = document.getElementById("search-module-input");
            inputbox.value = option.textContent;
            if(inputbox.classList.contains("inputbox-module-clicked")){
                inputbox.classList.remove("inputbox-module-clicked");
                inputbox.classList.add("inputbox-module");
            }
        });
    });
}


//dong the khi khong tuong tac
function auto_close_tag() {
    const div_list_module = document.getElementById("list-module");
    const inputbox = document.getElementById("search-module-input");
    document.addEventListener('click', function(event) {
        if (!inputbox.contains(event.target) && !div_list_module.contains(event.target)) {
            div_list_module.style.display = 'none';
            if(inputbox.classList.contains("inputbox-module-clicked")){
                inputbox.classList.remove("inputbox-module-clicked");
                inputbox.classList.add("inputbox-module");
            }
        }
      });
}



//ham highlight dong trong bang
function choosen_row(event , tbody) {
    const rows = tbody.getElementsByTagName("tr");
    for(let i = 0; i < rows.length; i++){
        rows[i].classList.remove("clicked-row");
    }
    const selectRow = event.currentTarget;
    selectRow.classList.add("clicked-row");  
}

//tao bang trong
function blank_table(tbody, number_row , number_cell){
    for(let i = 0; i < number_row; i++){
        const row = document.createElement("tr");
        for (let i = 0; i < number_cell; i++) {
          const cell = document.createElement("td");
          row.appendChild(cell);  
        };
        tbody.appendChild(row);
    }
}


//lay du lieu ve danh sach sinh vien thuoc lop
function get_list_std(idClass, idModule) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: 'get-list-std/'+idClass+'/'+idModule+'/',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                resolve(data);
            },
            error: function(){
                reject("Xác định lớp học phần cần truy cập");
            }
        });
    });    
}

//ham dien thong tin sinh vien vao bang lay tu sever
function fill_transcript_to_table(tbody, data) {
    tbody.innerHTML = "";
    data.transcripts.forEach(function(transcript) {
        const row = document.createElement("tr");

        const cell1 = document.createElement("td");
        row.appendChild(cell1);

        const cell2 = document.createElement("td");
        cell2.textContent = transcript.idStd;
        row.appendChild(cell2);

        const cell3 = document.createElement("td");
        cell3.textContent = transcript.nameStd;
        row.appendChild(cell3);

        const cell4 = document.createElement("td");
        cell4.textContent = transcript.date_birth;
        row.appendChild(cell4);

        const cell5 = document.createElement("td");
        cell5.textContent = transcript.process_grade;
        row.appendChild(cell5);

        const cell6 = document.createElement("td");
        cell6.textContent = transcript.final_grade;
        row.appendChild(cell6);

        const cell7 = document.createElement("td");
        cell7.textContent = transcript.overall_grade;
        row.appendChild(cell7);

        const cell8 = document.createElement("td");
        cell8.textContent = transcript.overall_grade_4;
        row.appendChild(cell8);

        const cell9 = document.createElement("td");
        cell9.textContent = transcript.overall_grade_text;
        row.appendChild(cell9);

        const cell10 = document.createElement("td");
        cell10.textContent = transcript.is_pass;
        row.appendChild(cell10);

        tbody.appendChild(row);
    });
    auto_number(tbody);  
}


//ham auto danh so thu tu
function auto_number(tbody){
    const rows = tbody.querySelectorAll("tr");
    index = 0;
    rows.forEach(function (row) {
        const numberCell = row.querySelector("td:first-child");
        numberCell.textContent = index + 1;
        index += 1;
    });
}