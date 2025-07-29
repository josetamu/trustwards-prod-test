'use client'

import './builder-root.css'
import './builder.css'

import BuilderLeftPanel from './builderLeftPanel/builderLeftPanel'
import BuilderBody from './builderBody/builderBody'
import BuilderRightPanel from './builderRightPanel/builderRightPanel'

function Builder() {
  return (
    <div className="tw-builder">
      <BuilderLeftPanel/>
      <BuilderBody/>
      <BuilderRightPanel/>
    </div>
  );
}

export default Builder