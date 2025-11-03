import { useDashboard } from '@dashboard/DashboardContext';
import UserNameSkeleton from '@components/Skeletons/UserNameSkeleton';


export const SitesWelcome = () => {
  const { allUserDataResource, userDataResource } = useDashboard();

  const res = userDataResource || allUserDataResource;
  if (!res) return <UserNameSkeleton />;

  const {user} = res.read();

  return (
    <h2 className="sites__welcome">Hello, {user?.Name || "User"}</h2>
  );
};