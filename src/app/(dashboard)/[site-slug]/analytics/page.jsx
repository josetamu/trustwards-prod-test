'use client'

import './analytics.css';
import { useParams, notFound } from 'next/navigation';
import { useDashboard } from '@dashboard/DashboardContext';
import { useState, useEffect, useMemo, Suspense, useRef } from 'react';
import dynamic from 'next/dynamic';
import { InstallationFirst } from '../homeComponents/InstallationFirst';
import { Tooltip } from '@components/tooltip/Tooltip';
import { Dropdown } from '@components/dropdown/Dropdown';
import { supabase } from '@/supabase/supabaseClient';
import { HomeInstallationSkeleton } from '@components/Skeletons/HomeInstallationSkeleton';
import { AreaChartSkeleton, RadialChartSkeleton } from './ChartSkeleton';

// Dynamic imports for chart components - recharts is quite heavy
const ConsentAreaChart = dynamic(() => import('./ConsentAreaChart').then(mod => ({ default: mod.ConsentAreaChart })), {
  ssr: false,
  suspense: true,
});

const RadialMetricChart = dynamic(() => import('./RadialMetricChart').then(mod => ({ default: mod.RadialMetricChart })), {
  ssr: false,
  suspense: true,
});

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

async function fetchChartData(siteId, timeRange) {
    const { data: consents, error } = await supabase
      .from('Consents')
      .select('id, site_id, consent_data')
      .eq('site_id', siteId);
  
    if (error) throw error;
  
    const now = new Date();
    let startDate = new Date();
    if (timeRange === "7d") startDate.setDate(now.getDate() - 7);
    else if (timeRange === "1m") startDate.setMonth(now.getMonth() - 1);
    else if (timeRange === "1y") startDate.setFullYear(now.getFullYear() - 1);
  
    const latestConsentsByIP = {};
    consents.forEach(consent => {
      const consentData = consent.consent_data;
      if (!consentData || !consentData.userip || !consentData.ts) return;
      const userip = consentData.userip;
      const timestamp = new Date(consentData.ts);
      if (timestamp < startDate || timestamp > now) return;
      if (!latestConsentsByIP[userip] || new Date(latestConsentsByIP[userip].ts) < timestamp) {
        latestConsentsByIP[userip] = consentData;
      }
    });
  
    const consentsByDate = {};
    Object.values(latestConsentsByIP).forEach(consentData => {
      const date = new Date(consentData.ts);
      let dateKey;
      if (timeRange === "7d" || timeRange === "1m") {
        dateKey = date.toISOString().split('T')[0];
      } else if (timeRange === "1y") {
        dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
      }
      if (!consentsByDate[dateKey]) {
        consentsByDate[dateKey] = {
          fullConsentGiven: 0,
          parseConsentGiven: 0,
          fullConsentRejected: 0
        };
      }
      const categories = consentData.categories || {};
      const relevant = Object.entries(categories).filter(([k]) => k !== 'Functional').map(([, v]) => v);
      if (relevant.length === 0) consentsByDate[dateKey].fullConsentRejected++;
      else if (relevant.every(Boolean)) consentsByDate[dateKey].fullConsentGiven++;
      else if (relevant.every(v => v === false)) consentsByDate[dateKey].fullConsentRejected++;
      else consentsByDate[dateKey].parseConsentGiven++;
    });
  
    const dates = [];
    const currentDate = new Date(startDate);
    while (currentDate <= now) {
      let dateKey;
      if (timeRange === "7d" || timeRange === "1m") {
        dateKey = currentDate.toISOString().split('T')[0];
      } else if (timeRange === "1y") {
        dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-01`;
      }
      dates.push({
        date: dateKey,
        fullConsentGiven: consentsByDate[dateKey]?.fullConsentGiven || 0,
        parseConsentGiven: consentsByDate[dateKey]?.parseConsentGiven || 0,
        fullConsentRejected: consentsByDate[dateKey]?.fullConsentRejected || 0
      });
      if (timeRange === "7d" || timeRange === "1m") currentDate.setDate(currentDate.getDate() + 1);
      else if (timeRange === "1y") currentDate.setMonth(currentDate.getMonth() + 1);
    }
  
    return timeRange === "1y"
      ? Array.from(new Map(dates.map(item => [item.date, item])).values())
      : dates;
  }



function AnalyticsContent({ site, initialChartData, defaultTimeRange = "7d" }) {


  const params = useParams();
  const siteSlug = params['site-slug'];
  const { setOffcanvasType, setIsOffcanvasOpen } = useDashboard();
  const [timeRange, setTimeRange] = useState(defaultTimeRange);
  const [timeRangeDropdownOpen, setTimeRangeDropdownOpen] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [chartData, setChartData] = useState(initialChartData || []);
  const [isLoadingChartData, setIsLoadingChartData] = useState(!initialChartData);
  const [chartKey, setChartKey] = useState(0);




  useEffect(() => {
    const fetchConsentData = async () => {
      if (!site || !site.id || !site.Verified) return;

      
      if (initialChartData && timeRange === defaultTimeRange && chartData === initialChartData) {
        setIsLoadingChartData(false);
        return;
      }

      setIsLoadingChartData(true);
      try {
        const data = await fetchChartData(site.id, timeRange);
        setChartData(data);
        setIsLoadingChartData(false);
   
      } catch (error) {
        console.error('Error processing consent data:', error);
        setChartData([]);
        setIsLoadingChartData(false);
      }
    };

    fetchConsentData();
  }, [site, timeRange]);

  if (!site) {
    notFound();
  }

  if (!site.Verified) {
    return (
      <div className='analytics'>
        <InstallationFirst siteSlug={siteSlug} />
      </div>
    );
  }

  const chartConfig = {
    fullConsentGiven: { label: "Full Consent Given", color: "#0099FE" },
    parseConsentGiven: { label: "Parse Consent Given", color: "#FFFFFF" },
    fullConsentRejected: { label: "Full Consent Rejected", color: "#6B7280" },
  };

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case "7d": return "last 7 days";
      case "1m": return "last month";
      case "1y": return "last year";
      default: return "last 7 days";
    }
  };

  const pagesValue = site.Pages || 0;
  const pagesMax = 12;
  const pagesData = [{ label: "pages", value: pagesValue }];

  const scansValue = site.Scans || 0;
  const scansMax = 50;
  const scansData = [{ label: "scans", value: scansValue }];

  const pocValue = site["Monthly proof"] || 0;
  const pocMax = 50;
  const pocData = [{ label: "poc", value: pocValue }];

  return (
    <div className='analytics'>
      <div className="analytics__header">
        <h1 className="analytics__title">Analytics</h1>
        <div className="analytics__header-content">
          <p className="analytics__description">
            Get detailed analytics and insights. <span
              className="analytics__upgrade-link"
              onClick={() => { setOffcanvasType('Pricing'); setIsOffcanvasOpen(true); }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOffcanvasType('Pricing'); setIsOffcanvasOpen(true); }}}
              tabIndex={0}
              aria-label="Upgrade this site to pro"
              style={{ cursor: 'pointer' }}
            >Upgrade</span> this site to pro.
          </p>
          <button
            className="analytics__upgrade-button"
            onClick={() => { setOffcanvasType('Pricing'); setIsOffcanvasOpen(true); }}
            aria-label="Upgrade to pro plan"
          >
            Upgrade
          </button>
        </div>
      </div>

      <div className="analytics__chart">
        <div className="analytics__chart-content">
          <div className="analytics__chart-content-left-wrapper">
            <h2 className="analytics__chart-title">Consent Analytics</h2>
            <p className="analytics__chart-subtitle">
              Showing consent data for the {getTimeRangeLabel()}.
            </p>
          </div>

          <div className="analytics__chart-dropdown">
            <Dropdown
              open={timeRangeDropdownOpen}
              onClose={() => setTimeRangeDropdownOpen(false)}
              menu={
                <>
                  <button
                    className={`dropdown__item ${timeRange === "7d" ? 'dropdown__item--selected' : ''}`}
                    onClick={() => { setTimeRange("7d"); setTimeRangeDropdownOpen(false); }}
                  >
                    <span>Last 7 days</span>
                    {timeRange === "7d" && (
                      <svg className="dropdown__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M20.1757 5.26268C20.5828 5.63587 20.6103 6.26844 20.2372 6.67556L9.23715 18.6756C9.05285 18.8766 8.79441 18.9937 8.52172 18.9996C8.24903 19.0055 7.98576 18.8998 7.79289 18.7069L3.29289 14.2069C2.90237 13.8164 2.90237 13.1832 3.29289 12.7927C3.68342 12.4022 4.31658 12.4022 4.70711 12.7927L8.46859 16.5542L18.7628 5.32411C19.136 4.91699 19.7686 4.88948 20.1757 5.26268Z" fill="currentColor"></path>
                      </svg>
                    )}
                  </button>
                  <button
                    className={`dropdown__item ${timeRange === "1m" ? 'dropdown__item--selected' : ''}`}
                    onClick={() => { setTimeRange("1m"); setTimeRangeDropdownOpen(false); }}
                  >
                    <span>Last month</span>
                    {timeRange === "1m" && (
                      <svg className="dropdown__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M20.1757 5.26268C20.5828 5.63587 20.6103 6.26844 20.2372 6.67556L9.23715 18.6756C9.05285 18.8766 8.79441 18.9937 8.52172 18.9996C8.24903 19.0055 7.98576 18.8998 7.79289 18.7069L3.29289 14.2069C2.90237 13.8164 2.90237 13.1832 3.29289 12.7927C3.68342 12.4022 4.31658 12.4022 4.70711 12.7927L8.46859 16.5542L18.7628 5.32411C19.136 4.91699 19.7686 4.88948 20.1757 5.26268Z" fill="currentColor"></path>
                      </svg>
                    )}
                  </button>
                  <button
                    className={`dropdown__item ${timeRange === "1y" ? 'dropdown__item--selected' : ''}`}
                    onClick={() => { setTimeRange("1y"); setTimeRangeDropdownOpen(false); }}
                  >
                    <span>Last year</span>
                    {timeRange === "1y" && (
                      <svg className="dropdown__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M20.1757 5.26268C20.5828 5.63587 20.6103 6.26844 20.2372 6.67556L9.23715 18.6756C9.05285 18.8766 8.79441 18.9937 8.52172 18.9996C8.24903 19.0055 7.98576 18.8998 7.79289 18.7069L3.29289 14.2069C2.90237 13.8164 2.90237 13.1832 3.29289 12.7927C3.68342 12.4022 4.31658 12.4022 4.70711 12.7927L8.46859 16.5542L18.7628 5.32411C19.136 4.91699 19.7686 4.88948 20.1757 5.26268Z" fill="currentColor"></path>
                      </svg>
                    )}
                  </button>
                </>
              }
            >
              <button
                className="analytics__dropdown-trigger"
                onClick={() => setTimeRangeDropdownOpen(!timeRangeDropdownOpen)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTimeRangeDropdownOpen(!timeRangeDropdownOpen); }}}
                aria-expanded={timeRangeDropdownOpen}
                aria-haspopup="listbox"
                aria-label="Select time range"
              >
                <span className="analytics__dropdown-value">
                  {timeRange === "7d" ? "Last 7 days" :
                   timeRange === "1m" ? "Last month" : "Last year"}
                </span>
                <svg
                  className={`analytics__dropdown-chevron ${timeRangeDropdownOpen ? 'analytics__dropdown-chevron--open' : ''}`}
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    d="M3 4.5L6 7.5L9 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </Dropdown>
          </div>
        </div>

        <div className="analytics__chart-divider"></div>

        <Suspense fallback={<AreaChartSkeleton />}>
          <ConsentAreaChart 
            chartData={chartData} 
            timeRange={timeRange} 
            chartConfig={chartConfig} 
          />
        </Suspense>
      </div>

      <div className="analytics__radial-charts">
        <div className="analytics__chart">
          <div className="analytics__radial-chart-content">
            <h3 className="analytics__chart-title">Pages</h3>
            <span
              className="analytics__chart-info-icon"
              onMouseEnter={() => setActiveTooltip('pages')}
              onMouseLeave={() => setActiveTooltip(null)}
              onFocus={() => setActiveTooltip('pages')}
              onBlur={() => setActiveTooltip(null)}
              tabIndex={0}
              aria-label="Information about pages metric"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M12 16V11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M12 8.01172V8.00172" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
              <Tooltip
                message="Total number of pages tracked on your website (12 max)"
                open={activeTooltip === 'pages'}
                responsivePosition={{ desktop: 'top', tablet: 'right', mobile: 'right' }}
                responsiveAnimation={{ desktop: 'SCALE_BOTTOM', tablet: 'SCALE_LEFT', mobile: 'SCALE_LEFT' }}
                width="200px"
              />
            </span>
          </div>
          <Suspense fallback={<RadialChartSkeleton />}>
            <RadialMetricChart
              chartKey={`pages-${chartKey}`}
              data={pagesData}
              max={pagesMax}
              label="Pages"
              value={pagesValue}
            />
          </Suspense>
        </div>

        <div className="analytics__chart">
          <div className="analytics__radial-chart-content">
            <h3 className="analytics__chart-title">Scans</h3>
            <span
              className="analytics__chart-info-icon"
              onMouseEnter={() => setActiveTooltip('scans')}
              onMouseLeave={() => setActiveTooltip(null)}
              onFocus={() => setActiveTooltip('scans')}
              onBlur={() => setActiveTooltip(null)}
              tabIndex={0}
              aria-label="Information about scans metric"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M12 16V11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M12 8.01172V8.00172" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
              <Tooltip
                message="Number of security scans performed on your website (3 max)"
                open={activeTooltip === 'scans'}
                responsivePosition={{ desktop: 'top', tablet: 'right', mobile: 'right' }}
                responsiveAnimation={{ desktop: 'SCALE_BOTTOM', tablet: 'SCALE_LEFT', mobile: 'SCALE_LEFT' }}
                width="200px"
              />
            </span>
          </div>
          <Suspense fallback={<RadialChartSkeleton />}>
            <RadialMetricChart
              chartKey={`scans-${chartKey}`}
              data={scansData}
              max={scansMax}
              label="Scans"
              value={scansValue}
            />
          </Suspense>
        </div>

        <div className="analytics__chart">
          <div className="analytics__radial-chart-content">
            <h3 className="analytics__chart-title">PoC</h3>
            <span
              className="analytics__chart-info-icon"
              onMouseEnter={() => setActiveTooltip('poc')}
              onMouseLeave={() => setActiveTooltip(null)}
              onFocus={() => setActiveTooltip('poc')}
              onBlur={() => setActiveTooltip(null)}
              tabIndex={0}
              aria-label="Information about PoC metric"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M12 16V11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M12 8.01172V8.00172" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
              <Tooltip
                message="Proof of Concept implementations for your website (3 max)"
                open={activeTooltip === 'poc'}
                responsivePosition={{ desktop: 'top', tablet: 'right', mobile: 'right' }}
                responsiveAnimation={{ desktop: 'SCALE_BOTTOM', tablet: 'SCALE_LEFT', mobile: 'SCALE_LEFT' }}
                width="200px"
              />
            </span>
          </div>
          <Suspense fallback={<RadialChartSkeleton />}>
            <RadialMetricChart
              chartKey={`poc-${chartKey}`}
              data={pocData}
              max={pocMax}
              label="PoC"
              value={pocValue}
            />
          </Suspense>
        </div>
      </div>

    </div>
  );
}
function AnalyticsResourceContent({ site, resource, defaultTimeRange = "7d" }) {
    const { initialChartData } = resource.read();
    return (
      <AnalyticsContent
        site={site}
        initialChartData={initialChartData}
        defaultTimeRange={defaultTimeRange}
      />
    );
  }

function Home() {
    const params = useParams();
    const siteSlug = params['site-slug'];
    const { siteData, allUserDataResource } = useDashboard();

    const defaultTimeRange = "7d";

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    const delay = 1500;

    const resource = useMemo(() => {
      if (!siteSlug || !siteData) return null;

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
            await p; // pendiente
            return null;
          }
          throw p;
        }
      })();

      const dataLoader = (async () => {
        let chartData = null;
        if (siteData?.Verified) {
          chartData = await fetchChartData(siteData.id, defaultTimeRange);
        }
        return { initialChartData: chartData };
      })();

      return createResource(
        Promise.all([dataLoader, gate]).then(([data]) => data)
      );
    }, [siteSlug, siteData, allUserDataResource]);

    return (
      <div className='analytics'>
        <Suspense fallback={<HomeInstallationSkeleton />}>
          {resource && siteData ? (
            <AnalyticsResourceContent
              site={siteData}
              resource={resource}
              defaultTimeRange={defaultTimeRange}
            />
          ) : (
            <HomeInstallationSkeleton />
          )}
        </Suspense>
      </div>
    );
  }

export default Home;