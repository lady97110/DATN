from django.shortcuts import render
from login_admin.models import profile_admin

# Create your views here.
def admin_mngfaculty(request):
    getidAdmin = request.user.idAdmin
    admininfo = profile_admin.objects.get(idAdmin=getidAdmin)
    infoAdmin = {'admininfo': admininfo,}
    return render(request, 'admin_mngfaculty.html', infoAdmin)
