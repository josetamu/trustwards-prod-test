import { useDashboard } from '../../dashboard/layout'; // Ajusta el import según tu estructura
import UserAvatarSkeleton from '../Skeletons/UserAvatarSkeleton';

export const UserAvatar = ({checkProfilePicture, profileStyle}) => {
  const { userResource } = useDashboard();

  if (!userResource) return <UserAvatarSkeleton />;

  const user = userResource.read();


  return (
    <>
    <span className={`user__color ${checkProfilePicture(user) === '' ? '' : 'user__color--null'}`} 
                        style={profileStyle(user)}>
                          {user?.Name.charAt(0)}
    </span> 
                        <img className={`user__avatar ${checkProfilePicture(user) === '' ? 'user__avatar--null' : ''}`} src={user?.["Avatar URL"]} alt="avatar" />
    </>
  );

};