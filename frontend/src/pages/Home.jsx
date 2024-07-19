import React, { useState } from 'react';
import Modal from '../components/Modal';
import Bio from '../components/Bio';
import PostsFeed from './PostsFeed';
import Navigation from '../components/Navigation';

const Home = () => {
  const [showBio, setShowBio] = useState(false);
  const [showNav, setShowNav] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex justify-between items-center bg-gray-800 text-white p-4">
        <button className="p-2" onClick={() => setShowNav(true)}>
          Menu
        </button>
        <h1 className="text-lg">App Title</h1>
        <img
          src="/path/to/profile-pic.jpg"
          alt="Profile"
          className="w-8 h-8 rounded-full cursor-pointer"
          onClick={() => setShowBio(true)}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Navigation */}
        <Navigation />

        {/* Posts */}
        <div className="md:w-6/12 bg-black p-4 flex-1 text-white">
          <h1>All Posts</h1>
          {/* Your posts content */}
          <PostsFeed />
        </div>

        {/* Bio/Profile */}
        <div className="md:w-3/12 bg-black p-4 flex flex-col h-screen sticky top-0">
          {/* Desktop Bio */}
          <div className="hidden md:block">
            <Bio />
            {/* <h2>Bio</h2>
            <p>Your bio content goes here...</p> */}
          </div>
        </div>
      </div>

      {/* Navigation Modal */}
      <Modal isOpen={showNav} onClose={() => setShowNav(false)} direction="left">
        <nav>
          <ul>
            <li>
              <a href="#home" onClick={() => setShowNav(false)}>
                Home
              </a>
            </li>
            <li>
              <a href="#about" onClick={() => setShowNav(false)}>
                About
              </a>
            </li>
            <li>
              <a href="#contact" onClick={() => setShowNav(false)}>
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </Modal>

      {/* Bio Modal */}
      <Modal isOpen={showBio} onClose={() => setShowBio(false)} direction="right">
        <Bio />
        {/* <h2>Bio</h2>
        <p>Your bio content goes here...</p> */}
      </Modal>
    </div>
  );
};

export default Home;
