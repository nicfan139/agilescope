import { CreateToastFnReturn } from '@chakra-ui/react';
import { AxiosError } from 'axios';

export const getAccessToken = () => {
	if (typeof window !== 'undefined') {
		return window.localStorage.getItem('agileScope-accessToken');
	}
	return undefined;
};

export const getHeaders = () => ({
	Authorization: `Bearer ${getAccessToken()}`
});

export const handleLogout = () => {
	if (typeof window !== 'undefined') {
		window.localStorage.removeItem('agileScope-accessToken');
		window.location.href = '/login';
	}
};

export const handleError = (e: unknown, toast: CreateToastFnReturn) => {
	const error = e as AxiosError;
	const data = error.response?.data as { errorMessage: string };
	toast({
		status: 'error',
		title: data.errorMessage
	});
};
