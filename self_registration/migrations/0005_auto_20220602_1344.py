# Generated by Django 3.2.12 on 2022-06-02 13:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('self_registration', '0004_auto_20220602_1315'),
    ]

    operations = [
        migrations.AlterField(
            model_name='staff',
            name='is_approved',
            field=models.PositiveSmallIntegerField(choices=[(2, 'Approved'), (3, 'Not Approved'), (1, 'Pending Approval')], default=1, null=True),
        ),
        migrations.AlterField(
            model_name='visitor',
            name='email',
            field=models.EmailField(blank=True, max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='visitor',
            name='is_approved',
            field=models.PositiveSmallIntegerField(choices=[(2, 'Approved'), (3, 'Not Approved'), (1, 'Pending Approval')], default=2, null=True),
        ),
    ]
