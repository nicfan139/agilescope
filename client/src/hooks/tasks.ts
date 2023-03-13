import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { BACKEND_API_URL } from '@/constants';
import { getHeaders } from '@/helpers';

export const useTasksList = () =>
	useQuery(['GET_TASKS'], async () => {
		const res = await axios.get(`${BACKEND_API_URL}/api/tasks`, {
			headers: getHeaders()
		});
		return res.data;
	});

export const useTaskDetails = (taskId: string) =>
	useQuery([`GET_TASK_${taskId}`], async () => {
		const res = await axios.get(`${BACKEND_API_URL}/api/tasks/${taskId}`, {
			headers: getHeaders()
		});
		return res.data;
	});

type TTaskPayload = Pick<TTask, 'title' | 'description' | 'complexity' | 'priority' | 'status'> & {
	createdBy: string;
};

export const useTaskCreate = () => {
	const queryClient = useQueryClient();
	return useMutation(
		async (payload: TTaskPayload) => {
			const res = await axios.post(`${BACKEND_API_URL}/api/tasks`, payload, {
				headers: getHeaders()
			});
			return res.data;
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['GET_TASKS']);
			}
		}
	);
};

export const useTaskUpdate = (taskId: string) => {
	const queryClient = useQueryClient();
	return useMutation(
		async (payload: TTaskPayload) => {
			const res = await axios.put(`${BACKEND_API_URL}/api/tasks/${taskId}`, payload, {
				headers: getHeaders()
			});
			return res.data;
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries([`GET_TASK_${taskId}`]);
			}
		}
	);
};
