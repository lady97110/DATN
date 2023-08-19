# Generated by Django 4.2.4 on 2023-08-18 11:19

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='profile_admin',
            fields=[
                ('idAdmin', models.CharField(max_length=10, primary_key=True, serialize=False, verbose_name='Tên đăng nhập')),
                ('password', models.CharField(max_length=128, verbose_name='Mật khẩu')),
                ('nameAdmin', models.CharField(max_length=32, verbose_name='Họ và tên')),
                ('datebirthAdmin', models.DateField(verbose_name='Ngày sinh')),
                ('sexAdmin', models.CharField(choices=[('Nam', 'Nam'), ('Nữ', 'Nữ')], max_length=5, verbose_name='Giới tính')),
                ('ethnicityAdmin', models.CharField(default='Kinh', max_length=10, verbose_name='Dân tộc')),
                ('phoneAdmin', models.CharField(blank=True, max_length=12, null=True, verbose_name='Điện thoại')),
                ('emailAdmin', models.CharField(blank=True, max_length=40, null=True, verbose_name='Email')),
                ('addressAdmin', models.CharField(max_length=50, verbose_name='Quê quán')),
                ('last_login', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Quản trị viên',
                'verbose_name_plural': 'Quản trị viên',
            },
        ),
    ]
