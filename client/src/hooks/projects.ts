import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { BACKEND_API_URL } from '@/constants';
import { getHeaders } from '@/helpers';

export const useProjectsList = () =>
	useQuery(['GET_PROJECTS'], async () => {
		const res = await axios.get(`${BACKEND_API_URL}/api/projects`, {
			headers: getHeaders()
		});
		return res.data;
	});

export const useProjectDetails = (projectId: string) =>
	useQuery([`GET_PROJECT_${projectId}`], async () => {
		const res = await axios.get(`${BACKEND_API_URL}/api/projects/${projectId}`, {
			headers: getHeaders()
		});
		return res.data;
	});

type TProjectPayload = Pick<
	TProject,
	'title' | 'description' | 'complexity' | 'priority' | 'status'
> & {
	createdBy: string;
};

export const useProjectCreate = () => {
	const queryClient = useQueryClient();
	return useMutation(
		async (payload: TProjectPayload) => {
			const res = await axios.post(`${BACKEND_API_URL}/api/projects`, payload, {
				headers: getHeaders()
			});
			return res.data;
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['GET_PROJECTS']);
			}
		}
	);
};

export const useProjectUpdate = (projectId: string) => {
	const queryClient = useQueryClient();
	return useMutation(
		async (payload: TProjectPayload) => {
			const res = await axios.put(`${BACKEND_API_URL}/api/projects/${projectId}`, payload, {
				headers: getHeaders()
			});
			return res.data;
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries([`GET_PROJECT_${projectId}`]);
			}
		}
	);
};
