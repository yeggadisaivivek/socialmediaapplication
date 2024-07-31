import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import store from './redux/store';
import Home from './pages/Home';
import Login from './pages/Login';
import AllPosts from './pages/PostsFeed';
import SignupPage from './pages/Signup';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';
import Search from './pages/Search';

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
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </Provider>
  </React.StrictMode>
);

