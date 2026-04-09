import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchCourses, fetchCategories } from '../../store/slices/coursesSlice';
import { fetchMyProgress } from '../../store/slices/progressSlice';
import { fetchMyOrders } from '../../store/slices/paymentsSlice';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { courses, isLoading: coursesLoading } = useAppSelector((state) => state.courses);
  const { progress, isLoading: progressLoading } = useAppSelector((state) => state.progress);
  const { orders, isLoading: ordersLoading } = useAppSelector((state) => state.payments);

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchCategories());
    dispatch(fetchMyProgress());
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const enrolledCourses = courses.filter(course => 
    orders.some(order => order.course === course.id && order.status === 'completed')
  );

  const completedLessons = progress.filter(p => p.completed).length;
  const totalLessons = progress.length;
  const completionRate = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  if (coursesLoading || progressLoading || ordersLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome back, {user?.first_name || user?.username}!
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                Enrolled Courses
              </Typography>
              <Typography variant="h4">
                {enrolledCourses.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                Progress
              </Typography>
              <Typography variant="h4">
                {completionRate.toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {completedLessons} of {totalLessons} lessons
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                Completed Orders
              </Typography>
              <Typography variant="h4">
                {orders.filter(order => order.status === 'completed').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                Role
              </Typography>
              <Typography variant="h4">
                {user?.is_instructor ? 'Instructor' : 'Student'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Courses
              </Typography>
              {enrolledCourses.slice(0, 3).map((course) => (
                <Box key={course.id} sx={{ mb: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="subtitle1">{course.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {course.instructor_name}
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => navigate(`/courses/${course.id}`)}
                    sx={{ mt: 1 }}
                  >
                    Continue Learning
                  </Button>
                </Box>
              ))}
              {enrolledCourses.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No enrolled courses yet. Browse courses to get started!
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => navigate('/courses')}
                  fullWidth
                >
                  Browse Courses
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/profile')}
                  fullWidth
                >
                  View Profile
                </Button>
                {user?.is_instructor && (
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/instructor')}
                    fullWidth
                  >
                    Instructor Dashboard
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
