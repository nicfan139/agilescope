import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { BACKEND_API_URL } from '@/constants';
import { getHeaders } from '@/helpers';

export const useSprintsList = () =>
	useQuery(['GET_SPRINTS'], async () => {
		const res = await axios.get(`${BACKEND_API_URL}/api/sprints`, {
			headers: getHeaders()
		});
		return res.data;
	});

export const useSprintCreate = () => {
	const queryClient = useQueryClient();
	return useMutation(
		async (payload: TSprintPayload) => {
			const res = await axios.post(`${BACKEND_API_URL}/api/sprints`, payload, {
				headers: getHeaders()
			});
			return res.data;
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['GET_SPRINTS']);
			}
		}
	);
};

export const useSprintUpdate = (sprintId: string) => {
	const queryClient = useQueryClient();
	return useMutation(
		async (payload: TSprintPayload) => {
			const res = await axios.put(`${BACKEND_API_URL}/api/sprints/${sprintId}`, payload, {
				headers: getHeaders()
			});
			return res.data;
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries([`GET_SPRINT_${sprintId}`]);
			}
		}
	);
};
