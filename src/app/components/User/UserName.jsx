import { useDashboard } from '@dashboard/DashboardContext';
import UserNameSkeleton from '@components/Skeletons/UserNameSkeleton';

export const UserName = () => {
  const { userDataResource, allUserDataResource } = useDashboard();

  const res = userDataResource || allUserDataResource;
  if (!res) return <UserNameSkeleton />;

  const { user } = res.read();
  return <span className="user__name">{user?.Name || 'User'}</span>;
};