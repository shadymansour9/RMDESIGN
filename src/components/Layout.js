import React from "react";
import "../styleSheets/Layout.css";
// Do not import Navbar here since it will be rendered at the app level
// This prevents duplicate navbars

function Layout({ children }) {
  return (
    <div className="layout-container">
      <div className="layout-content">
        {children}
      </div>
    </div>
  );
}

export default Layout;