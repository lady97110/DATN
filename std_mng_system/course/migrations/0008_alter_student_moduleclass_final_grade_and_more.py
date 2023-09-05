# Generated by Django 4.2.4 on 2023-09-04 11:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('course', '0007_remove_semester_enddate_registration_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='student_moduleclass',
            name='final_grade',
            field=models.FloatField(blank=True, null=True, verbose_name='Điểm kết thúc'),
        ),
        migrations.AlterField(
            model_name='student_moduleclass',
            name='overall_grade',
            field=models.FloatField(blank=True, null=True, verbose_name='Điểm tổng kết'),
        ),
        migrations.AlterField(
            model_name='student_moduleclass',
            name='overall_grade_4',
            field=models.FloatField(blank=True, null=True, verbose_name='Hệ số 4'),
        ),
        migrations.AlterField(
            model_name='student_moduleclass',
            name='overall_grade_text',
            field=models.CharField(blank=True, max_length=2, null=True, verbose_name='Điểm chữ'),
        ),
        migrations.AlterField(
            model_name='student_moduleclass',
            name='process_grade',
            field=models.FloatField(blank=True, null=True, verbose_name='Điểm quá trình'),
        ),
    ]