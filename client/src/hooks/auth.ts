import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { BACKEND_API_URL } from '@/constants';
import { getHeaders } from '@/helpers';

export const useAuthLogin = () =>
	useMutation((payload: any) => axios.post(`${BACKEND_API_URL}/api/auth/login`, payload));

export const useAuthValidateToken = () =>
	useMutation(() =>
		axios.get(`${BACKEND_API_URL}/api/auth/validate_token`, {
			headers: getHeaders()
		})
	);
