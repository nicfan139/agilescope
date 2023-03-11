import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { getAccessToken } from '@/helpers';

const BACKEND_API_URL = process.env.GATSBY_BACKEND_API_URL;

export const useAuthLogin = () =>
	useMutation((payload: any) => axios.post(`${BACKEND_API_URL}/api/auth/login`, payload));

export const useAuthValidateToken = () =>
	useMutation(() =>
		axios.get(`${BACKEND_API_URL}/api/auth/validate_token`, {
			headers: {
				Authorization: `Bearer ${getAccessToken()}`
			}
		})
	);
