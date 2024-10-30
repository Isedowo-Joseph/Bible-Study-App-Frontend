import React, { useEffect, useState } from 'react';
import UserService from '../Services/UserService';

const FriendsList = ({ userId }) => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await UserService.getUserFriends(userId);
        setFriends(response.data);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };
    fetchFriends();
  }, [userId]);

  return (
    <div className="friends-list">
      <h3>Friends List</h3>
      <ul>
        {friends.map(friend => (
          <li key={friend.friend.id}>{friend.friend.userName}</li>
        ))}
      </ul>
    </div>
  );
};

export default FriendsList;
