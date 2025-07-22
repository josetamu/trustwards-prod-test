import { useDashboard } from '../../dashboard/layout'; // Ajusta el import según tu estructura
import UserNameSkeleton from '../Skeletons/UserNameSkeleton';

export const UserName = () => {
  const { userResource } = useDashboard();

  if (!userResource) return <UserNameSkeleton />;

  const user = userResource.read();


  return (
    <span className="user__name">{user.Name || "User"}</span>
  );
};