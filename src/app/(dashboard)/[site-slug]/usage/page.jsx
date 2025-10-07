'use client'

import './usage.css';
import { useParams, notFound } from 'next/navigation';
import { useDashboard } from '@dashboard/layout';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, Bar, BarChart, Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';

function Home() {
    const params = useParams();
    const siteSlug = params['site-slug'];
    const { webs } = useDashboard();

    // Find the selected site based on the slug (using id like the main page)
    const selectedSite = webs.find(site => site.id === siteSlug);
    if(!webs || webs.length === 0) {
        return
    }
    
    if (!selectedSite) {
        notFound();
    }

    const visitorData = [
        { date: "Jan", visitors: 2400 },
        { date: "Feb", visitors: 1398 },
        { date: "Mar", visitors: 9800 },
        { date: "Apr", visitors: 3908 },
        { date: "May", visitors: 4800 },
        { date: "Jun", visitors: 3800 },
        { date: "Jul", visitors: 5200 },
        { date: "Aug", visitors: 6100 },
        { date: "Sep", visitors: 4900 },
        { date: "Oct", visitors: 7300 },
        { date: "Nov", visitors: 6800 },
        { date: "Dec", visitors: 8500 },
    ];

    const chartConfig = {
        visitors: {
            label: "Visitors",
            color: "hsl(var(--chart-1))",
        },
        value: {
            label: "Views",
            color: "hsl(var(--chart-2))",
        },
        scans: {
            label: "Scans",
            color: "hsl(var(--chart-3))",
        },
        proofs: {
            label: "Proofs",
            color: "hsl(var(--chart-4))",
        },
    };

    return (
        <div className='usage'>
            <div className="usage__monthly-visitors-wrapper">
                <ChartContainer config={chartConfig}>
                    <AreaChart data={visitorData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area 
                            type="monotone" 
                            dataKey="visitors" 
                            stroke="hsl(var(--chart-1))" 
                            fill="hsl(var(--chart-1))" 
                            fillOpacity={0.6}
                        />
                    </AreaChart>
                </ChartContainer>
            </div>
        </div>
    );
}
export default Home;