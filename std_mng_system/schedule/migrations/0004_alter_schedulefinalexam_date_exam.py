# Generated by Django 4.2.4 on 2023-08-28 13:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('schedule', '0003_remove_schedulefinalexam_days_of_week_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='schedulefinalexam',
            name='date_exam',
            field=models.DateField(blank=True, null=True, verbose_name='Ngày thi'),
        ),
    ]
