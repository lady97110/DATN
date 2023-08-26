# Generated by Django 4.2.4 on 2023-08-26 03:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('course', '0002_remove_student_module_semester_and_more'),
        ('schedule', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='schedulemoduleclass',
            options={'verbose_name': 'Lịch học', 'verbose_name_plural': 'Lịch học'},
        ),
        migrations.RemoveField(
            model_name='schedulemoduleclass',
            name='is_final_exam',
        ),
        migrations.CreateModel(
            name='ScheduleFinalExam',
            fields=[
                ('idSFE', models.AutoField(primary_key=True, serialize=False)),
                ('days_of_week', models.CharField(choices=[('T2', 'T2'), ('T3', 'T3'), ('T4', 'T4'), ('T5', 'T5'), ('T6', 'T6'), ('T7', 'T7'), ('CN', 'CN')], max_length=2, verbose_name='Thứ')),
                ('period_start', models.CharField(choices=[('1', '1'), ('4', '4'), ('7', '7'), ('10', '10'), ('13', '13')], max_length=2, verbose_name='Tiết bắt đầu')),
                ('class_room', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='schedule.classroom', verbose_name='Phòng học')),
                ('idModuleClass', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='finalexam', to='course.moduleclass', verbose_name='Lớp học phần')),
            ],
            options={
                'verbose_name': 'Lịch thi',
                'verbose_name_plural': 'Lịch thi',
            },
        ),
    ]
