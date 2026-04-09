import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { fetchCourse, fetchCourseLessons } from '../../store/slices/coursesSlice';
import { createOrder } from '../../store/slices/paymentsSlice';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { course, lessons, isLoading } = useAppSelector((state) => state.courses);
  const { user, token } = useAppSelector((state) => state.auth);
  const [enrollDialog, setEnrollDialog] = useState(false);
  const [couponCode, setCouponCode] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(fetchCourse(Number(id)));
      dispatch(fetchCourseLessons(Number(id)));
    }
  }, [dispatch, id]);

  const handleEnroll = async () => {
    if (!token || !id) {
      navigate('/login');
      return;
    }

    try {
      const order = await dispatch(createOrder({ 
        courseId: Number(id),
        couponCode: couponCode || undefined 
      })).unwrap();
      setEnrollDialog(false);
      navigate(`/checkout/${order.id}`);
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!course) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Course not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {course.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {course.description}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" color="primary">
            ${course.price}
          </Typography>
          <Chip label={course.category_name} size="small" />
          {course.average_rating && (
            <Chip 
              label={`${course.average_rating.toFixed(1)} stars (${course.reviews_count} reviews)`}
              size="small"
              color="primary"
            />
          )}
        </Box>

        <Typography variant="body2" color="text.secondary">
          Instructor: {course.instructor_name}
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => setEnrollDialog(true)}
        >
          Enroll Now
        </Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom>
        Course Content
      </Typography>

      <List>
        {lessons.map((lesson: any) => (
          <ListItem key={lesson.id} sx={{ border: 1, borderColor: 'divider', mb: 1, borderRadius: 1 }}>
            <ListItemText
              primary={lesson.title}
              secondary={`Duration: ${lesson.duration} minutes`}
            />
            {lesson.is_published ? (
              <Chip label="Published" size="small" color="success" />
            ) : (
              <Chip label="Draft" size="small" color="warning" />
            )}
          </ListItem>
        ))}
      </List>

      {lessons.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          No lessons available yet.
        </Typography>
      )}

      <Dialog open={enrollDialog} onClose={() => setEnrollDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Enroll in Course</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            You're about to enroll in: <strong>{course.title}</strong>
          </Typography>
          <Typography variant="h6" color="primary" gutterBottom>
            Price: ${course.price}
          </Typography>
          <TextField
            fullWidth
            label="Coupon Code (Optional)"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEnrollDialog(false)}>Cancel</Button>
          <Button onClick={handleEnroll} variant="contained">
            Proceed to Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourseDetail;
