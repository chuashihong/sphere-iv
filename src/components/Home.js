import React, { useState, useEffect } from 'react';
import supabase from '../utils/supabaseClient';
import userService from '../utils/userService'; // Import the userService utility

const Home = () => {
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Get the logged-in user's details from Supabase Auth
        const { data: user, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          setErrorMessage('Unable to fetch user details. Please log in again.');
          console.error('Error fetching user:', userError?.message || 'No user found.');
          return;
        } else {
          console.log('User:', user);
        }

        // Use userService to fetch the profile by ID
        const { data: profile, error: profileError } = await userService.getUserById(user.user.id);

        if (profileError) {
          setErrorMessage('Unable to fetch profile details.');
          console.error('Error fetching profile:', profileError.message);
          return;
        }

        setUsername(profile?.username || 'Guest');
      } catch (error) {
        console.error('Unexpected error:', error.message);
        setErrorMessage('An unexpected error occurred.');
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <div className="text-center min-h-screen flex items-center justify-center bg-gray-100">
      {errorMessage ? (
        <p className="text-red-600">{errorMessage}</p>
      ) : (
        <h1 className="text-3xl font-bold text-blue-600">
          Welcome, {username}!
        </h1>
      )}
    </div>
  );
};

export default Home;
