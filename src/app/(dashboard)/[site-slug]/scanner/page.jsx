'use client'

import './scanner.css';
import { useParams } from 'next/navigation';
import React, { useState, Suspense, useMemo } from 'react';
import PlanSkeleton from '@components/Skeletons/PlanSkeleton';
import { ScanButton } from './ScanButton';
import { MonthlyScans } from './MonthlyScans';
import { MonthlyScansSkeleton } from '@components/Skeletons/MonthlyScansSkeleton';
import { ScanResult } from './ScanResult';
import { ScanResultSkeleton } from '@components/Skeletons/ScanResultSkeleton';
import { useDashboard } from '@dashboard/layout';
import { supabase } from '@supabase/supabaseClient';
import { InstallationFirst } from '../homeComponents/InstallationFirst';

function createResource(promise) {
  let status = 'pending';
  let result;
  const suspender = promise.then(
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

async function fetchScannerData(siteSlug) {
  const [{ data: site, error: siteErr }, { data: siteScans, error: scansErr }] = await Promise.all([
    supabase.from('Site').select('*').eq('id', siteSlug).single(),
    supabase.from('Site').select('Scans').eq('id', siteSlug).single()
  ]);
  if (siteErr) throw siteErr;
  if (scansErr) throw scansErr;
  const scanCount = siteScans?.Scans || 0;
  return { site, scanCount };
}

function ScannerContent({ resource }) {
  const { site, scanCount: initialScanCount } = resource.read();

  const params = useParams();
  const siteSlug = params['site-slug'];
  const { isScanning, setIsScanning, scanDone, setScanDone, MAX_SCANS } = useDashboard();

  const [scanCount, setScanCount] = useState(initialScanCount);

  if (!site) {
    return null;
  }

  if (!site.Verified) {
    return (
      <div className="scanner">
        <InstallationFirst siteSlug={siteSlug} />
      </div>
    );
  }

  return (
    <div className="scanner">
      <div className='scanner__top-wrapper'>
        <div className="scanner__header">
          <h2 className='scanner__title'>Scanner</h2>
          <p className='scanner__paragraph'>In the scanner you can check all the scripts inserting cookies on your website.</p>
        </div>
        <div className='scanner__actions'>
          <ScanButton
            isScanning={isScanning}
            MAX_SCANS={MAX_SCANS}
            setScanDone={setScanDone}
            setIsScanning={setIsScanning}
            siteSlug={siteSlug}
          />
          <MonthlyScans scanCount={scanCount} MAX_SCANS={MAX_SCANS} />
        </div>
      </div>
      <ScanResult
        scanDone={scanDone}
        isScanning={isScanning}
        MAX_SCANS={MAX_SCANS}
        setScanDone={setScanDone}
        setIsScanning={setIsScanning}
        siteSlug={siteSlug}
        scanCount={scanCount}
        setScanCount={setScanCount}
      />
    </div>
  );
}

function Home() {
    const params = useParams();
    const siteSlug = params['site-slug'];
    const { allUserDataResource } = useDashboard();
  
    const resource = useMemo(() => {
      if (!siteSlug) return null;
  
      const sleep = (ms) => new Promise(r => setTimeout(r, ms));
      const delay = 1500;
  
      const res = allUserDataResource;
      const gate = (async () => {
        if (!res) {
          await sleep(delay);
          return null;
        }
        try {
          const v = res.read(); // resolved
          await sleep(delay);
          return v;
        } catch (p) {
          if (p && typeof p.then === 'function') {
            await p; // pending
            return null;
          }
          throw p;
        }
      })();
  
      return createResource(
        Promise.all([fetchScannerData(siteSlug), gate]).then(([data]) => data)
      );
    }, [siteSlug, allUserDataResource]);
  
    const Skeleton = (
      <div className="scanner">
        <div className='scanner__top-wrapper'>
          <div className="scanner__header">
            <h2 className='scanner__title'>Scanner</h2>
            <p className='scanner__paragraph'>In the scanner you can check all the scripts inserting cookies on your website.</p>
          </div>
          <div className='scanner__actions'>
            <PlanSkeleton />
            <MonthlyScansSkeleton />
          </div>
        </div>
        <ScanResultSkeleton />
      </div>
    );
  
    return (
      <div className="scanner">
        <Suspense fallback={Skeleton}>
          {resource ? <ScannerContent resource={resource} /> : Skeleton}
        </Suspense>
      </div>
    );
  }

export default Home;