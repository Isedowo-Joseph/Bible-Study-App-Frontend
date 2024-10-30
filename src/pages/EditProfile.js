import React, { useState } from 'react';
import UserService from '../Services/UserService';

const EditProfile = ({ user, toggleEdit }) => {
  const [formData, setFormData] = useState({
    userName: user.userName,
    email: user.email,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await UserService.updateUser(user.id, formData);
      toggleEdit(); // Close the edit form
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="edit-profile-form">
      <label>
        Username:
        <input
          type="text"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </label>
      <button type="submit">Save Changes</button>
      <button type="button" onClick={toggleEdit}>Cancel</button>
    </form>
  );
};

export default EditProfile;
