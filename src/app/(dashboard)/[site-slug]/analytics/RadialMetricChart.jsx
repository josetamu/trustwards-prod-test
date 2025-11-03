'use client'

import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

export function RadialMetricChart({ chartKey, data, max, label, value }) {
  return (
    <div className="analytics__radial-chart-container">
      <RadialBarChart 
        key={chartKey} 
        width={200} 
        height={200} 
        cx="50%" 
        cy="50%" 
        innerRadius="70%" 
        outerRadius="85%" 
        data={data} 
        startAngle={90} 
        endAngle={450}
      >
        <PolarAngleAxis type="number" domain={[0, max]} tick={false} />
        <RadialBar 
          dataKey="value" 
          cornerRadius={10} 
          fill="var(--analytics-radial-chart-fill)" 
          background={{ fill: "var(--analytics-radial-chart-background)" }} 
        />
      </RadialBarChart>
      <div className="analytics__radial-chart-center">
        <span className="analytics__radial-chart-value">{value}</span>
        <span className="analytics__radial-chart-label">{label}</span>
      </div>
    </div>
  );
}

