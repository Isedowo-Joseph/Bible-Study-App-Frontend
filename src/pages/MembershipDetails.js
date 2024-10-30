import React, { useEffect, useState } from 'react';
import BibleStudyService from '../Services/BibleStudyService';
import { useNavigate } from 'react-router-dom';
import UserService from '../Services/UserService';
function MembershipDetails({user, bibleId, leaveVisibility }) {
    const [Biblestudy, setBiblestudy] = useState(null);
    const [loading, setloading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
      if (bibleId) {
        BibleStudyService.getSessionById(bibleId).then((response) =>{
          setBiblestudy(response.data);
          setloading(false);
        }).catch((error) =>() => {
          console.error('Error fetching bibleStudy:', error);
          setloading(false);
        });
      } else{
        setloading(false);
      }
      },[bibleId])

    if (loading) {
        return <div>Loading...</div>; // Optional loading state
    }
    const exitGroup = () => {
      UserService.exitGroup(user.id, bibleId)
      navigate(`/bibleStudy/${user.bibleStudySessionId}`)
    };

    const gotoSession = () => {
      navigate(`/bibleStudy/${bibleId}`)
    };
    return (
        <div>
          <br/>
          <br/>
          <br/>
          <br/>
          MembershipDetails: {Biblestudy.id}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={gotoSession} style={styles.button}>
                Goto Session
            </button>
      
            <button onClick={exitGroup} style={styles.button} hidden={leaveVisibility}>
            Leave
            </button>
        
            </div>
          
          </div>
    );
}
// Example CSS styles for the card
const styles = {
  container: {
    display: 'flex',          // Align elements side by side
    justifyContent: 'center', // Center the items horizontally
    alignItems: 'center',     // Center the items vertically
    gap: '40px',              // Add space between the countdown and the card
    padding: '16px',          // Add some padding to the container
    },
    countdown: {
    textAlign: 'center',      // Center the text inside the countdown block
    marginLeft: '125px', 
    },
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    marginLeft: "auto", // Push the card to the right
    width: "50%", // Set a fixed width for the card
  },
  cardCenter: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    margin: "auto",
    width: "50%", // Set a fixed width for the card 
  },
  content: {
    marginTop: "12px",
    maxHeight: "450px", // Set a fixed height for the content area
    overflowY: "auto", // Enable vertical scrolling
  },
  button: {
    marginTop: "12px",
    padding: "8px 16px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default MembershipDetails;
