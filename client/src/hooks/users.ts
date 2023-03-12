import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BACKEND_API_URL } from '@/constants';
import { getHeaders } from '@/helpers';

export const useUsersList = () =>
	useQuery(['GET_USERS'], async () => {
		const res = await axios.get(`${BACKEND_API_URL}/api/users`, {
			headers: getHeaders()
		});
		return res.data;
	});
