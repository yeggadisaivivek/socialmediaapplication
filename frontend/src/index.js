import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import Home from './pages/Home';
import Login from './pages/Login';
import AllPosts from './pages/PostsFeed';
import SignupPage from './pages/Signup';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';
import Search from './pages/Search';
import FollowerRequests from './pages/FollowerRequest';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/profile',
        element: (
          <Profile />
        )
      },
      {
        path: '/profile/:userId',
        element: (
          <Profile />
        )
      },
      {
        path: '/search',
        element: (
          <Search />
        )
      },
      {
        path: '/follower-requests',
        element: (
          <FollowerRequests />
        )
      },
      {
        path: '/login',
        element: (
          <Login />
        )
      },
      {
        path: '/signup',
        element: (
          <SignupPage />
        )
      },
      {
        path: '/allposts',
        element: (
          <AllPosts />
        )
      },
      {
        path: '/addpost',
        element: (
          <CreatePost />
        )
      },
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

