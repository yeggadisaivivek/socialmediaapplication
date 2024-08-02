import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../redux/authSlice';
import logo from '../metadata/pictures/logo.webp';

const Navigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = () => {
    dispatch(logout());
    localStorage.removeItem('token');
  }

  const handleOnClickLogo = () => {
    navigate('/');
  }

  const handleNavigation = (event, path) => {
    event.preventDefault();
    if (path !== "/" && location.pathname.includes(path)) {
      window.location.reload();
    } else {
      navigate(path);
    }
  };

  return (
    <div className="bg-white shadow-md p-4 h-full relative">
      <div className="mb-8">
        <img
          src={logo}
          alt="Logo"
          className="mx-auto h-40 w-40 cursor-pointer"
          onClick={handleOnClickLogo}
        />
      </div>
      <nav>
        <ul className="space-y-4">
          <li>
            <Link 
            to="/" 
            className="block bg-gray-200 rounded-lg px-4 py-2 text-center hover:bg-gray-300 transition duration-300"
            onClick={(event) => handleNavigation(event, '/')}>
              Home
            </Link>
          </li>
          <li>
            <Link 
            to="/addpost" 
            className="block bg-gray-200 rounded-lg px-4 py-2 text-center hover:bg-gray-300 transition duration-300"
            onClick={(event) => handleNavigation(event, '/addpost')}>
              Create a Post
            </Link>
          </li>
          <li>
            <Link 
            to="/search" 
            className="block bg-gray-200 rounded-lg px-4 py-2 text-center hover:bg-gray-300 transition duration-300"
            onClick={(event) => handleNavigation(event, '/search')}>
              Search
            </Link>
          </li>
          <li>
            <Link 
            to="/profile" 
            className="block bg-gray-200 rounded-lg px-4 py-2 text-center hover:bg-gray-300 transition duration-300"
            onClick={(event) => handleNavigation(event, '/profile')}>
              Profile
            </Link>
          </li>
          <li>
            <Link 
            to="/follower-requests" 
            className="block bg-gray-200 rounded-lg px-4 py-2 text-center hover:bg-gray-300 transition duration-300"
            onClick={(event) => handleNavigation(event, '/follower-requests')}>
              Follow Requests
            </Link>
          </li>
          <li>
            <Link 
            to="/login" 
            onClick={handleSignOut} 
            className="block bg-red-200 rounded-lg px-4 py-2 text-center hover:bg-red-300 transition duration-300">
              Signout
            </Link>
          </li>
        </ul>
      </nav>
      <div className="absolute top-0 right-0 h-full border-r border-gray-300"></div>
    </div>
  );
};

export default Navigation;
