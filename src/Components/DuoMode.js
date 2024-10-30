import React, { useState, useEffect, useContext } from 'react';
import BibleAPIService from '../Services/BibleAPIService';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import BibleStudyService from '../Services/BibleStudyService';
import { UserContext } from '../UserContext';
import ChapterCard from './ChapterCard';
import UserService from '../Services/UserService';
import ChapterCardView from './ChapterCardView';
function DuoMode({ bibleId }) {
  const { FixedUser } = useContext(UserContext); // Ensure this is set in UserContext.Provider
  const [studyData, setStudyData] = useState(null);
  const [User, setUser] = useState(null);
  const [IsMember, setIsMember] = useState(false); // Track membership state explicitly

  // Fetch study data and user info
  useEffect(() => {
    if (FixedUser && FixedUser.id && bibleId) {
      const fetchData = async () => {
        try {
          // Fetch Bible study session data
          const sessionResponse = await BibleStudyService.getSessionById(bibleId);
          setStudyData(sessionResponse.data); // Ensure to use .data
          console.log('Session Response:', sessionResponse.data); // Log the correct response data
  
          // Fetch user data
          const userResponse = await UserService.getUserById(FixedUser.id);
          setUser(userResponse.data); // Ensure to use .data
          console.log('User Response:', userResponse.data);
  
          // Check if user is a member of the Bible study session
          handleMemberCheck(userResponse.data, sessionResponse.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }
  }, [FixedUser, bibleId]);

  // Check if the user is a member of the Bible study
  const handleMemberCheck = (user, studyData) => {
    if (studyData.members) {
        const isMember = studyData.members.some(member => member.id === user.id);
        setIsMember(isMember);
      }
  };



  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: "60px", textAlign: 'center' }}>
      {User && User.hasJoined && IsMember ? (
        <ChapterCardView studyData={studyData} />
      ) : (
        studyData && (
          <ChapterCard 
            bibleId={studyData.id} 
          />
        )
      )}
    </div>
  );  
}

export default DuoMode;
