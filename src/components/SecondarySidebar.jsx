import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function SecondarySidebar({ modules, handleLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const activeModule = location.pathname.split('/')[1] || 'settings';
  const module = modules.find((m) => m.id === activeModule);
  const [width, setWidth] = useState(localStorage.getItem('sidebarWidth') || 256);
  const [isResizing, setIsResizing] = useState(false);
  const iconMap = {
    'fa-users': (
      <svg className="h-5 w-5 fill-current mr-2" viewBox="0 0 24 24">
        <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
    ),
    'fa-cog': (
      <svg className="h-5 w-5 fill-current mr-2" viewBox="0 0 24 24">
        <path d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 0 1-.517.608 7.45 7.45 0 0 0-.478.198.798.798 0 0 1-.796-.064l-.453-.324a1.875 1.875 0 0 0-2.416.2l-.243.243a1.875 1.875 0 0 0-.2 2.416l.324.453a.798.798 0 0 1 .064.796 7.448 7.448 0 0 0-.198.478.798.798 0 0 1-.608.517l-.55.092a1.875 1.875 0 0 0-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.099.266.123.559.198.478a.798.798 0 0 1 .796.064l.453.324c.802.573 1.869.572 2.416-.2l.243-.243c.573-.802.572-1.869-.2-2.416l-.324-.453a.798.798 0 0 1-.064-.796c.075-.319.099-.612.198-.478a.798.798 0 0 1 .608-.517l.55-.092a1.875 1.875 0 0 0 1.566-1.849v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 0 1-.608-.517 7.507 7.507 0 0 0-.198-.478.798.798 0 0 1-.064-.796l.324-.453a1.875 1.875 0 0 0 .2-2.416l-.243-.243a1.875 1.875 0 0 0-2.416-.2l-.453.324a.798.798 0 0 1-.796.064 7.462 7.462 0 0 0-.478-.198.798.798 0 0 1-.517-.608l-.091-.549c-.15-.904-.934-1.567-1.85-1.567zm.172 2.828c.523 0 .972.378 1.057.894l.091.548c.099.595.573 1.068 1.168 1.167.294.049.58.123.854.22.523.187.784.717.624 1.208l-.324.453c-.336.47-.272 1.104.149 1.486.294.267.543.568.727.894.336.595.955.894 1.578.894h.344c.523 0 .972.378 1.057.894l.091.549c.099.595.573 1.068 1.168 1.167.294.049.58.123.854.22.523.187.784.717.624 1.208l-.324.453c-.336.47-.272 1.104.149 1.486.294.267.543.568.727.894.336.595.955.894 1.578.894h.344c.523 0 .972.378 1.057.894l.091.549c.099.595.573 1.068 1.168 1.167.294.049.58.123.854.22.523.187.784.717.624 1.208l-.324.453c-.336.47-.272 1.104.149 1.486.294.267.543.568.727.894.336.595.955.894 1.578.894h.344c.523 0 .972.378 1.057.894l.091.549c.099.595.573 1.068 1.168 1.167.294.049.58.123.854.22.523.187.784.717.624 1.208l-.324.453c-.336.47-.272 1.104.149 1.486.294.267.543.568.727.894.336.595.955.894 1.578.894h.344c.523 0 .972.378 1.057.894l.091.549c.15.904.934 1.567 1.85 1.567s1.699-.663 1.85-1.567l.091-.549c.099-.595.573-1.068 1.168-1.167.294-.049.58-.123.854-.22.523-.187.784-.717.624-1.208l-.324-.453c-.336-.47-.272-1.104.149-1.486.294-.267.543-.568.727-.894.336-.595.955-.894 1.578-.894h.344c.523 0 .972-.378 1.057-.894l.091-.549c.099-.595.573-1.068 1.168-1.167.294-.049.58-.123.854-.22.523-.187.784-.717.624-1.208l-.324-.453c-.336-.47-.272-1.104.149-1.486.294-.267.543-.568.727-.894.336-.595.955-.894 1.578-.894h.344c.523 0 .972-.378 1.057-.894l.091-.549c.099-.595.573-1.068 1.168-1.167.294-.049.58-.123.854-.22.523-.187.784-.717.624-1.208l-.324-.453c-.336-.47-.272-1.104.149-1.486.294-.267.543-.568.727-.894.336-.595.955-.894 1.578-.894h.344c.523 0 .972-.378 1.057-.894l.091-.549c.15-.904.934-1.567 1.85-1.567zm-7.828 1.172a4.125 4.125 0 1 1 0 8.25 4.125 4.125 0 0 1 0-8.25zm0 1.5a2.625 2.625 0 1 0 0 5.25 2.625 2.625 0 0 0 0-5.25z"/>
      </svg>
    ),
    'fa-sliders-h': (
      <svg className="h-5 w-5 fill-current mr-2" viewBox="0 0 24 24">
        <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2h-4V9h-2v6h2v-2h4zm-6-4h-2v2h2v2h2V9h-2z"/>
      </svg>
    ),
    'fa-handshake': (
      <svg className="h-5 w-5 fill-current mr-2" viewBox="0 0 24 24">
        <path d="M16.5 8.5H14l-2-2 2-2h2.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5zm-5 0H9l-2-2 2-2h2.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5zm6 3.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-1.5 4.5-4.5 4.5h-9c-3 0-4.5-3.67-4.5-4.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5h3c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5h3zm-9 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm6 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
      </svg>
    ),
    'fa-tasks': (
      <svg className="h-5 w-5 fill-current mr-2" viewBox="0 0 24 24">
        <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
      </svg>
    ),
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizing) {
        const newWidth =
          e.clientX - document.getElementById('secondary-sidebar').getBoundingClientRect().left;
        if (newWidth >= 200 && newWidth <= 400) {
          setWidth(newWidth);
          localStorage.setItem('sidebarWidth', newWidth);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = 'default';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div
      id="secondary-sidebar"
      className="bg-sam-secondary text-white h-screen p-4 flex flex-col"
      style={{ width: `${width}px` }}
      onMouseDown={(e) => {
        if (e.target.id === 'secondary-sidebar' && e.offsetX > width - 10) {
          setIsResizing(true);
          document.body.style.cursor = 'ew-resize';
        }
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">SAM CRM</h1>
        <button
          onClick={handleLogout}
          className="text-sm bg-sam-accent text-white px-2 py-1 rounded hover:bg-sam-primary"
        >
          Logout
        </button>
      </div>
      <h3 className="text-sm font-semibold mb-2">{module ? module.name : 'Unknown'}</h3>
      <ul id="sub-links" className="space-y-1">
        {module?.subSections.map((link) => {
          const Icon = iconMap[link.icon] || iconMap['fa-cog'];
          return (
            <li key={link.id}>
              <button
                onClick={() => navigate(`/${activeModule}/${link.id}`)}
                className="w-full text-left py-1 px-2 rounded hover:bg-sam-primary flex items-center"
              >
                {Icon}
                {link.name}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default SecondarySidebar;