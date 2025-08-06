import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import PrimarySidebar from './components/PrimarySidebar';
import SecondarySidebar from './components/SecondarySidebar';
import Content from './components/Content';
import { dummyData } from './data/dummyData';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [sessionTimeout] = useState(86400000);
  const navigate = useNavigate();
  const location = useLocation();
  const [modules] = useState(dummyData.modules);

  const checkSession = () => {
    const session = localStorage.getItem('sam_crm_session');
    if (session) {
      const { user, loginTimestamp } = JSON.parse(session);
      const now = new Date().getTime();
      if (now - loginTimestamp < sessionTimeout) {
        setCurrentUser(user);
        if (location.pathname === '/') navigate('/settings/user-management');
      } else {
        localStorage.removeItem('sam_crm_session');
        navigate('/');
      }
    }
  };

  return (
    <div>
      {!currentUser ? (
        <Login setCurrentUser={setCurrentUser} checkSession={checkSession} />
      ) : (
        <div className="flex h-screen">
          <PrimarySidebar modules={modules} />
          <SecondarySidebar modules={modules} handleLogout={() => {
            localStorage.removeItem('sam_crm_session');
            setCurrentUser(null);
            navigate('/');
          }} />
          <Content currentUser={currentUser} />
        </div>
      )}
    </div>
  );
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
