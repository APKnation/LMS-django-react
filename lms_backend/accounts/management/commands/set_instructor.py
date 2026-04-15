from django.core.management.base import BaseCommand
from accounts.models import User


class Command(BaseCommand):
    help = 'Set a user as instructor'

    def add_arguments(self, parser):
        parser.add_argument('username', type=str, help='Username of the user')
        parser.add_argument('--approve', action='store_true', help='Approve the instructor account')

    def handle(self, *args, **options):
        username = options['username']
        approve = options['approve']

        try:
            user = User.objects.get(username=username)
            user.is_instructor = True
            user.is_student = False
            if approve:
                user.is_instructor_approved = True
            user.save()

            self.stdout.write(
                self.style.SUCCESS(f'Successfully set {username} as instructor')
            )
            self.stdout.write(f'is_instructor: {user.is_instructor}')
            self.stdout.write(f'is_student: {user.is_student}')
            self.stdout.write(f'is_instructor_approved: {user.is_instructor_approved}')
        except User.DoesNotExist:
            self.stdout.write(
                self.style.ERROR(f'User {username} does not exist')
            )
