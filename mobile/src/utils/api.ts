import * as SecureStore from 'expo-secure-store';

const BASE = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/$/, '') + '/api';

const TOKEN_KEY = 'promptpal_token';

export const getToken = () => SecureStore.getItemAsync(TOKEN_KEY);
export const setToken = (t: string) => SecureStore.setItemAsync(TOKEN_KEY, t);
export const removeToken = () => SecureStore.deleteItemAsync(TOKEN_KEY);

const authHeaders = async () => {
  const token = await getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

async function handleRes<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  stars: number;
  assessmentsPassed: number;
  profileImage?: string;
  token?: string;
}

export interface CourseTemplate {
  _id?: string;
  title: string;
  prompt: string;
  icon: string;
}

export interface Assessment {
  question: string;
  options: string[];
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  tag: string;
  image?: string;
  passingThreshold: number;
  templates: CourseTemplate[];
  assessments: Assessment[];
  assessment?: Assessment;
  whyLearn?: string;
  lessonTopic?: string;
  videoUrl?: string;
}

export interface AssessmentResult {
  passed: boolean;
  score: number;
  message: string;
  stars: number;
  locked?: boolean;
  attempts?: number;
  corrections?: { questionIndex: number; yourAnswer: string }[];
}

export const api = {
  login: async (email: string, password: string): Promise<AuthUser> => {
    const res = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleRes<AuthUser>(res);
  },

  register: async (name: string, email: string, password: string): Promise<AuthUser> => {
    const res = await fetch(`${BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    return handleRes<AuthUser>(res);
  },

  getProfile: async (): Promise<AuthUser> => {
    const headers = await authHeaders();
    const res = await fetch(`${BASE}/auth/me`, { headers });
    return handleRes<AuthUser>(res);
  },

  updateProfile: async (data: Partial<AuthUser>): Promise<AuthUser> => {
    const headers = await authHeaders();
    const res = await fetch(`${BASE}/auth/profile`, {
      method: 'PUT', headers, body: JSON.stringify(data),
    });
    return handleRes<AuthUser>(res);
  },

  getAssignedCourses: async (): Promise<Course[]> => {
    const headers = await authHeaders();
    const res = await fetch(`${BASE}/courses/assigned`, { headers });
    return handleRes<Course[]>(res);
  },

  getCourseById: async (id: string): Promise<Course> => {
    const headers = await authHeaders();
    const res = await fetch(`${BASE}/courses/${id}`, { headers });
    return handleRes<Course>(res);
  },

  submitAssessment: async (courseId: string, answers: string[]): Promise<AssessmentResult> => {
    const headers = await authHeaders();
    const res = await fetch(`${BASE}/assessments/submit`, {
      method: 'POST', headers, body: JSON.stringify({ courseId, answers }),
    });
    return handleRes<AssessmentResult>(res);
  },

  getLeaderboard: async (): Promise<any[]> => {
    const headers = await authHeaders();
    const res = await fetch(`${BASE}/leaderboard`, { headers });
    return handleRes<any[]>(res);
  },
};
