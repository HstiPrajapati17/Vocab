const BASE_URL = 'http://localhost:3001';

// ===== AUTH =====

export const loginUser = async (email, password) => {
  const res = await fetch(`${BASE_URL}/users?email=${encodeURIComponent(email)}`);
  const users = await res.json();
  const user = users.find(u => u.password === password);
  if (!user) throw new Error('Invalid email or password');
  return user;
};

export const registerUser = async (name, email, password, language, level, dailyGoal) => {
  // Check if email exists
  const checkRes = await fetch(`${BASE_URL}/users?email=${encodeURIComponent(email)}`);
  const existing = await checkRes.json();
  if (existing.length > 0) throw new Error('Email already registered');

  const newUser = {
    name,
    email,
    password,
    avatar: '🧑‍💻',
    xp: 0,
    streak: 0,
    hearts: 5,
    language: language || 'Spanish',
    level: level || 'Beginner',
    dailyGoal: dailyGoal || 'Regular',
    completedLessons: [],
    activeLesson: 1,
    joinedDate: new Date().toISOString().split('T')[0],
  };

  const res = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newUser),
  });
  return res.json();
};

export const updateUser = async (userId, updates) => {
  const res = await fetch(`${BASE_URL}/users/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  return res.json();
};

// ===== LESSONS =====

export const getLessons = async (language = 'English') => {
  const res = await fetch(`${BASE_URL}/lessons?language=${encodeURIComponent(language)}`);
  return res.json();
};

// ===== QUESTIONS =====

export const getQuestionsByLesson = async (lessonId) => {
  const res = await fetch(`${BASE_URL}/questions?lessonId=${lessonId}`);
  const data = await res.json();
  return data;
};

// ===== LEADERBOARD =====

export const getLeaderboard = async () => {
  const res = await fetch(`${BASE_URL}/leaderboard`);
  const data = await res.json();
  return data.sort((a, b) => b.xp - a.xp).map((entry, i) => ({ ...entry, rank: i + 1 }));
};

export const updateLeaderboard = async (userId, xp, streak) => {
  const res = await fetch(`${BASE_URL}/leaderboard?userId=${userId}`);
  const entries = await res.json();
  if (entries.length > 0) {
    const entry = entries[0];
    await fetch(`${BASE_URL}/leaderboard/${entry.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ xp, streak }),
    });
  }
};

// ===== ACHIEVEMENTS =====

export const getAchievements = async () => {
  const res = await fetch(`${BASE_URL}/achievements`);
  return res.json();
};

// ===== USER ACTIVITY =====

export const getUserActivity = async (userId) => {
  const res = await fetch(`${BASE_URL}/userActivity?userId=${userId}`);
  const data = await res.json();
  return data.length > 0 ? data[0] : null;
};

// ===== LEVEL THRESHOLDS =====

export const getLevelThresholds = async () => {
  const res = await fetch(`${BASE_URL}/levelThresholds`);
  return res.json();
};

// ===== LESSON PROGRESS =====

export const getLessonProgress = async (userId) => {
  const res = await fetch(`${BASE_URL}/lessonProgress?userId=${userId}`);
  return res.json();
};

// ===== SINGLE LESSON =====

export const getLessonById = async (lessonId) => {
  const res = await fetch(`${BASE_URL}/lessons/${lessonId}`);
  return res.json();
};

// ===== LANGUAGES =====

export const getLanguages = async () => {
  const res = await fetch(`${BASE_URL}/languages`);
  return res.json();
};

// ===== HOME PAGE DATA =====

export const getHomeFeatures = async () => {
  const res = await fetch(`${BASE_URL}/homeFeatures`);
  return res.json();
};

export const getHomeSteps = async () => {
  const res = await fetch(`${BASE_URL}/homeSteps`);
  return res.json();
};

export const getHomeStats = async () => {
  const res = await fetch(`${BASE_URL}/homeStats`);
  return res.json();
};

// ===== QUESTS =====

export const getQuests = async () => {
  const res = await fetch(`${BASE_URL}/quests`);
  return res.json();
};

// ===== SHOP ITEMS =====

export const getShopItems = async () => {
  const res = await fetch(`${BASE_URL}/shopItems`);
  return res.json();
};

// ===== LEAGUES =====

export const getLeagues = async () => {
  const res = await fetch(`${BASE_URL}/leagues`);
  return res.json();
};

// ===== BLOG =====

export const getBlogPosts = async () => {
  const res = await fetch(`${BASE_URL}/blogPosts`);
  return res.json();
};

export const getBlogFilters = async () => {
  const res = await fetch(`${BASE_URL}/blogFilters`);
  return res.json();
};

export const getFeaturedPost = async () => {
  const res = await fetch(`${BASE_URL}/featuredPost`);
  return res.json();
};

export const getBlogHeroStats = async () => {
  const res = await fetch(`${BASE_URL}/blogHeroStats`);
  return res.json();
};

// ===== UNITS (Dashboard) =====

export const getUnits = async () => {
  const res = await fetch(`${BASE_URL}/units`);
  return res.json();
};

// ===== ALPHABETS =====

export const getAlphabets = async () => {
  const res = await fetch(`${BASE_URL}/alphabets`);
  return res.json();
};

export const getAlphabetByLanguage = async (language) => {
  const res = await fetch(`${BASE_URL}/alphabets?language=${encodeURIComponent(language)}`);
  const data = await res.json();
  return data.length > 0 ? data[0] : null;
};

// ===== ABOUT US =====

export const getTeamMembers = async () => {
  const res = await fetch(`${BASE_URL}/teamMembers`);
  return res.json();
};

export const getAboutFeatures = async () => {
  const res = await fetch(`${BASE_URL}/aboutFeatures`);
  return res.json();
};

export const getAboutStats = async () => {
  const res = await fetch(`${BASE_URL}/aboutStats`);
  return res.json();
};

export const getTimeline = async () => {
  const res = await fetch(`${BASE_URL}/timeline`);
  return res.json();
};

// ===== LANGUAGE SELECT / ONBOARDING =====

export const getLevels = async () => {
  const res = await fetch(`${BASE_URL}/levels`);
  return res.json();
};

export const getDailyGoals = async () => {
  const res = await fetch(`${BASE_URL}/dailyGoals`);
  return res.json();
};

// ===== INSIGHTS =====

export const getInsightSkills = async () => {
  const res = await fetch(`${BASE_URL}/insightSkills`);
  return res.json();
};

export const getInsightAchievements = async () => {
  const res = await fetch(`${BASE_URL}/insightAchievements`);
  return res.json();
};

export const getLessonMeta = async () => {
  const res = await fetch(`${BASE_URL}/lessonMeta`);
  return res.json();
};
