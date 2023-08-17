# Generated by Django 4.2.1 on 2023-08-12 05:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('course', '0001_initial'),
        ('login_std', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='tuitionfee',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('totalcredit', models.IntegerField(verbose_name='Tín chỉ đăng ký')),
                ('total_tuitionfee', models.CharField(max_length=20, verbose_name='Học phí')),
                ('paid_tuitionfee', models.CharField(max_length=20, verbose_name='Đã đóng')),
                ('unpaid_tuitionfee', models.CharField(max_length=20, verbose_name='Còn nợ')),
                ('idSemester', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='course.semester', verbose_name='Học kỳ')),
                ('idStd', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='login_std.profile_std', verbose_name='Mã sinh viên')),
            ],
            options={
                'verbose_name': 'Học phí',
                'verbose_name_plural': 'Học phí',
            },
        ),
    ]
