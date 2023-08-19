from django.db import models

# bảng danh sách các khoa
class Faculty(models.Model):
    idFaculty = models.CharField(max_length=10, verbose_name= "Mã khoa", primary_key= True)
    nameFaculty = models.CharField(max_length=50, verbose_name= "Tên khoa")

    def __str__(self):
        return self.nameFaculty
    
    class Meta:
        verbose_name = "Khoa"
        verbose_name_plural = "Khoa"



#bảng danh sách các ngành trong một khoa
class Department(models.Model):
    faculty = models.ForeignKey(Faculty, on_delete= models.CASCADE, verbose_name= "Tên Khoa" )
    idDepartment = models.CharField(max_length=10, verbose_name= "Mã ngành", primary_key= True )
    nameDepartment = models.CharField(max_length=50, verbose_name= "Tên Ngành")

    def __str__(self):
        return self.nameDepartment
    
    class Meta:
        verbose_name = "Ngành đào tạo"
        verbose_name_plural = "Ngành đào tạo"



# bảng danh sách lớp thuộc khoa
class FacultyClasses(models.Model):
    idClass = models.CharField(max_length = 10, verbose_name= "Mã lớp", primary_key= True)
    faculty = models.ForeignKey(Faculty, on_delete= models.CASCADE, verbose_name= "Tên Khoa" )
    department = models.ForeignKey(Department, on_delete= models.CASCADE, verbose_name= "Tên Ngành")
    idCourse = models.CharField(max_length=15, verbose_name= "Khoá")

    def __str__(self):
        return self.idClass

    class Meta:
        verbose_name = "Lớp"
        verbose_name_plural = "Lớp"