# Generated by Django 2.2.7 on 2021-04-28 15:29

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('hook', '0006_auto_20211202_2331_squashed_0009_auto_20211217_1816'),
    ]

    operations = [
        migrations.RenameField(
            model_name='hooklog',
            old_name='instance_id',
            new_name='submission_id',
        ),
    ]
