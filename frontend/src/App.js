import React, { useState, useEffect } from 'react';
import './index.css';
import { ToastContainer } from 'react-toastify';
import { Outlet } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <>
      <div className='bg-gradient-to-b from-light-beige to-transparent'>
        <main className="min-h-screen border border-light-beige">
          <Outlet />
          <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </main>
      </div>
    </>
  )
}
