# LMS-django-react

A Learning Management System built with Django REST Framework and React.

## Features Implemented

### Student Features
- **Course Search & Filtering** - Filter by category, instructor, difficulty, price range
- **Payment System** - Multiple payment methods including:
  - Credit/Debit Card (Stripe)
  - Mobile Money (Vodacom M-Pesa, Airtel Money, Halotel Money, TTCL Money, Yas Money)
- **Quiz Points System** - Earn points for correct answers in quizzes
- **Bookmark Lessons** - Save lesson progress markers with notes
- **Notes System** - Take notes on lessons with video timestamps
- **Discussion/Comments** - Q&A on lessons with instructor responses
- **Certificates** - Auto-generated certificates on course completion

### Instructor Features
- **Course Analytics** - View student progress stats, completion rates, revenue
- **Announcements** - Notify enrolled students about updates
- **Course Management** - Create draft/published courses with categories

## Currency

All monetary values in the system are displayed in **Tanzanian Shillings (TZS)**. This includes:
- Course prices
- Payment amounts
- Revenue analytics
- Instructor payouts

## Payment Methods

The system supports the following payment methods:

### Card Payments
- Credit/Debit Card via Stripe
- Secure payment processing
- Instant enrollment upon successful payment

### Mobile Money Payments (Tanzania)
- **Vodacom M-Pesa**
- **Airtel Money**
- **Halotel Money**
- **TTCL Money**
- **Yas Money**

**Note:** Mobile money payments are currently in demo mode and do not process actual transactions.

## Quiz Points System

Quizzes include a points-based scoring system:
- Each question has an assigned point value (default: 1 point)
- Students earn points for correct answers
- Quiz results display:
  - Points earned
  - Maximum possible points
  - Percentage score
  - Pass/fail status

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/token/` | Get JWT access & refresh tokens |
| POST | `/api/token/refresh/` | Refresh JWT token |
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

### Categories (`/api/categories/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories/` | List all categories |
| POST | `/api/categories/` | Create category |
| GET | `/api/categories/{id}/` | Retrieve category |
| PUT | `/api/categories/{id}/` | Update category |
| DELETE | `/api/categories/{id}/` | Delete category |

### Courses (`/api/courses/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses/` | List all courses (with filters) |
| POST | `/api/courses/` | Create course (instructor) |
| GET | `/api/courses/{id}/` | Retrieve course |
| PUT | `/api/courses/{id}/` | Update course |
| DELETE | `/api/courses/{id}/` | Delete course |
| GET | `/api/courses/{id}/lessons/` | Get course lessons |
| GET | `/api/courses/{id}/analytics/` | Get course analytics (instructor only) |
| GET | `/api/courses/search/` | Search courses by query |
| GET | `/api/courses/my_courses/` | Get my created courses (instructor) |

**Filter Parameters for `/api/courses/`:**
- `?category=1` - Filter by category ID
- `?difficulty=beginner` - Filter by difficulty (beginner/intermediate/advanced)
- `?instructor=1` - Filter by instructor ID
- `?is_free=true` - Filter free courses
- `?min_price=10&max_price=100` - Filter by price range
- `?instructor_name=john` - Filter by instructor username
- `?category_name=python` - Filter by category name
- `?search=python` - Search in title/description

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
| GET | `/api/quizzes/{id}/start_attempt/` | Start or get current quiz attempt |
| GET | `/api/quizzes/{id}/questions_for_quiz/` | Get quiz questions (without answers) |

### Quiz Attempts (`/api/quiz-attempts/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/quiz-attempts/` | List all attempts |
| POST | `/api/quiz-attempts/` | Create attempt |
| GET | `/api/quiz-attempts/{id}/` | Retrieve attempt |
| POST | `/api/quiz-attempts/{id}/submit/` | Submit quiz answers (auto-graded) |
| GET | `/api/quiz-attempts/my_attempts/?quiz=1` | Get my attempts |

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

### Assignments (`/api/assignments/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/assignments/` | List all assignments |
| POST | `/api/assignments/` | Create assignment (instructor) |
| GET | `/api/assignments/{id}/` | Retrieve assignment |
| PUT | `/api/assignments/{id}/` | Update assignment (instructor) |
| DELETE | `/api/assignments/{id}/` | Delete assignment (instructor) |
| GET | `/api/assignments/course_assignments/?course=1` | Get course assignments |

### Assignment Submissions (`/api/assignment-submissions/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/assignment-submissions/` | List all submissions |
| POST | `/api/assignment-submissions/` | Submit assignment |
| GET | `/api/assignment-submissions/{id}/` | Retrieve submission |
| PUT | `/api/assignment-submissions/{id}/` | Update submission |
| DELETE | `/api/assignment-submissions/{id}/` | Delete submission |
| POST | `/api/assignment-submissions/{id}/grade/` | Grade submission (instructor) |
| GET | `/api/assignment-submissions/my_submissions/?assignment=1` | Get my submissions |

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

### Bookmarks (`/api/bookmarks/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookmarks/` | List all bookmarks |
| POST | `/api/bookmarks/` | Create bookmark |
| GET | `/api/bookmarks/{id}/` | Retrieve bookmark |
| PUT | `/api/bookmarks/{id}/` | Update bookmark |
| DELETE | `/api/bookmarks/{id}/` | Delete bookmark |
| GET | `/api/bookmarks/my_bookmarks/` | Get my bookmarks |

### Notes (`/api/notes/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes/` | List all notes |
| POST | `/api/notes/` | Create note |
| GET | `/api/notes/{id}/` | Retrieve note |
| PUT | `/api/notes/{id}/` | Update note |
| DELETE | `/api/notes/{id}/` | Delete note |
| GET | `/api/notes/my_notes/?lesson=1` | Get my notes (optional lesson filter) |

### Certificates (`/api/certificates/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/certificates/` | List certificates |
| GET | `/api/certificates/{id}/` | Retrieve certificate |
| POST | `/api/certificates/generate/` | Generate certificate for course |
| GET | `/api/certificates/my_certificates/` | Get my certificates |

### Comments (`/api/comments/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/comments/` | List all comments |
| POST | `/api/comments/` | Create comment |
| GET | `/api/comments/{id}/` | Retrieve comment |
| PUT | `/api/comments/{id}/` | Update comment |
| DELETE | `/api/comments/{id}/` | Delete comment |
| GET | `/api/comments/lesson_comments/?lesson=1` | Get comments for lesson |

### Orders (`/api/orders/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders/` | List all orders |
| POST | `/api/orders/` | Create order (with payment method) |
| GET | `/api/orders/{id}/` | Retrieve order |
| POST | `/api/orders/{id}/checkout/` | Process payment (Stripe or mobile money) |
| POST | `/api/orders/confirm_payment/` | Confirm Stripe payment |
| GET | `/api/orders/my_orders/` | Get my orders |

### Coupons (`/api/coupons/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/coupons/` | List all coupons |
| POST | `/api/coupons/` | Create coupon |
| GET | `/api/coupons/{id}/` | Retrieve coupon |
| PUT | `/api/coupons/{id}/` | Update coupon |
| DELETE | `/api/coupons/{id}/` | Delete coupon |
| POST | `/api/coupons/validate/` | Validate coupon code |

### Instructor Payouts (`/api/instructor-payouts/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/instructor-payouts/` | List all payouts |
| GET | `/api/instructor-payouts/my_payouts/` | Get my payouts |
| GET | `/api/instructor-payouts/revenue_summary/` | Get revenue summary |

### Announcements (`/api/announcements/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/announcements/` | List all announcements |
| POST | `/api/announcements/` | Create announcement (instructor) |
| GET | `/api/announcements/{id}/` | Retrieve announcement |
| PUT | `/api/announcements/{id}/` | Update announcement (instructor) |
| DELETE | `/api/announcements/{id}/` | Delete announcement (instructor) |
| GET | `/api/announcements/course_announcements/?course=1` | Get course announcements |

## Setup

```bash
cd lms_backend
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers django-filter
python3 manage.py migrate
python3 manage.py runserver
```

## Admin
Access Django admin at `/admin/`
