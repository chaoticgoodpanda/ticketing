import axios from 'axios';

// destructure req property from incoming argument
export default function buildClient({ req }) {
    if(typeof window === 'undefined') {
        // We are on the server
        
        return axios.create({
           baseURL: 'http://www.nug-lottery-global.xyz',
           headers: req.headers 
        });
    } else {
        // We are on the browser
        return axios.create({
           baseUrl: '/' 
        });
    }
}