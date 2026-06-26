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
  return res.json();
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
