import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth APIs
export const login = (credentials) => {
  console.log("Login credentials received:", credentials);
  const requestData = {
    usernameOrEmail: credentials.email,
    password: credentials.password,
  };
  console.log("Login request data:", requestData);
  return api.post("/auth/login", requestData);
};
export const signup = (userData) => api.post("/auth/signup", userData);

// User APIs
export const getCurrentUser = () => api.get("/users/me");
export const updateUser = (userId, userData) =>
  api.put(`/users/${userId}`, userData);

// Course APIs
export const getCourses = () => api.get("/modules");
export const getModuleById = (moduleId, userId) => {
  return api.get(`/modules/${moduleId}`, {
    headers: {
      "User-Id": userId,
    },
  });
};
export const createCourse = (courseData) => api.post("/modules", courseData);
export const updateCourse = (courseId, courseData) =>
  api.put(`/modules/${courseId}`, courseData);
export const deleteCourse = (courseId) => api.delete(`/modules/${courseId}`);

// Progress APIs
export const getProgress = (userId) => api.get(`/progress/${userId}`);
export const updateProgress = (userId, progressData) =>
  api.put(`/progress/${userId}`, progressData);
export const getAllUserProgress = () => api.get("/progress/all");

export const completeSubModule = (userId, moduleId, subModuleId) => {
  return api.post(
    `/progress/${userId}/module/${moduleId}/submodule/${subModuleId}/complete`
  );
};

// Trainee APIs
export const getTraineeStats = (userId) => api.get(`/trainees/${userId}/stats`);
export const getTraineeAchievements = (userId) =>
  api.get(`/trainees/${userId}/achievements`);
export const getTraineeModules = (userId) =>
  api.get(`/trainees/${userId}/modules`);

// Leaderboard APIs
export const getLeaderboardData = () => api.get("/leaderboard");

// Quiz APIs
export const getQuizById = (quizId) => api.get(`/quizzes/${quizId}`);
export const getQuizzesByModuleId = (moduleId) =>
  api.get(`/quizzes/module/${moduleId}`);
export const submitQuiz = (userId, submissionData) =>
  api.post(`/quizzes/submit`, submissionData);

// Trainer Dashboard APIs (Placeholders - requires backend implementation)
export const getTrainerDashboardStats = () => {
  console.log("Calling actual getTrainerDashboardStats API");
  return api.get("/trainer/dashboard/stats");
};

export const getRecentTrainees = () => {
  console.log("Calling actual getRecentTrainees API");
  return api.get("/trainer/dashboard/recent-trainees");
};

export default api;
