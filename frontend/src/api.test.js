import { getQuestionsByLesson, recordLessonCompletion, updateUser } from './api';

const response = (body) => ({
  ok: true,
  json: async () => body,
});

beforeEach(() => {
  localStorage.setItem('token', 'test-token');
});

afterEach(() => {
  delete global.fetch;
  localStorage.clear();
});

test('persists the selected language without sending a progress reset', async () => {
  global.fetch = jest.fn(async (url, options = {}) => {
    if (url.endsWith('/user/updateProfile')) {
      expect(JSON.parse(options.body)).toEqual({
        onboarding: { languageToLearn: 'Italian' },
      });
      return response({ success: true, result: {} });
    }
    if (url.endsWith('/auth/me')) {
      return response({
        success: true,
        result: {
          id: 'user-1',
          onboarding: { languageToLearn: 'Italian' },
          completedLessons: ['lesson-1'],
        },
      });
    }
    if (url.endsWith('/user/getAnalytics')) {
      return response({ success: true, result: { completedLessons: [] } });
    }
    throw new Error(`Unexpected request: ${url}`);
  });

  const updatedUser = await updateUser('user-1', { language: 'Italian' });

  expect(updatedUser.onboarding.languageToLearn).toBe('Italian');
  expect(updatedUser.completedLessons).toEqual(['lesson-1']);
});

test('uploads a profile image as multipart form data', async () => {
  const image = new Blob(['image data'], { type: 'image/jpeg' });
  global.fetch = jest.fn(async (url, options = {}) => {
    if (url.endsWith('/user/updateProfile')) {
      expect(options.body).toBeInstanceOf(FormData);
      expect(options.body.get('avatar')).toBeTruthy();
      expect(options.headers['Content-Type']).toBeUndefined();
      return response({ success: true, result: {} });
    }
    if (url.endsWith('/auth/me')) {
      return response({
        success: true,
        result: { id: 'user-1', avatarUrl: 'https://example.com/avatar.jpg' },
      });
    }
    if (url.endsWith('/user/getAnalytics')) {
      return response({ success: true, result: { completedLessons: [] } });
    }
    throw new Error(`Unexpected request: ${url}`);
  });

  const updatedUser = await updateUser('user-1', { avatar: image });

  expect(updatedUser.avatarUrl).toBe('https://example.com/avatar.jpg');
});

test('uses one backend question for each lesson level', async () => {
  const questions = Array.from({ length: 5 }, (_, id) => ({
    id,
    text: `Question ${id}`,
    rightAnswer: 'correct',
    options: ['incorrect', 'correct'],
  }));
  global.fetch = jest.fn(async () => response({ success: true, result: questions }));

  const result = await getQuestionsByLesson('lesson-1');
  expect(result).toHaveLength(1);
  expect(result[0]).toMatchObject({
    id: 0,
    question: 'Question 0',
    options: ['incorrect', 'correct'],
    correct: 1,
  });
});

test('stores lesson completion with its language', async () => {
  const requests = [];
  global.fetch = jest.fn(async (url, options = {}) => {
    requests.push({ url, options });
    if (url.endsWith('/auth/me')) {
      return response({ success: true, result: { id: 'user-1', onboarding: { languageToLearn: 'Italian' } } });
    }
    if (url.endsWith('/user/updateAnalytics')) return response({ success: true, result: {} });
    if (url.endsWith('/user/updateProfile')) return response({ success: true, result: {} });
    if (url.endsWith('/user/getAnalytics')) return response({ success: true, result: { completedLessons: [] } });
    throw new Error(`Unexpected request: ${url}`);
  });

  await recordLessonCompletion('user-1', {
    lessonId: 'lesson-1',
    score: 100,
    hearts: 5,
    language: 'Italian',
  });

  const progressRequest = requests.find(({ url }) => url.endsWith('/user/updateAnalytics'));
  expect(JSON.parse(progressRequest.options.body)).toMatchObject({
    journeyLessonId: 'lesson-1',
    languageToLearn: 'Italian',
    status: 'completed',
  });
});
