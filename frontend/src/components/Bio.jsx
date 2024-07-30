import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserDetails, getPreSignedURL, updateUserDetails } from '../apiCalls/apiCalls';
import axios from 'axios';
import { setUsername } from '../redux/authSlice';
import defaultProfilePic from '../metadata/pictures/default_profile_pic.jpg'
import { toast } from 'react-toastify';

const Bio = () => {
  const dispatch = useDispatch();
  const isMounted = useRef(false);
  const userId = useSelector((state) => state.auth.userId);

  const [stats, setStats] = useState({
    followersCount: 0,
    postsCount: 0,
  });
  const [saveButtonDisabled,setSaveButtonDisabled] = useState(true)
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    profilePicture: '',
    profilePictureFile: null, // to store the file object
    profilePictureKey: '', // key to store the S3 key
  });

  useEffect(() => {
    if (isMounted.current) {
      return;
    }

    const getUserDetails = async () => {
      try {
        const userDetails = await fetchUserDetails(userId);
        // Update state with fetched details
        if (userDetails) {
          setFormData({
            name: userDetails.name || 'No name',
            bio: userDetails.bio || '',
            profilePicture: userDetails.profile_pic_url || defaultProfilePic,
            profilePictureKey: userDetails.profilePictureKey || '',
          });
          setStats({
            followersCount: userDetails.number_of_followers || 0,
            postsCount: userDetails.number_of_posts || 0,
          });

          dispatch(setUsername({username : userDetails.name}))
        }
      } catch (error) {
        toast.error("Error in fetching user details")
      }
    }

    getUserDetails();
    isMounted.current = true;
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSaveButtonDisabled(false);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    saveButtonDisabled(false)
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        profilePicture: URL.createObjectURL(file),
        profilePictureFile: file, // store the file object
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let profilePicKey = formData.profilePictureKey;

    if (formData.profilePictureFile) {
      try {
        const response = await getPreSignedURL(formData.profilePictureFile.name, formData.profilePictureFile.type)
        const { url, key } = response;
        await axios.put(url, formData.profilePictureFile, {
          headers: {
            'Content-Type': formData.profilePictureFile.type,
          },
        });
        profilePicKey = key;
      } catch (error) {
        toast.error('Error uploading file')
        return;
      }
    }

    try {
      await updateUserDetails(userId, formData.bio, profilePicKey);
      const updatedUserDetails = await fetchUserDetails(userId);
      if (updatedUserDetails) {
        setFormData({
          name: updatedUserDetails.name || 'No name',
          bio: updatedUserDetails.bio || '',
          profilePicture: updatedUserDetails.profilePicture || '',
          profilePictureKey: updatedUserDetails.profilePictureKey || '',
        });
        setStats({
          followersCount: updatedUserDetails.number_of_followers || 0,
          postsCount: updatedUserDetails.number_of_posts || 0,
        });
      }
      setEditMode(false);
    } catch (error) {
      toast.error('Error updating profile:');
    }
  };

  return (
    <div className="p-4 ">
      {editMode ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500"
            />
          </div>
          {formData.profilePicture && (
            <img src={formData.profilePicture} alt="Profile Preview" className="w-24 h-24 rounded-full mt-2" />
          )}
          <div className="flex justify-start space-x-2">
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
              disabled={saveButtonDisabled}
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div className="flex items-center space-x-4">
            <img src={formData.profilePicture} alt="Profile" className="w-24 h-24 rounded-full" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{formData.name}</h2>
            <p>{formData.bio}</p>
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
