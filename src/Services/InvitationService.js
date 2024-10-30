import axios from 'axios';
const API_URL = 'http://localhost:8080/invitation';

const InvitationService = {

    sendInvitation(senderId, receiverId, type) {
       return axios.get(`${API_URL}/send/${senderId}/${receiverId}/${type}`);
    },

    respondToInvitation(invitationId, status) { 
       return axios.post(`${API_URL}/respond/${invitationId}/${status}`);
    },

    getInvitations(userId){
        return axios.get(`${API_URL}/getInvitations/${userId}`);
    },

    removeInvitation(invitationId){
        return axios.delete(`${API_URL}removeInvitation/${invitationId}`)
    },
}
export default InvitationService;