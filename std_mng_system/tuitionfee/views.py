from django.shortcuts import render
from login_std.models import profile_std
from django.contrib.auth.decorators import login_required
from django.db import models
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from course.models import *
# Create your views here.



@receiver(post_save, sender = Student_ModuleClass)
@receiver(post_delete, sender = Student_ModuleClass)
def update_tuitionfee(sender,  instance, **kwargs):
    std = instance.idStd

