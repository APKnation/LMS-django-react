import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './store';
import { useAppSelector } from './hooks/redux';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import Courses from './components/Courses/Courses';
import CourseDetail from './components/Courses/CourseDetail';
import Quiz from './components/Quiz/Quiz';
import Profile from './components/Profile/Profile';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAppSelector(state => state.auth);
  return token ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/courses" element={
              <PrivateRoute>
                <Courses />
              </PrivateRoute>
            } />
            <Route path="/courses/:id" element={
              <PrivateRoute>
                <CourseDetail />
              </PrivateRoute>
            } />
            <Route path="/quiz/:id" element={
              <PrivateRoute>
                <Quiz />
              </PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
