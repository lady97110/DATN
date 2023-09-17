document.addEventListener("DOMContentLoaded", function(){
    get_tuitionfee()
    .then(function (data) {
        console.log(data);      
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
function fill_data_to_table(all_data) {
    const tbody = document.getElementById("tbody-tuitionfee");
    all_data.semester_tuitionfees.forEach(function(data) {
        const semester = data.semester;
        const moduleclasses = data.moduleclasses;
        const tuitionfee = data.tuitionfee;
        

    });
}

//tao bang trong 