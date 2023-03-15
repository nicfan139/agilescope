import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { BACKEND_API_URL } from '@/constants';
import { getHeaders } from '@/helpers';

export const useAuthLogin = () =>
	useMutation((payload: { email: string; password: string }) =>
		axios.post(`${BACKEND_API_URL}/api/auth/login`, payload)
	);

export const useAuthValidateOtp = () =>
	useMutation((payload: { accessToken: string; otp: string }) =>
		axios.post(`${BACKEND_API_URL}/api/auth/validate_otp`, payload)
	);

export const useAuthValidateToken = () =>
	useMutation(() =>
		axios.get(`${BACKEND_API_URL}/api/auth/validate_token`, {
			headers: getHeaders()
		})
	);
