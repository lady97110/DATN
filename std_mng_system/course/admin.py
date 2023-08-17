from django.contrib import admin
from .models import *
from schedule.models import *

#đăng ký bảng học kỳ vào trang quản trị viên
class SemesterAdmin(admin.ModelAdmin):
    list_display = ('idSemester', 'nameSemester','startdateSem','enddateSem')
    
admin.site.register(Semester, SemesterAdmin)



#đăng ký bảng môn học sinh viên vào trang quản trị
class std_subAdmin(admin.ModelAdmin):
    list_display = ('id', 'idSub_display', 'idStd_display', 'idClass', 'progress_grade', 'final_grade', 'overall_grade', 'overall_grade_4', 'overall_grade_text', 'stt_pass')
    search_fields = ('id','idSub','idStd', 'idClass', 'progress_grade', 'final_grade', 'overall_grade', 'overall_grade_4', 'overall_grade_text','stt_pass')
  

    def idSub_display(self, obj):
        return obj.idSub.idSub
    idSub_display.short_description = 'Mã học phần'

    def idStd_display(self, obj):
        return obj.idStd.idStd
    idStd_display.short_description = 'MSSV'

    
admin.site.register(std_sub, std_subAdmin)



#đăng ký bảng lớp môn học vào trang quản trị
class SessionScheduleInline(admin.TabularInline):
    model = SessionSchedule
    extra = 1

class courseClassAdmin(admin.ModelAdmin):
    list_display = ('idSub_display','nameSub_display','creditsnum_display','idClass')
    search_fields = ('idSub','idClass',)
    autocomplete_fields = ('idSub', )
    inlines = [SessionScheduleInline]

    def idSub_display(self, obj):
        return obj.idSub.idSub
    idSub_display.short_description = 'Mã học phần'

    def nameSub_display(self, obj):
        return obj.idSub.nameSub
    nameSub_display.short_description = 'Tên học phần'

    def creditsnum_display(self, obj):
        return obj.idSub.creditsnum
    creditsnum_display.short_description = 'Số tín chỉ'

admin.site.register(courseClass, courseClassAdmin)



#đăng ký bảng danh sách môn học vào trang quản trị
class subjectAdmin(admin.ModelAdmin):
    list_display = ('idSub','nameSub','creditsnum')
    search_fields = ('idSub','nameSub','creditsnum')

admin.site.register(subject, subjectAdmin)
