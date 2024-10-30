import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';
import BibleStudyForm from './pages/BibleStudyForm'
import BibleStudy from './pages/BibleStudy'
import UserProfile from './pages/UserProfile'
import Membership from './pages/Membership';
import Friends  from './pages/Friends';
import Invites from './pages/Invites';
function App() {
  return (
    <BrowserRouter>
    <div>
      <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/bibleStudy/new/:userId" element={<BibleStudyForm />} />
        <Route path="/bibleStudy/:bibleStudyId" element={<BibleStudy/>} />
        <Route path="/userProfile/:userId" element={<UserProfile/>} />
        <Route path="/friends/:bibleStudyId" element={<Friends/>} />
        <Route path="/membership/:bibleStudyId" element={<Membership/>} />
        <Route path="/invites/:bibleStudyId" element={<Invites/>} />
      </Routes> 
    </div>
  </BrowserRouter>
  );
}

export default App;
