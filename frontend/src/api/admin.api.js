import axiosInstance from './axiosInstance';

export const getSystemStats = async () => {
  const response = await axiosInstance.get('/stats/laws/count');
  return response.data;
};

// Placeholder for recent activity until endpoint is available
export const getRecentActivity = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: [
          { id: 1, action: 'User Registration', description: 'New user john@example.com registered.', date: new Date().toISOString() },
          { id: 2, action: 'Law Updated', description: 'Section 302 of IPC was updated by admin.', date: new Date(Date.now() - 3600000).toISOString() },
          { id: 3, action: 'System Alert', description: 'Database backup completed successfully.', date: new Date(Date.now() - 86400000).toISOString() },
        ]
      });
    }, 500);
  });
};
