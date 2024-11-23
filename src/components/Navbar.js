import React, { useEffect, useState } from 'react'
import '../static/css/sidenavbar.css';
const RBACNavbar = () => {
  const [isNavbarShown, setIsNavbarShown] = useState(false);

  useEffect(() => {
    const toggleNavbar = () => {
      setIsNavbarShown((prev) => !prev);
    };
    const toggleButton = document.getElementById('header-toggle');
    toggleButton?.addEventListener('click', toggleNavbar);
    return () => {
      toggleButton?.removeEventListener('click', toggleNavbar);
    };
  }, []);

  useEffect(() => {
    const links = document.querySelectorAll('.nav_link');
    const handleLinkClick = (event) => {
      links.forEach((link) => link.classList.remove('active'));
      event.currentTarget.classList.add('active');
    };

    links.forEach((link) => link.addEventListener('click', handleLinkClick));
    return () => {
      links.forEach((link) => link.removeEventListener('click', handleLinkClick));
    };
  }, []);

  return (
    <div id="body-pd" className={isNavbarShown ? 'body-pd' : ''}>
      <header className={`header ${isNavbarShown ? 'body-pd' : ''}`} id="header">
        <div className="header_toggle">
          <i className={`bx ${isNavbarShown ? 'bx-x' : 'bx-menu'}`} id="header-toggle"></i>
        </div>
      </header>
      <div className={`l-navbar ${isNavbarShown ? 'show' : ''}`} id="nav-bar">
        <nav className="nav">
          <div>
            <a href="/" className="nav_logo">
              <i className="bx bx-layer nav_logo-icon"></i>
              <span className="nav_logo-name">VRV Security</span>
            </a>
            <div className="nav_list">
              <a href="/" className="nav_link">
                <i className="bx bx-user nav_icon"></i>
                <span className="nav_name">Users</span>
              </a>
              <a href="roles" className="nav_link">
                <i className="bx bx-group nav_icon"></i>
                <span className="nav_name">Roles</span>
              </a>
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
}
export default RBACNavbar