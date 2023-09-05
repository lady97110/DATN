document.addEventListener("DOMContentLoaded",function() {

    const search_classBtn = document.getElementById("search-class-btn");
    
    search_classBtn.addEventListener("click",function(){
        const class_value = document.getElementById("search-class-input").value;
        console.log(class_value);
        get_search_class(class_value)
            .then(function (data) {
                table_class(data);
            })  
    });




});



//tim kiem lop hoc phan
function get_search_class(value) {
    return new Promise(function(resolve, reject){
        $.ajax({
            url : 'get-search-class/'+value+'/',
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


//tao bang lop hoc phan
function table_class(data) {
    const table_class = document.getElementById("tb-class");
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

    table_class.appendChild(tr);

    tr.addEventListener("click", function(){
        const idClass = tr.getAttribute("idClass");
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
    data.modules.forEach(function(module) {
        const option = document.createElement("option");
        option.value = module.idModuleClass;
        option.textContent = module.idModule+" - "+module.nameModule;
        option.classList.add("option-moduleclass");
        div_options.appendChild(option);
    });
}