from django.db import models
from course.models import *


#bảng thời khóa biểu
class SessionSchedule(models.Model):
    day_choices = [
        ('T2','T2'),
        ('T3','T3'),
        ('T4','T4'),
        ('T5','T5'),
        ('T6','T6'),
        ('T7','T7'),
        ('CN','CN'),
    ]

    period_choices = [
        ('1','1'), ('2','2'), ('3','3'), ('4','4'), ('5','5'), ('6','6'), ('7','7'), ('8','8'), ('9','9'), ('10','10'), ('11','11'), ('12','12'), ('13','13'), ('14','14'), ('15','15')
    ]
    idCourseClass = models.ForeignKey(courseClass, related_name= 'schedule_course', on_delete= models.CASCADE, verbose_name= 'Mã lớp môn học')
    day_of_week = models.CharField(max_length= 2, choices= day_choices, verbose_name= 'Thứ')
    start_period = models.CharField(max_length= 2 , choices= period_choices, verbose_name= 'Tiết bắt đầu')
    num_period = models.IntegerField(default= 3, verbose_name= 'Số tiết')
    idRoom = models.CharField(max_length= 10, verbose_name= 'Phòng học')
    exam_check = models.BooleanField(default= False, verbose_name= 'Lịch thi?')

    class Meta:
        verbose_name = 'Lịch học'
        verbose_name_plural = 'Lịch học'




