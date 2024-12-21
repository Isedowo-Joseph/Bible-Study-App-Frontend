import axios from 'axios';
const API_URL = 'http://localhost:4000/api/v1';
// Axios default configuration to send cookies with requests if necessary
axios.defaults.withCredentials = true;
const BibleAPIService = {
    getVerseOfTheDay(){
        return axios.get(`${API_URL}/votd`)
    },
    getChapter(book,chapter,version){
        return axios.get(`${API_URL}/verse/${book}/${chapter}/${version}`,{ timeout: 9000 })
    },  
    getStatus(){
        return axios.get(`${API_URL}/status`)
    }
}

export default BibleAPIService;