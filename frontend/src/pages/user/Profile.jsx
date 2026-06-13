import { useState } from 'react';
import { User, Mail, Shield, BookMarked, History } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import PageWrapper from '../../components/layout/PageWrapper';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function Profile() {
  const { user, role } = useAuthStore();
  const [activeTab, setActiveTab] = useState('settings');

  // Placeholder for when backend integration is complete
  const handleUpdateProfile = (e) => {
    e.preventDefault();
    alert('Profile update endpoint not yet implemented.');
  };

  return (
    <PageWrapper title="Your Profile" className="max-w-5xl">
      <div className="flex flex-col md:flex-row gap-8 py-8">
        
        {/* Left Sidebar Profile Card */}
        <div className="w-full md:w-1/3">
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary/20">
              <span className="text-3xl font-display font-bold text-primary">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            
            <h2 className="text-xl font-display font-bold text-text-primary mb-1">
              {user?.name || 'User'}
            </h2>
            <p className="text-text-secondary text-sm mb-4">
              {user?.email || 'user@example.com'}
            </p>
            
            <div className="flex justify-center mb-6">
              {role === 'admin' ? (
                <Badge variant="admin" className="px-3 py-1 text-sm flex items-center">
                  <Shield className="w-3 h-3 mr-1" /> Administrator
                </Badge>
              ) : (
                <Badge variant="category" className="px-3 py-1 text-sm flex items-center">
                  <User className="w-3 h-3 mr-1" /> Standard User
                </Badge>
              )}
            </div>

            <div className="flex flex-col space-y-2 border-t border-border pt-6">
              <button 
                onClick={() => setActiveTab('settings')}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-primary/10 text-primary font-medium' : 'text-text-secondary hover:bg-surface-2'}`}
              >
                <User className="w-5 h-5" />
                <span>Account Settings</span>
              </button>
              <button 
                onClick={() => setActiveTab('bookmarks')}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'bookmarks' ? 'bg-primary/10 text-primary font-medium' : 'text-text-secondary hover:bg-surface-2'}`}
              >
                <BookMarked className="w-5 h-5" />
                <span>Bookmarked Laws</span>
              </button>
              <button 
                onClick={() => setActiveTab('activity')}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'activity' ? 'bg-primary/10 text-primary font-medium' : 'text-text-secondary hover:bg-surface-2'}`}
              >
                <History className="w-5 h-5" />
                <span>Recent Activity</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="w-full md:w-2/3">
          <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 shadow-sm min-h-[500px]">
            
            {activeTab === 'settings' && (
              <div>
                <h3 className="text-2xl font-display font-bold text-text-primary mb-6">Account Settings</h3>
                <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-md">
                  <Input 
                    label="Full Name" 
                    defaultValue={user?.name} 
                    icon={User}
                  />
                  <Input 
                    label="Email Address" 
                    type="email" 
                    defaultValue={user?.email} 
                    icon={Mail}
                    disabled
                    helper="Email cannot be changed."
                  />
                  
                  <div className="pt-4 border-t border-border">
                    <Button type="submit">Save Changes</Button>
                  </div>
                </form>

                <div className="mt-12 pt-8 border-t border-border">
                  <h4 className="text-lg font-semibold text-error mb-2">Danger Zone</h4>
                  <p className="text-text-secondary text-sm mb-4">
                    Permanently delete your account and all associated data.
                  </p>
                  <Button variant="danger" size="sm">Delete Account</Button>
                </div>
              </div>
            )}

            {activeTab === 'bookmarks' && (
              <div>
                <h3 className="text-2xl font-display font-bold text-text-primary mb-6">Bookmarked Laws</h3>
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center mb-4">
                    <BookMarked className="w-8 h-8 text-primary opacity-50" />
                  </div>
                  <h4 className="text-lg font-medium text-text-primary mb-2">No bookmarks yet</h4>
                  <p className="text-text-secondary max-w-sm">
                    When you bookmark laws while browsing, they will appear here for quick access.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div>
                <h3 className="text-2xl font-display font-bold text-text-primary mb-6">Recent Activity</h3>
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center mb-4">
                    <History className="w-8 h-8 text-primary opacity-50" />
                  </div>
                  <h4 className="text-lg font-medium text-text-primary mb-2">Activity log empty</h4>
                  <p className="text-text-secondary max-w-sm">
                    Your recent searches and viewed laws will be tracked here.
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </PageWrapper>
  );
}
