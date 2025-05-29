import "./plancard.css";
export const PlanCard = ({ currentPlan, monthlyVisitors, totalVisitors }) => {
    const percentage = (monthlyVisitors / totalVisitors) * 100;

    return (
        <div className="planCard">
            <div className="planCard__header">
                <span className="planCard__icon">
                    <svg className="planCard__icon__svg" width="23" height="16" viewBox="0 0 23 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_d_79_136)">
                            <path d="M4 0H19V3H4V0Z" fill="url(#paint0_linear_79_136)"/>
                            <path d="M8 11V5H14L8 11Z" fill="url(#paint1_linear_79_136)"/>
                            <path d="M12 11V5H17L12 11Z" fill="url(#paint2_linear_79_136)"/>
                        </g>
                        <defs>
                            <filter id="filter0_d_79_136" x="0" y="0" width="23" height="19" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                            <feOffset dy="4"/>
                            <feGaussianBlur stdDeviation="2"/>
                            <feComposite in2="hardAlpha" operator="out"/>
                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_79_136"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_79_136" result="shape"/>
                            </filter>
                            <linearGradient id="paint0_linear_79_136" x1="11.5" y1="0" x2="11.5" y2="11" gradientUnits="userSpaceOnUse">
                            <stop stop-color="white"/>
                            <stop offset="1" stop-color="#1C6DE8"/>
                            </linearGradient>
                            <linearGradient id="paint1_linear_79_136" x1="11.5" y1="0" x2="11.5" y2="11" gradientUnits="userSpaceOnUse">
                            <stop stop-color="white"/>
                            <stop offset="1" stop-color="#1C6DE8"/>
                            </linearGradient>
                            <linearGradient id="paint2_linear_79_136" x1="11.5" y1="0" x2="11.5" y2="11" gradientUnits="userSpaceOnUse">
                            <stop stop-color="white"/>
                            <stop offset="1" stop-color="#1C6DE8"/>
                            </linearGradient>
                        </defs>
                    </svg>
                </span>
                <span className="planCard__title">{currentPlan}</span>
                <span className="planCard__subtitle">{monthlyVisitors}/{totalVisitors} monthly visitors</span>
            </div>
            <div className="planCard__widgets">
                <div className="planCard__bar">
                    <div className="planCard__fill" style={{ width: `${percentage}%` }}></div>
                </div>
                <button className={`${currentPlan === "Free plan" ? "planCard__button" : "planCard__button--disabled"}`}>Upgrade to Pro</button>
            </div>
        </div>
    )
}
