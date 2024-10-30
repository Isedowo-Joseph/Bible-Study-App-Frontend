import React, { useState, useEffect } from 'react';
import UserService from '../Services/UserService';
import './SearchResult.css';
import { useNavigate } from 'react-router-dom';
import InvitationService from '../Services/InvitationService';
import BibleStudyService from '../Services/BibleStudyService';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
function SearchFriends({ userId, bibleId }) {
  const [searchUser, setSearchUser] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [userFriends, setUserFriends] = useState([]); // Store current user's friends
  const [userMembers, setUserMembers] = useState([]); // Store current user's members
  const [pendingInvitations, setPendingInvitations] = useState([]); // Store pending invitations
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // WebSocket connection using SockJS and STOMP
    const socket = new SockJS('http://localhost:8080/ws'); // Replace with your WebSocket endpoint
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000, // Reconnect after 5 seconds if the connection drops
      onConnect: () => {
        console.log('Connected to WebSocket');

      // Subscribe to updates for pending invitations for the logged-in user
      stompClient.subscribe(`/topic/invitations/${userId}`, (message) => {
        const newInvitation = JSON.parse(message.body);
        console.log('New Invitation:', newInvitation);
        
        // Update the pending invitations state
        setPendingInvitations((prevInvitations) => [
          ...prevInvitations,
          newInvitation
        ]);
      });
    },
    onStompError: (frame) => {
      console.error('STOMP error:', frame);
    },
  });

    stompClient.activate();
    
     // Clean up the WebSocket connection when the component unmounts
     return () => {
      stompClient.deactivate();
    };
  }, [userId, bibleId]);

   // Fetch all users
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await UserService.getAllUsers();
        const user = await UserService.getUserById(userId);
        setUser(user.data);
        console.log(user)
        setFilteredUsers(response.data);
        console.log(userId, bibleId)
        setDisplayedUsers([]); // Clear displayed users initially
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchAllUsers();
  }, [pendingInvitations]);

  // Fetch friends for the logged-in user
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await UserService.getFriends(userId);
        setUserFriends(response.data || []); // Ensure state is set correctly
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };
    fetchFriends();
  }, [userId]);

  // Fetch members for the logged-in user
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await BibleStudyService.getSessionById(bibleId);
        console.log(response.data.members);
        setUserMembers(response.data.members || []); // Ensure state is set correctly
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };
    fetchMembers();
  }, [userId]);

  // Fetch pending invitations sent by the logged-in user
  useEffect(() => {
    const fetchPendingInvitations = async () => {
      try {
        const response = await InvitationService.getInvitations(userId);
        console.log(response.data)
        setPendingInvitations(response.data.filter(inv => inv.status === 'PENDING'));
      } catch (error) {
        console.error('Error fetching pending invitations:', error);
      }
    };
    fetchPendingInvitations();
  }, [userId]);

  // Perform search whenever searchUser changes
  const performSearch = () => {
    const trimmedSearch = searchUser.trim();
    if (trimmedSearch === '') {
      setDisplayedUsers([]);
    } else {
      const result = filteredUsers.filter(user =>
        user.id !== userId && user.userName.toLowerCase().includes(trimmedSearch.toLowerCase())
      );
      setDisplayedUsers(result);
    }
  };

  useEffect(() => {
    performSearch();
  }, [searchUser, filteredUsers]); // Added filteredUsers to the dependency array

  // Check if a user is already friends with the current user
  const isFriend = (userIdToCheck) => {
    return userFriends.some(response => (response && response.id === userIdToCheck));
  };

  // Check if a user is already a member
  const isMember = (userIdToCheck) => {
    return ((user.hasJoined === true || userMembers.some(response => response && response.hasJoined === true)) 
            && userMembers.some(response => response && ((response.id === userIdToCheck)||(response.id === user.id))));
  };

  // Check if there is a pending invitation for a user
  const isPending = (userIdToCheck, type) => {
    console.log(pendingInvitations)
    return pendingInvitations.some(inv => (inv.receiver.id === userIdToCheck || inv.sender.id === userIdToCheck) && inv.type === type);
  };

  // Handle adding a friend
  const handleAddFriend = async (user) => {
    try {
      const response = await InvitationService.sendInvitation(userId, user.id, "FRIENDSHIP");
      const invitation = response.data;
      setPendingInvitations(prevInvites => [
        ...prevInvites,
        {sender: {id:userId}, receiver: { id: user.id },type: invitation.type, status: invitation.status || 'PENDING' }
      ]);

    } catch (error) {
      console.error('Error adding friend:', error);

      // Check if the error response exists and has a message
      if (error.response && error.response.data && error.response.data.message) {
        // Display a user-friendly alert with the server error message
        alert(`Error: ${error.response.data.message}`);
      } else {
        // Generic error message if the response structure is unexpected
        alert('An unexpected error occurred. Please try again later.');
      }
    }
  };

  // Handle adding a member
  const handleAddMember = async (user) => {
    try {
      const response = await InvitationService.sendInvitation(userId, user.id, "MEMBERSHIP");
      const invitation = response.data;
      console.log(response);
      setPendingInvitations(prevInvites => [
        ...prevInvites,
        { receiver: { id: user.id }, type: invitation.type, status: invitation.status || 'PENDING' }
      ]);
    } catch (error) {
      console.error('Error adding member:', error);

      // Check if the error response exists and has a message
      if (error.response && error.response.data && error.response.data.message) {
        // Display a user-friendly alert with the server error message
        alert(`Error: ${error.response.data.message}`);
      } else {
        // Generic error message if the response structure is unexpected
        alert('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="position-relative">
      {!isFocused && (
        <i
          className="bi bi-search position-absolute"
          style={{
            left: "10px",
            top: "52%",
            transform: "translateY(-50%)",
            transition: "opacity 0.2s",
            marginTop: "3px",
            marginLeft: "5px",
          }}
        />
      )}
      <input
        type="text"
        className="textbox"
        placeholder="Search Friends"
        value={searchUser}
        style={{
          paddingLeft: isFocused ? "10px" : "40px",
          transition: "padding-left 0.2s",
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => setSearchUser(e.target.value)}
      />

      {displayedUsers.length > 0 && (
        <div className="search-results">
          <ul style={{ 
            listStyleType: "none", 
            padding: 0,
            marginRight: 0,
            textAlign: "left" 
          }}>
            {displayedUsers.map((user) => (
              <li key={user.id} className="nav-icon">
                <div style={{ display: "flex", justifyContent: "left" }}>
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/userProfile/${user.id}`)}
                  >
                    {user.userName}
                    <div style={{ position: 'relative' }}>
                      {/* Friendship Check */}
                      {isPending(user.id, 'FRIENDSHIP') ? (
                        <span style={{ marginRight: "5px" }}>Pending Friend</span>
                      ) : isFriend(user.id) ? (
                        <span style={{ marginRight: "5px" }}>Friend</span>
                      ) : (
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            await handleAddFriend(user);
                          }}
                          style={{ marginRight: '20px' }}
                        >
                          Add Friend
                        </button>
                      )}
                      
                      {/* Membership Check */}
                      {isPending(user.id, 'MEMBERSHIP') ? (
                        <span style={{ marginRight: "5px" }}>Pending Member</span>
                      ) : isMember(user.id) && (isMember(user.id)) ? (
                        <span style={{ marginRight: "5px" }}>Member</span>
                      ) : (
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            await handleAddMember(user);
                          }}
                          style={{ marginLeft: '10px' }}
                          hidden={!isFriend(user.id) && !isMember(user.id) }
                        >
                          Add Member
                        </button>
                      )}
                    </div>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchFriends;
