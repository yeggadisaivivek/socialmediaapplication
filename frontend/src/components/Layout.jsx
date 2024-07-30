import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Navigation from './Navigation';
import { FaAlignJustify } from 'react-icons/fa6'
import Bio from './Bio';

const Layout = ({ children }) => {
  const [showNav, setShowNav] = useState(false);
  const [showBio, setShowBio] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.matchMedia("(min-width: 768px)").matches);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.matchMedia("(min-width: 768px)").matches);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex justify-between items-center text-black p-4">
        <button className="p-2" onClick={() => setShowNav(true)}>
          <FaAlignJustify />
        </button>
        <h1 className="text-lg">Social Media Application</h1>
        <img
          src="/path/to/profile-pic.jpg"
          alt="Profile"
          className="w-8 h-8 rounded-full cursor-pointer"
          onClick={() => setShowBio(true)}
        />
      </div>

      <div className="flex flex-1 flex-col md:flex-row">
        {/* Navigation */}
        <div className="md:w-3/12 mx-auto p-4 hidden md:block flex-shrink-0 text-black h-screen sticky top-0 text-xl font-bold">
          <Navigation />
        </div>

        {/* Main Content */}
        <main className="md:w-6/12 p-4 flex-1">
          {children}
        </main>

        {/* Bio/Profile */}
        {isDesktop && (
          <div className="md:w-3/12 p-4 hidden md:flex flex-col h-screen sticky top-0 flex-shrink-0">
            <Bio />
          </div>
        )}
      </div>

      {/* Navigation Modal */}
      <Modal isOpen={showNav} onClose={() => setShowNav(false)} direction="left">
        <Navigation />
      </Modal>

      {/* Bio Modal */}
      {!isDesktop && (
        <Modal isOpen={showBio} onClose={() => setShowBio(false)} direction="right">
          <Bio />
        </Modal>
      )}
    </div>
  );
};

export default Layout;
