import React, { useState } from 'react';
import image1 from '../metadata/pictures/profile_pic.jpg';

const initialPosts = [
  {
    id: 1,
    username: "johndoe",
    userProfilePicture: image1,
    imageUrl: image1,
    caption: "This is a sample post caption.",
    likesCount: 120,
    commentsCount: 45,
    comments: [
      { id: 1, username: "vivek", text: "hello" },
      { id: 2, username: "vivek", text: "hello" },
      { id: 3, username: "vivek", text: "hello" },
      { id: 4, username: "vivek", text: "hello" },
      { id: 5, username: "vivek", text: "hello" },
      { id: 6, username: "vivek", text: "hello" },
      { id: 7, username: "vivek", text: "hello" },
    ],
    isLiked: false,
  },
  {
    id: 2,
    username: "johndoe",
    userProfilePicture: image1,
    imageUrl: image1,
    caption: "This is a sample post caption.",
    likesCount: 120,
    commentsCount: 45,
    isLiked: false,
  },
  {
    id: 3,
    username: "johndoe",
    userProfilePicture: image1,
    imageUrl: image1,
    caption: "This is a sample post caption.",
    likesCount: 120,
    commentsCount: 45,
    isLiked: false,
  },
  {
    id: 4,
    username: "johndoe",
    userProfilePicture: image1,
    imageUrl: image1,
    caption: "This is a sample post caption.",
    likesCount: 120,
    commentsCount: 45,
    isLiked: false,
  },
  {
    id: 5,
    username: "johndoe",
    userProfilePicture: image1,
    imageUrl: image1,
    caption: "This is a sample post caption.",
    likesCount: 120,
    commentsCount: 45,
    isLiked: false,
  },
];

const PostsFeed = () => {
  const [posts, setPosts] = useState(initialPosts);
  const [visibleComments, setVisibleComments] = useState({}); // State to track visible comments count for each post

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likesCount: post.likesCount + 1, isLiked: true } : post
    ));
  };

  const handleUnlike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likesCount: post.likesCount - 1, isLiked: false } : post
    ));
  };

  const handleAddComment = (postId, comment) => {
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, commentsCount: post.commentsCount + 1, comments: [...(post.comments || []), comment] } : post
    ));
  };

  const handleEditComment = (postId, commentId, newComment) => {
    setPosts(posts.map(post => 
      post.id === postId ? {
        ...post,
        comments: post.comments.map(comment =>
          comment.id === commentId ? { ...comment, text: newComment } : comment
        )
      } : post
    ));
  };

  const handleDeleteComment = (postId, commentId) => {
    setPosts(posts.map(post => 
      post.id === postId ? {
        ...post,
        commentsCount: post.commentsCount - 1,
        comments: post.comments.filter(comment => comment.id !== commentId)
      } : post
    ));
  };

  const handleShowMoreComments = (postId) => {
    setVisibleComments({
      ...visibleComments,
      [postId]: (visibleComments[postId] || 2) + 2
    });
  };

  return (
    <div className="container mx-auto p-4">
      {posts.map((post) => (
        <div className="bg-white shadow-md rounded-lg mb-6 text-black" key={post.id}>
          <div className="flex items-center p-4">
            <img src={post.userProfilePicture} alt={post.username} className="w-10 h-10 rounded-full mr-3" />
            <div>
              <h2 className="text-sm font-bold">{post.username}</h2>
            </div>
          </div>
          <img src={post.imageUrl} alt={post.caption} className="w-full" />
          <div className="p-4">
            <p className="text-sm">
              <span className="font-bold">{post.username}</span> {post.caption}
            </p>
            <div className="mt-2 flex justify-between text-sm text-gray-600">
              <div>
                <span className="font-bold">{post.likesCount}</span> likes
                {post.isLiked ? (
                  <button
                    onClick={() => handleUnlike(post.id)}
                    className="ml-2 text-red-500"
                    disabled={!post.isLiked}
                  >
                    Unlike
                  </button>
                ) : (
                  <button
                    onClick={() => handleLike(post.id)}
                    className="ml-2 text-blue-500"
                    disabled={post.isLiked}
                  >
                    Like
                  </button>
                )}
              </div>
              <div>
                <span className="font-bold">{post.commentsCount}</span> comments
              </div>
            </div>
            <div className="mt-4">
              {post.comments && post.comments.slice(0, visibleComments[post.id] || 2).map(comment => (
                <div key={comment.id} className="flex justify-between items-center mb-2">
                  <p className="text-sm"><span className="font-bold">{comment.username}</span> {comment.text}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditComment(post.id, comment.id, prompt('Edit your comment:', comment.text))}
                      className="text-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteComment(post.id, comment.id)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {post.comments && post.comments.length > (visibleComments[post.id] || 2) && (
                <button
                  onClick={() => handleShowMoreComments(post.id)}
                  className="text-blue-500"
                >
                  Show more comments
                </button>
              )}
              <form onSubmit={(e) => {
                e.preventDefault();
                const comment = {
                  id: Date.now(),
                  username: 'current_user', // Replace with the actual username of the current user
                  text: e.target.elements.comment.value
                };
                handleAddComment(post.id, comment);
                e.target.reset();
              }}>
                <input
                  name="comment"
                  type="text"
                  placeholder="Add a comment..."
                  className="w-full p-2 border rounded mt-2"
                />
              </form>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostsFeed;
