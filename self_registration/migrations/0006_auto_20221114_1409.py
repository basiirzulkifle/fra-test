# Generated by Django 3.2.12 on 2022-11-14 14:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('self_registration', '0005_auto_20220602_1344'),
    ]

    operations = [
        migrations.AlterField(
            model_name='staff',
            name='identification_no',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='staff',
            name='is_approved',
            field=models.PositiveSmallIntegerField(choices=[(1, 'Pending Approval'), (3, 'Not Approved'), (2, 'Approved')], default=1, null=True),
        ),
        migrations.AlterField(
            model_name='visitor',
            name='identification_no',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='visitor',
            name='is_approved',
            field=models.PositiveSmallIntegerField(choices=[(1, 'Pending Approval'), (3, 'Not Approved'), (2, 'Approved')], default=2, null=True),
        ),
    ]
