import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styleSheets/Navbar.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Updated menu items with correct form route
  const menuItems = [
    { path: "/", label: "בית" },
    { path: "/form", label: "הרשמה" }, // Changed from "/register"
    { path: "/about", label: "אודות" },
    { path: "/competition", label: "תחרויות" },
    { path: "/projects", label: "פרויקטים" }
  ];

  // Rest of the component remains the same
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 769) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/">
            <img
              src={`${process.env.PUBLIC_URL}/logo.jpg`}
              alt="RM Logo"
              className="navbar-logo"
            />
          </Link>
        </div>
        
        <ul className="navbar-menu">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path} className={isActive(item.path)}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="navbar-toggle"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      <div className={`navbar-mobile ${isOpen ? 'open' : ''}`}>
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path} className={isActive(item.path)}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;