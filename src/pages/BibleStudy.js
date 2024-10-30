import {React, useEffect, useState, useContext} from 'react'
import { useParams } from 'react-router-dom';
import NavBar from '../Components/NavBar';
import BibleStudyService from '../Services/BibleStudyService';
import DuoMode from '../Components/DuoMode';
import InvalidSession from '../Components/InvalidSession'
import "./BibleStudy.css";
import { UserContext } from '../UserContext';
import UserService from '../Services/UserService';
function BibleStudy() {
  const { FixedUser } = useContext(UserContext);
  const [user, setUser] = useState(null)
  const { bibleStudyId } = useParams();  // Destructure id from useParams
  const [bibleStudy, setBibleStudy] = useState();
  const [loading, setloading] = useState(true)
  const [IsMember, setIsMember] = useState(false); // Track membership state explicitly

    // Check if the user is a member of the Bible study
    const handleMemberCheck = (user, studyData) => {
      if (studyData?.members) {
          const isMember = studyData.members.some(member => member.id === user.id);
          setIsMember(isMember);
        }
    };
  useEffect(() => {
    if (FixedUser && FixedUser.id) {
    BibleStudyService.getSessionById(bibleStudyId).then((response) =>{
      setBibleStudy(response.data);
      handleMemberCheck(FixedUser,response.data);
      setloading(false);
    }).catch((error) =>() => {
      console.error('Error fetching bibleStudy:', error);
      setloading(false);
    });
    console.log(FixedUser);
    UserService.getUserById(FixedUser.id).then((response) => {
      setUser(response.data);
      setloading(false);
    }).catch ((error) => {
      console.error ('Error fetching user:', error);
      setloading(false);
    })
  
  } else {
    setloading(false);
  }
  },[FixedUser, bibleStudyId])
  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while fetching data
  }
  return (
    <div className="bible-study-container">
      <NavBar userData={user} bibleStudyid={bibleStudyId}/>
      {
         (bibleStudy?.userId === user?.id) || IsMember ? (
          <DuoMode  bibleId = {bibleStudyId} />
        ): (
          <InvalidSession  bibleId = {bibleStudyId} />
        )
      }
    </div> 
  )
}

export default BibleStudy;