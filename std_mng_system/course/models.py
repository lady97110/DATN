from django.db import models
from login_std.models import profile_std
from faculty.models import *

#bang hoc ky
class Semester(models.Model):
    idSemester = models.CharField(max_length= 10, verbose_name= 'Mã học kỳ', primary_key= True)
    nameSemester = models.CharField(max_length= 30, verbose_name= 'Học kỳ')
    start_date = models.DateField(verbose_name= 'Ngày bắt đầu', blank= True, null= True)
    end_date = models.DateField(verbose_name= 'Ngày kết thúc', blank= True, null= True)
    
    def __str__(self):
        return f"{self.idSemester} - {self.nameSemester}"

    class Meta:
        verbose_name = 'Học kỳ'
        verbose_name_plural = 'Học kỳ'


#bang mon hoc
class Module(models.Model):
    idModule = models.CharField(max_length=10, verbose_name='Mã học phần', primary_key= True)
    nameModule = models.CharField(max_length=70, verbose_name='Tên học phần')
    credits = models.IntegerField(default=0, verbose_name='Số tín chỉ')
    department = models.ForeignKey(Department, on_delete=models.PROTECT, verbose_name= 'Chuyên ngành', related_name='Module_of_Department')
    

    def __str__(self):
        return f"{self.idModule} - {self.nameModule}"
    
    class Meta:
        verbose_name = 'Học phần'
        verbose_name_plural = 'Danh sách học phần'


#bang lop hoc phan
class ModuleClass(models.Model):
    idModuleClass = models.AutoField(primary_key=True, verbose_name="Mã lớp học phần")
    module = models.ForeignKey(Module, on_delete= models.CASCADE, verbose_name= "Tên học phần")
    idClass = models.ForeignKey(FacultyClasses, on_delete = models.CASCADE, verbose_name= 'Lớp học phần', related_name='Module_of_idClass')

    def __str__(self):
        return f'{self.idClass.idClass}_{self.module.idModule}_{self.module.nameModule}'
    
    class Meta:
        verbose_name = 'Lớp học phần'
        verbose_name_plural = 'Lớp học phần'




#bang luu mon hoc da dang ky cho sinh vien + bảng điểm
class Student_Module(models.Model):
    id = models.AutoField(primary_key=True)
    module_class = models.ForeignKey(ModuleClass, on_delete= models.CASCADE, related_name= 'module_std' ,verbose_name='Học phần')
    idStd = models.ForeignKey(profile_std, on_delete= models.CASCADE, related_name='std_module', verbose_name='MSSV')
    semester = models.ForeignKey(Semester, on_delete= models.CASCADE, verbose_name= 'Học kỳ')
    process_grade = models.FloatField(verbose_name='Điểm quá trình', default=0)
    final_grade = models.FloatField(verbose_name='Điểm kết thúc', default=0)
    overall_grade = models.FloatField(verbose_name='Điểm tổng kết', default=0)
    overall_grade_4 = models.FloatField(verbose_name='Hệ số 4', default=0)
    overall_grade_text = models.CharField(max_length=2, verbose_name='Điểm chữ', blank=True)
    is_pass = models.BooleanField(default=False, choices=[(True, 'Đạt'), (False, 'Chưa đạt')], verbose_name='Đạt')

    def __str__(self):
        return f'{self.idStd.idStd} - {self.module_class.module.nameModule}'


    def save(self, *args, **kwargs):
        if self.process_grade is not None and self.final_grade is not None:
            self.overall_grade = round(self.process_grade*0.3 + self.final_grade*0.7,2)
            
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
        verbose_name = 'Bảng điểm'
        verbose_name_plural = 'Bảng điểm'