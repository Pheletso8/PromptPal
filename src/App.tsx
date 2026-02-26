import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './features/User/landing/pages/landingPage';
import HomePage from "./features/User/home/pages/HomePage";
import CourseDetail from "./features/User/chapters/pages/CourseDetails";
import LeaderboardPage from './features/User/Leaderboard/pages/LeaderBoardPage';
import ChatPage from './features/User/AI_chatbot/UiPage/ChatPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* The main landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* The student dashboard/home */}
        <Route path="/home" element={<HomePage />} />

        {/* Dynamic route for courses using an ID */}
        <Route path="/course/:id" element={<CourseDetail />} />

        {/*LeaderBoard Page*/}
        <Route path="/leaderboard" element={<LeaderboardPage />} />

        {/*AI chatbot page*/}
        <Route path="/ai-chatbot" element={<ChatPage />} />
        
        {/* Optional: Catch-all route to redirect back to landing if path not found */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;