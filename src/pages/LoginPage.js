import {React,  useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../Services/UserService';
import './LoginPage.css';
import { UserContext } from '../UserContext'; // Adjust this line to import from the correct file
import axios from 'axios';
function LoginPage() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ name: '', userName: '', password: '', email: '', phoneNumber: '' })
  const { setFixedUser } = useContext(UserContext); // Accessing context here
  const [isSignup, setIsSignup] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignup) {
      const user = await UserService.createUser(credentials);
      const userId = user.data.id;
      if (user) {
        alert('successfully signed up');
        navigate(`/bibleStudy/new/${userId}}`)
      }
    }
    else {
       // Handle Login logic with backend session
       const response = await axios.post('http://localhost:8080/api/login', credentials,{
        withCredentials: true  // This enables cookies/session to be sent to the backend
    }); // Call backend login API
      console.log(response.data)
       if (response.data) {
         const bibleId = response.data.bibleStudySessionId; // Assuming your response contains bibleStudySessionId
         setFixedUser(response.data); // Set the logged-in user data in context
         navigate(`/bibleStudy/${bibleId}`); // Redirect to the user's Bible study session
       }
    }
  };

  return (
    <div className="login-container">
      <div className="welcome-text">
        Welcome to Bible Study App!
      </div>
      <form onSubmit={handleSubmit} className="login-form">
        <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
        <input
          type="text"
          placeholder="Username"
          value={credentials.userName}
          onChange={(e) => setCredentials({ ...credentials, userName: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          required
        />
        {isSignup && (
          <input
            type="email"
            placeholder="Email (required for sign-up)"
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            required={isSignup}
          />
        )}
        <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
        <button type="button" onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
        </button>
      </form>
    </div>

  )
}

export default LoginPage;