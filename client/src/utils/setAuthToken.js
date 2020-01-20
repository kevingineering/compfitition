import axios from 'axios';

//if a token exists, this includes it as a default in the header of requests - works hand in hand with auth middleware

const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
}

export default setAuthToken;