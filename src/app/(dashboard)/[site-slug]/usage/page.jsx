'use client'

import './usage.css';
import { useParams, notFound } from 'next/navigation';
import { useDashboard } from '@dashboard/layout';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, RadialBarChart, RadialBar, PolarAngleAxis, Cell, PieChart, Pie } from 'recharts';
import { useState, useEffect } from 'react';
import { supabase } from '@supabase/supabaseClient';
import { InstallationFirst } from '../homeComponents/InstallationFirst';

function Home() {
    const params = useParams();
    const siteSlug = params['site-slug'];
    const { webs, setUserSettings, setIsModalOpen, setModalType } = useDashboard();
    const [siteData, setSiteData] = useState(null);

    // Find the selected site based on the slug (using id like the main page)
    const selectedSite = webs.find(site => site.id === siteSlug);

    // Set siteData for charts
    useEffect(() => {
        if (selectedSite) {
            setSiteData(selectedSite);
        }
    }, [selectedSite]);

    if(!webs || webs.length === 0) {
        return
    }
    
    if (!selectedSite) {
        notFound();
    }

    // If not installed, show installation screen (check directly from site data)
    if (!selectedSite.Verified) {
        return (
            <div className='usage'>
                <InstallationFirst siteSlug={siteSlug} />
            </div>
        );
    }

    // Default visitor data for the area chart
    const chartData = [
        { date: "2024-04-01", visitors: 372 },
        { date: "2024-04-02", visitors: 277 },
        { date: "2024-04-03", visitors: 287 },
        { date: "2024-04-04", visitors: 502 },
        { date: "2024-04-05", visitors: 663 },
        { date: "2024-04-06", visitors: 641 },
        { date: "2024-04-07", visitors: 425 },
        { date: "2024-04-08", visitors: 729 },
        { date: "2024-04-09", visitors: 169 },
        { date: "2024-04-10", visitors: 451 },
        { date: "2024-04-11", visitors: 677 },
        { date: "2024-04-12", visitors: 502 },
        { date: "2024-04-13", visitors: 722 },
        { date: "2024-04-14", visitors: 357 },
        { date: "2024-04-15", visitors: 290 },
        { date: "2024-04-16", visitors: 328 },
        { date: "2024-04-17", visitors: 806 },
        { date: "2024-04-18", visitors: 774 },
        { date: "2024-04-19", visitors: 423 },
        { date: "2024-04-20", visitors: 239 },
        { date: "2024-04-21", visitors: 337 },
        { date: "2024-04-22", visitors: 394 },
        { date: "2024-04-23", visitors: 368 },
        { date: "2024-04-24", visitors: 677 },
        { date: "2024-04-25", visitors: 465 },
        { date: "2024-04-26", visitors: 205 },
        { date: "2024-04-27", visitors: 803 },
        { date: "2024-04-28", visitors: 302 },
        { date: "2024-04-29", visitors: 555 },
        { date: "2024-04-30", visitors: 834 },
        { date: "2024-05-01", visitors: 385 },
        { date: "2024-05-02", visitors: 603 },
        { date: "2024-05-03", visitors: 437 },
        { date: "2024-05-04", visitors: 805 },
        { date: "2024-05-05", visitors: 871 },
        { date: "2024-05-06", visitors: 1018 },
        { date: "2024-05-07", visitors: 688 },
        { date: "2024-05-08", visitors: 359 },
        { date: "2024-05-09", visitors: 407 },
        { date: "2024-05-10", visitors: 623 },
        { date: "2024-05-11", visitors: 605 },
        { date: "2024-05-12", visitors: 437 },
        { date: "2024-05-13", visitors: 357 },
        { date: "2024-05-14", visitors: 938 },
        { date: "2024-05-15", visitors: 853 },
        { date: "2024-05-16", visitors: 738 },
        { date: "2024-05-17", visitors: 919 },
        { date: "2024-05-18", visitors: 665 },
        { date: "2024-05-19", visitors: 415 },
        { date: "2024-05-20", visitors: 407 },
        { date: "2024-05-21", visitors: 222 },
        { date: "2024-05-22", visitors: 201 },
        { date: "2024-05-23", visitors: 542 },
        { date: "2024-05-24", visitors: 514 },
        { date: "2024-05-25", visitors: 451 },
        { date: "2024-05-26", visitors: 383 },
        { date: "2024-05-27", visitors: 880 },
        { date: "2024-05-28", visitors: 423 },
        { date: "2024-05-29", visitors: 208 },
        { date: "2024-05-30", visitors: 620 },
        { date: "2024-05-31", visitors: 408 },
        { date: "2024-06-01", visitors: 378 },
        { date: "2024-06-02", visitors: 880 },
        { date: "2024-06-03", visitors: 263 },
        { date: "2024-06-04", visitors: 819 },
        { date: "2024-06-05", visitors: 228 },
        { date: "2024-06-06", visitors: 544 },
        { date: "2024-06-07", visitors: 693 },
        { date: "2024-06-08", visitors: 705 },
        { date: "2024-06-09", visitors: 918 },
        { date: "2024-06-10", visitors: 355 },
        { date: "2024-06-11", visitors: 242 },
        { date: "2024-06-12", visitors: 912 },
        { date: "2024-06-13", visitors: 211 },
        { date: "2024-06-14", visitors: 806 },
        { date: "2024-06-15", visitors: 657 },
        { date: "2024-06-16", visitors: 681 },
        { date: "2024-06-17", visitors: 995 },
        { date: "2024-06-18", visitors: 277 },
        { date: "2024-06-19", visitors: 631 },
        { date: "2024-06-20", visitors: 858 },
        { date: "2024-06-21", visitors: 379 },
        { date: "2024-06-22", visitors: 587 },
        { date: "2024-06-23", visitors: 1010 },
        { date: "2024-06-24", visitors: 312 },
        { date: "2024-06-25", visitors: 331 },
        { date: "2024-06-26", visitors: 814 },
        { date: "2024-06-27", visitors: 938 },
        { date: "2024-06-28", visitors: 349 },
        { date: "2024-06-29", visitors: 263 },
        { date: "2024-06-30", visitors: 846 },
    ];

    const chartConfig = {
        visitors: {
            label: "Visitors",
            color: "#3B82F6", // Blue
        },
    };

    // Data for radial charts with max values (raw values; proportion handled by axis domain)
    const pagesValue = 8;
    const pagesMax = 12;
    const pagesData = [{ label: "pages", value: pagesValue }];

    const scansValue = 2;
    const scansMax = 3;
    const scansData = [{ label: "scans", value: scansValue }];

    const pocValue = 1;
    const pocMax = 3;
    const pocData = [{ label: "poc", value: pocValue }];

    const pagesConfig = {
        visitors: { label: "Pages" },
        pages: { label: "Pages", color: "#3B82F6" },
    };

    const scansConfig = {
        visitors: { label: "Scans" },
        scans: { label: "Scans", color: "#10B981" },
    };

    const pocConfig = {
        visitors: { label: "PoC" },
        poc: { label: "PoC", color: "#F59E0B" },
    };

    return (
        <div className='usage'>
            {/* Header Section */}
            <div className="usage__header">
                <h1 className="usage__title">Usage</h1>
                <div className="usage__header-content">
                    <p className="usage__description">
                        Enjoy much more usage. <span className="usage__upgrade-link" onClick={() => { setUserSettings('Plan'); setModalType('Plan'); setIsModalOpen(true); }} style={{ cursor: 'pointer' }}>Upgrade</span> this site to pro.
                    </p>
                    <button className="usage__upgrade-button" onClick={() => { setUserSettings('Plan'); setModalType('Plan'); setIsModalOpen(true); }}>
                        Upgrade
                    </button>
                </div>
            </div>

            {/* Monthly Visitors Chart */}
            <div className="usage__chart">
                <div className="usage__chart-header">
                    <div className="usage__chart-left">
                        <div className="usage__chart-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                            <path d="M3 4V18C3 19.1046 3.89543 20 5 20H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M6 14L11 9L14.5 12.5L20 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="usage__chart-span">area chart</span>
                    </div>
                    <div className="usage__view-code-button">View Code</div>
                </div>

                <div className="usage__chart-divider"></div>
                
                <div className="usage__chart-content">
                    <div className="usage__chart-content-left-wrapper">
                        <h2 className="usage__chart-title">Area Chart</h2>
                        <p className="usage__chart-subtitle">Showing total visitors for the last month.</p>
                    </div>
                    
                    <div className="usage__chart-metrics">
                        <div className="usage__metric">
                            <span className="usage__metric-label">Visitors</span>
                            <span className="usage__metric-value">49,838</span>
                        </div>
                    </div>
                </div>

                <div className="usage__chart-divider"></div>

                <div className="usage__area-chart-container">
                    <ChartContainer
                        config={chartConfig}
                        className="aspect-auto h-[250px] w-full"
                    >
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="fillVisitors" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor="#3B82F6"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="#3B82F6"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={32}
                                tickFormatter={(value) => {
                                    const date = new Date(value)
                                    return date.toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                    })
                                }}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        labelFormatter={(value) => {
                                            return new Date(value).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            })
                                        }}
                                        indicator="dot"
                                    />
                                }
                            />
                            <Area
                                dataKey="visitors"
                                type="natural"
                                fill="url(#fillVisitors)"
                                stroke="#3B82F6"
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                        </AreaChart>
                </ChartContainer>
                </div>
            </div>

            {/* Radial Charts Section */}
            <div className="usage__radial-charts">
                {/* Pages Chart */}
                <div className="usage__chart">
                    <div className="usage__chart-header">
                        <div className="usage__chart-left">
                            <div className="usage__chart-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                                    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M7 12H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M12 17L12 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span className="usage__chart-span">Radial Chart</span>
                        </div>
                        <button className="usage__view-code-button">View Code</button>
                    </div>
                    
                    <div className="usage__radial-chart-content">
                        <h3 className="usage__chart-title">Pages</h3>
                    </div>

                    <div className="usage__radial-chart-container">
                        <RadialBarChart width={200} height={200} cx="50%" cy="50%" innerRadius="70%" outerRadius="85%" data={pagesData} startAngle={90} endAngle={450}>
                            <PolarAngleAxis type="number" domain={[0, pagesMax]} tick={false} />
                            <RadialBar dataKey="value" cornerRadius={10} fill="#3B82F6" background={{ fill: "var(--usage-radial-chart-background)" }} />
                        </RadialBarChart>
                        <div className="usage__radial-chart-center">
                            <span className="usage__radial-chart-value">{pagesValue}</span>
                            <span className="usage__radial-chart-label">Pages</span>
                        </div>
                    </div>
                </div>

                {/* Monthly Scans Chart */}
                <div className="usage__chart">
                    <div className="usage__chart-header">
                        <div className="usage__chart-left">
                            <div className="usage__chart-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                                    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M7 12H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M12 17L12 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span className="usage__chart-span">Radial Chart</span>
                        </div>
                        <button className="usage__view-code-button">View Code</button>
                    </div>
                    
                    <div className="usage__radial-chart-content">
                        <h3 className="usage__chart-title">Scans</h3>
                    </div>

                    <div className="usage__radial-chart-container">
                        <RadialBarChart width={200} height={200} cx="50%" cy="50%" innerRadius="70%" outerRadius="85%" data={scansData} startAngle={90} endAngle={450}>
                            <PolarAngleAxis type="number" domain={[0, scansMax]} tick={false} />
                            <RadialBar dataKey="value" cornerRadius={10} fill="#10B981" background={{ fill: "var(--usage-radial-chart-background)" }} />
                        </RadialBarChart>
                        <div className="usage__radial-chart-center">
                            <span className="usage__radial-chart-value">{scansValue}</span>
                            <span className="usage__radial-chart-label">Scans</span>
                        </div>
                    </div>
                </div>

                {/* Monthly PoC Chart */}
                <div className="usage__chart">
                    <div className="usage__chart-header">
                        <div className="usage__chart-left">
                            <div className="usage__chart-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                                    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M7 12H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M12 17L12 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span className="usage__chart-span">Radial Chart</span>
                        </div>
                        <button className="usage__view-code-button">View Code</button>
                    </div>
                    
                    <div className="usage__radial-chart-content">
                        <h3 className="usage__chart-title">PoC</h3>
                    </div>

                    <div className="usage__radial-chart-container">
                        <RadialBarChart width={200} height={200} cx="50%" cy="50%" innerRadius="70%" outerRadius="85%" data={pocData} startAngle={90} endAngle={450}>
                            <PolarAngleAxis type="number" domain={[0, pocMax]} tick={false} />
                            <RadialBar dataKey="value" cornerRadius={10} fill="#F59E0B" background={{ fill: "var(--usage-radial-chart-background)" }} />
                        </RadialBarChart>
                        <div className="usage__radial-chart-center">
                            <span className="usage__radial-chart-value">{pocValue}</span>
                            <span className="usage__radial-chart-label">PoC</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Home;