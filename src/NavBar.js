import React from "react";
import './NavBar.css'

const NavBar = () => {
    return (
        <div className="na-bar">
            <div className="logo"> 
                <a href="#"><img className="resize" src="https://logonoid.com/images/rbc-logo.png"/></a>
            </div>

            <ul>
                <li className="li1"><a href="http://localhost:3000/">RBTicket</a></li>
                <li><img className="RBClogo" src={require('./RBClogo.png')} /></li>
                
            </ul>
        </div>
    );
}

export default NavBar;