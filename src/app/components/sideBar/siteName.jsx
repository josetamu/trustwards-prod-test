import { useEffect, useRef, useState } from 'react';
import { useDashboard } from '@dashboard/DashboardContext';
import UserNameSkeleton from '@components/Skeletons/UserNameSkeleton';

export const SiteName = ({ siteSlug }) => {
  const { allUserDataResource } = useDashboard();

  // Track changes in the resource to force skeleton on the swap
  const lastResourceRef = useRef(allUserDataResource);
  const [showSkeleton, setShowSkeleton] = useState(true);

  const resourceChanged = allUserDataResource !== lastResourceRef.current;

  // If the resource changed, mark skeleton until it resolves
  if (resourceChanged) {
    lastResourceRef.current = allUserDataResource;
  }

  let data;
  let canRead = false;
  try {
    data = allUserDataResource?.read();
    canRead = !!data;
  } catch {
    canRead = false; // Suspense will handle the fallback
  }

  // When the current resource resolves, hide skeleton
  useEffect(() => {
    if (canRead) setShowSkeleton(false);
  }, [canRead]);

  // Guard: if no siteSlug, return null
  if (!siteSlug) return null;

  // If the resource has just changed or cannot be read yet, skeleton
  if (resourceChanged || !canRead || showSkeleton) {
    return <UserNameSkeleton />;
  }

  const webs = Array.isArray(data?.webs) ? data.webs : [];
  const site = webs.find(w => w.id === siteSlug);

  if (!site?.Name) {
    return <UserNameSkeleton />;
  }

  return (
    <span className='sidebar__sites-title sidebar__sites-title--link'>{site.Name}</span>
  );
};