import axios from 'axios';
const API_URL = 'http://localhost:8080/study';

const BibleStudyService = {
    getAllSessions() {
        return axios.get(API_URL);
      },
    getSessionById(id) {
    return axios.get(`${API_URL}/${id}`);
    },

    createSession(session) {
      return axios.post(API_URL, session, {
          headers: {
              'Content-Type': 'application/json',
          },
      });
  },

    updateSession(id, session) {
    return axios.put(`${API_URL}/bibleStudy/${id}/update`, session);
    },

    deleteSession(id) {
    return axios.delete(`${API_URL}/${id}`);
    },
    startTimer(bibleId, duration) {
      return axios.post(`${API_URL}/timer/${bibleId}/${duration}`)
    }    
}

 export default BibleStudyService;
