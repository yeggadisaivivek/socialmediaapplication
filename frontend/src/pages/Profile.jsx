import React from 'react';
import Navigation from '../components/Navigation'; // Adjust the import path as necessary
import { useSelector } from 'react-redux';
import PostsFeed from './PostsFeed'; // Adjust the import path as necessary

const Profile = () => {
  const user = useSelector((state) => state.profile.user);

  return (
    <div className="flex flex-1 flex-col md:flex-row">
      {/* Navigation */}
      <Navigation />

      {/* Profile Content */}
      <div className="md:w-6/12 bg-white p-4">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
          {/* Profile Picture */}
          <div className="w-24 h-24 md:w-48 md:h-48">
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          </div>

          {/* Bio Information */}
          <div className="flex-1">
            <h1 className="text-2xl md:text-4xl font-bold">{user.name}</h1>
            <p className="text-gray-700">{user.bio}</p>
            <div className="flex space-x-4 mt-4">
              <div>
                <span className="font-bold">{user.postsCount || 0}</span> Posts
              </div>
              <div>
                <span className="font-bold">{user.followersCount || 0}</span> Followers
              </div>
              <div>
                <span className="font-bold">{user.followingCount || 0}</span> Following
              </div>
            </div>
          </div>
        </div>

        {/* User's Posts */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Posts</h2>
          <PostsFeed posts={user.posts} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
