import "./SidebarSites.css";
import { useId } from "react";
import { SiteMenuSB } from "../SiteMenuSB/SiteMenuSB";
export function SidebarSites ({avatar, name, isSidebarOpen}) {
    const sidebarSitesId = useId();
    
    return(
        <div className={`${isSidebarOpen ? 'sidebarSites__site--open' : 'sidebarSites__site'}`} id={sidebarSitesId}>
            <div className="sidebarSites__header">
            <span className="sidebarSites__header-avatar">
                <img className="sidebarSites__header-avatar-img" src={avatar}/>
            </span>
            <span className="sidebarSites__header-name">
                {name}
            </span>
            </div>
            <SiteMenuSB />
        </div>
    );
}

    


