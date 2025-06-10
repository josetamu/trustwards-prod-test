import "./SidebarSites.css";
import { Tooltip } from "../tooltip/Tooltip";

export function SidebarSites ({avatar, name, isSidebarOpen}) {
    
    return(
        <div className="sidebarSites__site">
            <span className="sidebarSites__site-avatar">
                <img className="sidebarSites__site-avatar-img" src={avatar}/>
            </span>
            <span className="sidebarSites__site-name">
                {name}
            </span>
        </div>
    );
}

    


