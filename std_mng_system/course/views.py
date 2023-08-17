from django.shortcuts import render , redirect
from django.contrib.auth.decorators import login_required
from login_std.models import profile_std
from course.models import courseClass, std_sub

# Create your views here.
@login_required(login_url='login_site')
def course_regis_view(request):
    getidStd = request.user.username
    stdinfo = profile_std.objects.get(idStd=getidStd)
    
    subjects = courseClass.objects.all()

    subjected = std_sub.objects.filter(idStd=stdinfo).select_related('idSub')
    context = {'stdinfo':stdinfo, 'subjects':subjects, 'subjected':subjected}
    return render(request, 'course_regis.html', context)

# lưu đăng ký môn học
@login_required(login_url='login_site')
def save_subjects(request):
    if request.method == 'POST':
        subject_ids = request.POST.getlist('selected_courses')
        getidStd = request.user.username
        idStd = profile_std.objects.get(idStd=getidStd)
        for subject_id in subject_ids:
            sub_selected = courseClass.objects.get(idSub=subject_id)
            idSub = sub_selected.idSub
            idClass = sub_selected.idClass
            std_sub_ = std_sub(idStd = idStd, idSub = idSub, idClass = idClass)
            std_sub_.save()
    return redirect('coursereg_success')

# thông báo đã đăng ký thành công môn học
@login_required(login_url='login_site')
def coursereg_success_view(request):   
    getidStd = request.user.username
    stdinfo = profile_std.objects.get(idStd=getidStd)
    context = {'stdinfo': stdinfo}
    return render(request, 'coursereg_success.html', context)           

# xóa môn học đã đăng ký
@login_required(login_url='login_site')
def delete_subjects(request):
    if request.method == 'POST':
        delete_ids = request.POST.getlist('delete_id')
        # delete_ids = list(map(int, delete_ids))
        std_sub.objects.filter(id__in=delete_ids).delete()
    return redirect('coursereg')

# xem danh sách môn học đã đăng ký và bảng điểm
@login_required(login_url='login_site')
def transcript_view(request):
    getidStd = request.user.username
    stdinfo = profile_std.objects.get(idStd=getidStd)

    transcripts = std_sub.objects.filter(idStd=getidStd)

    context = {'stdinfo':stdinfo, 'transcripts':transcripts}    
    return render(request, 'transcript.html', context)
    