import axios from 'axios';

const API_URL = 'http://localhost:8080/study';

axios.defaults.withCredentials = true; // Apply this if necessary for all requests, otherwise specify per request

const BibleStudyService = {
    async getAllSessions() {
        try {
            return await axios.get(API_URL, { withCredentials: true });
        } catch (error) {
            console.error("Error fetching sessions", error);
            throw error;
        }
    },

    async getSessionById(id) {
        try {
            return await axios.get(`${API_URL}/${id}`, { withCredentials: true });
        } catch (error) {
            console.error(`Error fetching session ${id}`, error);
            throw error;
        }
    },

    async createSession(session) {
        try {
            return await axios.post(API_URL, session, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                withCredentials: true,
            });
        } catch (error) {
            console.error("Error creating session", error);
            throw error;
        }
    },

    async updateSession(id, session) {
        try {
            return await axios.put(`${API_URL}/bibleStudy/${id}/update`, session, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
        } catch (error) {
            console.error(`Error updating session ${id}`, error);
            throw error;
        }
    },

    async deleteSession(id) {
        try {
            return await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
        } catch (error) {
            console.error(`Error deleting session ${id}`, error);
            throw error;
        }
    },

    async startTimer(bibleId, duration) {
        try {
            return await axios.post(`${API_URL}/timer/${bibleId}/${duration}`, null, { withCredentials: true });
        } catch (error) {
            console.error(`Error starting timer for bibleId ${bibleId}`, error);
            throw error;
        }
    },
};

export default BibleStudyService;
