import { useDashboard } from '@dashboard/layout';
import UserNameSkeleton from '@components/Skeletons/UserNameSkeleton';


export const SitesWelcome = () => {
  const { allUserDataResource, userDataResource } = useDashboard();

  if (!allUserDataResource || !userDataResource) return <UserNameSkeleton />;

  const {user} = userDataResource.read();

  return (
    <h2 className="sites__welcome">Hello, {user?.Name || "User"}</h2>
  );
};