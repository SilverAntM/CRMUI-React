import { useState, useEffect } from 'react';
import { dummyData } from '../data/dummyData';

function FormWidget({ entity, itemId, currentUser, onClose, onSave }) {
  const [formData, setFormData] = useState({});
  const [roles, setRoles] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const tenantId = currentUser.role.permissions[entity]?.includes('manage_all_tenants')
      ? formData.tenantId || currentUser.tenantId
      : currentUser.tenantId;
    setRoles(dummyData.roles.filter((r) => r.tenantId === tenantId));
    setUsers(dummyData.users.filter((u) => u.tenantId === tenantId));
    setTenants([...new Set(dummyData.users.map((u) => u.tenantId))]);
    if (itemId) {
      const data = (dummyData[entity] || []).find((item) => item.id === itemId);
      setFormData(data || {});
    } else {
      setFormData({
        status: entity === 'customers' ? 'active' : entity === 'deals' ? 'open' : 'pending',
        tenantId: currentUser.tenantId,
      });
    }
  }, [itemId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      id: itemId || Date.now(),
      updatedAt: new Date().toISOString(),
      createdAt: itemId ? undefined : new Date().toISOString(),
      subSectionId:
        entity === 'users'
          ? 'user-management'
          : entity === 'customers'
          ? 'all-customers'
          : entity === 'deals'
          ? 'active-deals'
          : 'my-tasks',
      roleId: entity === 'users' ? parseInt(formData.roleId) : undefined,
      amount: entity === 'deals' ? parseFloat(formData.amount) : undefined,
    };
    dummyData[entity] = itemId
      ? dummyData[entity].map((item) => (item.id === itemId ? data : item))
      : [...(dummyData[entity] || []), data];
    onSave();
    onClose();
  };

  return (
    <div className="modal" style={{ display: 'flex' }}>
      <div className="modal-content">
        <h2 className="text-xl font-bold mb-4">
          {itemId
            ? `Edit ${entity.charAt(0).toUpperCase() + entity.slice(1)}`
            : `Add ${entity.charAt(0).toUpperCase() + entity.slice(1)}`}
        </h2>
        <div>
          {entity === 'users' ? (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Username</label>
                <input
                  name="username"
                  value={formData.username || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 ring-sam-accent"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 ring-sam-accent"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  name="password"
                  type="password"
                  value={formData.password || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 ring-sam-accent"
                  required={!itemId}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  name="roleId"
                  value={formData.roleId || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 ring-sam-accent"
                  required
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              {currentUser.role.permissions.settings?.includes('manage_all_tenants') && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Tenant</label>
                  <select
                    name="tenantId"
                    value={formData.tenantId || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 ring-sam-accent"
                  >
                    <option value="">Select Tenant</option>
                    {tenants.map((tenant) => (
                      <option key={tenant} value={tenant}>
                        {tenant}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          ) : entity === 'customers' ? (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 ring-sam-accent"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 ring-sam-accent"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 ring-sam-accent"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status || 'active'}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 ring-sam-accent"
                  required
                >
                  <option value="active">Active</option>
                  <option value="lead">Lead</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 ring-sam-accent"
                ></textarea>
              </div>
              {currentUser.role.permissions.customers?.includes('manage_all_tenants') && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Tenant</label>
                  <select
                    name="tenantId"
                    value={formData.tenantId || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 ring-sam-accent"
                  >
                    <option value="">Select Tenant</option>
                    {tenants.map((tenant) => (
                      <option key={tenant} value={tenant}>
                        {tenant}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          ) : entity === 'deals' ? (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 ring-sam-accent"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  name="amount"
                  type="number"
                  min="0"
                  value={formData.amount || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 ring-sam-accent"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status || 'open'}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 ring-sam-accent"
                  required
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                  <option value="lost">Lost</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Assigned To</label>
                <select
                  name="assignedTo"
                  value={formData.assignedTo || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 ring-sam-accent"
                  required
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.username}>
                      {user.username}
                    </option>
                  ))}
                </select>
              </div>
              {currentUser.role.permissions.deals?.includes('manage_all_tenants') && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Tenant</label>
                  <select
                    name="tenantId"
                    value={formData.tenantId || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 ring-sam-accent"
                  >
                    <option value="">Select Tenant</option>
                    {tenants.map((tenant) => (
                      <option key={tenant} value={tenant}>
                        {tenant}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  name="title"
                  value={formData.title || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 ring-sam-accent"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <input
                  name="dueDate"
                  type="date"
                  value={formData.dueDate?.split('T')[0] || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 ring-sam-accent"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Assignee</label>
                <select
                  name="assignee"
                  value={formData.assignee || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 ring-sam-accent"
                  required
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.username}>
                      {user.username}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status || 'pending'}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 ring-sam-accent"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              {currentUser.role.permissions.tasks?.includes('manage_all_tenants') && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Tenant</label>
                  <select
                    name="tenantId"
                    value={formData.tenantId || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 ring-sam-accent"
                  >
                    <option value="">Select Tenant</option>
                    {tenants.map((tenant) => (
                      <option key={tenant} value={tenant}>
                        {tenant}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-4 py-2 bg-sam-accent text-white rounded hover:bg-sam-primary"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormWidget;