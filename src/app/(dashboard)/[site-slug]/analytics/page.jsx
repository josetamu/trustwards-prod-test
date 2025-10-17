'use client'

import './analytics.css';
import { useParams, notFound } from 'next/navigation';
import { useDashboard } from '@dashboard/layout';
import { ChartContainer, ChartTooltip, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Area, AreaChart, XAxis, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { useState, useEffect } from 'react';
import { InstallationFirst } from '../homeComponents/InstallationFirst';
import { Tooltip } from '@components/tooltip/Tooltip';
import { Dropdown } from '@components/dropdown/Dropdown';
import { supabase } from '@/supabase/supabaseClient';

function Analytics() {
    const params = useParams();
    const siteSlug = params['site-slug'];
    const { webs, setUserSettings, setIsModalOpen, setModalType } = useDashboard();
    const [timeRange, setTimeRange] = useState("7d");
    const [timeRangeDropdownOpen, setTimeRangeDropdownOpen] = useState(false);
    const [activeTooltip, setActiveTooltip] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [isLoadingChartData, setIsLoadingChartData] = useState(true);

    // Find the selected site based on the slug (using id like the main page)
    const selectedSite = webs.find(site => site.id === siteSlug);

    // Function to fetch and process consent data from Supabase
    useEffect(() => {
        const fetchConsentData = async () => {
            if (!selectedSite || !selectedSite.id || !selectedSite.Verified) return;
            
            setIsLoadingChartData(true);
            
            try {
                // Calculate date range based on timeRange
                const now = new Date();
                let startDate = new Date();
                
                if (timeRange === "7d") {
                    startDate.setDate(now.getDate() - 7);
                } else if (timeRange === "1m") {
                    startDate.setMonth(now.getMonth() - 1);
                } else if (timeRange === "1y") {
                    startDate.setFullYear(now.getFullYear() - 1);
                }
                
                // Fetch consents from Supabase for this site
                const { data: consents, error } = await supabase
                    .from('Consents')
                    .select('id, site_id, consent_data')
                    .eq('site_id', selectedSite.id);
                
                if (error) {
                    console.error('Error fetching consents:', error);
                    setChartData([]);
                    setIsLoadingChartData(false);
                    return;
                }
                
                // Filter consents by date range and keep only the latest consent per userip
                const latestConsentsByIP = {};
                
                consents.forEach(consent => {
                    console.log(consent);
                    const consentData = consent.consent_data;
                    if (!consentData || !consentData.userip || !consentData.ts) return;
                    
                    const userip = consentData.userip;
                    const timestamp = new Date(consentData.ts);
                    
                    // Filter by date range
                    if (timestamp < startDate || timestamp > now) return;
                    
                    // Keep only the latest consent for each userip
                    if (!latestConsentsByIP[userip] || 
                        new Date(latestConsentsByIP[userip].ts) < timestamp) {
                        latestConsentsByIP[userip] = consentData;
                    }
                });
                
                // Group consents by date and classify them
                const consentsByDate = {};
                
                Object.values(latestConsentsByIP).forEach(consentData => {
                    const date = new Date(consentData.ts);
                    let dateKey;
                    
                    // Format date based on time range
                    if (timeRange === "7d") {
                        dateKey = date.toISOString().split('T')[0];
                    } else if (timeRange === "1m") {
                        dateKey = date.toISOString().split('T')[0];
                    } else if (timeRange === "1y") {
                        // Group by month
                        dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
                    }
                    
                    if (!consentsByDate[dateKey]) {
                        consentsByDate[dateKey] = {
                            fullConsentGiven: 0,
                            parseConsentGiven: 0,
                            fullConsentRejected: 0
                        };
                    }
                    
                    // Classify consent based on categories (excluding Functional)
                    const categories = consentData.categories || {};
                    
                    // Filter out Functional category
                    const relevantCategories = Object.entries(categories)
                        .filter(([key]) => key !== 'Functional')
                        .map(([, value]) => value);
                    
                    if (relevantCategories.length === 0) {
                        // No relevant categories, consider as rejected
                        consentsByDate[dateKey].fullConsentRejected++;
                    } else if (relevantCategories.every(val => val === true)) {
                        // All relevant categories are true
                        consentsByDate[dateKey].fullConsentGiven++;
                    } else if (relevantCategories.every(val => val === false)) {
                        // All relevant categories are false
                        consentsByDate[dateKey].fullConsentRejected++;
                    } else {
                        // Mix of true and false
                        consentsByDate[dateKey].parseConsentGiven++;
                    }
                });
                
                // Convert to array and fill missing dates
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
                    
                    // Increment date
                    if (timeRange === "7d" || timeRange === "1m") {
                        currentDate.setDate(currentDate.getDate() + 1);
                    } else if (timeRange === "1y") {
                        currentDate.setMonth(currentDate.getMonth() + 1);
                    }
                }
                
                // Remove duplicates for yearly view
                const uniqueDates = timeRange === "1y" 
                    ? Array.from(new Map(dates.map(item => [item.date, item])).values())
                    : dates;
                
                setChartData(uniqueDates);
                setIsLoadingChartData(false);
                
            } catch (error) {
                console.error('Error processing consent data:', error);
                setChartData([]);
                setIsLoadingChartData(false);
            }
        };
        
        fetchConsentData();
    }, [selectedSite, timeRange]);

    if(!webs || webs.length === 0) {
        return
    }
    
    if (!selectedSite) {
        notFound();
    }

    // If not installed, show installation screen (check directly from site data)
    if (!selectedSite.Verified) {
        return (
            <div className='analytics'>
                <InstallationFirst siteSlug={siteSlug} />
            </div>
        );
    }

    // Chart configuration for the area chart - defines colors and labels for each consent type
    const chartConfig = {
        fullConsentGiven: {
            label: "Full Consent Given",
            color: "#0099FE", // Project Blue
        },
        parseConsentGiven: {
            label: "Parse Consent Given", 
            color: "#FFFFFF", // White
        },
        fullConsentRejected: {
            label: "Full Consent Rejected",
            color: "#6B7280", // Gray
        },
    };

    // Get time range label for display
    const getTimeRangeLabel = () => {
        switch (timeRange) {
            case "7d": return "last 7 days";
            case "1m": return "last month";
            case "1y": return "last year";
            default: return "last 7 days";
        }
    };

    // Data for radial charts with max values (raw values; proportion handled by axis domain)
    // Pages chart data - tracks total pages on the website
    const pagesValue = selectedSite.Pages || 0;
    const pagesMax = 12;
    const pagesData = [{ label: "pages", value: pagesValue }];

    // Scans chart data - tracks security scans performed
    const scansValue = selectedSite.Scans || 0;
    const scansMax = 50;
    const scansData = [{ label: "scans", value: scansValue }];

    // PoC chart data - tracks Proof of Concept implementations
    const pocValue = selectedSite["Monthly proof"] || 0;
    const pocMax = 50;
    const pocData = [{ label: "poc", value: pocValue }];

    // Custom tooltip component for radial charts
    const RadialTooltip = ({ active, payload, currentValue, maxValue, unit }) => {
        if (active && payload && payload.length) {
            return (
                <div className="analytics__tooltip">
                    <div className="analytics__radial-tooltip-content">
                        <div className="analytics__tooltip-label ">
                            {currentValue} {unit}
                        </div>
                        <div className="analytics__tooltip-value">
                            {maxValue} {unit} Max
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };


    return (
        <div className='analytics'>
            {/* Header Section */}
            <div className="analytics__header">
                <h1 className="analytics__title">Analytics</h1>
                <div className="analytics__header-content">
                    <p className="analytics__description">
                        Get detailed analytics and insights. <span 
                            className="analytics__upgrade-link" 
                            onClick={() => { setUserSettings('Billing'); setModalType('Billing'); setIsModalOpen(true); }} 
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setUserSettings('Billing'); setModalType('Billing'); setIsModalOpen(true); }}}
                            tabIndex={0}
                            aria-label="Upgrade this site to pro"
                            style={{ cursor: 'pointer' }}
                        >Upgrade</span> this site to pro.
                    </p>
                    <button 
                        className="analytics__upgrade-button" 
                        onClick={() => { setUserSettings('Billing'); setModalType('Billing'); setIsModalOpen(true); }}
                        aria-label="Upgrade to pro plan"
                    >
                        Upgrade
                    </button>
                </div>
            </div>

            {/* Main Area Chart - Shows consent analytics over time */}
            <div className="analytics__chart">
                <div className="analytics__chart-content">
                    <div className="analytics__chart-content-left-wrapper">
                        <h2 className="analytics__chart-title">Consent Analytics</h2>
                        <p className="analytics__chart-subtitle">
                            Showing consent data for the {getTimeRangeLabel()}.
                        </p>
                    </div>
                    
                    {/* Time range selector dropdown */}
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

                {/* Area chart container with gradient definitions */}
                <div className="analytics__area-chart-container">
                    <ChartContainer
                        config={chartConfig}
                        className="aspect-auto h-[250px] w-full"
                    >
                        <AreaChart data={chartData}>
                            {/* Gradient definitions for area chart fills */}
                            <defs>
                                <linearGradient id="fillFullConsentGiven" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor="var(--analytics-area-chart-given-gradient-start)"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="var(--analytics-area-chart-given-gradient-end)"
                                        stopOpacity={0.5}
                                    />
                                </linearGradient>
                                <linearGradient id="fillParseConsentGiven" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor="var(--analytics-area-chart-parse-gradient-start)"
                                        stopOpacity={1}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="var(--analytics-area-chart-parse-gradient-end)"
                                        stopOpacity={1}
                                    />
                                </linearGradient>
                                <linearGradient id="fillFullConsentRejected" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor="var(--analytics-area-chart-rejected-gradient-start)"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="var(--analytics-area-chart-rejected-gradient-end)"
                                        stopOpacity={0.5}
                                    />
                                </linearGradient>
                            </defs>
                            {/* X-axis with dynamic date formatting based on time range */}
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={timeRange === "1m" ? 16 : timeRange === "1y" ? 8 : 32}
                                tickFormatter={(value) => {
                                    const date = new Date(value);
                                    if (timeRange === "7d") {
                                        // Show month and day for "Last 7 days"
                                        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                                    } else if (timeRange === "1m") {
                                        // Show even days for "Last month"
                                        const day = date.getDate();
                                        return day % 2 === 0 ? day : "";
                                    } else if (timeRange === "1y") {
                                        // Show full month for "Last year"
                                        return date.toLocaleDateString("en-US", { month: "long" });
                                    }
                                    return value;
                                }}
                            />
                            {/* Custom tooltip with dynamic date formatting */}
                            <ChartTooltip
                                cursor={false}
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload;
                                        const date = new Date(data.date);
                                        
                                        if (isNaN(date.getTime())) {
                                            return null;
                                        }
                                        
                                        // Format date for tooltip based on selected time range
                                        let formattedDate;
                                        if (timeRange === "7d") {
                                            // Tooltip shows "Oct 15" for 7 days
                                            formattedDate = date.toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            });
                                        } else if (timeRange === "1m") {
                                            // Tooltip shows "Sep 15" for monthly view
                                            formattedDate = date.toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            });
                                        } else if (timeRange === "1y") {
                                            // Tooltip shows "Jan 2024" for yearly view
                                            formattedDate = date.toLocaleDateString("en-US", {
                                                month: "short",
                                                year: "numeric",
                                            });
                                        } else {
                                            // Default fallback
                                            formattedDate = date.toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            });
                                        }
                                        
                                        return (
                                            <div className="analytics__tooltip">
                                                <p className="analytics__tooltip-label">{formattedDate}</p>
                                                {payload.map((entry, index) => (
                                                    <div key={index} className="analytics__tooltip-value-content">
                                                        <div className="analytics__tooltip-left">
                                                            <span 
                                                                className="analytics__tooltip-dot" 
                                                                style={{ backgroundColor: entry.color }}
                                                            ></span>
                                                            <span className="analytics__tooltip-value">
                                                                {entry.dataKey === 'fullConsentGiven' ? 'Full Consent Given' :
                                                                entry.dataKey === 'parseConsentGiven' ? 'Parse Consent Given' :
                                                                'Full Consent Rejected'}
                                                            </span>
                                                        </div>
                                                        <span className="analytics__tooltip-value">{entry.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            {/* Area chart layers - stacked from bottom to top */}
                            <Area
                                dataKey="fullConsentGiven"
                                type="natural"
                                fill="url(#fillFullConsentGiven)"
                                stroke="var(--analytics-area-chart-given-stroke)"
                                stackId="a"
                            />
                            <Area
                                dataKey="parseConsentGiven"
                                type="natural"
                                fill="url(#fillParseConsentGiven)"
                                stroke="var(--analytics-area-chart-parse-stroke)"
                                stackId="a"
                            />
                            <Area
                                dataKey="fullConsentRejected"
                                type="natural"
                                fill="url(#fillFullConsentRejected)"
                                stroke="var(--analytics-area-chart-rejected-stroke)"
                                stackId="a"
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                        </AreaChart>
                </ChartContainer>
                </div>
            </div>

            {/* Radial Charts Section */}
            <div className="analytics__radial-charts">
                {/* Pages Chart - Shows total pages tracked */}
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
                                    message="Total number of pages tracked on your website"
                                    open={activeTooltip === 'pages'}
                                    responsivePosition={{ desktop: 'top', mobile: 'top' }}
                                    width="auto"
                                />
                            </span>
                    </div>

                    <div className="analytics__radial-chart-container">
                        <RadialBarChart width={200} height={200} cx="50%" cy="50%" innerRadius="70%" outerRadius="85%" data={pagesData} startAngle={90} endAngle={450}>
                            <PolarAngleAxis type="number" domain={[0, pagesMax]} tick={false} />
                            <ChartTooltip 
                                content={<RadialTooltip currentValue={pagesValue} maxValue={pagesMax} unit="Pages" />}
                                cursor={false}
                            />
                            <RadialBar dataKey="value" cornerRadius={10} fill="var(--analytics-radial-chart-fill)" background={{ fill: "var(--analytics-radial-chart-background)" }} />
                        </RadialBarChart>
                        <div className="analytics__radial-chart-center">
                            <span className="analytics__radial-chart-value">{pagesValue}</span>
                            <span className="analytics__radial-chart-label">Pages</span>
                        </div>
                    </div>
                </div>

                {/* Scans Chart - Shows security scans performed */}
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
                                    message="Number of security scans performed on your website"
                                    open={activeTooltip === 'scans'}
                                    responsivePosition={{ desktop: 'top', mobile: 'top' }}
                                    width="auto"
                                />
                            </span>
                    </div>

                    <div className="analytics__radial-chart-container">
                        <RadialBarChart width={200} height={200} cx="50%" cy="50%" innerRadius="70%" outerRadius="85%" data={scansData} startAngle={90} endAngle={450}>
                            <PolarAngleAxis type="number" domain={[0, scansMax]} tick={false} />
                            <ChartTooltip 
                                content={<RadialTooltip currentValue={scansValue} maxValue={scansMax} unit="Scans" />}
                                cursor={false}
                            />
                            <RadialBar dataKey="value" cornerRadius={10} fill="var(--analytics-radial-chart-fill)" background={{ fill: "var(--analytics-radial-chart-background)" }} />
                        </RadialBarChart>
                        <div className="analytics__radial-chart-center">
                            <span className="analytics__radial-chart-value">{scansValue}</span>
                            <span className="analytics__radial-chart-label">Scans</span>
                        </div>
                    </div>
                </div>

                {/* PoC Chart - Shows Proof of Concept implementations */}
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
                                    message="Proof of Concept implementations for your website"
                                    open={activeTooltip === 'poc'}
                                    responsivePosition={{ desktop: 'top', mobile: 'top' }}
                                    width="auto"
                                />
                            </span>
                    </div>

                    <div className="analytics__radial-chart-container">
                        <RadialBarChart width={200} height={200} cx="50%" cy="50%" innerRadius="70%" outerRadius="85%" data={pocData} startAngle={90} endAngle={450}>
                            <PolarAngleAxis type="number" domain={[0, pocMax]} tick={false} />
                            <ChartTooltip 
                                content={<RadialTooltip currentValue={pocValue} maxValue={pocMax} unit="PoC" />}
                                cursor={false}
                            />
                            <RadialBar dataKey="value" cornerRadius={10} fill="var(--analytics-radial-chart-fill)" background={{ fill: "var(--analytics-radial-chart-background)" }} />
                        </RadialBarChart>
                        <div className="analytics__radial-chart-center">
                            <span className="analytics__radial-chart-value">{pocValue}</span>
                            <span className="analytics__radial-chart-label">PoC</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Analytics;