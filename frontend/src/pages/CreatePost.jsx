import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
//import { createPost } from '../redux/postSlice'; // Adjust the import path as necessary
import Navigation from '../components/Navigation'; // Import your Navigation component

const CreatePost = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    media: null,
    caption: '',
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      media: file,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Assuming you have an action creator `createPost` defined in your Redux slice
    // TODO
    // dispatch(createPost(formData));
    // Reset form data after submission
    setFormData({
      media: null,
      caption: '',
    });
  };

  return (
    <div className="flex flex-1 flex-col md:flex-row">
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <div className="md:w-6/12 bg-white p-4">
        <h1 className="text-xl font-bold mb-4">Create a Post</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Media (Image or Video)</label>
            <input
              type="file"
              accept="image/*, video/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Caption</label>
            <textarea
              name="caption"
              value={formData.caption}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
