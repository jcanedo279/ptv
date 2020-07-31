import React from "react";

import { Link } from "react-router-dom";

import "./Nav.css";

function Nav() {
  return (
    <div className="navBody">
      <nav className="navSections">
        <ul className="navList">
          <Link className="navLinks" to="/">
            <li>Home</li>
          </Link>

          <Link className="navLinks" to="/create">
            <li>Create</li>
          </Link>

          <Link className="navLinks" to="/about">
            <li>About</li>
          </Link>
        </ul>
      </nav>
    </div>
  );
}

export default Nav;
