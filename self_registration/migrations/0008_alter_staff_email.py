# Generated by Django 3.2.12 on 2022-11-14 14:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('self_registration', '0007_auto_20221114_1445'),
    ]

    operations = [
        migrations.AlterField(
            model_name='staff',
            name='email',
            field=models.EmailField(max_length=50, null=True),
        ),
    ]
