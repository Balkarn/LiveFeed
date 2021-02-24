import React from 'react'



const Header = ({username}) => {
    return (
        <div>
            <h1>
                {username}
            </h1>
        </div>
    )
}

export default Header;