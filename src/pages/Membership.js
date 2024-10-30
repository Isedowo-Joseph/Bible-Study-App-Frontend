import { useState, useEffect, useContext } from 'react';
import MembershipDetails from './MembershipDetails';
import { UserContext } from '../UserContext';
import UserService from '../Services/UserService';
import NavBar from '../Components/NavBar';
function Membership() {
  const { FixedUser } = useContext(UserContext);
  const [User, setUser] = useState(null);
  const [loading, setloading] = useState(true)
  const [LeaveHidden, setLeaveHidden] = useState(false)
  useEffect(() => {
    // Only fetch the user data if `fixedUser` exists and has an `id`
    if (FixedUser && FixedUser.id) {
      UserService.getUserById(FixedUser.id)
        .then((response) => {
          setUser(response.data);
          console.log(response.data);
          setloading(false);
        })
        .catch((error) => {
          console.error('Error fetching user:', error);
          setloading(false);
        });
    }else{
      setloading(false);
    }
  }, [FixedUser]); // Depend on `fixedUser`
  useEffect(() => {
    if (User?.membership) {
      setLeaveHidden(false);
    } else {
      setLeaveHidden(true);
    }
  }, [User]);
if (loading) {
    return <div>Loading...</div>; // Show loading indicator while fetching data
  }
  
  return (
    <div>
      {User ? ( // Check if `User` exists
        <>
         <NavBar userData = {User} bibleStudyid =  {User.bibleStudySessionId}/>
          {User.membership ? ( // Check if `User.membership` exists
            <MembershipDetails user={User} bibleId={User.membership.bibleStudySessionId} leaveVisibility={LeaveHidden} /> // Render with `bibleStudySessionId` from membership
          ) : (
            <MembershipDetails user={User} bibleId={User.bibleStudySessionId} leaveVisibility={LeaveHidden}/> // Fallback if no membership
          )}
        </>
      ) : (
        <p>No user found</p> // Handle case when user is null
      )}
    </div>
  );
}

export default Membership;
