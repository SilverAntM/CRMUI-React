import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dummyData } from '../data/dummyData';

function Login({ setCurrentUser, checkSession }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const user = dummyData.users.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      const userWithRole = {
        ...user,
        role: dummyData.roles.find((r) => r.id === user.roleId),
      };
      setCurrentUser(userWithRole);
      localStorage.setItem(
        'sam_crm_session',
        JSON.stringify({
          user: userWithRole,
          loginTimestamp: new Date().getTime(),
        })
      );
      navigate('/settings/user-management');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div id="login-container">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4 text-center">SAM CRM Login</h2>
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 ring-sam-accent"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 ring-sam-accent"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-sam-accent text-white p-2 rounded hover:bg-sam-primary"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
        {error && <p className="text-sam-accent text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
}

export default Login;