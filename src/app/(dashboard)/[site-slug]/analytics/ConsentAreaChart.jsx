'use client'

import { Area, AreaChart, XAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartLegend, ChartLegendContent } from '@/components/ui/chart';

export function ConsentAreaChart({ chartData, timeRange, chartConfig }) {
  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[250px] w-full"
    >
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="fillFullConsentGiven" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--analytics-area-chart-given-gradient-start)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--analytics-area-chart-given-gradient-end)" stopOpacity={0.5} />
          </linearGradient>
          <linearGradient id="fillParseConsentGiven" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--analytics-area-chart-parse-gradient-start)" stopOpacity={1} />
            <stop offset="95%" stopColor="var(--analytics-area-chart-parse-gradient-end)" stopOpacity={1} />
          </linearGradient>
          <linearGradient id="fillFullConsentRejected" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--analytics-area-chart-rejected-gradient-start)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--analytics-area-chart-rejected-gradient-end)" stopOpacity={0.5} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={timeRange === "1m" ? 16 : timeRange === "1y" ? 8 : 32}
          tickFormatter={(value) => {
            const date = new Date(value);
            if (timeRange === "7d") {
              return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
            } else if (timeRange === "1m") {
              const day = date.getDate();
              return day % 2 === 0 ? day : "";
            } else if (timeRange === "1y") {
              return date.toLocaleDateString("en-US", { month: "long" });
            }
            return value;
          }}
        />
        <ChartTooltip
          cursor={false}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              const date = new Date(data.date);
              if (isNaN(date.getTime())) return null;
              let formattedDate;
              if (timeRange === "7d" || timeRange === "1m") {
                formattedDate = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
              } else if (timeRange === "1y") {
                formattedDate = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
              } else {
                formattedDate = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
              }
              return (
                <div className="analytics__tooltip">
                  <p className="analytics__tooltip-label">{formattedDate}</p>
                  {payload.map((entry, index) => (
                    <div key={index} className="analytics__tooltip-value-content">
                      <div className="analytics__tooltip-left">
                        <span className="analytics__tooltip-dot" style={{ backgroundColor: entry.color }}></span>
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
        <Area dataKey="fullConsentGiven" type="natural" fill="url(#fillFullConsentGiven)" stroke="var(--analytics-area-chart-given-stroke)" stackId="a" />
        <Area dataKey="parseConsentGiven" type="natural" fill="url(#fillParseConsentGiven)" stroke="var(--analytics-area-chart-parse-stroke)" stackId="a" />
        <Area dataKey="fullConsentRejected" type="natural" fill="url(#fillFullConsentRejected)" stroke="var(--analytics-area-chart-rejected-stroke)" stackId="a" />
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  );
}

