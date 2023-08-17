from django.db import models
from login_std.models import profile_std

#bang hoc ky
class Semester(models.Model):
    idSemester = models.CharField(max_length= 10, verbose_name= 'Mã học kỳ', primary_key= True)
    nameSemester = models.CharField(max_length= 30, verbose_name= 'Học kỳ')
    startdateSem = models.DateField(verbose_name= 'Ngày bắt đầu', blank= True, null= True)
    enddateSem = models.DateField(verbose_name= 'Ngày kết thúc', blank= True, null= True)
    
    def __str__(self):
        return f"{self.idSemester} - {self.nameSemester}"

    class Meta:
        verbose_name = 'Học kỳ'
        verbose_name_plural = 'Học kỳ'


#bang mon hoc
class subject(models.Model):
    idSub = models.CharField(max_length=10, verbose_name='Mã học phần', primary_key= True)
    nameSub = models.CharField(max_length=70, verbose_name='Tên học phần')
    creditsnum = models.IntegerField(default=0, verbose_name='Số tín chỉ')

    def __str__(self):
        return f"{self.idSub} - {self.nameSub}"
    
    class Meta:
        verbose_name = 'Học phần'
        verbose_name_plural = 'Danh sách học phần'


#bang lop mon hoc

class courseClass(models.Model):
    id = models.BigAutoField(primary_key=True)
    idClass = models.CharField(max_length= 10, verbose_name= 'Mã lớp')
    idSub = models.ForeignKey(subject, on_delete = models.CASCADE, verbose_name= 'Mã học phần')
    startdateCourse = models.DateField(verbose_name= 'Ngày bắt đầu', null= True, blank= True)
    enddateCourse = models.DateField(verbose_name= 'Ngày kết thúc', null= True, blank= True)
    idSemester = models.ForeignKey(Semester, on_delete= models.CASCADE, verbose_name= 'Học kỳ')
    idCourse = models.CharField(max_length= 3, verbose_name= 'Khóa', blank=True, null=True)

    def __str__(self):
        return f'{self.idClass} - {self.idSub.nameSub}'
    
    class Meta:
        verbose_name = 'Lớp'
        verbose_name_plural = 'Lớp học phần'




#bang luu mon hoc da dang ky cho sinh vien
class std_sub(models.Model):
    id = models.BigAutoField(primary_key=True)
    idSub = models.ForeignKey(subject, on_delete= models.CASCADE, verbose_name='Mã học phần')
    idStd = models.ForeignKey(profile_std, on_delete= models.CASCADE, verbose_name='MSSV')
    idClass = models.CharField(max_length=10, verbose_name='Mã lớp')
    progress_grade = models.FloatField(verbose_name='Điểm quá trình', default=0)
    final_grade = models.FloatField(verbose_name='Điểm kết thúc', default=0)
    overall_grade = models.FloatField(verbose_name='Điểm tổng kết', default=0)
    overall_grade_4 = models.FloatField(verbose_name='Hệ số 4', default=0)
    overall_grade_text = models.CharField(max_length=2, verbose_name='Điểm chữ', blank=True)
    stt_pass = models.BooleanField(default=False, choices=[(True, 'Đạt'), (False, 'Chưa đạt')], verbose_name='Đạt')

    def __str__(self):
        return self.idSub.idSub


    def save(self, *args, **kwargs):
       
        self.overall_grade = round(self.progress_grade*0.3 + self.final_grade*0.7,2)
        
        if self.overall_grade >= 8.5:
            self.overall_grade_4 = 4.0
            self.overall_grade_text = 'A'
            self.stt_pass = True
        elif self.overall_grade >= 8.0:
            self.overall_grade_4 = 3.5
            self.overall_grade_text = 'B+'
            self.stt_pass = True
        elif self.overall_grade >= 7.5:
            self.overall_grade_4 = 3.0
            self.overall_grade_text = 'B'
            self.stt_pass = True
        elif self.overall_grade >= 6.5:
            self.overall_grade_4 = 2.5
            self.overall_grade_text = 'C+'
            self.stt_pass = True
        elif self.overall_grade >= 6.0:
            self.overall_grade_4 = 2.0
            self.overall_grade_text = 'C'
            self.stt_pass = True
        elif self.overall_grade >= 5.0:
            self.overall_grade_4 = 1.5
            self.overall_grade_text = 'D+'
            self.stt_pass = True
        elif self.overall_grade >= 4.0:
            self.overall_grade_4 = 1
            self.overall_grade_text = 'D'
            self.stt_pass = True
        else:
            self.overall_grade_4 = 0.0
            self.overall_grade_text = 'F'
            self.stt_pass = False

        super().save(*args, **kwargs)

    class Meta:
        verbose_name = 'Điểm'
        verbose_name_plural = 'Bảng điểm'