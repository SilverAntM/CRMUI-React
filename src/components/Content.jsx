import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import TableWidget from './TableWidget';
import SettingsFormWidget from './SettingsFormWidget';

const searchFields = {
  'user-management': [
    { value: 'username', label: 'Username' },
    { value: 'email', label: 'Email' },
    { value: 'roleName', label: 'Role' },
  ],
  'all-customers': [
    { value: 'name', label: 'Name' },
    { value: 'email', label: 'Email' },
    { value: 'status', label: 'Status' },
  ],
  'active-deals': [
    { value: 'name', label: 'Name' },
    { value: 'status', label: 'Status' },
    { value: 'assignedTo', label: 'Assigned To' },
  ],
  'my-tasks': [
    { value: 'title', label: 'Title' },
    { value: 'status', label: 'Status' },
    { value: 'assignee', label: 'Assignee' },
  ],
};

function Content({ currentUser }) {
  const location = useLocation();
  const subLinkId = location.pathname.split('/')[2] || 'user-management';
  const moduleId = location.pathname.split('/')[1] || 'settings';
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState(searchFields[subLinkId]?.[0]?.value || '');

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-white p-4 border-b flex items-center space-x-2">
        <select
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
          className="p-2 border rounded focus:outline-none focus:ring-2 ring-sam-accent"
        >
          {searchFields[subLinkId]?.map((field) => (
            <option key={field.value} value={field.value}>
              {field.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${
            subLinkId === 'user-management'
              ? 'users'
              : subLinkId === 'all-customers'
              ? 'customers'
              : subLinkId === 'active-deals'
              ? 'deals'
              : 'tasks'
          }...`}
          className="w-1/2 p-2 border rounded focus:outline-none focus:ring-2 ring-sam-accent"
        />
      </div>
      <Routes>
        {Object.keys(searchFields).map((subLink) => (
          <Route
            key={subLink}
            path={`/:moduleId/${subLink}`}
            element={
              <TableWidget
                entity={subLink}
                currentUser={currentUser}
                searchQuery={searchQuery}
                searchField={searchField}
              />
            }
          />
        ))}
        <Route
          path="/settings/settings-preferences"
          element={<SettingsFormWidget currentUser={currentUser} />}
        />
      </Routes>
    </div>
  );
}

export default Content;