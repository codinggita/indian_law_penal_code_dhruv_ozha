import { useState } from 'react';
import { Search, Mail, Shield, User, MoreVertical, Ban } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

// Mock data for demonstration since the user backend isn't fully implemented
const MOCK_USERS = [
  { id: '1', name: 'Admin User', email: 'admin@lexindia.in', role: 'admin', joinDate: '2023-01-15T10:00:00Z', status: 'active' },
  { id: '2', name: 'John Doe', email: 'john.doe@example.com', role: 'user', joinDate: '2023-03-22T14:30:00Z', status: 'active' },
  { id: '3', name: 'Jane Smith', email: 'jane.smith@lawfirm.com', role: 'user', joinDate: '2023-06-10T09:15:00Z', status: 'active' },
  { id: '4', name: 'Suspended Account', email: 'spam@example.com', role: 'user', joinDate: '2023-08-05T11:45:00Z', status: 'suspended' },
  { id: '5', name: 'Legal Researcher', email: 'research@university.edu', role: 'user', joinDate: '2023-11-02T16:20:00Z', status: 'active' },
];

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredUsers = MOCK_USERS.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary">User Management</h1>
          <p className="text-text-secondary mt-1">View and manage registered users.</p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-border bg-surface-2 flex justify-between items-center">
          <div className="w-full max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-text-muted" />
              </div>
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-border rounded-md leading-5 bg-surface placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-2/50">
                <th className="px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-text-muted">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-2/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                          <span className="text-primary font-bold">{user.name.charAt(0)}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-text-primary">{user.name}</div>
                          <div className="text-sm text-text-secondary flex items-center mt-0.5">
                            <Mail className="w-3 h-3 mr-1" /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.role === 'admin' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                          <Shield className="w-3 h-3 mr-1" /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-2 text-text-secondary border border-border">
                          <User className="w-3 h-3 mr-1" /> User
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.status === 'active' ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="error" className="flex items-center w-fit">
                          <Ban className="w-3 h-3 mr-1" /> Suspended
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {new Date(user.joinDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-text-muted hover:text-primary transition-colors p-2 rounded-md hover:bg-surface-2">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
