'use client'

import './web.css'
import '@components/tooltip/Tooltip.css'
import Link from 'next/link'

function Web() {
  return (
    <div className="tw-root">
      <div className="tw-root__header">
        <Link href="/dashboard" className="tw-root__dashboard-button">Dashboard</Link>
      </div>
      
      <h1>Web</h1>
    </div>
  );
}

export default Web