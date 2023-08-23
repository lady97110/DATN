# Generated by Django 4.2.4 on 2023-08-23 08:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('course', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ClassRoom',
            fields=[
                ('idClassRoom', models.CharField(max_length=10, primary_key=True, serialize=False, verbose_name='Mã phòng học')),
                ('nameClassRoom', models.CharField(max_length=20, verbose_name='Tên phòng học')),
            ],
            options={
                'verbose_name': 'Phòng học',
                'verbose_name_plural': 'Danh sách phòng học',
            },
        ),
        migrations.CreateModel(
            name='ScheduleModuleClass',
            fields=[
                ('idSMC', models.AutoField(primary_key=True, serialize=False)),
                ('days_of_week', models.CharField(choices=[('T2', 'T2'), ('T3', 'T3'), ('T4', 'T4'), ('T5', 'T5'), ('T6', 'T6'), ('T7', 'T7'), ('CN', 'CN')], max_length=2, verbose_name='Thứ')),
                ('period_start', models.CharField(choices=[('1', '1'), ('4', '4'), ('7', '7'), ('10', '10'), ('13', '13')], max_length=2, verbose_name='Tiết bắt đầu')),
                ('periods_count', models.IntegerField(default=3, verbose_name='Số tiết')),
                ('start_date', models.DateField(blank=True, null=True, verbose_name='Ngày bắt đầu')),
                ('end_date', models.DateField(blank=True, null=True, verbose_name='Ngày kết thúc')),
                ('is_final_exam', models.BooleanField(default=False, verbose_name='Lịch thi ?')),
                ('class_room', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='schedule.classroom', verbose_name='Phòng học')),
                ('idModuleClass', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='schedules', to='course.moduleclass', verbose_name='Lớp học phần')),
            ],
            options={
                'verbose_name': 'Lịch học, lịch thi',
                'verbose_name_plural': 'Lịch học, lịch thi',
            },
        ),
    ]
