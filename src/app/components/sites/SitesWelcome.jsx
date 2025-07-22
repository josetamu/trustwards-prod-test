import { useDashboard } from '../../dashboard/layout';
import UserNameSkeleton from '../Skeletons/UserNameSkeleton';


export const SitesWelcome = () => {
  const { userResource } = useDashboard();

  if (!userResource) return <UserNameSkeleton />;

  const user = userResource.read();

  return (
    <h2 className="sites__welcome">Hello, {user?.Name || "User"}</h2>
  );
};