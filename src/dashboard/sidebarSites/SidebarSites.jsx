import "./SidebarSites.css";

export function SidebarSites ({avatar, name}) {
    return(
        <div className="sidebarSites__site">
            <span className="sidebarSites__site-avatar">
                <img src={avatar} alt={name} />
            </span>
            <span className="sidebarSites__site-name">
                {name}
            </span>
        </div>
    );
}

    


