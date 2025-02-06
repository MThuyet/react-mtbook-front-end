import { createContext, useState, useContext } from "react";

interface IAppContext {
	isAuthenticated: boolean;
	setIsAuthenticated: (v: boolean) => void;
	user: IUser | null;
	setUser: (v: IUser) => void;
	isAppLoading: boolean;
	setisAppLoading: (v: boolean) => void;
}

const CurrentAppContext = createContext<IAppContext | null>(null);

type TProps = {
	children: React.ReactNode
}

export const AppProvider = (props: TProps) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [isAppLoading, setisAppLoading] = useState<boolean>(true);
	const [user, setUser] = useState<IUser | null>(null);

	return (
		<CurrentAppContext.Provider value={{
			isAuthenticated,
			user,
			setIsAuthenticated,
			setUser,
			isAppLoading,
			setisAppLoading
		}}>
			{props.children}
		</CurrentAppContext.Provider >
	);
};

export const useCurrentApp = () => {
	const currentAppContext = useContext(CurrentAppContext);

	if (!currentAppContext) {
		throw new Error(
			"useCurrentApp has to be used within <currentAppContext.Provider>"
		);
	}

	return currentAppContext;
};
