// ✨ implement axiosWithAuth
import axios from 'axios';

const axiosWithAuth = () => {
    const token = localStorage.getItem('token');

    return axios.create({
      baseURL: 'http://localhost:9000/api',
        header: {
            Authorization: token
        }
    })
}

export default axiosWithAuth;
