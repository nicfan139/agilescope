import React, {
	createContext,
	ReactElement,
	ReactNode,
	useState,
	useEffect,
	useContext
} from 'react';
import { useToast, Spinner } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { LayoutCenter } from '@/components';
import { PUBLIC_ROUTES } from '@/constants';
import { getAccessToken, handleLogout } from '@/helpers';
import { useAuthValidateToken } from '@/hooks';

interface IUserContext {
	currentUser: TUser | null;
	setCurrentUser: (user: TUser) => void;
}

const UserContext = createContext<IUserContext>({
	currentUser: null,
	setCurrentUser: () => {}
});

const IS_PUBLIC_ROUTE = PUBLIC_ROUTES.includes(window.location.pathname);

export const UserContextProvider = ({ children }: { children: ReactNode }): ReactElement => {
	const [currentUser, setCurrentUser] = useState<TUser | null>(null);

	const authValidateToken = useAuthValidateToken();
	const toast = useToast();

	const validateAccessToken = async () => {
		try {
			const res = await authValidateToken.mutateAsync();
			if (res.data.isTokenValid) {
				setCurrentUser(res.data.user);
			} else {
				setTimeout(() => {
					handleLogout();
				}, 4000);
				toast({
					status: 'error',
					title: 'Unable to validate user credentials',
					description: 'Redirecting to login in a few moments'
				});
			}
		} catch (e: unknown) {
			const error = e as AxiosError;
			const data = error.response?.data as { errorMessage: string };
			toast({
				status: 'error',
				title: data.errorMessage
			});
		}
	};

	useEffect(() => {
		if (getAccessToken()) {
			validateAccessToken();
		} else {
			if (!IS_PUBLIC_ROUTE) {
				window.location.href = '/login';
			}
		}
	}, []);

	if (!IS_PUBLIC_ROUTE && (!getAccessToken() || authValidateToken.isLoading))
		return (
			<LayoutCenter>
				<Spinner boxSize={44} color="green" />
			</LayoutCenter>
		);

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
