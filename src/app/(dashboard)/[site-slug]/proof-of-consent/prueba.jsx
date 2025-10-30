'use client'

import '@app/root.css'
import './dashboard.css'
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@supabase/supabaseClient';
import { useRouter, useParams, usePathname } from 'next/navigation';

import { Sidebar} from '@components/sideBar/Sidebar'
import { ModalContainer } from '@components/ModalContainer/ModalContainer'
import { ModalDelete } from '@components/ModalDelete/ModalDelete'
import { ModalSupport } from '@components/ModalSupport/ModalSupport'
import { ModalChange } from '@components/ModalChange/ModalChange'
import { ModalUser } from '@components/ModalUser/ModalUser'
import { ModalWelcome } from '@components/ModalWelcome/ModalWelcome'
import { ModalCheckout } from '@components/ModalCheckout/ModalCheckout'
import Notification from '@components/Notification/Notification'
import DashboardHeader from '@components/DashboardHeader/DashboardHeader'
import { useSidebarSettings } from '@contexts/SidebarSettingsContext';
import { OffcanvasContainer } from '@components/OffcanvasContainer/OffcanvasContainer'
import  OffcanvasPricing  from '@components/OffcanvasPricing/OffcanvasPricing'
import { createCDN } from '@contexts/CDNsContext';
import 'react-day-picker/style.css';

import { useTheme } from 'next-themes'
const DashboardContext = createContext(null);
export const useDashboard = () => useContext(DashboardContext);

// HELPER FUNCTION: Crear recursos de datos (para uso en otras vistas)
export function createDataResource(fetchFunction) {
  let status = 'pending';
  let result;
  const suspender = fetchFunction().then(
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

function DashboardLayout({ children }) {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { sidebarState, setSidebarState } = useSidebarSettings();

  // Sidebar state && Site state
  const [isSidebarOpen, setIsSidebarOpen] = useState(sidebarState);
  const [isSidebarMenu, setIsSidebarMenu] = useState(false);  
  const [blockContent, setBlockContent] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
  const [isSiteOpen, setIsSiteOpen] = useState(!!params['site-slug']);

  // DB state - SEPARADO: solo user y appearance
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

  // CAMBIO PRINCIPAL: Solo cargar user y appearance (carga única al iniciar)
  const [user, setUser] = useState(null);
  const [webs, setWebs] = useState([]);
  const [appearanceSettings, setAppearanceSettings] = useState(null);
  const [consents, setConsents] = useState([]);
  const [userDataResource, setUserDataResource] = useState(null);
  const [allUserDataResource, setAllUserDataResource] = useState(null);
  const userDataResourceRef = useRef({ userId: null, resource: null });

  // Función para cargar SOLO user y appearance
  const getUserData = async (userId) => {
    if (!userId) {
      setUser(null);
      setAppearanceSettings(null);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const [userResult, appearanceResult] = await Promise.allSettled([
        supabase.from('User').select('*').eq('id', userId).single(),
        supabase.from('Appearance').select('*').eq('userid', userId).single()
      ]);
      const userData = userResult.status === 'fulfilled' && !userResult.value.error ? userResult.value.data : null;
      const appearanceData = appearanceResult.status === 'fulfilled' && !appearanceResult.value.error ? appearanceResult.value.data : null;
      
      setUser(userData);
      setAppearanceSettings(appearanceData);
      return { user: userData, appearance: appearanceData };
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }

  function createUserDataResource(userId) {
    let status = 'pending';
    let result;
    const suspender = getUserData(userId).then(
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

  // We set the appearance settings when they are loaded
  useEffect(() => {
    setIsBrowser(true);
    if (appearanceSettings) {
      setTheme(appearanceSettings['Theme']);
      
      if (appearanceSettings['Accent Color']) {
        document.documentElement.setAttribute('data-color', appearanceSettings['Accent Color']);
      } else {
        document.documentElement.removeAttribute('data-color');
      }
    }
  }, [appearanceSettings]);

  // Cargar userDataResource solo una vez al iniciar la app
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          if(userDataResourceRef.current.userId !== session.user.id){
            const resource = createUserDataResource(session.user.id);
            userDataResourceRef.current = { userId: session.user.id, resource };
            setUserDataResource(resource);
            setAllUserDataResource(resource); // Compatibilidad
          } else {
            setUserDataResource(userDataResourceRef.current.resource);
            setAllUserDataResource(userDataResourceRef.current.resource); // Compatibilidad
          }
        } else {
          userDataResourceRef.current = { userId: null, resource: null };
          setUserDataResource(null);
          setAllUserDataResource(null);
          setWebs([]);
        }
      }
    );
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  //Redirect to login if no session
  const [checkingAuth, setCheckingAuth] = useState(true);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const isPublic = pathname.startsWith('/login') || pathname.startsWith('/public');
      if (!user && !isPublic) {
        router.replace('/login');
        return;
      }
      if (user && userDataResourceRef.current.userId !== user.id) {
        const resource = createUserDataResource(user.id);
        userDataResourceRef.current = { userId: user.id, resource };
        setUserDataResource(resource);
        setAllUserDataResource(resource);
      }
      if (!cancelled) setCheckingAuth(false);
    })();
    return () => { cancelled = true; };
  }, [pathname, router, supabase]);

  // Función para actualizar appearance settings
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

  // ... continúa con el resto del código (toggleSidebar, avatarColors, etc.) ...
  // (Mantener todo el código desde línea 178 hasta línea 738 igual)

  // Avatar's colors pool
  const avatarColors = {
    green: { backgroundColor: '#2FB11F', color: '#FFFFFF' },
    pink: { backgroundColor: '#FF3DDB', color: '#000000' },
    yellow: { backgroundColor: '#FEBA00', color: '#000000' },
    blue: { backgroundColor: '#0099FE', color: '#FFFFFF' },
    purple: { backgroundColor: '#9D4EDD', color: '#FFFFFF' },
    orange: { backgroundColor: '#FF6B35', color: '#000000' },
  };

  const checkProfilePicture = (user) => {
    const profilePicture = user?.["Avatar URL"];
    if(profilePicture === null || profilePicture === undefined || profilePicture === '') return '';
    return profilePicture;
  }

  const ProfileStyle = (user) => {
    const color = avatarColors[user?.["Avatar Color"]]?.color || '#FFFFFF';
    const backgroundColor = avatarColors[user?.["Avatar Color"]]?.backgroundColor || '#000000';
    return { color, backgroundColor }
  }

  const SiteStyle = (site) => {
    const color = avatarColors[site?.["Avatar Color"]]?.color || '#FFFFFF';
    const backgroundColor = avatarColors[site?.["Avatar Color"]]?.backgroundColor || '#000000';
    return { color, backgroundColor }
  }  

  const toggleSidebar = async () => {
    const newSidebarState = !isSidebarOpen;
    setIsSidebarOpen(newSidebarState);
    
    if (window.innerWidth > 767) {
      await updateAppearanceSettings({ Sidebar: newSidebarState });
    }

    const contentContainer = document.querySelector('.content__container');
    if (!isSidebarOpen) {
      contentContainer.classList.add('open');
    } else {
      contentContainer.classList.remove('open');
    }
  };

  // ... REST OF YOUR EXISTING CODE (handlers, modals, etc.) ...
  // TODO: Seguir leyendo desde línea 285 en adelante y mantenerlo igual
  
  // ... (mantener todo el código que no se menciona hasta la línea del contextProps)

  const contextProps = {
    // CAMBIO: Solo exponer userDataResource (para compatibilidad también allUserDataResource)
    userDataResource,
    allUserDataResource, // Para compatibilidad con componentes existentes
    user,
    webs,
    setWebs,
    isModalOpen,
    setIsModalOpen,
    isSidebarOpen,
    setModalType,
    setSiteData,
    siteData,
    setIsDropdownOpen,
    SiteStyle,
    showNotification,
    supabase,
    isDropdownOpen,
    handleCopy,
    setSelectedSite,
    openChangeModalSettings,
    openChangeModal,
    isScanning,
    setIsScanning,
    scanDone,
    setScanDone,
    MAX_SCANS,
    isInstalled,
    setIsInstalled,
    isVerifying,
    setIsVerifying,
    appearanceSettings,
    setAppearanceSettings,
    setOffcanvasType,
    setIsOffcanvasOpen,
    userSettings,
    setUserSettings,
    consents,
    setConsents,
    // ... resto de props
  };
  
  // Show loading state while checking authentication
  if (checkingAuth) {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-auth-checking', 'true');
    }
    return <div className="auth-checking-loader"></div>;
  } else {
    if (typeof document !== 'undefined') {
      document.documentElement.removeAttribute('data-auth-checking');
    }
  }

  return (
    <DashboardContext.Provider value={contextProps}>
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
          {isSiteOpen && !pathname.startsWith('/builder') && <DashboardHeader />}
          {children}
        </div>
        
        {/* Modals... */}
        {/* Notifications... */}
        {/* Offcanvas... */}
        {/* (Mantener todo el código de modales sin cambios) */}
      </div>
    </DashboardContext.Provider>
  );
}

export default DashboardLayout

