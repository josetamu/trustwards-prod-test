import  Scan  from "@components/scan/Scan";
import { ScanButton } from "./ScanButton";
import { ScanResultSkeleton } from "@components/Skeletons/ScanResultSkeleton";
import { Suspense, useState } from "react";
import { useDashboard } from "../../layout";
import './scanner.css';
import React from "react";

// tridimensional array with default scan results grouped by category
const defaultScanResults = [
    {
      category: 'Marketing',
      groups: [
        [
          { status: 'tracked', name: 'Google Ads', script: 'https://trustwards.io/cdn/8495-9687-0233-4545.min.js' },
          { status: 'untracked', name: '???', script: 'https://trustwards.io/cdn/8495-9687-0233-4545.min.js' },
        ],
      ],
    },
    {
      category: 'Functional',
      groups: [
        [
          { status: 'tracked', name: 'Trustwards', script: 'https://trustwards.io/cdn/8495-9687-0233-4545.min.js' },
          { status: 'untracked', name: '???', script: 'https://trustwards.io/cdn/8495-9687-0233-4545.min.js' },
        ],
      ],
    },
    {
      category: 'Required',
      groups: [
        [
          { status: 'tracked', name: 'Google Analytics', script: 'https://trustwards.io/cdn/8495-9687-0233-4545.min.js' },
          { status: 'untracked', name: '???', script: 'https://trustwards.io/cdn/8495-9687-0233-4545.min.js' },
        ],
      ],
    },
    
  ];
  
  // renders scan results grouped by category
  function ResultCardArray({ results }) {
    const [isVisible, setIsVisible] = React.useState(false);
  
    // Trigger fade-in animation when component mounts
    React.useEffect(() => {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    }, []);
  
    return (
      <div className={`scanner__results-container ${isVisible ? 'scanner__results-container--visible' : ''}`}>
        {results.map((cat, idx) => (
          <div className="scanner__card" key={cat.category}>
              <div className='scanner__card-wrapper'>
                  <div className="scanner__card-scripts-count">
                      {cat.groups.reduce((acc, group) => acc + group.length, 0)} SCRIPTS
                  </div>
                  <div className="scanner__card-title">{cat.category}</div>
                  <div className="scanner__card-table-responsive">
                    <table className="scanner__card-table">
                      <thead>
                        <tr>
                          <th className="scanner__card-table-title">Status</th>
                          <th className="scanner__card-table-title">Name</th>
                          <th className="scanner__card-table-title">Script</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td colSpan={3}>
                            <div className="scanner__card-divider"></div>
                          </td>
                        </tr>
                        {cat.groups.map((group, gIdx) =>
                          group.map((script, sIdx) => (
                            <tr key={gIdx + '-' + sIdx}>
                              <td>
                                <span
                                  className={`scanner__card-table-script ${script.status === 'tracked'
                                    ? 'scanner__card-status--tracked'
                                    : 'scanner__card-status--untracked'
                                    }`}
                                >
                                  {script.status === 'tracked' ? '● Tracked' : '✖ Untracked'}
                                </span>
                              </td>
                              <td>
                                <span className='scanner__card-table-script'>{script.name}</span>
                              </td>
                              <td>
                                <span className='scanner__card-table-script'>{script.script}</span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
              </div>
          </div>
        ))}
      </div>
    );
  }

export const ScanResult = ({scanDone, isScanning, MAX_SCANS, setScanDone, setIsScanning, siteSlug}) => {
    const [scanResults, setScanResults] = useState(defaultScanResults);
    const {allUserDataResource } = useDashboard();
    if(!allUserDataResource) return <ScanResultSkeleton />;
    const {webs} = allUserDataResource.read();
    const site = webs.find(web => web.id === siteSlug);
    const scanCount = site.Scans;
    
    return (
        (scanDone || scanCount > 0) ? (
            <>
                <div className="scanner__card-divider"></div>
                <ResultCardArray results={scanResults} />
            </>
        ) : (
            <div className="scanner__main-box">
                <div className="scanner__main-box-content">
                    {isScanning ? (
                        <Scan isScanning={isScanning}/>
                    ) : (
                        <>
                            <div className="scanner__main-box-text">Scan your website for the first time<br/>to see all the scripts inserting cookies</div>
                            <Suspense fallback={<ScanResultSkeleton />}>
                                <ScanButton isScanning={isScanning} MAX_SCANS={MAX_SCANS} setScanDone={setScanDone} setIsScanning={setIsScanning} siteSlug={siteSlug} />
                            </Suspense>
                        </>
                    )}
                </div>
            </div>
        )
    )
}