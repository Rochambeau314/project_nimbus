# Generated by Django 4.0 on 2022-03-20 20:03

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('project_nimbus', '0004_alter_trip_pickup_time'),
    ]

    operations = [
        migrations.AlterField(
            model_name='trip',
            name='pickup_time',
            field=models.DateTimeField(default=datetime.datetime(2022, 3, 20, 15, 3, 50, 667917)),
        ),
    ]
