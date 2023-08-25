document.addEventListener("DOMContentLoaded", function(){
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



    //thêm các học phần vào danh sách mở lớp
    const addBtn = document.getElementById("button-add");
    addBtn.addEventListener("click",function(){
        const checkboxes = document.querySelectorAll("#tbody-module input[type='checkbox']:checked");
        const choosen_module = document.getElementById("choosen-module");
        choosen_module.innerHTML = "";
        var index = 0;
        checkboxes.forEach(function(checkbox){
            const row = checkbox.closest("tr");
            const idModule = row.getAttribute("idModule-value");
            $.ajax({
                url : 'get-module-byidModule/' + idModule + '/',
                method : 'get',
                dataType : 'json',
                success : function(data){
                    index = index + 1;
                    add_row_choosen_module(data, index);
                },
                error : function(){
                    alert('Lỗi xử lý dữ liệu');
                },
            });
            
        });
        document.getElementById("popup").style.display = "none";
        
    });


    //popup add moudle class
    document.getElementById("get-list-module").addEventListener("click", function() {
        document.getElementById("popup").style.display = "block";
      });
      
      document.getElementById("closePopup").addEventListener("click", function() {
        document.getElementById("popup").style.display = "none";
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
    cell5.appendChild(cell5_input);
    newRow.appendChild(cell5);

    const cell6 = document.createElement("td");
    newRow.appendChild(cell6);

    choosen_module.appendChild(newRow);
}