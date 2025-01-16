import supabase from './supabaseClient'; // Adjust the path as needed

const userService = {
  // Create a new user
  createUser: async (user) => {
    const { data, error } = await supabase
      .from('users')
      .insert([user]); // Expects { id, email, username }
    if (error) {
      console.error('Error creating user:', error.message);
      return { error };
    }
    return { data };
  },

  // Fetch a single user by ID
  getUserById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('username')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching user by ID:', error.message);
        return { error };
      }

      return { data };
    } catch (err) {
      console.error('Unexpected error fetching user:', err.message);
      return { error: err };
    }
  },

  // Fetch all users
  getAllUsers: async () => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
      console.error('Error fetching all users:', error.message);
      return { error };
    }
    return { data };
  },

  // Update a user by ID
  updateUserById: async (id, updates) => {
    const { data, error } = await supabase
      .from('users')
      .update(updates) // Expects an object with the fields to update
      .eq('id', id);
    if (error) {
      console.error('Error updating user:', error.message);
      return { error };
    }
    return { data };
  },

  // Delete a user by ID
  deleteUserById: async (id) => {
    const { data, error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Error deleting user:', error.message);
      return { error };
    }
    return { data };
  },
};

export default userService;
