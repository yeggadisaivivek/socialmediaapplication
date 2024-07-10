import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import  { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import Home from './pages/Home';
import Protected from './components/Protected';
import Login from './pages/Login';
import AllPosts from './pages/AllPosts';
import AddPost from './pages/AddPost';
import EditPost from './pages/EditPost';
import SignupPage from './pages/Signup';

const router  = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
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
          <Protected authentication>
            <AddPost />
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

