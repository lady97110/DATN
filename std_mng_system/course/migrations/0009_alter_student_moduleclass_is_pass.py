# Generated by Django 4.2.4 on 2023-09-05 00:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('course', '0008_alter_student_moduleclass_final_grade_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='student_moduleclass',
            name='is_pass',
            field=models.BooleanField(blank=True, choices=[(True, 'Đạt'), (False, 'Chưa đạt')], default=False, null=True, verbose_name='Đạt'),
        ),
    ]
