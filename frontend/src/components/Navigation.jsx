import React from 'react';

const Navigation = () => {
  return (
    <div className="md:block md:w-3/12 bg-black text-white p-4 hidden md:flex md:flex-col h-screen border-r-2 border-gray-100 sticky top-0">
      <div className="mb-8">
        <img
          src="/path/to/logo.png"
          alt="Logo"
          className="mx-auto h-12 w-12"
        />
      </div>
      <nav>
        <ul className="space-y-4">
          <li>
            <a href="/" className="block hover:text-gray-900">
              Home
            </a>
          </li>
          <li>
            <a href="/addpost" className="block hover:text-gray-900">
              Create a Post
            </a>
          </li>
          <li>
            <a href="/search" className="block hover:text-gray-900">
              Search
            </a>
          </li>
          <li>
            <a href="/profile" className="block hover:text-gray-900">
              Profile
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navigation;
