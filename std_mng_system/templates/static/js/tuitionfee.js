$(document).ready(function() {
    var total = 0;
    var totalfee = 0;
    $('.credit').each(function() {
        total += parseFloat($(this).text());
    });
    totalfee = total*325000;
    $('#totalcredits').text(total);
    $('#totalfee').text(totalfee);
});