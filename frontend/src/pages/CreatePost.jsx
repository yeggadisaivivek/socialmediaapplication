import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Layout from '../components/Layout';
import { addPost, getPreSignedURL } from '../apiCalls/apiCalls';
import { useNavigate } from 'react-router-dom';
import  { toast } from 'react-toastify';
import axios from 'axios';

const CreatePost = () => {
  const userId = useSelector((state) => state.auth.userId);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    caption: '',
    profilePicture: '',
    profilePictureFile: null, // to store the file object
    profilePictureKey: '', // key to store the S3 key
    mediaType: 'image'
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const mediaType = file.type.startsWith('video') ? 'video' : 'image';
    setFormData({
      ...formData,
      profilePicture: URL.createObjectURL(file),
      profilePictureFile: file,
      mediaType: mediaType
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let profilePicKey = formData.profilePictureKey;

    if (formData.profilePictureFile) {
      try {
        const response = await getPreSignedURL(formData.profilePictureFile.name, formData.profilePictureFile.type);
        const { url, key } = response;
        await axios.put(url, formData.profilePictureFile, {
          headers: {
            'Content-Type': formData.profilePictureFile.type,
          },
        });
        profilePicKey = key;
      } catch (error) {
        toast.error("Error uploading file");
        return; // Exit if file upload fails
      }
    }

    try {
      const response = await addPost(userId, { "caption": formData.caption, "mediaType": formData.mediaType,"profilePicUrl": profilePicKey });
      navigate('/');
    } catch (error) {
      toast.error("Error Uploading post");
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Create a Post</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Media (Image or Video)</label>
            <input
              type="file"
              accept="image/*, video/*"
              onChange={handleFileChange}
              className="mt-2 block w-full text-sm text-gray-500 border border-gray-300 rounded-md"
            />
          </div>
          {formData.profilePicture && formData.mediaType === 'image' && (
            <img src={formData.profilePicture} alt="Profile Preview" className="w-80 h-80  mt-4 mx-auto" />
          )}
          {formData.profilePicture && formData.mediaType === 'video' && (
            <video controls className="w-80 h-80 mt-4 mx-auto">
              <source src={formData.profilePicture} type={formData.profilePictureFile.type} />
              Your browser does not support the video tag.
            </video>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Caption</label>
            <textarea
              name="caption"
              value={formData.caption}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              rows="4"
              placeholder="Write a caption..."
            />
          </div>
          <button
            type="submit"
            className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Post
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default CreatePost;
