import './App.css';
import { LoginPage } from './components/Login';
import { Navbar } from './components/Navbar';
import { Signup } from './components/Signup';
import './index.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { VideoRoom } from './components/VideoRoom';
import { HomePage } from './components/HomePage';

function AppContent() {
  const location = useLocation();

  // Define all routes where Navbar should be hidden
  const hideNavbarRoutes = ['/sacai/login','/sacai/signup'];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/sacai" />} />
        <Route path="/sacai" element={<HomePage />} />
        <Route path="/sacai/login" element={<LoginPage />} />
        <Route path="/sacai/signup" element={<Signup />} />
        <Route path="/room/:roomName" element={<VideoRoom />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
