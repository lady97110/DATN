# Generated by Django 4.2.4 on 2023-08-29 07:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('course', '0004_rename_student_module_student_moduleclass'),
    ]

    operations = [
        migrations.AlterField(
            model_name='moduleclass',
            name='module',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ModuleClass_module', to='course.module', verbose_name='Tên học phần'),
        ),
    ]
