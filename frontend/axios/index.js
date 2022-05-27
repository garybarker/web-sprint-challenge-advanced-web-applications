// ✨ implement axiosWithAuth
import axios from 'axios';

const axiosWithAuth = () => {
    const token = localStorage.getItem('token');

    return axios.create({
      header: {
          authorization: token
          
        }
        
    })
    

}

export default axiosWithAuth
