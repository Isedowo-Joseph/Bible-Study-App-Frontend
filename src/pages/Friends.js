import React, { useEffect, useState, useContext } from 'react';
import Nav from 'react-bootstrap/Nav';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../Components/NavBar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import UserService from '../Services/UserService';
import { UserContext } from '../UserContext';

function Friends() {
  const { bibleStudyId } = useParams();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const { FixedUser } = useContext(UserContext);
  const [User, setUser] = useState(null)
  const navigate = useNavigate();

  useEffect(() => {
    if (FixedUser && FixedUser.id) {
      UserService.getUserById(FixedUser.id).then((response) => {
        setUser(response.data);
        setLoading(false);
      }).catch((error) => {
        console.error("Error fetching user:", error);
        setLoading(false); // Ensure loading is also set to false on error
      });

      UserService.getFriends(FixedUser.id).then((response) => {
        console.log(response.data);
        setFriends(response.data);
        setLoading(false); // Set loading to false after fetching friends
      }).catch((error) => {
        console.error("Error fetching friends:", error);
        setLoading(false); // Ensure loading is also set to false on error
      });
    } else {
      setLoading(false); // If no user, set loading to false
    }
  }, [bibleStudyId, FixedUser]); // Added user to the dependency array

  const handleUnfriend = (friend) => {
    if (friend) {
      UserService.unFriend(User.id, friend.id)
        .then(() => {
          setFriends((prevFriends) =>
            prevFriends.filter((f) => f.id !== friend.id)
          );  
        })
        .catch((err) => {
          console.error('Error unfriending:', err);
        });
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while fetching data
  }

  return (
    <div>
      <NavBar userData={User} bibleStudyid={bibleStudyId} />
      <Container fluid style={{ height: '100vh' }}>
        <Row style={{ height: '100%' }}>
          <Col
            md={2}
            style={{
              backgroundColor: 'pink',
              height: '100%',
              paddingTop: '60px',
            }}
          >
            <Nav className="flex-column">
              <Nav.Link onClick={() => {
                if (User) {
                  navigate(`/friends/${User.id}`);
                } else {
                  console.log("User data is not available yet.");
                }
              }}>Friends</Nav.Link>
              <Nav.Link onClick={() => {
                if (User) {
                  navigate(`/invites/${User.id}`);
                } else {
                  console.log("User data is not available yet.");
                }
              }}>Invites</Nav.Link>
            </Nav>
          </Col>

          <Col md={10} style={{ height: '100%', paddingTop: '60px' }}>
            <h2 style={{ marginTop: '10px' }}>Friends List</h2>
            <Container fluid style={{ height: 'calc(100% - 60px)', overflowY: 'auto' }}>
              <Row>
                {Array.isArray(friends) && friends.length > 0 ? (
                  friends.map((friend) => (
                    <Col key={friend.id} md={4}>
                      <div
                        style={{
                          backgroundColor: 'lightgray',
                          padding: '20px',
                          textAlign: 'center',
                          borderRadius: '5px',
                          marginBottom: '20px',
                        }}
                      >
                        <p>{friend.userName}</p>
                        <button
                          style={{
                            backgroundColor: 'red',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            cursor: 'pointer',
                            borderRadius: '5px',
                          }}
                          onClick={() => handleUnfriend(friend)}
                        >
                          Unfriend
                        </button>
                      </div>
                    </Col>
                  ))
                ) : (
                  <p>No friends found.</p>
                )}
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Friends;
