import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export interface Progress {
  id: number;
  student: number;
  lesson: number;
  lesson_title: string;
  completed: boolean;
  completed_at?: string;
  created_at: string;
}

export interface Bookmark {
  id: number;
  student: number;
  lesson: number;
  lesson_title: string;
  timestamp: number;
  created_at: string;
}

export interface Note {
  id: number;
  student: number;
  lesson: number;
  lesson_title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Certificate {
  id: number;
  student: number;
  course: number;
  course_title: string;
  certificate_number: string;
  issued_at: string;
  pdf_file?: string;
}

interface ProgressState {
  progress: Progress[];
  bookmarks: Bookmark[];
  notes: Note[];
  certificates: Certificate[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProgressState = {
  progress: [],
  bookmarks: [],
  notes: [],
  certificates: [],
  isLoading: false,
  error: null,
};

export const fetchMyProgress = createAsyncThunk(
  'progress/fetchMyProgress',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string | null } };
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await axios.get(`${API_BASE_URL}/progress/my_progress/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch progress');
    }
  }
);

export const markLessonComplete = createAsyncThunk(
  'progress/markLessonComplete',
  async (lessonId: number, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string | null } };
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await axios.post(
        `${API_BASE_URL}/progress/mark_complete/`,
        { lesson: lessonId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to mark lesson complete');
    }
  }
);

export const fetchMyBookmarks = createAsyncThunk(
  'progress/fetchMyBookmarks',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string | null } };
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await axios.get(`${API_BASE_URL}/bookmarks/my_bookmarks/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch bookmarks');
    }
  }
);

export const addBookmark = createAsyncThunk(
  'progress/addBookmark',
  async (lessonId: number, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string | null } };
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await axios.post(
        `${API_BASE_URL}/bookmarks/`,
        { lesson: lessonId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to add bookmark');
    }
  }
);

export const fetchMyNotes = createAsyncThunk(
  'progress/fetchMyNotes',
  async (lessonId?: number, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string | null } };
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('No token found');
      }

      const url = lessonId 
        ? `${API_BASE_URL}/notes/my_notes/?lesson=${lessonId}`
        : `${API_BASE_URL}/notes/my_notes/`;
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch notes');
    }
  }
);

export const addNote = createAsyncThunk(
  'progress/addNote',
  async ({ lessonId, content }: { lessonId: number; content: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string | null } };
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await axios.post(
        `${API_BASE_URL}/notes/`,
        { lesson: lessonId, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to add note');
    }
  }
);

export const fetchMyCertificates = createAsyncThunk(
  'progress/fetchMyCertificates',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string | null } };
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await axios.get(`${API_BASE_URL}/certificates/my_certificates/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch certificates');
    }
  }
);

export const generateCertificate = createAsyncThunk(
  'progress/generateCertificate',
  async (courseId: number, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string | null } };
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await axios.post(
        `${API_BASE_URL}/certificates/generate/`,
        { course: courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to generate certificate');
    }
  }
);

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch progress
      .addCase(fetchMyProgress.fulfilled, (state, action) => {
        state.progress = action.payload;
      })
      // Mark lesson complete
      .addCase(markLessonComplete.fulfilled, (state, action) => {
        const index = state.progress.findIndex(p => p.lesson === action.payload.lesson);
        if (index !== -1) {
          state.progress[index] = action.payload;
        } else {
          state.progress.push(action.payload);
        }
      })
      // Fetch bookmarks
      .addCase(fetchMyBookmarks.fulfilled, (state, action) => {
        state.bookmarks = action.payload;
      })
      // Add bookmark
      .addCase(addBookmark.fulfilled, (state, action) => {
        state.bookmarks.push(action.payload);
      })
      // Fetch notes
      .addCase(fetchMyNotes.fulfilled, (state, action) => {
        state.notes = action.payload;
      })
      // Add note
      .addCase(addNote.fulfilled, (state, action) => {
        state.notes.push(action.payload);
      })
      // Fetch certificates
      .addCase(fetchMyCertificates.fulfilled, (state, action) => {
        state.certificates = action.payload;
      })
      // Generate certificate
      .addCase(generateCertificate.fulfilled, (state, action) => {
        state.certificates.push(action.payload);
      });
  },
});

export const { clearError } = progressSlice.actions;
export default progressSlice.reducer;
