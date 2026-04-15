/**
 * api.ts — Centralized API service layer
 *
 * Every backend request goes through here, keeping fetch logic out of components.
 * The Vite dev proxy (vite.config.ts) forwards /api/* to http://localhost:5000.
 */

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
// If API_URL is empty, use absolute path '/api' (relying on proxy in dev).
// Otherwise, ensure we don't end up with '//api' by checking if API_URL exists.
const BASE = API_URL ? `${API_URL}/api` : '/api';

// ─── Types ────────────────────────────────────────────────────────────────────
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

export interface Course {
  _id: string;
  title: string;
  tag: string;
  description?: string;
  image?: string;
  videoUrl?: string;
  whyLearn?: string;
  lessonTopic?: string;
  templates: CourseTemplate[];
  assessment?: {
    question: string;
    options: string[];
  };
  assessments?: {
    question: string;
    options: string[];
  }[];
}

export interface LeaderboardEntry {
  _id: string;
  name: string;
  stars: number;
  assessmentsPassed: number;
}

export interface AssessmentResult {
  passed: boolean;
  score: number;
  message: string;
  stars: number;
  attempts?: number;
  locked?: boolean;
  corrections?: {
    questionIndex: number;
    correctAnswer: string;
    yourAnswer: string;
  }[];
}

export type ProgressMap = Record<string, { score: number; passed: boolean }>;

// ─── Helper: get stored token ─────────────────────────────────────────────────
const getToken = () => localStorage.getItem('token');

// ─── Helper: build auth headers ──────────────────────────────────────────────
const authHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

// ─── Helper: parse response or throw error ────────────────────────────────────
async function handleRes<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((body as any).message || 'Request failed');
  return body as T;
}

// ─── API surface ──────────────────────────────────────────────────────────────
export const api = {

  // ── Auth ────────────────────────────────────────────────────────────────────

  /** Register a new user account */
  register: (name: string, email: string, password: string) =>
    fetch(`${BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    }).then(res => handleRes<AuthUser>(res)),

  /** Authenticate and receive a JWT */
  login: (email: string, password: string) =>
    fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(res => handleRes<AuthUser>(res)),

  /** Authenticate a staff/admin user separately */
  loginStaff: (email: string, password: string) =>
    fetch(`${BASE}/auth/staff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(res => handleRes<AuthUser>(res)),

  /** Fetch the current user's profile (uses stored token) */
  getProfile: () =>
    fetch(`${BASE}/auth/profile`, { headers: authHeaders() })
      .then(res => handleRes<AuthUser>(res)),

  /** Update the current user's profile */
  updateProfile: (profileData: { name?: string; email?: string; password?: string; profileImage?: string }) =>
    fetch(`${BASE}/auth/profile`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(profileData),
    }).then(res => handleRes<AuthUser>(res)),

  // ── Courses ─────────────────────────────────────────────────────────────────

  /** All available courses (for the home catalog) */
  getAllCourses: () =>
    fetch(`${BASE}/courses`, { headers: authHeaders() })
      .then(res => handleRes<Course[]>(res)),

  /** Only the courses assigned to the logged-in user */
  getMyCourses: () =>
    fetch(`${BASE}/courses/my-courses`, { headers: authHeaders() })
      .then(res => handleRes<Course[]>(res)),

  /** Single course detail by MongoDB _id */
  getCourseById: (id: string) =>
    fetch(`${BASE}/courses/${id}`, { headers: authHeaders() })
      .then(res => handleRes<Course>(res)),

  /** Map of courseId → { score, passed } for the logged-in user */
  getMyProgress: () =>
    fetch(`${BASE}/courses/my-progress`, { headers: authHeaders() })
      .then(res => handleRes<ProgressMap>(res)),

  // ── Assessments ─────────────────────────────────────────────────────────────

  /** Submit an assessment answer — backend checks against the correct answer */
  submitAssessment: (courseId: string, answers: string[]) =>
    fetch(`${BASE}/assessments/submit`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ courseId, answers }),
    }).then(res => handleRes<AssessmentResult>(res)),

  // ── Leaderboard ─────────────────────────────────────────────────────────────

  /** Top users sorted by assessmentsPassed, then stars */
  getLeaderboard: () =>
    fetch(`${BASE}/leaderboard`, { headers: authHeaders() })
      .then(res => handleRes<LeaderboardEntry[]>(res)),

  /** Get all users (Admin only) */
  getAllUsers: () =>
    fetch(`${BASE}/admin/users`, { headers: authHeaders() })
      .then(res => handleRes<any[]>(res)),

  /** Assign course to user (Admin only) */
  assignCourseToUser: (userId: string, courseId: string) =>
    fetch(`${BASE}/admin/assign-course`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ userId, courseId }),
    }).then(res => handleRes<any>(res)),

  /** Unassign course from user (Admin only) */
  unassignCourseFromUser: (userId: string, courseId: string) =>
    fetch(`${BASE}/admin/unassign-course`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ userId, courseId }),
    }).then(res => handleRes<any>(res)),

  // ── Admin ───────────────────────────────────────────────────────────────────

  /** Get stats for the admin dashboard */
  getAdminStats: () =>
    fetch(`${BASE}/admin/stats`, { headers: authHeaders() })
      .then(res => handleRes<any>(res)),


  /** Toggle user status (Admin only) */
  adminToggleUserStatus: (id: string) =>
    fetch(`${BASE}/admin/users/${id}/toggle`, { method: 'PUT', headers: authHeaders() })
      .then(res => handleRes<any>(res)),

  /** Delete a user (Admin only) */
  adminDeleteUser: (id: string) =>
    fetch(`${BASE}/admin/users/${id}`, { method: 'DELETE', headers: authHeaders() })
      .then(res => handleRes<any>(res)),

  /** Update a user (Admin only) */
  adminUpdateUser: (id: string, data: any) =>
    fetch(`${BASE}/admin/users/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(res => handleRes<any>(res)),

  /** Create a new course */
  adminCreateCourse: (courseData: any) =>
    fetch(`${BASE}/admin/courses`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(courseData),
    }).then(res => handleRes<Course>(res)),

  /** Update an existing course */
  adminUpdateCourse: (id: string, courseData: any) =>
    fetch(`${BASE}/admin/courses/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(courseData),
    }).then(res => handleRes<Course>(res)),

  /** Delete a course */
  adminDeleteCourse: (id: string) =>
    fetch(`${BASE}/admin/courses/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }).then(res => handleRes<{ message: string }>(res)),

  // ── Platform Config ──────────────────────────────────────────────────────────

  /** Get platform config */
  getConfig: () =>
    fetch(`${BASE}/config`, { headers: authHeaders() })
      .then(res => handleRes<any>(res)),

  /** Get public platform settings */
  getPublicConfig: () =>
    fetch(`${BASE}/config/public`)
      .then(res => handleRes<any>(res)),

  /** Update platform config */
  updateConfig: (data: any) =>
    fetch(`${BASE}/config`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(res => handleRes<any>(res)),
};
