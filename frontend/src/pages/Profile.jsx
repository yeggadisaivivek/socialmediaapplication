import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import  { toast } from 'react-toastify';
import PostsFeed from './PostsFeed'; // Adjust the import path as necessary
import Layout from '../components/Layout';
import defaultProfilePic from '../metadata/pictures/default_profile_pic.jpg'
import {  fetchUserDetails, fetchPostsOfUser, followUser, unfollowUser } from '../apiCalls/apiCalls'; // Adjust the import path as necessary
import { decreaseFollowingCount } from '../redux/profileSlice';

const Profile = () => {
  const currentUserId = useSelector((state) => state.auth.userId);
  const dispatch = useDispatch();
  const { userId } = useParams();
  
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followingStatus, setFollowingStatus] = useState('follower'); // follow/unfollow/requested

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        let userProfile = {}
        if(userId && currentUserId) {
          userProfile = await fetchUserDetails(userId, currentUserId)
        } else {
          userProfile = await fetchUserDetails(currentUserId)
        }
        const userPosts = await fetchPostsOfUser(userId || currentUserId);
        if(!userProfile.profile_pic_url){
          userProfile.profile_pic_url = defaultProfilePic
        }
        setUser(userProfile);
        setFollowingStatus(userProfile?.followingStatus);
        if(userPosts?.posts) {
          setPosts(userPosts.posts);
        }
      } catch (error) {
        toast.error('Error while fetching profile information');
      }
    };

    fetchProfileData();
  }, []);

  const handleFollow = async () => {
    try {
      await followUser(currentUserId, userId);
      setFollowingStatus("pending");
    } catch (error) {
      toast.error("Error while following a user");
    }
  };

  const handleUnfollow = async () => {
    try {
      await unfollowUser(currentUserId,userId);
      dispatch(decreaseFollowingCount());
      setFollowingStatus("follow"); 
    } catch (error) {
      toast.error("Error while unfollowing a user");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
        {/* Profile Picture */}
        <div className="w-24 h-24 md:w-48 md:h-48">
          <img
            src={user.profile_pic_url}
            alt={defaultProfilePic}
            className="w-full h-full rounded-full object-cover"
          />
        </div>

        {/* Bio Information */}
        <div className="flex-1">
          <h1 className="text-2xl md:text-4xl font-bold">{user.name}</h1>
          <p className="text-gray-700">{user.bio}</p>
          <div className="flex space-x-4 mt-4">
            <div>
              <span className="font-bold">{user.number_of_posts || 0}</span> Posts
            </div>
            <div>
              <span className="font-bold">{user.number_of_followers || 0}</span> Followers
            </div>
          </div>
        </div>
        {userId && currentUserId !== Number(userId) && (
          <div className="mt-4">
            {followingStatus === "follower" && (
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={handleUnfollow}
              >
                Unfollow
              </button>
            )}
            {followingStatus === "pending" && (
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded"
                onClick={handleFollow}
                disabled
              >
                Requested
              </button>
            )}
            {(followingStatus !== "follower" && followingStatus !== "pending") && (
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleFollow}
              >
                Follow
              </button>
            )}
          </div>
        )}
      </div>

      {/* User's Posts */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Posts</h2>
        <PostsFeed postFromParent={posts} flag={true}/>
      </div>
    </Layout>
  );
};

export default Profile;
