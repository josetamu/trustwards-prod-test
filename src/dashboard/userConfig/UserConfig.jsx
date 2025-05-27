import './UserConfig.css';


// Modal profile
export function UserConfig({ onClose }) {
    return (
        <div className="userConfig" onClick={onClose}>
            <div className="userConfig__modal" onClick={(e) => e.stopPropagation()}>
                <div className="userConfig__banner">

                </div>
                <div className="userConfig__header">
                        <img src="https://cdn-icons-png.flaticon.com/512/1308/1308845.png" alt="User" />
                        {/* <span>{{user.user_metadata?.display_name}}</span> */}
                        <span>user@example.com</span>
                      
                 
                </div>
                <div className="userConfig__body">
                    <table className="userConfig__table">
                    <thead className="userConfig__table-header">
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody className='settingsUser__table-body'>
                        <tr>
                            <td>pepe</td>
                            <td>{/* {user.email} */}pepe@gmail.com</td>
                        </tr>
                    </tbody>
                    
                </table>
                    
                </div>
                <div className="userConfig__footer">
                    <button className="userConfig__footer--logout">Log Out</button>
                    <button className="userConfig__footer--save">Save</button>
                </div>
            </div>
        </div>
    )
}

