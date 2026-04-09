import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export interface Quiz {
  id: number;
  title: string;
  description: string;
  course: number;
  course_title: string;
  time_limit: number;
  passing_score: number;
  max_attempts: number;
  created_at: string;
}

export interface Question {
  id: number;
  question: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer';
  points: number;
  quiz: number;
  choices?: Choice[];
  correct_answer?: string;
}

export interface Choice {
  id: number;
  text: string;
  is_correct: boolean;
  question: number;
}

export interface QuizAttempt {
  id: number;
  student: number;
  student_name: string;
  quiz: number;
  quiz_title: string;
  score: number;
  percentage: number;
  is_passed: boolean;
  status: 'in_progress' | 'completed' | 'timed_out';
  attempt_number: number;
  started_at: string;
  completed_at?: string;
}

interface QuizState {
  quizzes: Quiz[];
  quiz: Quiz | null;
  questions: Question[];
  attempts: QuizAttempt[];
  currentAttempt: QuizAttempt | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: QuizState = {
  quizzes: [],
  quiz: null,
  questions: [],
  attempts: [],
  currentAttempt: null,
  isLoading: false,
  error: null,
};

export const fetchQuizzes = createAsyncThunk(
  'quiz/fetchQuizzes',
  async (courseId?: number, { rejectWithValue }) => {
    try {
      const url = courseId 
        ? `${API_BASE_URL}/quizzes/?course=${courseId}`
        : `${API_BASE_URL}/quizzes/`;
      const response = await axios.get(url);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch quizzes');
    }
  }
);

export const fetchQuiz = createAsyncThunk(
  'quiz/fetchQuiz',
  async (quizId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/quizzes/${quizId}/`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch quiz');
    }
  }
);

export const fetchQuizQuestions = createAsyncThunk(
  'quiz/fetchQuizQuestions',
  async (quizId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/quizzes/${quizId}/questions_for_quiz/`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch questions');
    }
  }
);

export const startQuizAttempt = createAsyncThunk(
  'quiz/startAttempt',
  async (quizId: number, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string | null } };
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await axios.post(
        `${API_BASE_URL}/quizzes/${quizId}/start_attempt/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to start attempt');
    }
  }
);

export const submitQuiz = createAsyncThunk(
  'quiz/submitQuiz',
  async ({ attemptId, answers }: { attemptId: number; answers: any[] }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string | null } };
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await axios.post(
        `${API_BASE_URL}/quiz-attempts/${attemptId}/submit/`,
        { answers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to submit quiz');
    }
  }
);

export const fetchMyAttempts = createAsyncThunk(
  'quiz/fetchMyAttempts',
  async (quizId?: number, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string | null } };
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('No token found');
      }

      const url = quizId 
        ? `${API_BASE_URL}/quiz-attempts/my_attempts/?quiz=${quizId}`
        : `${API_BASE_URL}/quiz-attempts/my_attempts/`;
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch attempts');
    }
  }
);

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    clearQuiz: (state) => {
      state.quiz = null;
      state.questions = [];
      state.currentAttempt = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch quizzes
      .addCase(fetchQuizzes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.quizzes = action.payload;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch quiz
      .addCase(fetchQuiz.fulfilled, (state, action) => {
        state.quiz = action.payload;
      })
      // Fetch questions
      .addCase(fetchQuizQuestions.fulfilled, (state, action) => {
        state.questions = action.payload;
      })
      // Start attempt
      .addCase(startQuizAttempt.fulfilled, (state, action) => {
        state.currentAttempt = action.payload;
      })
      // Submit quiz
      .addCase(submitQuiz.fulfilled, (state, action) => {
        state.currentAttempt = action.payload;
      })
      // Fetch attempts
      .addCase(fetchMyAttempts.fulfilled, (state, action) => {
        state.attempts = action.payload;
      });
  },
});

export const { clearQuiz, clearError } = quizSlice.actions;
export default quizSlice.reducer;
