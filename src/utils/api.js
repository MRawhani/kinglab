import axios from 'axios';

export default axios.create({
	baseURL: `${location.protocol + '//' + location.host}/api`,
	// baseURL: `http://localhost:8080/api`,
});
