import React, { useState, useEffect } from 'react';
import './index.css';
import { Outlet } from 'react-router-dom';

export default function App() {
  return (
    <>
      <div>
        <main>
          <Outlet />
        </main>
      </div>
    </>
  )
}
