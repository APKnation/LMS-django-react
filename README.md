# LMS-django-react

A Learning Management System built with Django REST Framework and React.

## 🚫 Video Upload Policy

**Video file uploads are NOT allowed in this repository.**

### Why?
- Video files are large and bloat the repository
- They slow down cloning and operations
- Better performance with external hosting
- Easier to manage and update content

### Alternatives
Use external video hosting services:
- **YouTube** - Free and widely supported
- **Vimeo** - Professional video hosting
- **AWS S3 + CloudFront** - Custom solution
- **Wistia** - Business video hosting

### How it works
- Lessons use `video_url` field instead of file uploads
- Add video URLs from YouTube, Vimeo, or other platforms
- GitHub Actions automatically block video file commits
- Django validation prevents video uploads through the API

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login/` | Login (session-based) |
| POST | `/api/auth/logout/` | Logout |

### Users (`/api/users/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/` | List all users |
| POST | `/api/users/` | Create user |
| GET | `/api/users/{id}/` | Retrieve user |
| PUT | `/api/users/{id}/` | Update user |
| DELETE | `/api/users/{id}/` | Delete user |
| GET | `/api/users/me/` | Get current user |
| GET | `/api/users/instructors/` | List instructors |
| GET | `/api/users/students/` | List students |

### Courses (`/api/courses/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses/` | List all courses |
| POST | `/api/courses/` | Create course (instructor) |
| GET | `/api/courses/{id}/` | Retrieve course |
| PUT | `/api/courses/{id}/` | Update course |
| DELETE | `/api/courses/{id}/` | Delete course |
| GET | `/api/courses/{id}/lessons/` | Get course lessons |

### Lessons (`/api/lessons/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/lessons/` | List all lessons |
| POST | `/api/lessons/` | Create lesson |
| GET | `/api/lessons/{id}/` | Retrieve lesson |
| PUT | `/api/lessons/{id}/` | Update lesson |
| DELETE | `/api/lessons/{id}/` | Delete lesson |

### Enrollments (`/api/enrollments/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/enrollments/` | List all enrollments |
| POST | `/api/enrollments/` | Enroll in course |
| GET | `/api/enrollments/{id}/` | Retrieve enrollment |
| DELETE | `/api/enrollments/{id}/` | Unenroll |
| GET | `/api/enrollments/my_enrollments/` | Get my enrollments |

### Quizzes (`/api/quizzes/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/quizzes/` | List all quizzes |
| POST | `/api/quizzes/` | Create quiz |
| GET | `/api/quizzes/{id}/` | Retrieve quiz |
| PUT | `/api/quizzes/{id}/` | Update quiz |
| DELETE | `/api/quizzes/{id}/` | Delete quiz |

### Questions (`/api/questions/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/questions/` | List all questions |
| POST | `/api/questions/` | Create question |
| GET | `/api/questions/{id}/` | Retrieve question |
| PUT | `/api/questions/{id}/` | Update question |
| DELETE | `/api/questions/{id}/` | Delete question |

### Choices (`/api/choices/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/choices/` | List all choices |
| POST | `/api/choices/` | Create choice |
| GET | `/api/choices/{id}/` | Retrieve choice |
| PUT | `/api/choices/{id}/` | Update choice |
| DELETE | `/api/choices/{id}/` | Delete choice |

### Progress (`/api/progress/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/progress/` | List all progress |
| POST | `/api/progress/` | Create progress entry |
| GET | `/api/progress/{id}/` | Retrieve progress |
| PUT | `/api/progress/{id}/` | Update progress |
| DELETE | `/api/progress/{id}/` | Delete progress |
| GET | `/api/progress/my_progress/` | Get my progress |
| POST | `/api/progress/mark_complete/` | Mark lesson as complete |

## Setup

```bash
cd lms_backend
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers
python3 manage.py migrate
python3 manage.py runserver
```

## Admin
Access Django admin at `/admin/`
