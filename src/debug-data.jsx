'use client'

import { useDashboard } from './app/dashboard/layout';

export const DebugData = () => {
    const { allUserDataResource, user, webs } = useDashboard();
    
    console.log('Debug - allUserDataResource:', allUserDataResource);
    console.log('Debug - user:', user);
    console.log('Debug - webs:', webs);
    
    try {
        if (allUserDataResource) {
            const data = allUserDataResource.read();
            console.log('Debug - resource data:', data);
        }
    } catch (error) {
        console.log('Debug - resource error or pending:', error);
    }
    
    return (
        <div style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            fontSize: '12px',
            zIndex: 9999
        }}>
            <div>User: {user ? 'Loaded' : 'Loading...'}</div>
            <div>Webs: {webs?.length || 0} sites</div>
            <div>Resource: {allUserDataResource ? 'Available' : 'Loading...'}</div>
        </div>
    );
} 