import React, { useState, useEffect } from 'react';


function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5001/test')
      .then(response => response.json())
      .then(data => setMessage(data.message));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
      <h1>Hello boys</h1>
        <p>{message}</p>
      </header>
    </div>
  );
}

export default App;
