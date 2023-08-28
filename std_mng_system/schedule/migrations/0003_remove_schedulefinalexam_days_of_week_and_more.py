# Generated by Django 4.2.4 on 2023-08-28 12:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('schedule', '0002_alter_schedulemoduleclass_options_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='schedulefinalexam',
            name='days_of_week',
        ),
        migrations.AddField(
            model_name='schedulefinalexam',
            name='date_exam',
            field=models.DateField(blank=True, null=True, verbose_name='Ngày bắt đầu'),
        ),
    ]
