import {React, createContext, useState, useEffect } from 'react';
import axios from 'axios';
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [FixedUser, setFixedUser] = useState(null);
    useEffect(() => {
        const fetchUserSession = async () => {
          try {
            await axios.get('http://localhost:8080/api/session').then((response) => {
              setFixedUser(response.data);
            })
          } catch (error) {
            console.log('No user session found');
          }
        };
    
        fetchUserSession(); // Call this function on component mount
      }, []);
    return (
        <UserContext.Provider value={{ FixedUser, setFixedUser }}>
            {children}
        </UserContext.Provider> 
    );
};
