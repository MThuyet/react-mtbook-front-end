import createInstanceAxios from 'services/axios.customize';

const axios = createInstanceAxios(import.meta.env.VITE_BACKEND_URL);

const axiosPayment = createInstanceAxios(import.meta.env.VITE_BACKEND_PAYMENT_URL);

export const getVNPayUrlAPI = (amount: number, locale: string, paymentRef: string) => {
	const urlBackend = '/vnpay/payment-url';
	return axiosPayment.post<IBackendRes<{ url: string }>>(
		urlBackend, { amount, locale, paymentRef }
	)
}

export const updatePaymentStatusAPI = (paymentStatus: string, paymentRef: string) => {
	const urlBackend = '/api/v1/order/update-payment-status';
	return axios.post<IBackendRes<IRegister>>(urlBackend, { paymentStatus, paymentRef },
		{
			headers: {
				delay: 2000
			}
		}
	);
}

export const loginAPI = (username: string, password: string) => {
	const urlBackend = '/api/v1/auth/login';
	return axios.post<IBackendRes<ILogin>>(urlBackend, { username, password });
}

export const registerAPI = (fullName: string, email: string, password: string, phone: string) => {
	const urlBackend = '/api/v1/user/register';
	return axios.post<IBackendRes<IRegister>>(urlBackend, { fullName, email, password, phone });
}

export const fetchAccountAPI = () => {
	const urlBackend = '/api/v1/auth/account';
	return axios.get<IBackendRes<IFetchAccount>>(urlBackend);
}

export const logoutAPI = () => {
	const urlBackend = '/api/v1/auth/logout';
	return axios.post<IBackendRes<IRegister>>(urlBackend);
}

export const getUsersAPI = (query: string) => {
	const urlBackend = `/api/v1/user?${query}`
	return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(urlBackend);
}

export const createUserAPI = (fullName: string, password: string, email: string, phone: string) => {
	const urlBackend = '/api/v1/user';
	return axios.post<IBackendRes<IRegister>>(urlBackend, { fullName, password, email, phone });
}

export const bulkCreateUserAPI = (data: {
	fullName: string,
	password: string,
	email: string,
	phone: string
}[]) => {
	const urlBackend = '/api/v1/user/bulk-create';
	return axios.post<IBackendRes<IBulkCreateUser>>(urlBackend, data);
}

export const updateUserAPI = (_id: string, fullName: string, phone: string) => {
	const urlBackend = '/api/v1/user';
	return axios.put<IBackendRes<IRegister>>(urlBackend, { _id, fullName, phone });
}

export const deleteUserAPI = (_id: string) => {
	const urlBackend = `/api/v1/user/${_id}`;
	return axios.delete<IBackendRes<IRegister>>(urlBackend);
}

// book
export const getBooksAPI = (query: string) => {
	const urlBackend = `/api/v1/book?${query}`
	return axios.get<IBackendRes<IModelPaginate<IBookTable>>>(urlBackend);
}

export const getCategoryAPI = () => {
	const urlBackend = `/api/v1/database/category`;
	return axios.get<IBackendRes<string[]>>(urlBackend);
}

export const uploadFileAPI = (fileImg: any, folder: string) => {
	const bodyFormData = new FormData();
	bodyFormData.append('fileImg', fileImg);
	return axios<IBackendRes<{
		fileUploaded: string
	}>>({
		method: 'post',
		url: '/api/v1/file/upload',
		data: bodyFormData,
		headers: {
			"Content-Type": "multipart/form-data",
			"upload-type": folder
		},
	});
}

export const createBookAPI = (data: {
	thumbnail: string,
	slider: string[],
	mainText: string,
	author: string,
	price: number,
	quantity: number,
	category: string
}) => {
	const urlBackend = `/api/v1/book`;
	return axios.post<IBackendRes<IRegister>>(urlBackend, data);
}

export const updateBookAPI = (
	_id: string,
	mainText: string, author: string,
	price: number, quantity: number, category: string,
	thumbnail: string, slider: string[]
) => {
	const urlBackend = `/api/v1/book/${_id}`;
	return axios.put<IBackendRes<IRegister>>(urlBackend,
		{ mainText, author, price, quantity, category, thumbnail, slider })
}

export const deleteBookAPI = (_id: string) => {
	const urlBackend = `/api/v1/book/${_id}`;
	return axios.delete<IBackendRes<IRegister>>(urlBackend);
}

export const getBookDetailAPI = (_id: string) => {
	const urlBackend = `/api/v1/book/${_id}`;
	return axios.get<IBackendRes<IBookTable>>(urlBackend);
}

export const createOrderAPI = (
	name: string, address: string, phone: string, totalPrice: number,
	type: string, detail: { bookName: string, quantity: number, _id: string }[],
	paymentRef?: string
) => {
	const urlBackend = '/api/v1/order';
	return axios.post<IBackendRes<IBookTable>>
		(urlBackend,
			{ name, address, phone, totalPrice, type, detail, paymentRef }
		);
}

export const getOrderAPI = () => {
	const urlBackend = '/api/v1/history';
	return axios.get<IBackendRes<IOrderTable[]>>(urlBackend);
}

export const updateUserInfoAPI = (
	_id: string, avatar: string,
	fullName: string, phone: string) => {
	const urlBackend = "/api/v1/user";
	return axios.put<IBackendRes<IRegister>>(urlBackend,
		{ fullName, phone, avatar, _id })
}
export const updateUserPasswordAPI = (
	email: string, oldpass: string, newpass: string) => {
	const urlBackend = "/api/v1/user/change-password";
	return axios.post<IBackendRes<IRegister>>(urlBackend,
		{ email, oldpass, newpass })
}

export const getOrderWithPaginateAPI = (query: string) => {
	const urlBackend = `/api/v1/order?${query}`;
	return axios.get<IBackendRes<IModelPaginate<IOrderTable>>>(urlBackend);
}

export const getDashboardAPI = () => {
	const urlBackend = '/api/v1/database/dashboard';
	return axios.get<IBackendRes<IDashboard>>(urlBackend);
}
