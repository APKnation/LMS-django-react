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
    if (percentage >= 80) return 'text-trading-up';
    if (percentage >= 60) return 'text-primary';
    return 'text-trading-down';
  };

  const getScoreMessage = (percentage) => {
    if (percentage >= 80) return 'Excellent!';
    if (percentage >= 60) return 'Good job!';
    return 'Keep practicing!';
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-canvas-dark text-on-dark">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="relative">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-12 w-12 bg-primary rounded-full animate-ping opacity-20"></div>
                  <div className="h-12 w-12 bg-primary rounded-full animate-pulse opacity-40"></div>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-on-dark mb-2">Loading Quiz</h3>
                <p className="text-muted">Preparing your quiz experience...</p>
                <div className="mt-4 flex justify-center">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-canvas-dark text-on-dark">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <div className="flex items-center justify-center py-12">
            <div className="bg-surface-card-dark border border-hairline-on-dark rounded-xl p-8 max-w-md w-full">
              <div className="text-center">
                <div className="mx-auto h-16 w-16 bg-surface-elevated-dark rounded-full mb-6 flex items-center justify-center">
                  <svg className="h-8 w-8 text-trading-down" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-on-dark mb-3">Quiz Error</h3>
                <p className="text-muted mb-6">{error}</p>
                <div className="bg-surface-elevated-dark rounded-lg p-4 border border-hairline-on-dark">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mr-3 text-trading-down mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M12 16h.01M3 21h18a2 2 0 002 2v-8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-on-dark">Something went wrong</p>
                      <p className="text-sm text-muted mt-1">We couldn't load your quiz. Please check your connection and try again.</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={fetchQuiz}
                  className="mt-6 w-full px-6 py-3 bg-primary text-on-primary rounded-md hover:bg-primary-active transition-colors duration-200 font-medium"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v16M4 4h16M4 4h16M4 4h16" />
                  </svg>
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (submitted && score !== null) {
    return (
      <div className="flex min-h-screen bg-canvas-dark text-on-dark">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <div className="flex items-center justify-center py-12">
            <div className="bg-surface-card-dark border border-hairline-on-dark rounded-xl p-8 max-w-2xl w-full">
              <div className="text-center">
                <div className="mb-8">
                  <div className="mx-auto h-20 w-20 bg-surface-elevated-dark rounded-full mb-6 flex items-center justify-center">
                    <svg className="h-10 w-10 text-trading-up" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-on-dark mb-2">Quiz Completed!</h2>
                    <p className="text-muted text-lg">Great job completing the quiz!</p>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="text-center mb-4">
                    <p className="text-sm font-semibold text-muted mb-2">Your Score</p>
                    <div className={`text-5xl font-bold font-plex ${getScoreColor(score.percentage)}`}>
                      {score.score}/{score.max_possible_score}
                    </div>
                    <div className={`text-2xl font-bold font-plex ${getScoreColor(score.percentage)}`}>
                      {score.percentage}%
                    </div>
                    <p className={`text-lg font-medium ${getScoreColor(score.percentage)}`}>{getScoreMessage(score.percentage)}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="bg-surface-card-dark border border-hairline-on-dark rounded-xl p-6">
                      <div className="text-center">
                        <svg className="w-8 h-8 mx-auto mb-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13l-4 4m4 4v4m0 0l-4-4" />
                        </svg>
                        <p className="text-sm font-semibold text-muted">Points Earned</p>
                        <p className="text-2xl font-bold text-on-dark font-plex">{score.score}</p>
                      </div>
                    </div>
                    <div className="bg-surface-card-dark border border-hairline-on-dark rounded-xl p-6">
                      <div className="text-center">
                        <svg className="w-8 h-8 mx-auto mb-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v5.586a1 1 0 01-.707.293l-5.414 5.414a1 1 0 01-.293.707L5.586 16H7a2 2 0 002 2v2a1 1 0 011 1h10a1 1 0 011-1v-2a2 2 0 002-2z" />
                        </svg>
                        <p className="text-sm font-semibold text-muted">Max Points</p>
                        <p className="text-2xl font-bold text-on-dark font-plex">{score.max_possible_score}</p>
                      </div>
                    </div>
                    <div className="bg-surface-card-dark border border-hairline-on-dark rounded-xl p-6">
                      <div className="text-center">
                        <svg className="w-8 h-8 mx-auto mb-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m0 0l-3-3m3 3v4m0 0l-3-3" />
                        </svg>
                        <p className="text-sm font-semibold text-muted">Time Taken</p>
                        <p className="text-2xl font-bold text-on-dark font-plex">{formatTime(score.time_taken)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => navigate(`/courses/${courseId}`)}
                    className="group flex-1 px-6 py-3 bg-primary text-on-primary rounded-md hover:bg-primary-active transition-colors duration-200 font-medium flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Course
                  </button>
                  <button
                    onClick={() => navigate(`/courses/${courseId}/quizzes`)}
                    className="group flex-1 px-6 py-3 border border-hairline-on-dark text-on-dark rounded-md hover:bg-surface-elevated-dark transition-colors duration-200 font-medium flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v5.586a1 1 0 01-.707.293l-5.414 5.414a1 1 0 01-.293.707L5.586 16H7a2 2 0 002 2v2a1 1 0 011 1h10a1 1 0 011-1v-2a2 2 0 002-2z" />
                    </svg>
                    View All Quizzes
                  </button>
                </div>
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
    <div className="flex min-h-screen bg-canvas-dark text-on-dark">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="bg-canvas-dark border-b border-hairline-on-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-on-dark">{quiz.title}</h1>
                <p className="text-muted text-lg">Question {currentQuestion + 1} of {quiz.questions.length}</p>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 mr-2 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m0 0l-3-3m3 3v4m0 0l-3-3" />
                    </svg>
                    <p className="text-sm text-muted font-medium">Time Left</p>
                  </div>
                  <div className={`px-4 py-2 rounded-xl font-mono font-bold text-lg transition-all duration-300 ${
                    timeLeft < 60
                      ? 'bg-trading-down/20 text-trading-down border border-trading-down/50 animate-pulse'
                      : 'bg-surface-elevated-dark text-on-dark border border-hairline-on-dark'
                  }`}>
                    {formatTime(timeLeft)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-surface-elevated-dark h-2">
          <div
            className="bg-primary h-2 transition-all duration-500"
            style={{ width: `${progress}%` }}
          >
            <div className="h-full bg-primary/40 animate-pulse"></div>
          </div>
          <div className="text-center mt-2">
            <span className="text-sm font-semibold text-on-dark bg-surface-card-dark px-3 py-1 rounded-full">
              {Math.round(progress)}% Complete
            </span>
          </div>
        </div>

        {/* Quiz Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-surface-card-dark border border-hairline-on-dark rounded-xl p-8">
            <div className="mb-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-on-dark mb-2 flex items-center">
                    <svg className="w-6 h-6 mr-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.657-1.228-2.228-2.228-2.228.549 0 1.657.228 2.228 2.228zm9 2.268a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                    {currentQuestionData.question}
                  </h2>
                  <p className="text-muted mt-1">Select the best answer from the options below</p>
                </div>
                <div className="flex items-center">
                  <span className="px-4 py-2 bg-surface-elevated-dark text-primary text-sm font-bold rounded-full">
                    {currentQuestionData.points} point{currentQuestionData.points !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Multiple Choice */}
              {currentQuestionData.type === 'multiple_choice' && (
                <div className="space-y-4">
                  <p className="text-sm font-medium text-muted mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v5.586a1 1 0 01-.707.293l-5.414 5.414a1 1 0 01-.293.707L5.586 16H7a2 2 0 002 2v2a1 1 0 011 1h10a1 1 0 011-1v-2a2 2 0 002-2z" />
                    </svg>
                    Choose one answer:
                  </p>
                  {currentQuestionData.options.map((option, index) => (
                    <label
                      key={index}
                      className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-colors duration-200 group ${
                        answers[currentQuestion] === option
                          ? 'bg-surface-elevated-dark border-primary'
                          : 'bg-surface-card-dark border-hairline-on-dark hover:border-primary'
                      }`}
                    >
                      <div className="flex items-start">
                        <input
                          type="radio"
                          name={`question-${currentQuestion}`}
                          value={option}
                          checked={answers[currentQuestion] === option}
                          onChange={(e) => handleAnswerChange(currentQuestion, e.target.value)}
                          className="w-5 h-5 text-primary focus:ring-primary focus:ring-2 mr-4 mt-0.5"
                          disabled={submitted}
                        />
                        <div className="flex-1">
                          <span className={`font-medium ${
                            answers[currentQuestion] === option ? 'text-primary' : 'text-on-dark'
                          }`}>{option}</span>
                          {answers[currentQuestion] === option && (
                            <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">Selected</span>
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {/* True/False */}
              {currentQuestionData.type === 'true_false' && (
                <div className="space-y-4">
                  <p className="text-sm font-medium text-muted mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.657-1.228-2.228-2.228-2.228.549 0 1.657.228 2.228 2.228zm9 2.268a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                    Select True or False:
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <label
                      className={`flex items-center justify-center p-6 border-2 rounded-xl cursor-pointer transition-colors duration-200 group ${
                        answers[currentQuestion] === 'true'
                          ? 'bg-surface-elevated-dark border-trading-up'
                          : 'bg-surface-card-dark border-hairline-on-dark hover:border-trading-up'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion}`}
                        value="true"
                        checked={answers[currentQuestion] === 'true'}
                        onChange={(e) => handleAnswerChange(currentQuestion, e.target.value)}
                        className="sr-only"
                        disabled={submitted}
                      />
                      <div className="text-center">
                        <svg className="w-8 h-8 mx-auto mb-2 text-trading-up" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className={`font-bold text-lg ${
                          answers[currentQuestion] === 'true' ? 'text-trading-up' : 'text-on-dark'
                        }`}>True</span>
                        {answers[currentQuestion] === 'true' && (
                          <span className="text-xs bg-trading-up/10 text-trading-up px-2 py-1 rounded-full font-medium mt-2 block">Your Choice</span>
                        )}
                      </div>
                    </label>
                    <label
                      className={`flex items-center justify-center p-6 border-2 rounded-xl cursor-pointer transition-colors duration-200 group ${
                        answers[currentQuestion] === 'false'
                          ? 'bg-surface-elevated-dark border-trading-down'
                          : 'bg-surface-card-dark border-hairline-on-dark hover:border-trading-down'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion}`}
                        value="false"
                        checked={answers[currentQuestion] === 'false'}
                        onChange={(e) => handleAnswerChange(currentQuestion, e.target.value)}
                        className="sr-only"
                        disabled={submitted}
                      />
                      <div className="text-center">
                        <svg className="w-8 h-8 mx-auto mb-2 text-trading-down" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className={`font-bold text-lg ${
                          answers[currentQuestion] === 'false' ? 'text-trading-down' : 'text-on-dark'
                        }`}>False</span>
                        {answers[currentQuestion] === 'false' && (
                          <span className="text-xs bg-trading-down/10 text-trading-down px-2 py-1 rounded-full font-medium mt-2 block">Your Choice</span>
                        )}
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0 || submitted}
                className="group px-6 py-3 border border-hairline-on-dark text-on-dark rounded-md hover:bg-surface-elevated-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center"
              >
                <svg className="w-4 h-4 mr-2 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              {currentQuestion < quiz.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestion(currentQuestion + 1)}
                  disabled={submitted}
                  className="group px-6 py-3 bg-primary text-on-primary rounded-md hover:bg-primary-active transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5 5v4m0 0l-5-5m5 5v4" />
                  </svg>
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitted || Object.keys(answers).length < quiz.questions.length}
                  className="group px-6 py-3 bg-primary text-on-primary rounded-md hover:bg-primary-active transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Submit Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
