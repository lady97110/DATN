from django.shortcuts import render
from login_std.models import profile_std
from course.models import std_sub
from django.contrib.auth.decorators import login_required
# Create your views here.



@login_required(login_url='login')
def tuitionfee_view(request):
    getidStd = request.user.username
    stdinfo = profile_std.objects.get(idStd = getidStd)

    subjected = std_sub.objects.filter(idStd=stdinfo).select_related('idSub')

    context = {
        'stdinfo': stdinfo,
        'subjected':subjected
    }

    return render(request, 'tuitionfee.html', context)


