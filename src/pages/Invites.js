import React, { useEffect, useState, useContext } from 'react';
import Nav from 'react-bootstrap/Nav';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../Components/NavBar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import UserService from '../Services/UserService';
import InvitationService from '../Services/InvitationService';
import { UserContext } from '../UserContext';

function Invites() {
  const { bibleStudyId } = useParams();
  const navigate = useNavigate();
  const { FixedUser } = useContext(UserContext);
  const [User, setUser] = useState(null)
  const [invites, setInvites] = useState(null);
const [loading, setloading] = useState(true)
  useEffect(() => {
    if (FixedUser && FixedUser.id) {
    UserService.getUserById(FixedUser.id).then((response) => {
      setUser(response.data);
      setloading(false);
    }).catch((error) => {
      console.error("Error fetching user:", error);
      setloading(false);
    });
 
      UserService.getInvites(FixedUser.id).then((response) => {
        console.log(response.data);
        setloading(false);
        setInvites(response.data);
      }).catch((err) => {
        console.error("Error fetching invites:", err);
        setloading(false);
      });
    }else{
      setloading(false)
    }
  }, [FixedUser]); // Add user to the dependency array
  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while fetching data
  }
  const handleAccept = (inviteId) => {
    InvitationService.respondToInvitation(inviteId, "ACCEPTED").then((response) => {
      const bibleSessionId = response.data.bibleStudySessionId;
      setInvites((prevInvites) => prevInvites.filter(invite => invite.id !== inviteId));

      if (bibleSessionId) {
        navigate(`/bibleStudy/${bibleSessionId}`);
      }
    }).catch((err) => {
      console.error("Error accepting invite:", err);
    });
  };

  const handleDecline = (inviteId) => {
    InvitationService.respondToInvitation(inviteId, "DECLINED").then(() => {
      setInvites((prevInvites) => prevInvites.filter(invite => invite.id !== inviteId));
    }).catch((err) => {
      console.error("Error declining invite:", err);
    });
  };

  return (
    <div>
      <NavBar userData={User} bibleStudyid={bibleStudyId} />
      <Container fluid style={{ height: "100vh" }}>
        <Row style={{ height: "100%" }}>
          <Col
            md={2}
            style={{
              backgroundColor: "pink",
              height: "100%",
              paddingTop: "60px",
            }}
          >
            <Nav className="flex-column">
              <Nav.Link onClick={() => navigate(`/friends/${User.id}`)}>Friends</Nav.Link>
              <Nav.Link onClick={() => navigate(`/invites/${User.id}`)}>Invites</Nav.Link>
            </Nav>
          </Col>

          <Col md={10} style={{ height: "100%", paddingTop: "60px" }}>
            <h2 style={{ marginTop: "10px" }}>Invites List</h2>
            <Container fluid style={{ height: "calc(100% - 60px)", overflowY: "auto" }}>
              <Row>
                {Array.isArray(invites) && invites.length > 0 ? (
                  invites.map((invite) => (
                    <Col key={invite.id} md={4}>
                      <div style={{
                        backgroundColor: "lightgray",
                        padding: "20px",
                        textAlign: "center",
                        borderRadius: "5px",
                        marginBottom: "20px",
                      }}>
                        {invite.sender.userName} <br />
                        {invite.type}
                        <div style={{ marginTop: "10px" }}>
                          <button onClick={() => handleAccept(invite.id)} style={{
                            marginRight: "10px",
                            padding: "10px 20px",
                            backgroundColor: "green",
                            color: "white",
                            borderRadius: "5px",
                            border: "none",
                            cursor: "pointer"
                          }}>
                            Accept
                          </button>
                          <button onClick={() => handleDecline(invite.id)} style={{
                            padding: "10px 20px",
                            backgroundColor: "red",
                            color: "white",
                            borderRadius: "5px",
                            border: "none",
                            cursor: "pointer"
                          }}>
                            Decline
                          </button>
                        </div>
                      </div>
                    </Col>
                  ))
                ) : (
                  <p>No invites found.</p>
                )}
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Invites;
