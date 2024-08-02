import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { fetchFollowerRequests, followOrUnfollowUser } from '../apiCalls/apiCalls';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify'; // Make sure to import the action correctly
import { increaseFollowingCount } from '../redux/profileSlice';
import LoadingSpinner from '../components/LoadingSpinner';

const FollowerRequests = () => {
  const dispatch = useDispatch();
  const [requests, setRequests] = useState([]);
  const userId = useSelector((state) => state.auth.userId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const response = await fetchFollowerRequests(userId); // Replace with your API endpoint
      setRequests(response);
      setLoading(false)
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [userId]); // Only run when userId changes

  const handleAccept = async (requestId) => {
    try {
      setLoading(true)
      await followOrUnfollowUser(userId, requestId, 'accept');
      dispatch(increaseFollowingCount());
      fetchRequests();
      setLoading(false)
    } catch (error) {
      toast.error('Error while accepting the request');
    }
  };

  const handleReject = async (requestId) => {
    try {
      setLoading(true)
      await followOrUnfollowUser(userId, requestId, 'reject');
      fetchRequests();
      setLoading(false)
    } catch (error) {
      toast.error('Error while rejecting the request');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Layout>
      {loading ? <LoadingSpinner /> : (
        <div className="flex justify-center min-h-screen">
          <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold mb-4 text-center">User Requests</h1>
            {requests.length === 0 ? (
              <div className="text-center text-gray-500">No requests at the moment</div>
            ) : (
              <div className="space-y-4 max-w-md mx-auto">
                {requests.map((request) => (
                  <div key={request.request_id_from} className="p-4 bg-white shadow-md rounded flex items-center justify-between">
                    <span className="font-medium">{request.name}</span>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleAccept(request.request_id_from)}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(request.request_id_from)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </Layout>
  );
};

export default FollowerRequests;
