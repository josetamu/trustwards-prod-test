import { useDashboard } from '../../layout';
import { AnalyticsSkeleton } from '@components/Skeletons/AnalyticsSkeleton';






//function to create a circle chart
function CircleChart({data, centerText, centerLabel, centerIcon}) {
    const radius = 60;
    const strokeWidth = 12;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;

    const totalValue = data.reduce((sum, d) => sum + d.value, 0);
    return (
    <svg className="home__circle-chart" viewBox="0 0 140 140">
      <g transform="translate(70,70)">
        {data.map((d, i) => {
          const value = d.value;
          const dash = (value / totalValue) * circumference;
          const dashArray = `${dash} ${circumference - dash}`;
          const circle = (
            <circle
              key={i}
              r={radius}
              fill="none"
              stroke={d.color}
              strokeWidth={strokeWidth}
              strokeDasharray={dashArray}
              strokeDashoffset={-offset}
              style={{ transition: "stroke-dasharray 0.3s" }}
            />
          );
          offset += dash;
          return circle;
        })}
      </g>
      
      {/* Center Icon - positioned behind the text */}
      {centerIcon && (
        <g transform="translate(35, 50)" style={{zIndex: 0}}>
          {centerIcon}
        </g>
      )}
      
      <text
        x="70"
        y="70"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="17"
        fontWeight="500"
        fill="var(--home-chart-color)"
        letterSpacing="var(--letter-spacing-negative)"
        style={{zIndex: 1}}
      >
        {centerText}
      </text>
      <text
        x="70"
        y="90"
        textAnchor="middle"
        fontSize="9"
        fill="var(--home-chart-color)"
        letterSpacing="var(--letter-spacing-negative)"
        style={{zIndex: 1}}
      >
        {centerLabel}
      </text>
    </svg>
    );
};

export const Analytics = ({ siteSlug, noInstalled }) => {
    const {allUserDataResource } = useDashboard();

    if(!allUserDataResource) return <AnalyticsSkeleton />;

    const {webs} = allUserDataResource.read();

    if(!siteSlug || !webs || !Array.isArray(webs)) return null;

    const site = webs.find(web => web.id === siteSlug);
    const isInstalled = site?.Verified;
    // Variables for the analytics cookies
const analyticsCookies = [
    {
        title: 'Accepted cookies',
        value: '11,054',
        color: 'blue',
        hex: '#0099FE',
    },
    {
        title: 'Modified cookies',
        value: '4,627',
        color: 'celeste',
        hex: '#0099fe80',
    },
    {
        title: 'Rejected cookies',
        value: '12,653',
        color: 'red',
        hex: '#F61C0D',
    },
    {
        title: 'No answer',
        value: '1,768',
        color: 'orange',
        hex: '#FE8700',
    },
];


// Convert analyticsCookies to format for the chart
const cookiesData = analyticsCookies.map(item => ({
    value: parseInt(item.value.replace(/,/g, "")),
    color: item.hex
}));


    return (
            <div className="home__info-card home__info-card--analytics">
                <div className="home__info-card-header">
                    <span className="home__info-card-title">Analytics</span>
                </div>
                {noInstalled()}
                <div className="home__info-card-content home__info-card-content--analytics">
                    <div className="home__cookies-displayed"> 
                        <CircleChart 
                        data={cookiesData} 
                        centerText={
                            (cookiesData[0].value + cookiesData[1].value + cookiesData[3].value).toLocaleString()
                        }
                        centerLabel="Cookies displayed"
                        centerIcon={
                            <g transform="translate(-2.5, -20)">
                                {/* Cookie icon - simple circle with dots */}
                                <svg className="home__circle-chart-icon" width="75" height="100" viewBox="0 0 102 75" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 0H102V20.4545H0V0Z" fill="currentColor"/>
                                    <path d="M27.2 75V34.0909H68L27.2 75Z" fill="currentColor"/>
                                    <path d="M54.4 75V34.0909H88.4L54.4 75Z" fill="currentColor"/>
                                </svg>
                            </g>
                        } />
                    </div>
                    <div className="home__analytics">
                        {analyticsCookies.map((item, index) => (
                            <div className="home__cookie" key={index}>
                                <div className={`home__color home__color--${item.color}`}></div>
                                <div className="home__cookie-text">
                                    <span className="home__cookie-title">{item.title}</span>
                                    <span className="home__cookie-value">{item.value}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
    )
}