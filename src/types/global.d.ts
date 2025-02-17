export { };

declare global {
	interface IBackendRes<T> {
		error?: string | string[];
		message: string;
		statusCode: number | string;
		data?: T;
	}

	interface IModelPaginate<T> {
		meta: {
			current: number;
			pageSize: number;
			pages: number;
			total: number;
		},
		result: T[]
	}

	interface ILogin {
		access_token: string;
		user: {
			email: string;
			phone: string;
			fullName: string;
			role: string;
			avatar: string;
			id: string;
		}
	}

	interface IRegister {
		_id: string;
		email: string;
		fullName: string;
	}

	interface IUser {
		email: string;
		phone: string;
		fullName: string;
		role: string;
		avatar: string;
		id: string;
	}

	interface IFetchAccount {
		user: IUser
	}

	interface IUserTable {
		_id: string;
		email: string;
		fullName: string;
		phone: string;
		role: string;
		type: string;
		avatar: string;
		isActive: boolean;
		createdAt: Date;
		updatedAt: Date;
		__v: number;
	}

	interface IBulkCreateUser {
		countSuccess: number;
		countError: number;
		detail: any;
	}

	interface IBookTable {
		_id: string;
		thumbnail: string;
		slider: string[];
		mainText: string;
		author: string;
		price: number;
		sold: number;
		quantity: number;
		category: string;
		createdAt: Date;
		updatedAt: Date;
		__v: number;
	}

	interface ICart {
		_id: string;
		detail: IBookTable;
		quantity: number;
	}

	interface IOrderTable {
		_id: string;
		name: string;
		type: string;
		email: string;
		phone: string;
		userId: string;
		detail: { _id: string; quantity: number; bookName: string }[];
		totalPrice: number;
		paymentStatus: string;
		paymentRef: string;
		createdAt: Date;
		updatedAt: Date;
		__v: number;
	}

	interface IDashboard {
		countOrder: number;
		countUser: number;
		countBook: number;
	}

}
