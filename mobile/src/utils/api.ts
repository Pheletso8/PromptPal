import * as SecureStore from 'expo-secure-store';

const LOCAL_BASE = (process.env.EXPO_PUBLIC_LOCAL_API_URL || '').replace(/\/$/, '') + '/api';
const REMOTE_BASE = (process.env.EXPO_PUBLIC_REMOTE_API_URL || '').replace(/\/$/, '') + '/api';

export let BASE = LOCAL_BASE;
let initPromise: Promise<void> | null = null;

export const initApi = async () => {
  if (initPromise) return initPromise;
  
  initPromise = (async () => {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${LOCAL_BASE}/status`, { signal: controller.signal });
      clearTimeout(id);
      if (!res.ok) throw new Error();
      BASE = LOCAL_BASE;
      console.log('[API] Using LOCAL backend:', BASE);
    } catch (e) {
      BASE = REMOTE_BASE;
      console.log('[API] Using REMOTE backend (fallback):', BASE);
    }
  })();
  
  return initPromise;
};

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
    const errMsg = body.message || `HTTP ${res.status}`;
    console.error(`[API Error] ${res.url}: ${errMsg}`);
    throw new Error(errMsg);
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
    await initApi();
    const res = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleRes<AuthUser>(res);
  },

  register: async (name: string, email: string, password: string): Promise<AuthUser> => {
    await initApi();
    const res = await fetch(`${BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    return handleRes<AuthUser>(res);
  },

  getProfile: async (): Promise<AuthUser> => {
    await initApi();
    const headers = await authHeaders();
    const res = await fetch(`${BASE}/auth/profile`, { headers });
    return handleRes<AuthUser>(res);
  },

  getPublicConfig: async (): Promise<any> => {
    await initApi();
    const res = await fetch(`${BASE}/config/public`);
    return handleRes<any>(res);
  },

  updateProfile: async (data: Partial<AuthUser>): Promise<AuthUser> => {
    await initApi();
    const headers = await authHeaders();
    const res = await fetch(`${BASE}/auth/profile`, {
      method: 'PUT', headers, body: JSON.stringify(data),
    });
    return handleRes<AuthUser>(res);
  },

  getAssignedCourses: async (): Promise<Course[]> => {
    await initApi();
    const headers = await authHeaders();
    const res = await fetch(`${BASE}/courses/my-courses`, { headers });
    return handleRes<Course[]>(res);
  },

  getCourseById: async (id: string): Promise<Course> => {
    await initApi();
    const headers = await authHeaders();
    const res = await fetch(`${BASE}/courses/${id}`, { headers });
    return handleRes<Course>(res);
  },

  submitAssessment: async (courseId: string, answers: string[]): Promise<AssessmentResult> => {
    await initApi();
    const headers = await authHeaders();
    const res = await fetch(`${BASE}/assessments/submit`, {
      method: 'POST', headers, body: JSON.stringify({ courseId, answers }),
    });
    return handleRes<AssessmentResult>(res);
  },

  getLeaderboard: async (): Promise<any[]> => {
    await initApi();
    const headers = await authHeaders();
    const res = await fetch(`${BASE}/leaderboard`, { headers });
    return handleRes<any[]>(res);
  },
};
