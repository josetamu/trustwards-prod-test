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

function Analytics() {
    const params = useParams();
    const siteSlug = params['site-slug'];
    const { webs, setUserSettings, setIsModalOpen, setModalType } = useDashboard();
    const [timeRange, setTimeRange] = useState("7d");
    const [timeRangeDropdownOpen, setTimeRangeDropdownOpen] = useState(false);
    const [activeTooltip, setActiveTooltip] = useState(null);

    // Find the selected site based on the slug (using id like the main page)
    const selectedSite = webs.find(site => site.id === siteSlug);


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


    // Static data for each time range - returns different datasets based on selected time range
    const getChartData = () => {
        if (timeRange === "7d") {
            return [
                { date: "2024-10-09", fullConsentGiven: 222, parseConsentGiven: 150, fullConsentRejected: 100 },
                { date: "2024-10-10", fullConsentGiven: 97, parseConsentGiven: 180, fullConsentRejected: 80 },
                { date: "2024-10-11", fullConsentGiven: 167, parseConsentGiven: 120, fullConsentRejected: 90 },
                { date: "2024-10-12", fullConsentGiven: 242, parseConsentGiven: 260, fullConsentRejected: 120 },
                { date: "2024-10-13", fullConsentGiven: 373, parseConsentGiven: 290, fullConsentRejected: 150 },
                { date: "2024-10-14", fullConsentGiven: 301, parseConsentGiven: 340, fullConsentRejected: 180 },
                { date: "2024-10-15", fullConsentGiven: 245, parseConsentGiven: 180, fullConsentRejected: 110 },
            ];
        } else if (timeRange === "1m") {
            return [
                { date: "2024-09-01", fullConsentGiven: 222, parseConsentGiven: 150, fullConsentRejected: 100 },
                { date: "2024-09-02", fullConsentGiven: 97, parseConsentGiven: 180, fullConsentRejected: 80 },
                { date: "2024-09-03", fullConsentGiven: 167, parseConsentGiven: 120, fullConsentRejected: 90 },
                { date: "2024-09-04", fullConsentGiven: 242, parseConsentGiven: 260, fullConsentRejected: 120 },
                { date: "2024-09-05", fullConsentGiven: 373, parseConsentGiven: 290, fullConsentRejected: 150 },
                { date: "2024-09-06", fullConsentGiven: 301, parseConsentGiven: 340, fullConsentRejected: 180 },
                { date: "2024-09-07", fullConsentGiven: 245, parseConsentGiven: 180, fullConsentRejected: 110 },
                { date: "2024-09-08", fullConsentGiven: 409, parseConsentGiven: 320, fullConsentRejected: 200 },
                { date: "2024-09-09", fullConsentGiven: 59, parseConsentGiven: 110, fullConsentRejected: 60 },
                { date: "2024-09-10", fullConsentGiven: 261, parseConsentGiven: 190, fullConsentRejected: 130 },
                { date: "2024-09-11", fullConsentGiven: 327, parseConsentGiven: 350, fullConsentRejected: 180 },
                { date: "2024-09-12", fullConsentGiven: 292, parseConsentGiven: 210, fullConsentRejected: 140 },
                { date: "2024-09-13", fullConsentGiven: 342, parseConsentGiven: 380, fullConsentRejected: 190 },
                { date: "2024-09-14", fullConsentGiven: 137, parseConsentGiven: 220, fullConsentRejected: 100 },
                { date: "2024-09-15", fullConsentGiven: 120, parseConsentGiven: 170, fullConsentRejected: 90 },
                { date: "2024-09-16", fullConsentGiven: 138, parseConsentGiven: 190, fullConsentRejected: 95 },
                { date: "2024-09-17", fullConsentGiven: 446, parseConsentGiven: 360, fullConsentRejected: 220 },
                { date: "2024-09-18", fullConsentGiven: 364, parseConsentGiven: 410, fullConsentRejected: 180 },
                { date: "2024-09-19", fullConsentGiven: 243, parseConsentGiven: 180, fullConsentRejected: 120 },
                { date: "2024-09-20", fullConsentGiven: 89, parseConsentGiven: 150, fullConsentRejected: 70 },
                { date: "2024-09-21", fullConsentGiven: 137, parseConsentGiven: 200, fullConsentRejected: 100 },
                { date: "2024-09-22", fullConsentGiven: 224, parseConsentGiven: 170, fullConsentRejected: 110 },
                { date: "2024-09-23", fullConsentGiven: 138, parseConsentGiven: 230, fullConsentRejected: 115 },
                { date: "2024-09-24", fullConsentGiven: 387, parseConsentGiven: 290, fullConsentRejected: 190 },
                { date: "2024-09-25", fullConsentGiven: 215, parseConsentGiven: 250, fullConsentRejected: 125 },
                { date: "2024-09-26", fullConsentGiven: 75, parseConsentGiven: 130, fullConsentRejected: 65 },
                { date: "2024-09-27", fullConsentGiven: 383, parseConsentGiven: 420, fullConsentRejected: 200 },
                { date: "2024-09-28", fullConsentGiven: 122, parseConsentGiven: 180, fullConsentRejected: 90 },
                { date: "2024-09-29", fullConsentGiven: 315, parseConsentGiven: 240, fullConsentRejected: 150 },
                { date: "2024-09-30", fullConsentGiven: 454, parseConsentGiven: 380, fullConsentRejected: 220 },
            ];
        } else if (timeRange === "1y") {
            return [
                { date: "2024-01-01", fullConsentGiven: 222, parseConsentGiven: 150, fullConsentRejected: 100 },
                { date: "2024-02-01", fullConsentGiven: 97, parseConsentGiven: 180, fullConsentRejected: 80 },
                { date: "2024-03-01", fullConsentGiven: 167, parseConsentGiven: 120, fullConsentRejected: 90 },
                { date: "2024-04-01", fullConsentGiven: 242, parseConsentGiven: 260, fullConsentRejected: 120 },
                { date: "2024-05-01", fullConsentGiven: 373, parseConsentGiven: 290, fullConsentRejected: 150 },
                { date: "2024-06-01", fullConsentGiven: 301, parseConsentGiven: 340, fullConsentRejected: 180 },
                { date: "2024-07-01", fullConsentGiven: 245, parseConsentGiven: 180, fullConsentRejected: 110 },
                { date: "2024-08-01", fullConsentGiven: 409, parseConsentGiven: 320, fullConsentRejected: 200 },
                { date: "2024-09-01", fullConsentGiven: 59, parseConsentGiven: 110, fullConsentRejected: 60 },
                { date: "2024-10-01", fullConsentGiven: 261, parseConsentGiven: 190, fullConsentRejected: 130 },
                { date: "2024-11-01", fullConsentGiven: 327, parseConsentGiven: 350, fullConsentRejected: 180 },
                { date: "2024-12-01", fullConsentGiven: 292, parseConsentGiven: 210, fullConsentRejected: 140 },
            ];
        }
        return [];
    };

    const chartData = getChartData();

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
    const pagesValue = 8;
    const pagesMax = 12;
    const pagesData = [{ label: "pages", value: pagesValue }];

    // Scans chart data - tracks security scans performed
    const scansValue = 2;
    const scansMax = 3;
    const scansData = [{ label: "scans", value: scansValue }];

    // PoC chart data - tracks Proof of Concept implementations
    const pocValue = 1;
    const pocMax = 3;
    const pocData = [{ label: "poc", value: pocValue }];

    // Custom tooltip component for radial charts
    const RadialTooltip = ({ active, payload, currentValue, maxValue, unit }) => {
        if (active && payload && payload.length) {
            return (
                <div className="analytics__radial-tooltip">
                    <div className="analytics__radial-tooltip-content">
                        <div className="analytics__radial-tooltip-current">
                            {currentValue} {unit}
                        </div>
                        <div className="analytics__radial-tooltip-max">
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
                        <h2 className="analytics__chart-title">Visitor Analytics</h2>
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
                                                    <p key={index} className="analytics__tooltip-value">
                                                        <span 
                                                            className="analytics__tooltip-dot" 
                                                            style={{ backgroundColor: entry.color }}
                                                        ></span>
                                                        {entry.dataKey === 'fullConsentGiven' ? 'Full Consent Given' :
                                                         entry.dataKey === 'parseConsentGiven' ? 'Parse Consent Given' :
                                                         'Full Consent Rejected'} {entry.value}
                                                    </p>
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