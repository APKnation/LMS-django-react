import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  CircularProgress,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchCourses, fetchCategories } from '../../store/slices/coursesSlice';
import { createOrder } from '../../store/slices/paymentsSlice';

const Courses: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { courses, categories, isLoading } = useAppSelector((state) => state.courses);
  const { user, token } = useAppSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | ''>('');

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchCategories());
  }, [dispatch]);

  const filteredCourses = courses.filter((course: any) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || course.category === selectedCategory;
    return matchesSearch && matchesCategory && course.is_published;
  });

  const handleEnroll = async (courseId: number) => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const order = await dispatch(createOrder({ courseId })).unwrap();
      navigate(`/checkout/${order.id}`);
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };

  const handleViewCourse = (courseId: number) => {
    navigate(`/courses/${courseId}`);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Browse Courses
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Search courses"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 200, flexGrow: 1 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as number | '')}
            label="Category"
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((category: any) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {filteredCourses.map((course: any) => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {course.thumbnail && (
                <CardMedia
                  component="img"
                  height="200"
                  image={course.thumbnail}
                  alt={course.title}
                  sx={{ objectFit: 'cover' }}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {course.description.length > 100 
                    ? `${course.description.substring(0, 100)}...`
                    : course.description
                  }
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Instructor: {course.instructor_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Category: {course.category_name}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" color="primary" sx={{ mr: 2 }}>
                    ${course.price}
                  </Typography>
                  {course.average_rating && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Chip 
                        label={`(${course.reviews_count})`}
                        size="small"
                        color="primary"
                      />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {course.average_rating.toFixed(1)} stars
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewCourse(course.id)}
                    sx={{ flexGrow: 1 }}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleEnroll(course.id)}
                    sx={{ flexGrow: 1 }}
                  >
                    Enroll Now
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredCourses.length === 0 && (
        <Box textAlign="center" sx={{ py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No courses found matching your criteria.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Courses;
