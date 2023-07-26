# Generated by Django 3.2.12 on 2022-04-19 15:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('self_registration', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='staff',
            name='is_approved',
            field=models.PositiveSmallIntegerField(choices=[(2, 'Approved'), (3, 'Not Approved'), (1, 'Pending Approval')], default=1, null=True),
        ),
        migrations.AlterField(
            model_name='visitor',
            name='is_approved',
            field=models.PositiveSmallIntegerField(choices=[(2, 'Approved'), (3, 'Not Approved'), (1, 'Pending Approval')], default=2, null=True),
        ),
    ]