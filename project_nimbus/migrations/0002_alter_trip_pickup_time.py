# Generated by Django 4.0 on 2022-01-16 20:46

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('project_nimbus', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='trip',
            name='pickup_time',
            field=models.DateTimeField(default=datetime.datetime(2022, 1, 16, 14, 46, 42, 913970)),
        ),
    ]
