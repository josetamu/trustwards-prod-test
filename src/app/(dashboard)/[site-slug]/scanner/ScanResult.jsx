import { ScanButton } from "./ScanButton";
import { ScanResultSkeleton } from "@components/Skeletons/ScanResultSkeleton";
import { Suspense, useState, useEffect } from "react";
import { useDashboard } from "@dashboard/DashboardContext";
import './scanner.css';
import '../home.css';
import React from "react";
import { supabase } from "@supabase/supabaseClient";

import Scanner from '@components/scan/scanner';
  
// renders scan results grouped by category
function ResultCardArray({ results }) {
  const [isVisible, setIsVisible] = React.useState(false);

  // Convert scanned JSON to grouped array format
  const convertedResults = React.useMemo(() => {
      // Group by category
      const grouped = {};
      
      results.forEach(item => {
          if (!grouped[item.category]) {
              grouped[item.category] = [];
          }
          
          grouped[item.category].push({
              status: item.name === 'Unknown' ? 'untracked' : 'tracked',
              name: item.name,
              script: item.src
          });
      });
      
      // Convert to the required format with groups array
      const unsortedResults = Object.keys(grouped).map(category => ({
          category: category,
          groups: [grouped[category]]
      }));
      
      // Define category priority order
      const categoryOrder = ['Functional', 'Analytics', 'Marketing', 'Other'];
      
      // Sort results by category priority
      return unsortedResults.sort((a, b) => {
          const indexA = categoryOrder.indexOf(a.category);
          const indexB = categoryOrder.indexOf(b.category);
          
          // If category not in order list, put it at the end
          const orderA = indexA === -1 ? categoryOrder.length : indexA;
          const orderB = indexB === -1 ? categoryOrder.length : indexB;
          
          return orderA - orderB;
      });
  }, [results]);

  // Trigger fade-in animation when component mounts
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`scanner__results-container ${isVisible ? 'scanner__results-container--visible' : ''}`}>
      {convertedResults.map((cat, idx) => (
        <div className="scanner__card" key={cat.category}>
            <div className='scanner__card-wrapper'>
                <div className="scanner__card-scripts-count">
                    {cat.groups.reduce((acc, group) => acc + group.length, 0)} SCRIPTS
                </div>
                <div className="scanner__card-title">{cat.category}</div>
                <div className="scanner__card-table-responsive">
                  <div className="scanner__card-table">
                      <div className="scanner__card-table-titles-wrapper">
                        <div className="scanner__card-table-title">Status</div>
                        <div className="scanner__card-table-title">Name</div>
                        <div className="scanner__card-table-title">Script</div>
                      </div>



                      <div className="scanner__card-divider"></div>


                      {cat.groups.map((group, gIdx) =>
                        group.map((script, sIdx) => (
                          <div className="scanner__card-table-row" key={gIdx + '-' + sIdx}>

                              <span
                                className={`scanner__card-table-script ${script.status === 'tracked'
                                  ? 'scanner__card-status--tracked'
                                  : 'scanner__card-status--untracked'
                                  }`}
                              >
                                {script.status === 'tracked' ? '● Tracked' : '✖ Untracked'}
                              </span>


                              <span className='scanner__card-table-script'>{script.name}</span>

                              <span className='scanner__card-table-script'>{script.script}</span>

                          </div>
                        ))
                      )}

                  </div>
                </div>
            </div>
        </div>
      ))}
    </div>
  );
}

export const ScanResult = ({scanDone, isScanning, MAX_SCANS, setScanDone, setIsScanning, siteSlug, scanCount, setScanCount}) => {
  const {allUserDataResource, showNotification, setSiteData, setIsInstalled, setWebs, siteData} = useDashboard();
  
  //Scan results from the scanner
  const [scriptsScanned, setScriptsScanned] = useState([]);
  const [iframesScanned, setIframesScanned] = useState([]);

  //Data used by scanner
  const [siteId, setSiteId] = useState(null);
  const [domain, setDomain] = useState(null);
  const urlPath = '/';
  
  //Set scriptsScanned and iframesScanned from supabase
  useEffect(() => {
    const fetchScanResults = async () => {
      if (!siteData?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('Site')
          .select('scriptsScanned, iframesScanned')
          .eq('id', siteData.id)
          .single();
        
        if (error) {
          console.error('Error fetching scan results:', error);
          return;
        }
        
        if (data) {
          setScriptsScanned(data.scriptsScanned || []);
          setIframesScanned(data.iframesScanned || []);
          setSiteId(siteData.id);
          setDomain(siteData.Domain);
        }
      } catch (error) {
        console.error('Error fetching scan results:', error);
      }
    };
    
    fetchScanResults();
  }, [siteData]); //not only siteData?.id so that Domain can be changed in real time and sync with the Scanner without reloading the page
  
  if(!allUserDataResource) return <ScanResultSkeleton />;
  const {webs} = allUserDataResource.read();
  const site = webs.find(web => web.id === siteSlug);
  const isInstalled = site?.Verified;


    /*
    Scenario 1: Scanning - Show scanning message
    Scenario 2: Scan finished or 1+ Scans done - Show scanner results
    Scenario 3: 0 Scans done - Show no scans message yet
    */
    if(isScanning){
        return (
          <>
            <div className="scanner__card-divider"></div>
            <div className="scanner__main-box">
              <div className="scanner__main-box-content">
                <Scanner
                  domain={domain} siteId={siteId} urlPath={urlPath}
                  setIsScanning={setIsScanning} setScanDone={setScanDone} scriptsScanned={scriptsScanned} iframesScanned={iframesScanned} setScriptsScanned={setScriptsScanned} setIframesScanned={setIframesScanned}
                  scanCount={scanCount} setScanCount={setScanCount}
                />
              </div>
            </div>
          </>
        )
    }else if(scanDone || scanCount > 0){
        return (
            <>
              <div className="scanner__card-divider"></div>
              {scriptsScanned && scriptsScanned.length > 0 && (
                <>
                  <span className="scanner__scanned-title">Scripts Scanned</span>
                  <ResultCardArray results={scriptsScanned}/>
                </>
              )}
              {iframesScanned && iframesScanned.length > 0 && (
                <>
                  <span className="scanner__scanned-title">Iframes Scanned</span>
                  <ResultCardArray results={iframesScanned}/>
                </>
              )}
            </>
        )
    }else{
        return (
          <>
            <div className="scanner__card-divider"></div>
            <div className="scanner__main-box">
              <div className="scanner__main-box-content">
                <>
                  <div className="scanner__main-box-text">Scan your website for the first time<br/>to see all the scripts inserting cookies</div>
                  <Suspense fallback={<ScanResultSkeleton />}>
                      <ScanButton isScanning={isScanning} MAX_SCANS={MAX_SCANS} setScanDone={setScanDone} setIsScanning={setIsScanning} siteSlug={siteSlug} />
                  </Suspense>
                </>
              </div>
            </div>
          </>
        )
    }
}