$(document).ready(function() {
    var passedCourses = $('td.pass:contains("Đạt")').parent();
  
    var totalCredits = 0;
    var totalGrade = 0;
    var totalGrade4 = 0;
    var numCourses = passedCourses.length;
  
    passedCourses.each(function() {
      var creditNum = parseFloat($(this).find('.creditnum').text());
      var overallGrade = parseFloat($(this).find('.over_grade').text());
      var overallGrade4 = parseFloat($(this).find('.over_grade_4').text());
  
      totalCredits += creditNum;
      totalGrade += overallGrade;
      totalGrade4 += overallGrade4;
    });
  
    var average = totalGrade / numCourses;
    var average4 = totalGrade4 / numCourses;
  
    
    $('#average').text(average.toFixed(2));
    $('#average_4').text(average4.toFixed(2));
    $('#totalcredited').text(totalCredits.toFixed(2));
  });