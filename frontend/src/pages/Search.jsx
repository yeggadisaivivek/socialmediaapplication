import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ReactSelect from 'react-select';
import Profile from './Profile'; // Assuming you have a Profile component
import Navigation from '../components/Navigation';

const Search = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loggedInUser = useSelector((state) => state.auth.user); // Assuming you have user information in your Redux state

  const [selectedUser, setSelectedUser] = useState(null);
  const [followingStatus, setFollowingStatus] = useState('follow'); // Default follow state

  const users = [
    { value: 1, label: 'User 1' },
    { value: 2, label: 'User 2' },
    { value: 3, label: 'User 3' },
    // Replace with actual users or fetched data
  ];

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    // Simulate following status based on some logic (can be Redux action to fetch actual status)
    const randomStatus = Math.random(); // Replace with actual logic
    if (randomStatus < 0.3) {
      setFollowingStatus('follow');
    } else if (randomStatus < 0.6) {
      setFollowingStatus('requested');
    } else {
      setFollowingStatus('unfollow');
    }
  };

  const handleProfileClick = () => {
    // Redirect to selected user's profile
    navigate(`/profile/${selectedUser.value}`);
  };

  return (
    <div className="flex h-screen">
      <Navigation />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-96">
          <h1 className="text-2xl font-bold mb-4">Search Users</h1>
          <ReactSelect
            options={users}
            onChange={handleUserSelect}
            value={selectedUser}
            placeholder="Search users..."
          />
          {selectedUser && (
            <div className="mt-4">
              <p className="mt-2">Following Status: {followingStatus}</p>
              <button
                onClick={handleProfileClick}
                className="mt-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                View Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
    
  );
};

export default Search;
