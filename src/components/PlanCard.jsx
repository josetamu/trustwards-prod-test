export const PlanCard = ({ currentPlan, monthlyVisitors, totalVisitors }) => {
    return (
        <div className="planCard">
            <div className="planCard__header">
                <span className="planCard__header-icon">
                    <svg width="23" height="19" viewBox="0 0 23 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g filter="url(#filter0_d_64_572)">
                    <path d="M4 0H19V3H4V0Z" fill="url(#paint0_linear_64_572)"/>
                    <path d="M8 11V5H14L8 11Z" fill="url(#paint1_linear_64_572)"/>
                    <path d="M12 11V5H17L12 11Z" fill="url(#paint2_linear_64_572)"/>
                    </g>
                    <defs>
                    <filter id="filter0_d_64_572" x="0" y="0" width="23" height="19" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dy="4"/>
                    <feGaussianBlur stdDeviation="2"/>
                    <feComposite in2="hardAlpha" operator="out"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_64_572"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_64_572" result="shape"/>
                    </filter>
                    <linearGradient id="paint0_linear_64_572" x1="11.5" y1="0" x2="11.5" y2="11" gradientUnits="userSpaceOnUse">
                    <stop stop-color="white"/>
                    <stop offset="1" stop-color="#1C6DE8"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear_64_572" x1="11.5" y1="0" x2="11.5" y2="11" gradientUnits="userSpaceOnUse">
                    <stop stop-color="white"/>
                    <stop offset="1" stop-color="#1C6DE8"/>
                    </linearGradient>
                    <linearGradient id="paint2_linear_64_572" x1="11.5" y1="0" x2="11.5" y2="11" gradientUnits="userSpaceOnUse">
                    <stop stop-color="white"/>
                    <stop offset="1" stop-color="#1C6DE8"/>
                    </linearGradient>
                    </defs>
                    </svg>
                </span>
                <span className="planCard__header-title">{currentPlan}</span>
                <span className="planCard__header-subtitle">{monthlyVisitors}/{totalVisitors} monthly visitors</span>
            </div>
            <div className="planCard__widgets">
                <span className="planCard__widgets-bar">
                    <span className="planCard__widgets-bar-fill"></span>
                </span>
                <button className={`${currentPlan === "Free plan" ? "planCard__widgets-button" : "planCard__widgets-button-disabled"}`}>Upgrade to Pro</button>
            </div>
        </div>
    )
}
