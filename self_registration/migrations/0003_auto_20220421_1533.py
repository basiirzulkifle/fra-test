# Generated by Django 3.2.12 on 2022-04-21 15:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('self_registration', '0002_auto_20220419_1514'),
    ]

    operations = [
        migrations.AlterField(
            model_name='staff',
            name='is_approved',
            field=models.PositiveSmallIntegerField(choices=[(3, 'Not Approved'), (2, 'Approved'), (1, 'Pending Approval')], default=1, null=True),
        ),
        migrations.AlterField(
            model_name='visitor',
            name='is_approved',
            field=models.PositiveSmallIntegerField(choices=[(3, 'Not Approved'), (2, 'Approved'), (1, 'Pending Approval')], default=2, null=True),
        ),
    ]
