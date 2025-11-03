'use client'

export function AreaChartSkeleton() {
  return (
    <div className="analytics__area-chart-container">
      <div className="aspect-auto h-[250px] w-full" style={{
        background: 'var(--analytics-skeleton-bg, rgba(128, 128, 128, 0.1))',
        borderRadius: '8px',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }} />
    </div>
  );
}

export function RadialChartSkeleton() {
  return (
    <div className="analytics__radial-chart-container">
      <div style={{
        width: '200px',
        height: '200px',
        background: 'var(--analytics-skeleton-bg, rgba(128, 128, 128, 0.1))',
        borderRadius: '50%',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }} />
    </div>
  );
}

