import { SidebarLink } from './sitebarLink/SitebarLink';


// Modal profile
export function UserConfig({ onClose }) {
    return (
        <div className="userConfig" onClick={onClose}>
            <div className="userConfig__modal" onClick={(e) => e.stopPropagation()}>
                <div className="userConfig__modal-header">
                    <span>Profile</span>
                    <button onClick={onClose} className="userConfig__modal-header-close-button">X</button>
                </div>
                <div className="userConfig__modal-content">
                    <div className="userConfig__modal-content-user-info ">
                        <img src="https://cdn-icons-png.flaticon.com/512/1308/1308845.png" alt="User" />
                        <span>user@example.com</span>
                        <span>username and usersurname</span>
                    </div>
                    <div className="userConfig__modal-content-user-links">
                     <SidebarLink
                        icon={
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                            <path d="M18 6C17.9531 4.44655 17.7797 3.51998 17.1377 2.87868C16.2581 2 14.8423 2 12.0108 2H8.0065C5.17501 2 3.75926 2 2.87963 2.87868C2 3.75736 2 5.17157 2 8V16C2 18.8284 2 20.2426 2.87963 21.1213C3.75926 22 5.17501 22 8.0065 22H12.0108C14.8423 22 16.2581 22 17.1377 21.1213C17.7797 20.48 17.9531 19.5535 18 18" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M20.2419 11.7419L21.419 10.5648C21.6894 10.2944 21.8246 10.1592 21.8969 10.0134C22.0344 9.73584 22.0344 9.41003 21.8969 9.13252C21.8246 8.98666 21.6894 8.85145 21.419 8.58104C21.1485 8.31062 21.0133 8.17542 20.8675 8.10314C20.59 7.96562 20.2642 7.96562 19.9866 8.10314C19.8408 8.17542 19.7056 8.31062 19.4352 8.58104L18.2581 9.7581M20.2419 11.7419L14.9757 17.0081L12 18L12.9919 15.0243L18.2581 9.7581M20.2419 11.7419L18.2581 9.7581" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M5 19H6L7.25 16.5L8.5 19H9.5" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M6 6H14" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M6 10H12" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    }
                    text="Support"
                    />
                    <SidebarLink
                        icon={
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                                <path d="M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12Z" stroke="#000000" stroke-width="1.5"></path>
                                <path d="M12 2C11.6227 2.33333 11.0945 3.2 12 4M12 20C12.3773 20.3333 12.9055 21.2 12 22M19.5 4.50271C18.9685 4.46982 17.9253 4.72293 18.0042 5.99847M5.49576 17.5C5.52865 18.0315 5.27555 19.0747 4 18.9958M5.00271 4.5C4.96979 5.03202 5.22315 6.0763 6.5 5.99729M18 17.5026C18.5315 17.4715 19.5747 17.7108 19.4958 18.9168M22 12C21.6667 11.6227 20.8 11.0945 20 12M4 11.5C3.66667 11.8773 2.8 12.4055 2 11.5" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path>
                            </svg>
                            <svg className="dark-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                                <path d="M21.5 14.0784C20.3003 14.7189 18.9301 15.0821 17.4751 15.0821C12.7491 15.0821 8.91792 11.2509 8.91792 6.52485C8.91792 5.06986 9.28105 3.69968 9.92163 2.5C5.66765 3.49698 2.5 7.31513 2.5 11.8731C2.5 17.1899 6.8101 21.5 12.1269 21.5C16.6849 21.5 20.503 18.3324 21.5 14.0784Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                        </>
                    }
                    text="Apparence"
                    />
                     <SidebarLink
                        icon={
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                                <path d="M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12Z" stroke="#000000" stroke-width="1.5"></path>
                                <path d="M12 2C11.6227 2.33333 11.0945 3.2 12 4M12 20C12.3773 20.3333 12.9055 21.2 12 22M19.5 4.50271C18.9685 4.46982 17.9253 4.72293 18.0042 5.99847M5.49576 17.5C5.52865 18.0315 5.27555 19.0747 4 18.9958M5.00271 4.5C4.96979 5.03202 5.22315 6.0763 6.5 5.99729M18 17.5026C18.5315 17.4715 19.5747 17.7108 19.4958 18.9168M22 12C21.6667 11.6227 20.8 11.0945 20 12M4 11.5C3.66667 11.8773 2.8 12.4055 2 11.5" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path>
                            </svg>
                            <svg className="dark-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                                <path d="M21.5 14.0784C20.3003 14.7189 18.9301 15.0821 17.4751 15.0821C12.7491 15.0821 8.91792 11.2509 8.91792 6.52485C8.91792 5.06986 9.28105 3.69968 9.92163 2.5C5.66765 3.49698 2.5 7.31513 2.5 11.8731C2.5 17.1899 6.8101 21.5 12.1269 21.5C16.6849 21.5 20.503 18.3324 21.5 14.0784Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                        </>
                    }
                    text="Profile"
                    />   
                    </div>
                </div>
                <div className="userConfig__modal-footer">
                    <span>Affiliate</span>
                    <button className="userConfig__modal-footer-logout-button">Log Out</button>
                </div>
            </div>
        </div>
    )
}

