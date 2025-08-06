import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import FormWidget from './FormWidget';
import { dummyData } from '../data/dummyData';

function TableWidget({ entity, currentUser, searchQuery, searchField }) {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const location = useLocation();
  const subLinkId = location.pathname.split('/')[2] || 'user-management';
  const moduleId = location.pathname.split('/')[1] || 'settings';

  useEffect(() => {
    fetchItems();
  }, [searchQuery, searchField]);

  const fetchItems = () => {
    let data = [];
    const entityName = {
      'user-management': 'users',
      'all-customers': 'customers',
      'active-deals': 'deals',
      'my-tasks': 'tasks',
    }[entity] || 'users';

    if (entityName === 'users') {
      data = dummyData.users.map((user) => ({
        ...user,
        roleName: dummyData.roles.find((r) => r.id === user.roleId).name,
      }));
    } else if (entityName === 'customers') {
      data = dummyData.customers;
    } else if (entityName === 'deals') {
      data = dummyData.deals;
    } else if (entityName === 'tasks') {
      data = dummyData.tasks;
    }

    if (!currentUser.role.permissions[entityName]?.includes('manage_all_tenants')) {
      data = data.filter((item) => item.tenantId === currentUser.tenantId);
    }

    if (searchQuery) {
      if (entityName === 'users' && searchField === 'roleName') {
        data = data.filter((item) =>
          item.roleName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      } else if (entityName === 'deals' && searchField === 'assignedTo') {
        data = data.filter((item) =>
          item.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
        );
      } else if (entityName === 'tasks' && searchField === 'assignee') {
        data = data.filter((item) =>
          item.assignee.toLowerCase().includes(searchQuery.toLowerCase())
        );
      } else {
        data = data.filter((item) =>
          item[searchField]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
    }

    setItems(data);
  };

  const deleteItem = (itemId) => {
    if (window.confirm(`Are you sure you want to delete this ${entity.split('-')[0]}?`)) {
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    }
  };

  const module = {
    id: moduleId,
    subSections: [
      {
        id: subLinkId,
        name: subLinkId
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' '),
        icon: ['user-management', 'all-customers', 'active-deals', 'my-tasks'].includes(entity)
          ? 'fa-users'
          : 'fa-cog',
      },
    ],
  };

  return (
    <div>
      <div id="content-header" className="bg-white p-4 border-b">
        <h2 className="text-lg font-semibold flex items-center">
          {module.subSections[0].icon === 'fa-users' ? (
            <svg className="h-6 w-6 fill-current mr-2" viewBox="0 0 24 24">
              <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          ) : (
            <svg className="h-6 w-6 fill-current mr-2" viewBox="0 0 24 24">
              <path d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 0 1-.517.608 7.45 7.45 0 0 0-.478.198.798.798 0 0 1-.796-.064l-.453-.324a1.875 1.875 0 0 0-2.416.2l-.243.243a1.875 1.875 0 0 0-.2 2.416l.324.453a.798.798 0 0 1 .064.796 7.448 7.448 0 0 0-.198.478.798.798 0 0 1-.608.517l-.55.092a1.875 1.875 0 0 0-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.099.266.123.559.198.478a.798.798 0 0 1 .796.064l.453.324c.802.573 1.869.572 2.416-.2l.243-.243c.573-.802.572-1.869-.2-2.416l-.324-.453a.798.798 0 0 1-.064-.796c.075-.319.099-.612.198-.478a.798.798 0 0 1 .608-.517l.55-.092a1.875 1.875 0 0 0 1.566-1.849v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 0 1-.608-.517 7.507 7.507 0 0 0-.198-.478.798.798 0 0 1-.064-.796l.324-.453a1.875 1.875 0 0 0 .2-2.416l-.243-.243a1.875 1.875 0 0 0-2.416-.2l-.453.324a.798.798 0 0 1-.796.064 7.462 7.462 0 0 0-.478-.198.798.798 0 0 1-.517-.608l-.091-.549c-.15-.904-.934-1.567-1.85-1.567zm.172 2.828c.523 0 .972.378 1.057.894l.091.548c.099.595.573 1.068 1.168 1.167.294.049.58.123.854.22.523.187.784.717.624 1.208l-.324.453c-.336.47-.272 1.104.149 1.486.294.267.543.568.727.894.336.595.955.894 1.578.894h.344c.523 0 .972.378 1.057.894l.091.549c.099.595.573 1.068 1.168 1.167.294.049.58.123.854.22.523.187.784.717.624 1.208l-.324.453c-.336.47-.272 1.104.149 1.486.294.267.543.568.727.894.336.595.955.894 1.578.894h.344c.523 0 .972.378 1.057.894l.091.549c.099.595.573 1.068 1.168 1.167.294.049.58.123.854.22.523.187.784.717.624 1.208l-.324.453c-.336.47-.272 1.104.149 1.486.294.267.543.568.727.894.336.595.955.894 1.578.894h.344c.523 0 .972.378 1.057.894l.091.549c.099.595.573 1.068 1.168 1.167.294.049.58.123.854.22.523.187.784.717.624 1.208l-.324.453c-.336.47-.272 1.104.149 1.486.294.267.543.568.727.894.336.595.955.894 1.578.894h.344c.523 0 .972.378 1.057.894l.091.549c.15.904.934 1.567 1.85 1.567s1.699-.663 1.85-1.567l.091-.549c.099-.595.573-1.068 1.168-1.167.294-.049.58-.123.854-.22.523-.187.784-.717.624-1.208l-.324-.453c-.336-.47-.272-1.104.149-1.486.294-.267.543-.568.727-.894.336-.595.955-.894 1.578-.894h.344c.523 0 .972-.378 1.057-.894l.091-.549c.099-.595.573-1.068 1.168-1.167.294-.049.58-.123.854-.22.523-.187.784-.717.624-1.208l-.324-.453c-.336-.47-.272-1.104.149-1.486.294-.267.543-.568.727-.894.336-.595.955-.894 1.578-.894h.344c.523 0 .972-.378 1.057-.894l.091-.549c.099-.595.573-1.068 1.168-1.167.294-.049.58-.123.854-.22.523-.187.784-.717.624-1.208l-.324-.453c-.336-.47-.272-1.104.149-1.486.294-.267.543-.568.727-.894.336-.595.955-.894 1.578-.894h.344c.523 0 .972-.378 1.057-.894l.091-.549c.15-.904.934-1.567 1.85-1.567zm-7.828 1.172a4.125 4.125 0 1 1 0 8.25 4.125 4.125 0 0 1 0-8.25zm0 1.5a2.625 2.625 0 1 0 0 5.25 2.625 2.625 0 0 0 0-5.25z"/>
            </svg>
          )}
          {module.subSections[0].name}
        </h2>
        <p className="text-gray-500 text-sm">
          {module.id.charAt(0).toUpperCase() + module.id.slice(1)} section
        </p>
      </div>
      <div id="content-body" className="flex-1 p-4 bg-white">
        <div className="mb-4">
          <button
            onClick={() => {
              setEditItemId(null);
              setShowModal(true);
            }}
            className={`bg-sam-accent text-white px-4 py-2 rounded hover:bg-sam-primary flex items-center ${
              currentUser.role.permissions[entity.split('-')[0]]?.includes('create')
                ? ''
                : 'hidden'
            }`}
          >
            <svg className="h-5 w-5 fill-current mr-2" viewBox="0 0 24 24">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
            Add {entity.split('-')[0].charAt(0).toUpperCase() + entity.split('-')[0].slice(1)}
          </button>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-sam-secondary text-white">
              {entity === 'user-management' ? (
                <>
                  <th className="p-2 text-left">Username</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Role</th>
                  <th
                    className={`p-2 text-left ${
                      currentUser.role.permissions.settings?.includes('manage_all_tenants')
                        ? ''
                        : 'hidden'
                    }`}
                  >
                    Tenant
                  </th>
                </>
              ) : entity === 'all-customers' ? (
                <>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Phone</th>
                  <th className="p-2 text-left">Status</th>
                  <th
                    className={`p-2 text-left ${
                      currentUser.role.permissions.customers?.includes('manage_all_tenants')
                        ? ''
                        : 'hidden'
                    }`}
                  >
                    Tenant
                  </th>
                </>
              ) : entity === 'active-deals' ? (
                <>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Amount</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Assigned To</th>
                  <th
                    className={`p-2 text-left ${
                      currentUser.role.permissions.deals?.includes('manage_all_tenants')
                        ? ''
                        : 'hidden'
                    }`}
                  >
                    Tenant
                  </th>
                </>
              ) : (
                <>
                  <th className="p-2 text-left">Title</th>
                  <th className="p-2 text-left">Due Date</th>
                  <th className="p-2 text-left">Assignee</th>
                  <th className="p-2 text-left">Status</th>
                  <th
                    className={`p-2 text-left ${
                      currentUser.role.permissions.tasks?.includes('manage_all_tenants')
                        ? ''
                        : 'hidden'
                    }`}
                  >
                    Tenant
                  </th>
                </>
              )}
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                {entity === 'user-management' ? (
                  <>
                    <td className="p-2">{item.username}</td>
                    <td className="p-2">{item.email}</td>
                    <td className="p-2">{item.roleName}</td>
                    <td
                      className={`p-2 ${
                        currentUser.role.permissions.settings?.includes('manage_all_tenants')
                          ? ''
                          : 'hidden'
                      }`}
                    >
                      {item.tenantId}
                    </td>
                  </>
                ) : entity === 'all-customers' ? (
                  <>
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{item.email}</td>
                    <td className="p-2">{item.phone || ''}</td>
                    <td className="p-2">{item.status}</td>
                    <td
                      className={`p-2 ${
                        currentUser.role.permissions.customers?.includes('manage_all_tenants')
                          ? ''
                          : 'hidden'
                      }`}
                    >
                      {item.tenantId}
                    </td>
                  </>
                ) : entity === 'active-deals' ? (
                  <>
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{item.amount}</td>
                    <td className="p-2">{item.status}</td>
                    <td className="p-2">{item.assignedTo}</td>
                    <td
                      className={`p-2 ${
                        currentUser.role.permissions.deals?.includes('manage_all_tenants')
                          ? ''
                          : 'hidden'
                      }`}
                    >
                      {item.tenantId}
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-2">{item.title}</td>
                    <td className="p-2">{new Date(item.dueDate).toLocaleDateString()}</td>
                    <td className="p-2">{item.assignee}</td>
                    <td className="p-2">{item.status}</td>
                    <td
                      className={`p-2 ${
                        currentUser.role.permissions.tasks?.includes('manage_all_tenants')
                          ? ''
                          : 'hidden'
                      }`}
                    >
                      {item.tenantId}
                    </td>
                  </>
                )}
                <td className="p-2">
                  <button
                    onClick={() => {
                      setEditItemId(item.id);
                      setShowModal(true);
                    }}
                    className={`text-sam-accent hover:text-sam-primary mr-2 ${
                      currentUser.role.permissions[entity.split('-')[0]]?.includes('update')
                        ? ''
                        : 'hidden'
                    }`}
                  >
                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className={`text-sam-accent hover:text-sam-primary ${
                      currentUser.role.permissions[entity.split('-')[0]]?.includes('delete')
                        ? ''
                        : 'hidden'
                    }`}
                  >
                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showModal && (
          <FormWidget
            entity={entity.split('-')[0]}
            itemId={editItemId}
            currentUser={currentUser}
            onClose={() => {
              setShowModal(false);
              setEditItemId(null);
            }}
            onSave={fetchItems}
          />
        )}
      </div>
    </div>
  );
}

export default TableWidget;