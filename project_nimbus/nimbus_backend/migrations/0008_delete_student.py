# Generated by Django 4.0 on 2022-12-21 20:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('nimbus_backend', '0007_remove_trip_gender_filter_and_more'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Student',
        ),
    ]
