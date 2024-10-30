import axios from 'axios';
const API_URL = 'http://localhost:8080/user'
    // Axios default configuration to send cookies with requests
    axios.defaults.withCredentials = true;
const UserService = {
    getAllUsers() {
        return axios.get(API_URL);
    },
    getUserById(id) {
        return axios.get(`${API_URL}/id/${id}`);
    },
    getUserByUserName(userName) {
        return axios.get(`${API_URL}/username/${userName}`);
    },
    getFriends(userId) {
        return axios.get(`${API_URL}/friends/${userId}`);
    },
    getInvites(userId){
        return axios.get(`${API_URL}/invitations/${userId}`);
    },

    createUser(user) {
        return axios.post(API_URL, user);
    },

    updateUser(id, userdetails) {
        return axios.put(`${API_URL}/${id}`, userdetails);
    },

    deleteUser(id) {
        return axios.delete(`${API_URL}/${id}`);
    },
    unFriend(userId, friendId){
        return axios.delete(`${API_URL}/${userId}/removeFriend/${friendId}`);
    },
    exitGroup(userId, bibleId){
        return axios.delete(`${API_URL}/${userId}/exitGroup/${bibleId}`);
    },

    async login (credentials)  {
        try {
          const response = await axios.post('/api/login', credentials, {
            // Ensure cookies are sent with the request
            withCredentials: true 
          });
          // Handle success (store the user, navigate, etc.)
          console.log('Logged in successfully', response.data);
        } catch (error) {
          // Handle errors
          console.error('Error logging in', error);
        }
      }


}
export default UserService;