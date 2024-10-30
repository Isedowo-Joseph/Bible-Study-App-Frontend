import {React,useState, useContext, useEffect} from 'react'; // Service to fetch user data
import { useParams } from 'react-router-dom';
import UserDetails from './UserDetails';
import EditProfile from './EditProfile';
import { UserContext } from '../UserContext';
import UserService from '../Services/UserService';
import NavBar from '../Components/NavBar';
const UserProfile = () => {
  const { FixedUser } = useContext(UserContext);
  const [User, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setloading] = useState(true);
  const {userId} = useParams()
  useEffect(() => {
    if (userId) {
    UserService.getUserById(userId).then((response) => {
      setUser(response.data);
      setloading(false);
    }).catch ((error) => {
      console.error ('Error fetching user:', error);
      setloading(false);
    })
  } else{
    setloading(false);
  }
  },[FixedUser])
  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while fetching data
  }
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div>
      {User && (  // Ensure `user` is properly handled before rendering
        <>
        <NavBar userData = {FixedUser} bibleStudyid =  {FixedUser.bibleStudySessionId}/>
          {User && !isEditing ? (
            <UserDetails user={User} toggleEdit={toggleEdit} />  // This should be the problematic line, ensure this is correct
          ) : (
            <EditProfile user={User} toggleEdit={toggleEdit} />
          )}
        </>
      )}
    </div>
  );
}

export default UserProfile;
