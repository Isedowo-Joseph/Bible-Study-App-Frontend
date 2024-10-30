import { useState, useEffect, useContext } from 'react';
import { Navbar, Nav, Spinner } from 'react-bootstrap'; // Added Spinner for loading state
import { IoHome } from 'react-icons/io5';
import { FaUserFriends, FaUser } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import './NavBar.css';
import SearchFriends from './SearchFriends';
import BibleStudyService from '../Services/BibleStudyService';
import { useNavigate } from 'react-router-dom';

function NavBar({ userData, bibleStudyid }) {
  const [studyData, setStudyData] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();
  const user = userData;
  useEffect(() => {
    const fetchStudyData = async () => {
      try {
        const response = await BibleStudyService.getSessionById(bibleStudyid);
        setStudyData(response.data);
      } catch (error) {
        console.error('Error fetching BibleStudySession:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchStudyData();
  }, [bibleStudyid]);

  if (loading) {
    return <Spinner animation="border" variant="light" />; // Loading spinner
  }

  return (
    <Navbar expand="lg" bg="dark" variant="dark" fixed='top'>
      {user && <SearchFriends userId={user.id} bibleId={studyData?.id} />}
      <Navbar.Toggle aria-controls="responsive-navbar-nav" className="custom-toggler" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mx-auto me-3">
          <Nav.Link className="nav-icon"
            onClick={() => {
              if (studyData) {
                navigate(`/bibleStudy/${studyData.id}`);
              } else {
                console.log("Study data is not available yet.");
              }
            }}
          >
            <span title='Home'><IoHome size={30} /></span>
          </Nav.Link>

          <Nav.Link className="nav-icon"
            onClick={() => {
              if (user) {
                navigate(`/userProfile/${user.id}`);
              } else {
                console.log("User data is not available yet.");
              }
            }}
          >
            <span title="User"><FaUser size={30} /></span>
          </Nav.Link>

          <Nav.Link className="nav-icon"
            onClick={() => {
              if (user) {
                navigate(`/friends/${user.id}`);
              } else {
                console.log("Study data is not available yet.");
              }
            }}
          >
            <span title="Friends"><FaUserFriends size={35} /></span>
          </Nav.Link>
          <Nav.Link className="nav-icon"
            onClick={() => {
              if (user) {
                navigate(`/membership/${user.id}`);
              } else {
                console.log("Study data is not available yet.");
              }
            }}
          >
            <span title="Group"><FaPeopleGroup size={35} /></span>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;
