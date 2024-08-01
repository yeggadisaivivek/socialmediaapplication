import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

const initialRequests = [
    {
        id: 1,
        username: "A"
    },
    {
        id: 2,
        username: "B"
    },
    {
        id: 3,
        username: "C"
    },
    {
        id: 4,
        username: "D"
    },
    {
        id: 5,
        username: "E"
    },
];

const FollowerRequests = () => {
  const [requests, setRequests] = useState(initialRequests);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchRequests = async () => {
//       try {
//         const response = await axios.get('/api/requests'); // Replace with your API endpoint
//         setRequests(response.data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRequests();
//   }, []);

  const handleAccept = (requestId) => {
    // Implement accept request logic here
    console.log(`Accepted request with ID: ${requestId}`);
  };

  const handleReject = (requestId) => {
    // Implement reject request logic here
    console.log(`Rejected request with ID: ${requestId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Layout>
      <div className="flex  justify-center min-h-screen">
        <div className="container mx-auto p-4">
          <h1 className="text-xl font-bold mb-4 text-center">User Requests</h1>
          <div className="space-y-4 max-w-md mx-auto">
            {requests.map(request => (
              <div key={request.id} className="p-4 bg-white shadow-md rounded flex items-center justify-between">
                <span className="font-medium">{request.username}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleAccept(request.id)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(request.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FollowerRequests;
