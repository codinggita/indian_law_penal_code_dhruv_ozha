import { useQuery } from '@tanstack/react-query';
import { Users, FileText, Bookmark, Activity, Plus } from 'lucide-react';
import { getSystemStats, getRecentActivity } from '../../api/admin.api';
import Button from '../../components/ui/Button';

export default function AdminDashboard() {
  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: getSystemStats
  });

  const { data: activityData, isLoading: isActivityLoading } = useQuery({
    queryKey: ['admin', 'activity'],
    queryFn: getRecentActivity
  });

  const stats = [
    { name: 'Total Laws', value: statsData?.data?.count || 2214, icon: FileText, color: 'text-primary', bg: 'bg-primary/10' },
    { name: 'Total Users', value: 145, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Active Bookmarks', value: 892, icon: Bookmark, color: 'text-green-500', bg: 'bg-green-500/10' },
    { name: 'Recent Searches', value: '4.2k', icon: Activity, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary">Admin Dashboard</h1>
          <p className="text-text-secondary mt-1">System overview and recent activity.</p>
        </div>
        <Button icon={Plus}>Add New Law</Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-surface p-6 rounded-xl border border-border shadow-sm flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bg}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-text-muted">{stat.name}</p>
                <h3 className="text-2xl font-bold text-text-primary">
                  {isStatsLoading ? '...' : stat.value}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Table */}
      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-surface-2 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-text-primary">Recent System Activity</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isActivityLoading ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-text-muted">Loading activity...</td>
                </tr>
              ) : activityData?.data?.map((item) => (
                <tr key={item.id} className="hover:bg-surface-2/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                    {item.action}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {item.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                    {new Date(item.date).toLocaleDateString()} at {new Date(item.date).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
