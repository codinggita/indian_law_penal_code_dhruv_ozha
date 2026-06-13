import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import PageWrapper from '../../components/layout/PageWrapper';

export default function AdminLayout() {
  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] bg-bg">
      <Sidebar mode="admin" />
      <div className="flex-1 w-full flex flex-col overflow-hidden">
        <PageWrapper className="flex-1 overflow-y-auto w-full">
          <Outlet />
        </PageWrapper>
      </div>
    </div>
  );
}
