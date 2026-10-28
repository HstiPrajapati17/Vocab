const configuredApiUrl = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');
const BASE_URL = /\/api$/i.test(configuredApiUrl) ? configuredApiUrl : `${configuredApiUrl}/api`;

const request = async (path, options = {}) => {
  const headers = { ...(options.body && !(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}), ...options.headers };
  const token = localStorage.getItem('token');
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => null);
  if (!response.ok || data?.success === false) {
    const error = new Error(data?.message || data?.error || `Request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return data;
};
const resultOf = (data) => data?.result ?? data;
const getContent = async (key) => resultOf(await request(`/content/${encodeURIComponent(key)}`));
const userOf = (data) => {
  const result = resultOf(data);
  return result?.user ?? result;
};
const authResult = (data) => {
  const result = resultOf(data) || {};
  if (result.token) localStorage.setItem('token', result.token);
  return userOf(data);
};
const query = (params) => new URLSearchParams(params).toString();

export const loginUser = async (email, password) => {
  authResult(await request('/auth/login', { method: 'POST', body: JSON.stringify({ email: email.trim(), password }) }));
  return getUser();
};
export const registerUser = async (name, email, password, language, level, dailyGoal, nativeLanguage, goal, commitment, interests) => authResult(await request('/auth/register', {
  method: 'POST', body: JSON.stringify({ name, email, password, onboarding: {
    languageToLearn: language || 'Spanish', learningLevel: level || 'Beginner',
    dailyTimeCommitment: dailyGoal || '15 minutes', nativeLanguage: nativeLanguage || 'English',
    learningGoals: Array.isArray(goal) ? goal : goal ? [goal] : [], bestTimeToStudy: commitment || 'Morning', interests: interests || [],
  } }),
}));
export const getUser = async () => {
  const user = userOf(await request('/auth/me'));
  try {
    const analytics = resultOf(await request('/user/getAnalytics'));
    if (Array.isArray(analytics?.completedLessons)) {
      const fromAnalytics = analytics.completedLessons
        .filter((lesson) => lesson.status === 'completed')
        .map((lesson) => String(lesson.journeyLessonId || lesson.lessonId));
      const fromUser = (user.completedLessons || []).map((lesson) => String(lesson?.journeyLessonId || lesson?.lessonId || lesson));
      user.completedLessons = [...new Set([...fromUser, ...fromAnalytics])];
    }
  } catch { /* Profile remains available if analytics has not been initialized. */ }
  return user;
};
export const logoutUser = async () => { try { await request('/auth/logout', { method: 'POST' }); } finally { localStorage.removeItem('token'); } };
// The API intentionally does not expose user lookup by email. The authenticated
// profile endpoint is the source of truth for session restoration.
export const getUserByEmail = async (email) => {
  if (!email || !localStorage.getItem('token')) return null;
  const user = await getUser();
  return user?.email?.toLowerCase() === email.trim().toLowerCase() ? user : null;
};
export const updateUser = async (_userId, updates = {}) => {
  const body = { ...updates };
  if (Object.hasOwn(body, 'avatar')) { body.avatarUrl = body.avatar; delete body.avatar; }
  const settings = body.settings;
  delete body.settings;
  if (settings) await request('/user/updateSettings', { method: 'PATCH', body: JSON.stringify({
    notifications: {
      status: settings.notifications,
      dailyPracticeReminder: settings.dailyReminder,
      dailyReminderTime: settings.dailyReminderTime,
      weeklyProgressSummary: settings.showProgress,
    },
    preferences: { soundEffects: settings.soundEffects, listeningExercises: settings.autoPlay },
  }) });
  const onboarding = { ...(body.onboarding || {}) };
  if (body.language !== undefined) onboarding.languageToLearn = body.language;
  if (body.level !== undefined) onboarding.learningLevel = body.level;
  if (body.dailyGoal !== undefined) onboarding.dailyTimeCommitment = body.dailyGoal;
  delete body.language; delete body.level; delete body.dailyGoal;
  if (Object.keys(onboarding).length) body.onboarding = onboarding;
  if (Object.keys(body).length) {
    if (typeof body.avatarUrl === 'string' && body.avatarUrl.startsWith('data:')) {
      const blob = await (await fetch(body.avatarUrl)).blob();
      const form = new FormData();
      for (const [key, value] of Object.entries(body)) {
        if (key !== 'avatarUrl') form.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
      }
      form.append('avatar', blob, 'profile-image.png');
      await request('/user/updateProfile', { method: 'PATCH', body: form });
    } else {
      await request('/user/updateProfile', { method: 'PATCH', body: JSON.stringify(body) });
    }
  }
  return getUser();
};
export const deleteUserAccount = async () => { const data = await request('/user/deleteAccount', { method: 'DELETE' }); localStorage.removeItem('token'); return resultOf(data); };
export const resetUserProgress = async (userId) => {
  const journey = resultOf(await request(`/user/getUserJourney?${query({ userId })}`)) || [];
  const topics = Array.isArray(journey) ? journey : journey.journey || journey.topics || [];
  const lessons = topics.flatMap((topic) => topic.lessons || []);
  await Promise.all(lessons.map((lesson) => request(`/user/resetLessonCompletion/${encodeURIComponent(lesson._id || lesson.id)}`, { method: 'POST' })));
  return updateUser(userId, { streakDays: 0, completedLessons: [], lastPracticedDate: null });
};

const optionList = (items = []) => items.map((item) => {
  const name = item.name || item.title || item.label || String(item);
  return { ...item, name, title: name, id: item.id || item._id || name, native: item.native || name, flagImg: item.flagImg || item.image };
});
export const getOnboardingOptions = async () => {
  const data = resultOf(await request('/onboarding/options')) || {};
  const toOptions = (items = []) => optionList(items.map((item) => typeof item === 'string' ? { name: item } : item));
  return {
    languages: toOptions(data.languagesToLearn || data.languages),
    nativeLanguages: toOptions(data.nativeLanguages),
    levels: toOptions(data.levels),
    goals: toOptions(data.learningGoals || data.goals),
    interests: toOptions(data.interests),
    commitments: toOptions(data.dailyTimeCommitments || data.commitments),
  };
};
export const getLanguages = async () => optionList(resultOf(await request('/onboarding/getLanguages')) || []);
export const getLevels = async () => optionList(resultOf(await request('/onboarding/getLevels')) || []);
export const getDailyGoals = async () => optionList(resultOf(await request('/onboarding/getCommitments')) || []);

const getJourney = async () => {
  const data = resultOf(await request('/user/getUserJourney'));
  return Array.isArray(data) ? data : data?.journey || data?.topics || [];
};
export const getUnits = async () => (await getJourney()).map((topic, index) => ({
  ...topic, id: topic._id || topic.id, title: topic.title || topic.name,
  sectionLabel: topic.category || `Section ${index + 1}`, color: topic.color || '#56b68b', emoji: topic.emoji || '📚',
}));
export const getLessons = async () => {
  const topics = await getJourney();
  return topics.flatMap((topic) => (topic.lessons || []).map((lesson) => ({
    ...lesson, id: lesson._id || lesson.id,
    unitId: lesson.journeyTopicId || topic._id || topic.id,
    topicId: topic._id || topic.id, unit: topic.title || topic.name,
  })));
};
export const getLessonById = async (lessonId) => (await getLessons()).find((item) => String(item.id) === String(lessonId)) || null;
export const getQuestionsByLesson = async (lessonId) => resultOf(await request(`/user/questionsByLesson/${encodeURIComponent(lessonId)}`));
export const recordLessonCompletion = async (_userId, { lessonId, score, hearts }) => {
  const fresh = await getUser();
  const lessonAlreadyDone = (fresh.completedLessons || []).some((item) => String(item?.journeyLessonId || item?.lessonId || item) === String(lessonId));
  await request('/user/updateAnalytics', { method: 'PATCH', body: JSON.stringify({ journeyLessonId: lessonId, status: 'completed', score }) });
  return updateUser(fresh.id || fresh._id, {
    hearts: hearts ?? fresh.hearts,
    completedLessons: lessonAlreadyDone ? fresh.completedLessons : [...(fresh.completedLessons || []), lessonId],
  });
};

export const getUserInsights = async () => {
  const data = resultOf(await request('/user/getInsights')) || {};
  const dayDates = [
    ...(data.monthlyCalendar?.days || []).filter((day) => day.isPracticed).map((day) => day.date),
    ...(data.streakCard?.weekDays || []).filter((day) => day.isPracticed).map((day) => day.date),
  ];
  const achievementDefinitions = (data.achievements?.list || []).map((achievement) => ({
    ...achievement,
    desc: achievement.description || achievement.desc,
    requiredCompleted: achievement.target || achievement.requiredCompleted || 1,
  }));
  const completedLessons = (data.completedLessons?.list || []).map((lesson) => ({
    ...lesson,
    lesson: { title: lesson.title, icon: lesson.image, type: lesson.difficulty, terms: lesson.termsCount },
  }));
  return {
    ...data,
    practicedDates: [...new Set(dayDates)],
    skillScores: Object.fromEntries(['speaking', 'listening', 'vocabulary'].map((key) => [key, data.skillTrends?.[key]?.score || 0])),
    achievementDefinitions,
    completedLessons,
  };
};
export const getLessonProgress = async () => {
  const data = resultOf(await request('/user/getAnalytics'));
  return data?.completedLessons || [];
};
export const getAchievements = () => getContent('achievements');
export const getHomeFeatures = () => getContent('homeFeatures');
export const getHomeSteps = () => getContent('homeSteps');
export const getHomeStats = () => getContent('homeStats');
export const getBlogPosts = () => getContent('blogPosts');
export const getBlogFilters = () => getContent('blogFilters');
export const getFeaturedPost = () => getContent('featuredPost');
export const getBlogHeroStats = () => getContent('blogHeroStats');
export const getAlphabets = () => getContent('alphabets');
export const getAlphabetByLanguage = async (language) => {
  const rows = await getContent('alphabets');
  return (rows || []).find((row) => row.language?.toLowerCase() === language?.toLowerCase()) || null;
};
export const getTeamMembers = () => getContent('teamMembers');
export const getAboutFeatures = () => getContent('aboutFeatures');
export const getAboutStats = () => getContent('aboutStats');
export const getTimeline = () => getContent('timeline');
export const getInsightSkills = () => getContent('insightSkills');
export const getInsightAchievements = () => getContent('insightAchievements');
export const getLessonMeta = () => getContent('lessonMeta');
export const getTermsConditions = async () => resultOf(await request('/getTermsConditions'));
export const getPrivacyPolicy = async () => resultOf(await request('/getAllPrivacyPolicy'));
export const getHelpCenter = async () => resultOf(await request('/getAllHelpCenter'));
export const getAppInfo = async () => resultOf(await request('/getAllAppInfo'));
export const getSubscriptionPlans = async () => resultOf(await request('/getAllSubscriptionPlans'));
export const getSubscriptionStatus = async () => resultOf(await request('/getMySubscriptionStatus'));
export const getUserSettings = async () => resultOf(await request('/user/getSettings'));
