from django.contrib.auth.models import User
import os

def create_superuser():
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='admin123',
            first_name='Admin',
            last_name='User'
        )
        print('Superuser created successfully!')
    else:
        print('Superuser already exists!')

if __name__ == '__main__':
    create_superuser()
