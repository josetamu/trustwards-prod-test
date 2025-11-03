'use client'

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@supabase/supabaseClient';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { useTheme, ThemeProvider } from 'next-themes';
import { createCDN } from '@contexts/CDNsContext';
import { DashboardContext } from './DashboardContext';

import { Sidebar } from '@components/sideBar/Sidebar';
import { ModalContainer } from '@components/ModalContainer/ModalContainer';
import { ModalDelete } from '@components/ModalDelete/ModalDelete';
import { ModalSupport } from '@components/ModalSupport/ModalSupport';
import { ModalChange } from '@components/ModalChange/ModalChange';
import { ModalUser } from '@components/ModalUser/ModalUser';
import { ModalWelcome } from '@components/ModalWelcome/ModalWelcome';
import { ModalCheckout } from '@components/ModalCheckout/ModalCheckout';
import Notification from '@components/Notification/Notification';
import DashboardHeader from '@components/DashboardHeader/DashboardHeader';
import { OffcanvasContainer } from '@components/OffcanvasContainer/OffcanvasContainer';
import OffcanvasPricing from '@components/OffcanvasPricing/OffcanvasPricing';

export function DashboardUI({ children, initialUser, initialWebs, initialAppearance, authUserId, initialSidebarState }) {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  // Sidebar state && Site state
  const [isSidebarOpen, setIsSidebarOpen] = useState(initialSidebarState ?? null);
  const [isSidebarMenu, setIsSidebarMenu] = useState(false);
  const [blockContent, setBlockContent] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
  const [isSiteOpen, setIsSiteOpen] = useState(!!params['site-slug']);

  // DB state
  const [userSettings, setUserSettings] = useState(null);
  const [siteData, setSiteData] = useState(null);

  // ModalChange state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [changeType, setChangeType] = useState('');

  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [offcanvasType, setOffcanvasType] = useState(null);

  // ModalWelcome state
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);

  //ModalCheckout state
  const [checkoutPlan, setCheckoutPlan] = useState(null);

  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: '',
  });

  // Dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Browser state to handle SSR
  const [isBrowser, setIsBrowser] = useState(false);

  //Home and scanner states
  const [isInstalled, setIsInstalled] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanDone, setScanDone] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const MAX_SCANS = 50;

  //NEW BD CODE - Initialize with server-side data
  const [user, setUser] = useState(initialUser);
  const [webs, setWebs] = useState(initialWebs);
  const [appearanceSettings, setAppearanceSettings] = useState(initialAppearance);
  const [allUserDataResource, setAllUserDataResource] = useState(null);
  const allUserDataResourceRef = useRef({ userId: authUserId, resource: null });
  const [userDataResource, setUserDataResource] = useState(null);
  const userDataResourceRef = useRef({ userId: authUserId, resource: null });
  const prevSiteSlugRef = useRef(params['site-slug']);

  const allDataPromiseCache = new Map();

  function getAllDataShared(userId) {
    if (!userId) return Promise.resolve(null);
    if (!allDataPromiseCache.has(userId)) {
      const p = getAllData(userId)
        .finally(() => {
          allDataPromiseCache.delete(userId);
        });
      allDataPromiseCache.set(userId, p);
    }
    return allDataPromiseCache.get(userId);
  }

  //NEW BD CODE
  const getAllData = async (userId) => {
    if (!userId) {
      setUser(null);
      setWebs([]);
      setAppearanceSettings(null);

      return;
    }

    try {
      const [userResult, sitesResult, appearanceResult] = await Promise.allSettled([
        supabase.from('User').select('*').eq('id', userId).single(),
        supabase.from('Site').select('*').eq('userid', userId),
        supabase.from('Appearance').select('*').eq('userid', userId).single()
      ]);
      const userData = userResult.status === 'fulfilled' && !userResult.value.error ? userResult.value.data : null;
      const sitesData = sitesResult.status === 'fulfilled' && !sitesResult.value.error ? sitesResult.value.data : [];
      const appearanceData = appearanceResult.status === 'fulfilled' && !appearanceResult.value.error ? appearanceResult.value.data : null;

      setUser(userData);
      setWebs(sitesData);
      setAppearanceSettings(appearanceData);

      return { user: userData, webs: sitesData, appearance: appearanceData };
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  function createAllUserDataResource(userId, { allPromise } = {}) {
    let status = 'pending';
    let result;
    const suspender = (allPromise ?? getAllDataShared(userId)).then(
      r => { status = 'success'; result = r; },
      e => { status = 'error'; result = e; }
    );
    return {
      read() {
        if (status === 'pending') throw suspender;
        if (status === 'error') throw result;
        return result;
      }
    };
  }

  const getUserData = async (userId) => {
    const [userRes, appearanceRes] = await Promise.allSettled([
      supabase.from('User').select('*').eq('id', userId).single(),
      supabase.from('Appearance').select('*').eq('userid', userId).single()
    ]);
    return {
      user: userRes.status === 'fulfilled' && !userRes.value.error ? userRes.value.data : null,
      appearance: appearanceRes.status === 'fulfilled' && !appearanceRes.value.error ? appearanceRes.value.data : null,
    };
  };

  function createUserDataResource(userId, { allPromise, userPromise } = {}) {
    let status = 'pending';
    let result;

    // Ambas empiezan YA (promesas inyectadas o disparadas aquí mismo)
    const allP = allPromise ?? getAllDataShared(userId);
    const userP = userPromise ?? getUserData(userId);

    const suspender = Promise.allSettled([allP, userP])
      .then(([_, userRes]) => {
        if (userRes.status === 'fulfilled') return userRes.value;
        throw userRes.reason;
      })
      .then(
        r => { status = 'success'; result = r; },
        e => { status = 'error'; result = e; }
      );

    return {
      read() {
        if (status === 'pending') throw suspender;
        if (status === 'error') throw result;
        return result;
      }
    };
  }

  const reloadAllUserData = () => {
    const userId = allUserDataResourceRef.current.userId;
    if (!userId) return;

    const newResource = createAllUserDataResource(userId);
    allUserDataResourceRef.current = { userId, resource: newResource };
    setAllUserDataResource(newResource);
  };

  // We set the appearance settings when they are loaded. appearanceSettings is a object with the settings of the user(database)
  // Theme is controlled with next-themes, Accent Color and Reduced Motion are attributes of the html tag
  useEffect(() => {
    setIsBrowser(true);
    if (appearanceSettings) {
      setTheme(appearanceSettings['Theme']);

      if (appearanceSettings['Accent Color']) {
        document.documentElement.setAttribute('data-color', appearanceSettings['Accent Color']);
      } else {
        document.documentElement.removeAttribute('data-color');
      }

      // Set reduced motion preference
      const reducedMotion = appearanceSettings['Reduced Motion'] ?? 'no-preference';
      document.documentElement.setAttribute('data-reduced-motion', reducedMotion);
    }
  }, [appearanceSettings]);

  // Shift key detector - suppress focus outlines when Shift is held
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const setShiftPressed = (pressed) => {
      document.documentElement.setAttribute('data-shift-pressed', pressed.toString());
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Shift') {
        setShiftPressed(true);
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'Shift') {
        setShiftPressed(false);
      }
    };

    const handleBlur = () => {
      // Reset when window loses focus (in case Shift is released outside the window)
      setShiftPressed(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  // function to open sidebar in desktop toggleing the .open class. Also we save the state in the database only on desktop
  const toggleSidebar = async () => {
    const newSidebarState = !isSidebarOpen;
    setIsSidebarOpen(newSidebarState);

    //save in the database only on desktop
    if (window.innerWidth > 767) {
      await updateAppearanceSettings({ Sidebar: newSidebarState });
    }

    // we add the .open class to the content container and the user settings and the modal
    const contentContainer = document.querySelector('.content__container');

    if (!isSidebarOpen) {
      contentContainer.classList.add('open');
    } else {
      contentContainer.classList.remove('open');
    }
  };

  // Avatar's colors pool
  const avatarColors = {
    green: {
      backgroundColor: '#2FB11F',
      color: '#FFFFFF',
    },
    pink: {
      backgroundColor: '#FF3DDB',
      color: '#000000',
    },
    yellow: {
      backgroundColor: '#FEBA00',
      color: '#000000',
    },
    blue: {
      backgroundColor: '#0099FE',
      color: '#FFFFFF',
    },
    purple: {
      backgroundColor: '#9D4EDD',
      color: '#FFFFFF',
    },
    orange: {
      backgroundColor: '#FF6B35',
      color: '#000000',
    },
  };

  // Function to check if the profile picture is null, undefined or empty, to know if we should show the avatar color or the avatar image
  const checkProfilePicture = (user) => {
    const profilePicture = user?.["Avatar URL"];
    if (profilePicture === null || profilePicture === undefined || profilePicture === '') {
      return '';
    } else {
      return profilePicture;
    }
  }

  // Function to set the style of the profile picture
  const ProfileStyle = (user) => {
    const color = avatarColors[user?.["Avatar Color"]]?.color || '#FFFFFF';
    const backgroundColor = avatarColors[user?.["Avatar Color"]]?.backgroundColor || '#000000';
    return {
      color,
      backgroundColor
    }
  }

  const SiteStyle = (site) => {
    const color = avatarColors[site?.["Avatar Color"]]?.color || '#FFFFFF';
    const backgroundColor = avatarColors[site?.["Avatar Color"]]?.backgroundColor || '#000000';
    return {
      color,
      backgroundColor
    }
  }

  //Redirect to login if no session
  const [checkingAuth, setCheckingAuth] = useState(!authUserId);

  // Initialize resources with server data if available
  useEffect(() => {
    if (authUserId && initialUser) {
      // Create initial resources with the server data
      const initialData = {
        user: initialUser,
        webs: initialWebs,
        appearance: initialAppearance
      };
      
      const allDataResource = {
        read() {
          return initialData;
        }
      };
      
      allUserDataResourceRef.current = { userId: authUserId, resource: allDataResource };
      setAllUserDataResource(allDataResource);
      setCheckingAuth(false);
    } else {
      setCheckingAuth(false);
    }
  }, []);

  //set the user data from the database - listen for auth changes
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          // Only fetch if user changed
          if (allUserDataResourceRef.current.userId !== session.user.id) {
            const allPromise = getAllDataShared(session.user.id);
            const userPromise = getUserData(session.user.id);

            const allDataResource = createAllUserDataResource(session.user.id, { allPromise });
            const uRes = createUserDataResource(session.user.id, { allPromise, userPromise });

            allUserDataResourceRef.current = {
              userId: session.user.id,
              resource: allDataResource
            };
            userDataResourceRef.current = {
              userId: session.user.id,
              resource: uRes
            };

            setAllUserDataResource(allDataResource);
            setUserDataResource(uRes);
          }
        } else {
          // User logged out
          allUserDataResourceRef.current = { userId: null, resource: null };
          userDataResourceRef.current = { userId: null, resource: null };
          setAllUserDataResource(null);
          setUserDataResource(null);

          setUser(null);
          setWebs([]);
          setAppearanceSettings(null);
          
          router.replace('/login');
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Function to update the appearance settings in the database
  const updateAppearanceSettings = async (settings) => {
    if (!user?.id) return;

    const { error } = await supabase
      .from('Appearance')
      .update(settings)
      .eq('userid', user.id);

    if (error) {
      console.error('Error updating appearance settings:', error);
    }
  };

  // Remove a site from the webs state.
  const handleDeleteSite = (id) => {
    setWebs(prev => prev.filter(site => site.id !== id));

    if (allUserDataResource) {
      const currentData = allUserDataResource.read();
      currentData.webs = currentData.webs.filter(site => site.id !== id);
    }

  };

  // Expose the function globally for Sites.jsx using useEffect, and real time removed
  useEffect(() => {
    window.onDeleteSite = handleDeleteSite;

    return () => {
      delete window.onDeleteSite;
    };
  }, []);

  // Update global siteData when navigating to a specific site
  useEffect(() => {
    const siteSlug = params['site-slug'];
    setIsSiteOpen(!!siteSlug);
    if (siteSlug && webs.length > 0) {
      const selectedSite = webs.find(site => site.id === siteSlug);
      if (selectedSite) {
        setSiteData(selectedSite);
      }
    }
    else {
      setSiteData(null);
    }
  }, [params, webs, setSiteData, setIsSiteOpen]);

  useEffect(() => {
    const prev = prevSiteSlugRef.current;
    const curr = params['site-slug'] || null;

    // dashboard -> site-slug
    if (!prev && curr) {
      reloadAllUserData();
    }
    // site-slug -> dashboard
    if (prev && !curr) {
      reloadAllUserData();
    }

    prevSiteSlugRef.current = curr;
  }, [params['site-slug']]);

  // Set userSettings based on modalType
  useEffect(() => {
    if (modalType === 'Account' || modalType === 'Appearance' || modalType === 'Billing') {
      setUserSettings(modalType);
    }
  }, [modalType]);

  //Global function to close modals with escape key
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      // Only close the topmost modal (change modal takes priority)
      if (isChangeModalOpen) {
        closeChangeModal();
      } else if (isModalOpen) {
        closeModal();
      }
    }
  }, [isModalOpen, isChangeModalOpen]);

  //Global function to close modals by clicking outside the modal
  const handleBackdropClick = useCallback((e) => {
    if (e.target.className.includes('modal__backdrop')) {
      if (isChangeModalOpen) {
        closeChangeModal();
      } else if (isModalOpen) {
        closeModal();
      }
    }
  }, [isModalOpen, isChangeModalOpen]);

  // Add event listener for keyboard events
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  //Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
  };

  // Function to open the ModalChange modal
  const openChangeModal = (type) => {
    setChangeType(type);
    setIsChangeModalOpen(true);
  };

  // Function to open the ModalChange modal with the site data
  const openChangeModalSettings = (siteData) => {
    setChangeType('settings');
    setIsChangeModalOpen(true);
    setSiteData(siteData);
  };

  //Function to close the ModalChange modal
  const closeChangeModal = () => {
    setIsChangeModalOpen(false);
    setChangeType('');
  };

  //UseEffect to open the ModalWelcome modal
  useEffect(() => {
    if (allUserDataResource && !user?.Name) {
      setIsWelcomeModalOpen(true);
    }
  }, [user?.Name]);

  //Function to close the ModalWelcome modal
  const closeWelcomeModal = () => {
    setIsWelcomeModalOpen(false);
  };

  // Ensure a default avatar color for the user if missing
  useEffect(() => {
    if (!user?.id) return;
    if (!user?.["Avatar Color"]) {
      const colorKeys = Object.keys(avatarColors);
      const randomColorKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];

      (async () => {
        const { error } = await supabase
          .from('User')
          .update({ 'Avatar Color': randomColorKey })
          .eq('id', user.id);

        if (!error) {
          setUser(prev => ({ ...prev, 'Avatar Color': randomColorKey }));
          if (allUserDataResource) {
            const currentData = allUserDataResource.read();
            currentData.user = { ...currentData.user, 'Avatar Color': randomColorKey };
          }
        }
      })();
    }
  }, [user?.id, user?.["Avatar Color"]]);

  //Function to show the notification
  const showNotification = (message, position = 'top', contentCenter = false, isWarning = false) => {
    setNotification({
      open: true,
      message: message,
      position: position,
      contentCenter: contentCenter,
      isWarning: isWarning,
    });
  };

  //Function to hide the notification
  const hideNotification = () => {
    setNotification({
      open: false,
      message: '',
      position: '',
      contentCenter: false,
    });
  };

  //Function to copy script to clipboard
  const handleCopy = async (siteID, contentCenter = false) => {
    const script = `<script src="https://cdn.trustwards.io/storage/v1/object/public/cdn-script/${siteID}.js"></script>`;
    try {
      await navigator.clipboard.writeText(script);
      showNotification("Copied script to clipboard", 'top', contentCenter);
    } catch (error) {
      console.error('Failed to copy text: ', error);
      showNotification("Failed to copy script", 'top', contentCenter);
    }
  };

  //Function to create a new site
  const createNewSite = async (createSiteName, createSiteDomain) => {

    try {
      const colorKeys = Object.keys(avatarColors);
      const randomColorKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];

      // Function to generate a unique site name, mapping the existing sites names if includes the name adds a number to the end in the while loop
      const generateUniqueSiteName = (baseName) => {
        const existingNames = webs.map(site => site.Name);
        let newName = baseName;
        let counter = 1;

        while (existingNames.includes(newName)) {
          newName = `${baseName} (${counter})`;
          counter++;
        }

        return newName;
      };

      // When a user creates a new site, the auto generated name is "Untitled"
      const uniqueSiteName = generateUniqueSiteName(createSiteName || 'Untitled');

      const { data, error } = await supabase
        .from('Site')
        .insert([
          {
            Name: uniqueSiteName,
            userid: user.id,
            'Avatar Color': randomColorKey,
            Plan: 'Free',
            Domain: createSiteDomain,
            Verified: false,
            Scans: 0,
          }
        ])
        .select();

      if (error) {
        showNotification('Error creating site');
        return;
      }

      //Create the CDN for the new site
      createCDN(data[0].id);

      // Update the webs state immediately with the new site
      setWebs(prevWebs => [...prevWebs, data[0]]);
      setSelectedSite(data[0]);
      setIsSiteOpen(true);

      // Update the resource (add the new site to the webs array real time)
      if (allUserDataResource) {
        const currentData = allUserDataResource.read();
        currentData.webs = [...currentData.webs, data[0]];
      }

      // Navigate to the new site page
      router.push(`/${data[0].id}`);

    } catch (error) {
      showNotification('Error creating site');
    }
  }

  // Add resize listener to close sidebar when switching from desktop to mobile
  useEffect(() => {
    if (!isBrowser) return;

    const handleResize = () => {
      //Close dropdown if open when resizing
      setIsDropdownOpen(false);

      const contentContainer = document.querySelector('.content__container');
      if (isSidebarOpen && contentContainer) {
        contentContainer.classList.add('open');
      } else if (contentContainer) {
        contentContainer.classList.remove('open');
      }

      if (window.innerWidth > 767) {
        setIsSidebarMenu(false);
      }
    };

    window.addEventListener('resize', handleResize);

    //Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isBrowser, isSidebarOpen, isSidebarMenu]);

  //This function is the master of the modals. It is the function that renders the modal depending on the modalType. Each modal is a component that is rendered in the ModalContainer as a child.
  //Also ModalUser is ModalContainer child, but it is father of account, appearance and upgrade. That's why we have to check the modalType and render ModalUser in those cases.
  const renderModal = () => {
    if (!isModalOpen) return null;

    switch (modalType) {
      case 'Account':
        return (
          <ModalUser
            onClose={() => setIsModalOpen(false)}
            onSave={() => {
              setIsModalOpen(false);


            }}
            user={user}
            setIsModalOpen={setIsModalOpen}
            appearanceSettings={appearanceSettings}
            setAppearanceSettings={setAppearanceSettings}
            userSettings={userSettings}
            setUserSettings={setUserSettings}
            openChangeModal={openChangeModal}
            checkProfilePicture={checkProfilePicture}
            profileStyle={ProfileStyle}
            setUser={setUser}
            allUserDataResource={allUserDataResource}
          />
        );
      case 'DeleteSite':
        return (
          <ModalDelete
            onClose={() => setIsModalOpen(false)}
            siteData={siteData}
            setIsModalOpen={setIsModalOpen}
            setSiteData={setSiteData}
          />
        );
      case 'Support':
        return (<ModalSupport
          onClose={() => setIsModalOpen(false)}
          onSave={() => setIsModalOpen(false)}
          user={user}
          setUser={setUser}
          setIsModalOpen={setIsModalOpen}
          showNotification={showNotification}
        />)
      case 'Appearance':
        return (
          <ModalUser
            onClose={() => setIsModalOpen(false)}
            onSave={() => {
              setIsModalOpen(false);

            }}
            user={user}
            setUser={setUser}
            setIsModalOpen={setIsModalOpen}
            appearanceSettings={appearanceSettings}
            setAppearanceSettings={setAppearanceSettings}
            userSettings={userSettings}
            setUserSettings={setUserSettings}
            openChangeModal={openChangeModal}
            checkProfilePicture={checkProfilePicture}
            profileStyle={ProfileStyle}
            allUserDataResource={allUserDataResource}
          />)
      case 'Billing':
        return (
          <ModalUser
            onClose={() => setIsModalOpen(false)}
            onSave={() => {
              setIsModalOpen(false);
            }}
            user={user}
            setUser={setUser}
            setIsModalOpen={setIsModalOpen}
            appearanceSettings={appearanceSettings}
            setAppearanceSettings={setAppearanceSettings}
            userSettings={userSettings}
            setUserSettings={setUserSettings}
            openChangeModal={openChangeModal}
            checkProfilePicture={checkProfilePicture}
            profileStyle={ProfileStyle}
            allUserDataResource={allUserDataResource}
          />
        )
      case 'Upgrade':
        return (
          <ModalCheckout
            onClose={() => setIsModalOpen(false)}
            setIsModalOpen={setIsModalOpen}
            currentPlan={user?.Plan || 'Free'}
            selectedPlan={checkoutPlan?.plan}
          />
        )
      default:
        return null;
    }
  }

  const renderOffcanvas = () => {
    if (!isOffcanvasOpen) return null;

    switch (offcanvasType) {
      case 'Pricing':
        return (
          <OffcanvasPricing
            onClose={() => setIsOffcanvasOpen(false)}
            user={user}
            currentPlan={(() => {
              return user?.Plan || 'Free';
            })()}
            setModalType={setModalType}
            setIsModalOpen={setIsModalOpen}
            setIsOffcanvasOpen={setIsOffcanvasOpen}
            setCheckoutPlan={setCheckoutPlan}
          />
        );
      default:
        return null;
    }
  };

  // Create context value to share with children
  const contextValue = {
    // User and sites data
    user,
    setUser,
    webs,
    setWebs,
    siteData,
    setSiteData,
    selectedSite,
    setSelectedSite,
    
    // UI state
    isSidebarOpen,
    setIsSidebarOpen,
    isSidebarMenu,
    setIsSidebarMenu,
    blockContent,
    setBlockContent,
    isSiteOpen,
    setIsSiteOpen,
    
    // Modal state
    isModalOpen,
    setIsModalOpen,
    modalType,
    setModalType,
    isChangeModalOpen,
    setIsChangeModalOpen,
    changeType,
    setChangeType,
    isWelcomeModalOpen,
    setIsWelcomeModalOpen,
    checkoutPlan,
    setCheckoutPlan,
    
    // Offcanvas state
    isOffcanvasOpen,
    setIsOffcanvasOpen,
    offcanvasType,
    setOffcanvasType,
    
    // Dropdown state
    isDropdownOpen,
    setIsDropdownOpen,
    
    // Notification state
    notification,
    
    // Scanner states
    isScanning,
    setIsScanning,
    scanDone,
    setScanDone,
    isInstalled,
    setIsInstalled,
    isVerifying,
    setIsVerifying,
    MAX_SCANS,
    
    // Settings
    userSettings,
    setUserSettings,
    appearanceSettings,
    setAppearanceSettings,
    
    // Resources
    allUserDataResource,
    userDataResource,
    
    // Functions
    toggleSidebar,
    checkProfilePicture,
    ProfileStyle,
    SiteStyle,
    openChangeModal,
    openChangeModalSettings,
    closeModal,
    closeChangeModal,
    closeWelcomeModal,
    handleBackdropClick,
    createNewSite,
    showNotification,
    hideNotification,
    handleCopy,
    
    // Router and params
    params,
    pathname,
    
    // Supabase
    supabase,
  };

  // Show loading state while checking authentication to avoid flickering
  if (checkingAuth) {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-auth-checking', 'true');
    }
    return (
      <div className="auth-checking-loader"></div>
    );
  } else {
    if (typeof document !== 'undefined') {
      document.documentElement.removeAttribute('data-auth-checking');
    }
  }

  return (
    <DashboardContext.Provider value={contextValue}>
      <ThemeProvider>
      <div className="app-container">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          toggleSidebar={toggleSidebar}
          user={user}
          webs={webs}
          setIsModalOpen={setIsModalOpen}
          setModalType={setModalType}
          isModalOpen={isModalOpen}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          setSiteData={setSiteData}
          siteData={siteData}
          modalType={modalType}
          selectedSite={selectedSite}
          setSelectedSite={setSelectedSite}
          isSiteOpen={isSiteOpen}
          setIsSiteOpen={setIsSiteOpen}
          userSettings={userSettings}
          setUserSettings={setUserSettings}
          checkProfilePicture={checkProfilePicture}
          profileStyle={ProfileStyle}
          SiteStyle={SiteStyle}
          openChangeModal={openChangeModal}
          openChangeModalSettings={openChangeModalSettings}
          showNotification={showNotification}
          isChangeModalOpen={isChangeModalOpen}
          isSidebarMenu={isSidebarMenu}
          setIsSidebarMenu={setIsSidebarMenu}
          isContentBlocked={blockContent}
          setBlockContent={setBlockContent}
        />

        <div className={`content__container ${isSidebarOpen ? 'open' : ''} ${blockContent ? 'content__container--blocked' : ''}`}>
          {!!params['site-slug'] && !pathname.startsWith('/builder') && <DashboardHeader />}
          {children}
        </div>
        
        <ModalContainer
          isOpen={isModalOpen}
          onClose={closeModal}
          onBackdropClick={handleBackdropClick}
        >
          {renderModal()}
        </ModalContainer>

        {/* ModalChange as independent modal */}
        <ModalContainer
          isOpen={isChangeModalOpen}
          onClose={closeChangeModal}
          onBackdropClick={handleBackdropClick}
        >
          <ModalChange
            changeType={changeType}
            onClose={closeChangeModal}
            user={user}
            setUser={setUser}
            setIsModalOpen={setIsModalOpen}
            showNotification={showNotification}
            siteData={siteData}
            setSiteData={setSiteData}
            setWebs={setWebs}
            createNewSite={createNewSite}
            allUserDataResource={allUserDataResource}
          />
        </ModalContainer>

        <ModalContainer
          isOpen={isWelcomeModalOpen}
          onClose={closeWelcomeModal}
          modalType="Welcome"
        >
          <ModalWelcome
            onClose={closeWelcomeModal}
            user={user}
            setUser={setUser}
            allUserDataResource={allUserDataResource}
          />
        </ModalContainer>

        <Notification
          open={notification.open}
          onClose={hideNotification}
          autoClose={2500} //duration of the notification in ms
          notificationMessage={notification.message}
          position={notification.position || 'top'}
          isSidebarOpen={isSidebarOpen}
          contentCenter={notification.contentCenter || false}
          isWarning={notification.isWarning || false}
        >
        </Notification>

        <OffcanvasContainer
          isOpen={isOffcanvasOpen}
          onClose={() => setIsOffcanvasOpen(false)}
          position="left"
        >
          {renderOffcanvas()}
        </OffcanvasContainer>
      </div>
      </ThemeProvider>
    </DashboardContext.Provider>
  );
}
