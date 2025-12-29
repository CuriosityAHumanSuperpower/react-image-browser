// Navbar Component
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <div className="navbar-right">
        <Link to="/">Home</Link>
        <Link to="/people">People</Link>
        <Link to="/map">Map</Link>
        <Link to="/settings">Settings</Link>
        <Link to="/admin">Admin</Link>
      </div>
      <div className="navbar-left">
        <Link to="/auth">Auth</Link>
      </div>
    </nav>
  );
};

export default Navbar;