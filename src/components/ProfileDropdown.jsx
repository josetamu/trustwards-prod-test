





export const ProfileDropdown = (avatar, name) => {
    return (
        <div className="profileDropdown">
            <div className="profileDropdown__header">
                <img src={avatar} alt="avatar" />
                <span>{name}</span>
            </div>
        </div>
    )
}

