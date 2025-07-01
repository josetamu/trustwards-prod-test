import './NewSite.css';

export function NewSite({ createNewSite }) {
    return (
        <div className="newSite__button" onClick={createNewSite}>
            <span className="newSite__text">New</span>
            <span className="newSite__svg">
            <svg className="newSite__svg" width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_371_406)">
                <path d="M0.75 4.5C0.75 6.57105 2.42893 8.25 4.5 8.25C6.57105 8.25 8.25 6.57105 8.25 4.5C8.25 2.42893 6.57105 0.75 4.5 0.75" stroke="white" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.5 3V6M6 4.5H3" stroke="white" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M0.9375 3.1875C1.0734 2.87646 1.24459 2.58437 1.446 2.31629M2.3163 1.44599C2.58438 1.24458 2.87647 1.0734 3.1875 0.9375" stroke="white" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
                <defs>
                <clipPath id="clip0_371_406">
                <rect width="9" height="9" fill="white"/>
                </clipPath>
                </defs>
            </svg>
            </span>
        </div>
    )
}

