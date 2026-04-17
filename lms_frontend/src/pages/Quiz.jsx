import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { quizAPI } from '../services/api';
import Sidebar from '../components/common/Sidebar';

const Quiz = () => {
  const { courseId, quizId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    fetchQuiz();
  }, [courseId, quizId]);

  useEffect(() => {
    if (quiz && quiz.time_limit && !submitted) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [quiz, submitted]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const response = await quizAPI.getQuestions(quizId);
      setQuiz(response.data);
      setTimeLeft(response.data.time_limit * 60); // Convert minutes to seconds
      setError(null);
    } catch (error) {
      console.error('Failed to fetch quiz:', error);
      setError('Failed to load quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    if (submitted) return;
    
    try {
      setSubmitted(true);
      const response = await quizAPI.submitQuiz(quizId, answers);
      setScore(response.data);
      setError(null);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      setError('Failed to submit quiz. Please try again.');
      setSubmitted(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-emerald-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (percentage) => {
    if (percentage >= 80) return 'Excellent!';
    if (percentage >= 60) return 'Good job!';
    return 'Keep practicing!';
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-600">Loading quiz...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Quiz</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={fetchQuiz}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
      </div>
    );
  }

  if (submitted && score !== null) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <div className="flex items-center justify-center py-12">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
              <div className="text-center">
                <div className="mb-6">
                  <svg className="mx-auto h-16 w-16 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
                
                <div className="mb-6">
                  <div className={`text-4xl font-bold ${getScoreColor(score.percentage)}`}>
                    {score.score}/{score.max_possible_score}
                  </div>
                  <div className={`text-lg font-medium ${getScoreColor(score.percentage)}`}>
                    {score.percentage}%
                  </div>
                  <p className="text-gray-600 mt-2">{getScoreMessage(score.percentage)}</p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Points Earned</p>
                    <p className="text-xl font-semibold text-emerald-600">{score.score}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Max Points</p>
                    <p className="text-xl font-semibold text-gray-900">{score.max_possible_score}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Time Taken</p>
                    <p className="text-xl font-semibold text-gray-900">{formatTime(score.time_taken)}</p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => navigate(`/courses/${courseId}`)}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Back to Course
                </button>
                <button
                  onClick={() => navigate(`/courses/${courseId}/quizzes`)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  View All Quizzes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) return null;

  const currentQuestionData = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 to-purple-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold">{quiz.title}</h1>
                <p className="text-indigo-200">Question {currentQuestion + 1} of {quiz.questions.length}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-sm text-indigo-200">Time Left</p>
                  <p className={`text-lg font-mono font-bold ${timeLeft < 60 ? 'text-red-300' : 'text-white'}`}>
                    {formatTime(timeLeft)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-200 h-1">
          <div 
            className="bg-indigo-600 h-1 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Quiz Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {currentQuestionData.question}
              </h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {currentQuestionData.points} point{currentQuestionData.points !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Multiple Choice */}
            {currentQuestionData.type === 'multiple_choice' && (
              <div className="space-y-3">
                {currentQuestionData.options.map((option, index) => (
                  <label
                    key={index}
                    className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion}`}
                      value={option}
                      checked={answers[currentQuestion] === option}
                      onChange={(e) => handleAnswerChange(currentQuestion, e.target.value)}
                      className="mr-3"
                      disabled={submitted}
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {/* True/False */}
            {currentQuestionData.type === 'true_false' && (
              <div className="space-y-3">
                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value="true"
                    checked={answers[currentQuestion] === 'true'}
                    onChange={(e) => handleAnswerChange(currentQuestion, e.target.value)}
                    className="mr-3"
                    disabled={submitted}
                  />
                  <span className="text-gray-700">True</span>
                </label>
                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value="false"
                    checked={answers[currentQuestion] === 'false'}
                    onChange={(e) => handleAnswerChange(currentQuestion, e.target.value)}
                    className="mr-3"
                    disabled={submitted}
                  />
                  <span className="text-gray-700">False</span>
                </label>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0 || submitted}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentQuestion < quiz.questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                disabled={submitted}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitted || Object.keys(answers).length < quiz.questions.length}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
