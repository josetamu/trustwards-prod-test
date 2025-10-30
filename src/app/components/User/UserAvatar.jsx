import { useDashboard } from '@dashboard/layout';
import UserAvatarSkeleton from '@components/Skeletons/UserAvatarSkeleton';

export const UserAvatar = ({checkProfilePicture, profileStyle}) => {
  const { userDataResource, allUserDataResource } = useDashboard();

  const res = userDataResource || allUserDataResource;
  if (!res) return <UserAvatarSkeleton />;

  const { user } = res.read();
  return (
    <>
      <span className={`user__color ${checkProfilePicture(user) === '' ? '' : 'user__color--null'}`} style={profileStyle(user)}>
        {user?.Name?.charAt(0)}
      </span>
      <img className={`user__avatar ${checkProfilePicture(user) === '' ? 'user__avatar--null' : ''}`} src={user?.["Avatar URL"]} alt="avatar" />
    </>
  );
};