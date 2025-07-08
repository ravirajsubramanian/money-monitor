import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="nav-brand">Money Monitor</Link>
        <div className="nav-links">
          <Link to="/">Dashboard</Link>
          <Link to="/analysis">Analysis</Link>
          <Link to="/goals">Goals</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
