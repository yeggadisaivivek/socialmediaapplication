import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import  { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import Home from './pages/Home';
import Protected from './components/Protected';
import Login from './pages/Login';
import AllPosts from './pages/PostsFeed';
import EditPost from './pages/EditPost';
import SignupPage from './pages/Signup';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';
import Search from './pages/Search';

const router  = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: (
          <Protected authentication={false}>
            <Home />
          </Protected>
        )
      },
      {
        path: '/profile',
        element: (
          <Protected authentication={false}>
            <Profile />
          </Protected>
        )
      },
      {
        path: '/profile/:userId',
        element: (
          <Protected authentication={false}>
            <Profile />
          </Protected>
        )
      },
      {
        path: '/search',
        element: (
          <Protected authentication={false}>
            <Search />
          </Protected>
        )
      },
      {
        path: '/login',
        element: (
          <Protected authentication={false}>
            <Login />
          </Protected>
        )
      },
      {
        path: '/signup',
        element: (
          <Protected authentication={false}>
            <SignupPage />
          </Protected>
        )
      },
      {
        path: '/allposts',
        element: (
          <Protected authentication>
            <AllPosts />
          </Protected>
        )
      },
      {
        path: '/addpost',
        element: (
          <Protected authentication={false}>
            <CreatePost />
          </Protected>
        )
      },
      {
        path: '/editpost/:slug',
        element: (
          <Protected authentication>
            <EditPost />
          </Protected>
        )
      }
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  </React.StrictMode>
);

