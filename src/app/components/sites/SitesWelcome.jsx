import { useDashboard } from '@dashboard/layout';
import UserNameSkeleton from '@components/Skeletons/UserNameSkeleton';


export const SitesWelcome = () => {
  const { allUserDataResource } = useDashboard();

  if (!allUserDataResource) return <UserNameSkeleton />;

  const {user} = allUserDataResource.read();

  return (
    <h2 className="sites__welcome">Hello, {user?.Name || "User"}</h2>
  );
};