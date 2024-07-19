import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../redux/profileSlice';

//import axios from 'axios';

const Bio = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.profile.user);
  const [stats, setStats] = useState({
    followersCount: 0,
    postsCount: 0,
    followingCount: 0,
  });

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    bio: user.bio || '',
    profilePicture: user.profilePicture || '',
  });

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const response = await axios.get(`/api/user-stats/${user.id}`);
//         setStats(response.data);
//       } catch (error) {
//         console.error('Error fetching user stats:', error);
//       }
//     };

//     fetchStats();
//   }, [user.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("file:::"+file)
    setFormData({
      ...formData,
      profilePicture: URL.createObjectURL(file),
    });
    console.log("formdata::::"+formData)
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile(formData));
    setEditMode(false);
  };

  return (
    <div className="p-4 text-white">
      {editMode ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500"
            />
          </div>
          {formData.profilePicture && (
            <img src={formData.profilePicture} alt="Profile Preview" className="w-24 h-24 rounded-full mt-2" />
          )}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div className="flex items-center space-x-4">
            <img src={user.profilePicture} alt="Profile" className="w-24 h-24 rounded-full" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p>{user.bio}</p>
          </div>
          <div className="mt-4 flex space-x-8">
            <div className="text-center">
              <span className="block text-xl font-bold">{stats.postsCount}</span>
              <span className="text-sm text-gray-500">Posts</span>
            </div>
            <div className="text-center">
              <span className="block text-xl font-bold">{stats.followersCount}</span>
              <span className="text-sm text-gray-500">Followers</span>
            </div>
            <div className="text-center">
              <span className="block text-xl font-bold">{stats.followingCount}</span>
              <span className="text-sm text-gray-500">Following</span>
            </div>
          </div>
          <button
            onClick={() => setEditMode(true)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default Bio;
