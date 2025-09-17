import { useDashboard } from '@dashboard/layout';
import UserNameSkeleton from '@components/Skeletons/UserNameSkeleton';

export const UserName = () => {
  const { allUserDataResource } = useDashboard();

  if (!allUserDataResource) return <UserNameSkeleton />;

  const {user} = allUserDataResource.read();


  return (
    <span className="user__name">{user.Name || "User"}</span>
  );
};