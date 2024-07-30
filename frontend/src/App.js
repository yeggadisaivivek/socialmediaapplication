import React, { useState, useEffect } from 'react';
import './index.css';
import { Outlet } from 'react-router-dom';

export default function App() {
  return (
    <>
      <div className='bg-gradient-to-b from-light-beige to-transparent'>
        <main className="min-h-screen border border-light-beige">
          <Outlet />
        </main>
      </div>
    </>
  )
}
