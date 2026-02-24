import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './features/User/landing/pages/landingPage';
import HomePage from "./features/User/home/pages/HomePage";
import CourseDetail from "./features/User/chapters/pages/CourseDetails";

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
        
        {/* Optional: Catch-all route to redirect back to landing if path not found */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;