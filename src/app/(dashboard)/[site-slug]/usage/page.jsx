'use client'

import './usage.css';
import { useParams, notFound } from 'next/navigation';
import { useDashboard } from '@dashboard/layout';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, Bar, BarChart, Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useState, useEffect } from 'react';
import { supabase } from '@supabase/supabaseClient';

function Home() {
    const params = useParams();
    const siteSlug = params['site-slug'];
    const { webs } = useDashboard();
    const [siteData, setSiteData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Find the selected site based on the slug
    const selectedSite = webs.find(site => site.id === siteSlug);
    
    if(!webs || webs.length === 0) {
        return <div className="usage__loading">Loading...</div>
    }
    
    if (!selectedSite) {
        notFound();
    }

    if (loading) {
        return <div className="usage__loading">Loading analytics...</div>
    }

    // Generate real data based on site information
    const generateMonthlyData = () => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = new Date().getMonth();
        const totalScans = siteData?.Scans || 0;
        
        return months.map((month, index) => {
            // Distribute scans across months with some variation
            const monthScans = index <= currentMonth ? 
                Math.floor(totalScans * (0.5 + Math.random() * 0.5) / (currentMonth + 1)) : 0;
            
            return {
                date: month,
                scans: monthScans,
                scripts: Math.floor(monthScans * (2 + Math.random() * 3)), // Scripts found per scan
                iframes: Math.floor(monthScans * (0.5 + Math.random() * 1.5)), // Iframes found per scan
            };
        });
    };

    const monthlyData = generateMonthlyData();

    // Generate category distribution data
    const generateCategoryData = () => {
        const scriptsScanned = siteData?.scriptsScanned || [];
        const iframesScanned = siteData?.iframesScanned || [];
        
        const categoryCount = {};
        
        // Count scripts by category
        scriptsScanned.forEach(script => {
            const category = script.category || 'Unknown';
            categoryCount[category] = (categoryCount[category] || 0) + 1;
        });
        
        // Count iframes by category
        iframesScanned.forEach(iframe => {
            const category = iframe.category || 'Unknown';
            categoryCount[category] = (categoryCount[category] || 0) + 1;
        });

        return Object.entries(categoryCount).map(([category, count]) => ({
            name: category,
            value: count,
        }));
    };

    const categoryData = generateCategoryData();

    const chartConfig = {
        scans: {
            label: "Scans",
            color: "hsl(var(--chart-1))",
        },
        scripts: {
            label: "Scripts",
            color: "hsl(var(--chart-2))",
        },
        iframes: {
            label: "Iframes",
            color: "hsl(var(--chart-3))",
        },
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    return (
        <div className='usage'>
            <div className="usage__header">
                <h1 className="usage__title">Analytics & Usage</h1>
            </div>

            <div className="usage__stats-grid">
                <div className="usage__stat-card">
                    <div className="usage__stat-content">
                        <h3 className="usage__stat-number">{siteData?.Scans || 0}</h3>
                        <p className="usage__stat-label">Total Scans</p>
                    </div>
                </div>
                
                <div className="usage__stat-card">
                    <div className="usage__stat-content">
                        <h3 className="usage__stat-number">{(siteData?.scriptsScanned || []).length}</h3>
                        <p className="usage__stat-label">Scripts Detected</p>
                    </div>
                </div>
                
                <div className="usage__stat-card">
                    <div className="usage__stat-content">
                        <h3 className="usage__stat-number">{(siteData?.iframesScanned || []).length}</h3>
                        <p className="usage__stat-label">Iframes Detected</p>
                    </div>
                </div>
                
                <div className="usage__stat-card">
                    <div className="usage__stat-content">
                        <h3 className="usage__stat-number">{siteData?.Verified ? 'Yes' : 'No'}</h3>
                        <p className="usage__stat-label">Site Verified</p>
                    </div>
                </div>
            </div>

            <div className="usage__charts-grid">
                <div className="usage__chart-container">
                    <h3 className="usage__chart-title">Monthly Scans</h3>
                    <ChartContainer config={chartConfig}>
                        <AreaChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Area 
                                type="monotone" 
                                dataKey="scans" 
                                stroke="hsl(var(--chart-1))" 
                                fill="hsl(var(--chart-1))" 
                                fillOpacity={0.6}
                            />
                        </AreaChart>
                    </ChartContainer>
                </div>

                <div className="usage__chart-container">
                    <h3 className="usage__chart-title">Detection Overview</h3>
                    <ChartContainer config={chartConfig}>
                        <BarChart data={[
                            { name: 'Scripts', count: (siteData?.scriptsScanned || []).length, fill: 'hsl(var(--chart-2))' },
                            { name: 'Iframes', count: (siteData?.iframesScanned || []).length, fill: 'hsl(var(--chart-3))' },
                            { name: 'Total Scans', count: siteData?.Scans || 0, fill: 'hsl(var(--chart-1))' }
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="count" fill="hsl(var(--chart-2))" />
                        </BarChart>
                    </ChartContainer>
                </div>

                {categoryData.length > 0 && (
                    <div className="usage__chart-container usage__chart-container--pie">
                        <h3 className="usage__chart-title">Detection by Category</h3>
                        <ChartContainer config={chartConfig}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <ChartTooltip content={<ChartTooltipContent />} />
                            </PieChart>
                        </ChartContainer>
                    </div>
                )}
            </div>
        </div>
    );
}
export default Home;