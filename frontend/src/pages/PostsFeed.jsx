import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { addComment, likeOrUnlikePost, fetchAllPosts, deletePost } from '../apiCalls/apiCalls';
import { useSelector } from 'react-redux';
import { FaEllipsisH, FaHeart, FaCommentDots } from 'react-icons/fa';

const PostsFeed = ({ postFromParent, flag }) => {
  const [posts, setPosts] = useState([]);
  const [visibleComments, setVisibleComments] = useState({});
  const [menuOpen, setMenuOpen] = useState({});
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.userId);
  const isMounted = useRef(false);
  const username = useSelector((state) => state.auth.username)

  const getAllPosts = useCallback(async (userId) => {
    try {
      if (flag) {
        setPosts(postFromParent || []);
      } else {
        const allPosts = await fetchAllPosts(userId);
        if (allPosts.posts) {
          setPosts(allPosts.posts);
        }
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  }, [flag, postFromParent]);

  useEffect(() => {
    if (isMounted.current) {
      return;
    }

    getAllPosts(userId);
    isMounted.current = true;
  }, [userId, getAllPosts]);

  const handleLike = async (postId) => {
    try {
      const response = await likeOrUnlikePost(userId, postId, "like");
      if(response !== "Liked/Unliked already") {
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          return post.id === postId
            ? { ...post, likes_count: Number(post?.likes_count) + 1 }
            : post
    })
      );}
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleUnlike = useCallback(async (postId) => {
    try {
      const response = await likeOrUnlikePost(userId, postId, "unlike");
      if(response !== "Liked/Unliked already") {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, likes_count: post.likes_count - 1}
            : post
        )
      );}
    } catch (error) {
      console.error('Error unliking post:', error);
    }
  }, [userId]);

  const handleAddComment = useCallback(async (postId, comment) => {
    try {
      await addComment(userId, postId, comment);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, comments_count: post.comments_count + 1, comments: [...(post.comments || []), comment] }
            : post
        )
      );
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  }, []);

  const handleShowMoreComments = (postId) => {
    setVisibleComments({
      ...visibleComments,
      [postId]: (visibleComments[postId] || 2) + 2
    });
  };

  const handleCreatePost = () => {
    navigate('/addpost');
  };

  const toggleMenu = (postId) => {
    setMenuOpen({
      ...menuOpen,
      [postId]: !menuOpen[postId],
    });
  };

  const handleDeletePost = async (postId) => {
    // Implement the delete post functionality here
    try {
      await deletePost(userId, postId);
      setMenuOpen({});
      await getAllPosts(userId);
    } catch (error) {
      console.error('Error deleting the post:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {posts?.length === 0 ? (
        <div className="flex flex-col items-center">
          <p>No posts found.</p>
          {!flag ? (
            <button
              onClick={handleCreatePost}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Create a New Post
            </button>
          ) : null}
        </div>
      ) : (
        posts.map((post) => (
          <div className="bg-white shadow-lg rounded-lg mb-6 text-black relative" key={post.id}>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <img src={post.profile_pic_url} alt={post.name} className="w-10 h-10 rounded-full mr-3" />
                <div>
                  <h2 className="text-sm font-bold">{post.name}</h2>
                </div>
              </div>
              <button onClick={() => toggleMenu(post.id)} className="focus:outline-none">
                <FaEllipsisH />
              </button>
              {menuOpen[post.id] && (
                <div className="absolute top-12 right-4 bg-white shadow-md rounded p-2">
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="text-red-500"
                  >
                    Delete Post
                  </button>
                </div>
              )}
            </div>
            {post.media_type === 'image' ? (
              <img src={post.post_url} alt={post.caption} className="w-full rounded-b-lg" />
            ) : (
              <video controls className="w-full rounded-b-lg">
                <source src={post.post_url} type="video/mp4" />
                <source src={post.post_url} type="video/quicktime" />
                Your browser does not support the video tag.
              </video>
            )}
            <div className="p-4">
              <p className="text-sm mb-2">
                <span className="font-bold">{post.name}</span> {post.caption}
              </p>
              <div className="mt-2 flex justify-between text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="font-bold">{post.likes_count}</span> likes
                    <button
                      onClick={() => handleUnlike(post.id)}
                      className="ml-2 text-gray-500"
                    >
                      Unlike
                    </button>
                    <button
                      onClick={() => handleLike(post.id)}
                      className="ml-2 text-red-500"
                    >
                      <FaHeart />
                    </button>
                </div>
                <div className="flex items-center">
                  <span className="font-bold">{post.comments_count}</span> comments
                  <FaCommentDots className="ml-2" />
                </div>
              </div>
              <div className="mt-4">
                {post.comments && post.comments.slice(0, visibleComments[post.id] || 2).map(comment => (
                  <div key={comment.id} className="flex justify-between items-center mb-2">
                    <p className="text-sm"><span className="font-bold">{comment.username}</span> {comment.comment}</p>
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
                    username,
                    comment: e.target.elements.comment.value
                  };
                  handleAddComment(post.id, comment);
                  e.target.reset();
                }} className="flex items-center mt-2">
                  <input
                    name="comment"
                    type="text"
                    placeholder="Add a comment..."
                    className="w-full p-2 border border-gray-300 rounded h-10"
                  />
                  <button
                    type="submit"
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded h-10"
                  >
                    Add Comment
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PostsFeed;
