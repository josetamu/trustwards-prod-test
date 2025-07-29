'use client'

import './builder-root.css'
import './builder.css'

import BuilderLeftPanel from './builderLeftPanel/builderLeftPanel'
import BuilderBody from './builderBody/builderBody'
import BuilderRightPanel from './builderRightPanel/builderRightPanel'
import { useEffect } from 'react';

function Builder() {
  //Remove padding from html from the dashboard
  useEffect(() => {
    document.documentElement.classList.add('trustwards-builder')

    return () => {
      document.documentElement.classList.remove('trustwards-builder')
    }
  }, [])

  return (
    <div className="tw-builder">
      <BuilderLeftPanel/>
      <BuilderBody/>
      <BuilderRightPanel/>
    </div>
  );
}

export default Builder;