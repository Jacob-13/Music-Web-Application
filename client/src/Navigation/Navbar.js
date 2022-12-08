import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div>
            <li>
                <Link to="/">Home</Link>
            </li>
            <li>
                <Link to="/signIn">Sign-In</Link>
            </li>
            <li>
                <Link to="/user">My Account</Link>
            </li>
            <li>
                <Link to="/securityAndPrivatePolicy">Security and Private Policy</Link>
            </li>
            <li>
                <Link to="/dcmaNoticeAndTakedownPolicy">Acceptable Use Policy</Link>
            </li>
            <li>
                <Link to="/acceptableUsePolicy">DCMA Notice and Takedown Policy</Link>
            </li>
        </div>
    )
}

export default Navbar;