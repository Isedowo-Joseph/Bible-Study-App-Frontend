import {React, useState, useContext } from 'react'
import { useNavigate, useParams} from 'react-router-dom';
import BibleStudyService from '../Services/BibleStudyService';
import './BibleStudyForm.css';
import UserService from '../Services/UserService';
import { UserContext } from '../UserContext';
import axios from 'axios';
function BibleStudyForm() {
    const navigate = useNavigate()
    const { userId } = useParams();
    const {setFixedUser} = useContext(UserContext)
  
    const [studyData, setStudyData] = useState({
      userId: parseInt(userId) || 0, // Assign the userId from the URL or fallback to 0
      duration: 0,
      readerStarter: '',
      nextDate: null,
      dueDate: null,
      weekRatio: { oddWeek: 0, evenWeek: 0 }, // WeekRatio is an object
      completed: false,
      members: [],
      invites: [],
      bible: {
        currentChapter: 0,
        bibleVersion: '',
        book:'',
    },
    });



    // Handle form submission
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
            const bibleStudy = await BibleStudyService.createSession(studyData); // Call the service to save session data
            const updatedUser = await UserService.getUserById(bibleStudy.data.userId);
            setFixedUser(updatedUser.data);
            await axios.post('http://localhost:8080/api/register', updatedUser.data,{
              withCredentials: true  // This enables cookies/session to be sent to the backend
          }); // Call backend login API
            const bibleStudyid = bibleStudy.data.id;
            navigate(`/bibleStudy/${bibleStudyid}`); // Navigate to another route after successful creation
          }
       catch (error) {
          console.error("Failed to save bibleStudySession", error);
      }
  };
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'oddWeek' || name === 'evenWeek') {
        // Update weekRatio properties
        setStudyData((prevData) => ({
            ...prevData,
            weekRatio: {
                ...prevData.weekRatio,
                [name]: parseInt(value),
            },
        }));
    } else if (name === 'currentChapter' || name === 'bibleVersion' || name === 'book') {
      // Update bible object properties
      setStudyData((prevData) => ({
          ...prevData,
          bible: {
              ...prevData.bible,
              [name]: value
          }
      }));
    } 
    else {
        setStudyData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }
};

  return (
    <div className="form-container">
      <button onClick={() => navigate(-1)} className="back-button">
        &#8592; Back
      </button>
      <form onSubmit={handleSubmit} className="task-form">
        <h2>{'Create BibleStudy'}</h2>
        <h3>Week Ratio</h3>
        <label htmlFor="oddWeek">Odd Week Days</label>
        <input
            id="oddWeek"
            name="oddWeek"
            type="number"
            value={studyData.weekRatio.oddWeek}
            onChange={handleChange}
            required
        />
        <label htmlFor="evenWeek">Even Week Days</label>
        <input
            id="evenWeek"
            name="evenWeek"
            type="number"
            value={studyData.weekRatio.evenWeek}
            onChange={handleChange}
            required
        />
        <h3>Bible Details</h3>
        <label htmlFor="bibleVersion">Bible Version</label>
        <input
            id="bibleVersion"
            name="bibleVersion"
            type="text"
            value={studyData.bible.bibleVersion}
            onChange={handleChange}
            required
        />
         <label htmlFor="bibleVersion">Bible Book</label>
        <input
            id="book"
            name="book"
            type="text"
            value={studyData.bible.book}
            onChange={handleChange}
            required
        />
        <label htmlFor="currentChapter">Current Chapter</label>
        <input
            id="currentChapter"
            name="currentChapter"
            type="text"
            value={studyData.bible.currentChapter}
            onChange={handleChange}
            required
        />
        <label htmlFor="duration">Duration (minutes)</label>
        <input
          id="duration"
          name="duration"
          type="number"
          value={studyData.duration}
          onChange={handleChange}
          required
        />
        <label htmlFor="dueDate">DueDate</label>
        <input
          id="dueDate"
          name="dueDate"
          type="Date"
          value={studyData.dueDate}
          onChange={handleChange}
          required
        />
        <label htmlFor="studyTime">Time</label>
        <input
          id="studyTime"
          name="studyTime"
          type="time"
          value={studyData.studyTime}
          onChange={handleChange}
          required
        />
        <button type="submit">
          Create  
        </button>
      </form>
    </div>
  );
}
export default BibleStudyForm;