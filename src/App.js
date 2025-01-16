import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import supabase from './utils/supabaseClient'; // Adjust the path
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check initial session
    const checkInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session); // Set initial login state
    };

    checkInitialSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session); // Update login state on auth changes
    });

    // Cleanup subscription on component unmount
    return () => {
      subscription?.unsubscribe(); // Safely unsubscribe
    };
  }, []);

  // Handle logout
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error.message);
    }
  };

  return (
    <Router>
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between">
          <Link to="/" className="font-bold">My App</Link>
          <div>
            <Link to="/" className="mr-4">Home</Link>
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="mr-4">Login</Link>
                <Link to="/signup">Signup</Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <div className="text-center mt-4">
        {isLoggedIn ? (
          <p>Welcome back! You are logged in.</p>
        ) : (
          <p>Please log in to access your account.</p>
        )}
      </div>
    </Router>
  );
}

export default App;
