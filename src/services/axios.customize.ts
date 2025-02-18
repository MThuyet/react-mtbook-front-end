import axios from 'axios'

const createInstanceAxios = (baseURL: string) => {
	const instance = axios.create({
		baseURL: baseURL,
		withCredentials: true
	});

	const handleRefreshToken = async () => {
		const res = await instance.get('/api/v1/auth/refresh');
		if (res.data) {
			return res.data.access_token;
		} else {
			return null
		}
	}

	// Add a request interceptor
	instance.interceptors.request.use(function (config) {
		// Do something before request is sent
		const token = localStorage.getItem('access_token');
		const auth = token ? `Bearer ${token}` : '';
		config.headers['Authorization'] = auth;
		return config;

	}, function (error) {
		// Do something with request error
		return Promise.reject(error);
	});

	// Add a response interceptor
	instance.interceptors.response.use(function (response) {
		// Any status code that lie within the range of 2xx cause this function to trigger
		// Do something with response data
		if (response && response.data && response.data.data) {
			return response.data;
		}

	}, async function (error) {
		// Any status codes that falls outside the range of 2xx cause this function to trigger
		// Do something with response error
		if (error.config && error.response && +error.response.status === 401) {
			const access_token = await handleRefreshToken();
			if (access_token) {
				error.config.headers['Authorization'] = `Bearer ${access_token}`;
				localStorage.setItem('access_token', access_token);
				return instance.request(error.config);
			}
		}

		if (error && error.response && error.response.data) {
			return error.response.data
		}

		return Promise.reject(error);
	});

	return instance;
}

export default createInstanceAxios;
