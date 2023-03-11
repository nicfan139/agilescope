import React, { createContext, ReactElement, ReactNode, useState, useContext } from 'react';

interface IUserContext {
	currentUser: unknown;
	setCurrentUser: (user: unknown) => void;
}

const UserContext = createContext<IUserContext>({
	currentUser: null,
	setCurrentUser: () => {}
});

export const UserContextProvider = ({ children }: { children: ReactNode }): ReactElement => {
	const [currentUser, setCurrentUser] = useState<unknown | null>(null);

	console.log('currentUser: ', currentUser);

	return (
		<UserContext.Provider
			value={{
				currentUser,
				setCurrentUser
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export const useUserContext = () => useContext(UserContext);
