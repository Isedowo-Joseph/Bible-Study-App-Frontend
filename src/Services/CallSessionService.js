import axios from 'axios';
const API_URL = 'http://localhost:8080/call';

const CallSessionService = {
  
    getAllSessions() {
        return axios.get(API_URL);
      },
    getSessionById(id) {
    return axios.get(`${API_URL}/${id}`);
    },

    createSession(session) {
    return axios.post(API_URL, session);
    },

    updateSession(id, session) {
    return axios.put(`${API_URL}/${id}`, session);
    },

    deleteSession(id) {
    return axios.delete(`${API_URL}/${id}`);
    },   
  
}
export default new CallSessionService();