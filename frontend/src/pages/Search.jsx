import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactSelect from 'react-select';
import Layout from '../components/Layout';
import { fetchAllUsers } from '../apiCalls/apiCalls';
import { toast } from 'react-toastify';

const Search = () => {
  const navigate = useNavigate();

  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]); // Ensure users is an array

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const response = await fetchAllUsers();
        if (response && response.length > 0) {
          const formattedUsers = response.map(user => ({
            ...user,
            label: user.name,
            value: user.id
          }));
          
          setUsers(formattedUsers);
        } else {
          setUsers([]);
        }
      } catch (error) {
        toast.error("Error while fetching users");
        setUsers([]);
      }
    };
    getAllUsers();
  }, []);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleProfileClick = () => {
    // Redirect to selected user's profile
    navigate(`/profile/${selectedUser.value}`);
  };

  return (
    <Layout>
      <div className="w-96">
        <h1 className="text-2xl font-bold mb-4">Search Users</h1>
        <ReactSelect
          options={users}
          onChange={handleUserSelect}
          value={selectedUser}
          placeholder="Search users..."
        />
        {selectedUser && (
          <div className="mt-4">
            <button
              onClick={handleProfileClick}
              className="mt-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              View Profile
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Search;
