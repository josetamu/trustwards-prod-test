'use client'

import { createContext, useContext } from 'react';

// Context to share all dashboard data and functions
export const DashboardContext = createContext(null);

// Hook to consume the Dashboard context
export const useDashboard = () => useContext(DashboardContext);
