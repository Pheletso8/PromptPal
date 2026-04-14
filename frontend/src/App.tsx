import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import LandingPage from './features/User/landing/pages/landingPage';
import AuthPage from './features/User/landing/pages/AuthPage';
import HomePage from './features/User/home/pages/HomePage';
import CourseDetail from './features/User/chapters/pages/CourseDetails';
import LeaderboardPage from './features/User/Leaderboard/pages/LeaderBoardPage';
import ChatPage from './features/User/AI_chatbot/UiPage/ChatPage';
import ProfilePage from './features/User/home/pages/ProfilePage';
import AdminDashboard from './features/admin/pages/AdminDashboard';
import ManageCourses from './features/admin/pages/ManageCourses';
import UserDirectory from './features/Admin/pages/UserDirectory';
import PlatformConfig from './features/Admin/pages/PlatformConfig';

/**
 * ProtectedRoute — Redirects to /auth if the user is not logged in.
 * While auth state is loading (token being verified), shows nothing to
 * avoid a flash of the login page for returning users.
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
  return user ? <>{children}</> : <Navigate to="/auth" replace />;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  return user?.role === 'admin' ? <>{children}</> : <Navigate to="/home" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected routes — require login */}
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/course/:id" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
        <Route path="/ai-chatbot" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/courses" element={<AdminRoute><ManageCourses /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><UserDirectory /></AdminRoute>} />
        <Route path="/admin/config" element={<AdminRoute><PlatformConfig /></AdminRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;