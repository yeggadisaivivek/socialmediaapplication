import React from 'react';
import Layout from '../components/Layout';
import PostsFeed from './PostsFeed';

const HomePage = () => {
  return (
    <Layout>
      <div className="flex flex-col h-full">
        <h1 className="text-2xl mb-4 font-semibold">All Posts</h1>
        <PostsFeed />
      </div>
    </Layout>
  );
};

export default HomePage;
