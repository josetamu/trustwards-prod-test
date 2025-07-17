// contexts/SidebarSettingsContext.jsx
'use client';
import { createContext, useContext, useState } from 'react';

const SidebarSettingsContext = createContext(null);

export function SidebarSettingsProvider({ initialState = true, children }) {
  const [sidebarState, setSidebarState] = useState(initialState); 

  console.log(sidebarState);

  return (
    <SidebarSettingsContext.Provider value={{ sidebarState, setSidebarState }}>
      {children}
    </SidebarSettingsContext.Provider>
  );
}

export function useSidebarSettings() {
  return useContext(SidebarSettingsContext);
}
