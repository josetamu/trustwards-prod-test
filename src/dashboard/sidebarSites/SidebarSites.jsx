import "./SidebarSites.css";



export function SidebarSites ({avatar, name}) {
    return(
        <div className="sidebarSites__site">
            <span className="sidebarSites__site-avatar">
                <img src='https://www.freepik.com/free-vector/mysterious-mafia-man-smoking-cigarette_7074311.htm#fromView=keyword&page=1&position=14&uuid=38c2c6df-e810-4ebb-b321-7f6e28a55dfd&query=Avatar' alt={avatar} />
            </span>
            <span className="sidebarSites__site-name">
                {name}
            </span>
        </div>
    );
}

    


