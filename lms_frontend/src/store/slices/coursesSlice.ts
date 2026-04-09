import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  instructor: string;
  instructor_name: string;
  category: number;
  category_name: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  lessons_count?: number;
  enrolled_count?: number;
  average_rating?: number;
  reviews_count?: number;
}

export interface Lesson {
  id: number;
  title: string;
  content: string;
  video_url?: string;
  duration: number;
  order: number;
  course: number;
  is_published: boolean;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

interface CoursesState {
  courses: Course[];
  course: Course | null;
  lessons: Lesson[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CoursesState = {
  courses: [],
  course: null,
  lessons: [],
  categories: [],
  isLoading: false,
  error: null,
};

export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async (params?: { category?: number; search?: string }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.category) queryParams.append('category', params.category.toString());
      if (params?.search) queryParams.append('search', params.search);
      
      const response = await axios.get(`${API_BASE_URL}/courses/?${queryParams}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch courses');
    }
  }
);

export const fetchCourse = createAsyncThunk(
  'courses/fetchCourse',
  async (courseId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/courses/${courseId}/`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch course');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'courses/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories/`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch categories');
    }
  }
);

export const fetchCourseLessons = createAsyncThunk(
  'courses/fetchCourseLessons',
  async (courseId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/lessons/?course=${courseId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch lessons');
    }
  }
);

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearCourse: (state) => {
      state.course = null;
      state.lessons = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch courses
      .addCase(fetchCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch course
      .addCase(fetchCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.course = action.payload;
      })
      .addCase(fetchCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      // Fetch lessons
      .addCase(fetchCourseLessons.fulfilled, (state, action) => {
        state.lessons = action.payload;
      });
  },
});

export const { clearCourse, clearError } = coursesSlice.actions;
export default coursesSlice.reducer;
