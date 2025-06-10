import "./SidebarSites.css";


export function SidebarSites ({avatar, name}) {
    
    return(
        <div className="sidebarSites__site">
            <div className="sidebarSites__header">
            <span className="sidebarSites__header-avatar">
                <img className="sidebarSites__header-avatar-img" src={avatar}/>
            </span>
            <span className="sidebarSites__header-name">
                {name}
            </span>
            </div>
            <div className="sidebarSites__edit">
                <svg width="9" height="2" viewBox="0 0 9 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.49563 1H4.50437M1 1H1.00874M7.99126 1H8" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            
                
            
        </div>
    );
}

    


