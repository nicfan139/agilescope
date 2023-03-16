import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { BACKEND_API_URL } from '@/constants';
import { getHeaders } from '@/helpers';

export const useTeamsList = () =>
	useQuery(['GET_TEAMS'], async () => {
		const res = await axios.get(`${BACKEND_API_URL}/api/teams`, {
			headers: getHeaders()
		});
		return res.data;
	});

export const useTeamDetails = (teamId: string) =>
	useQuery([`GET_TEAM_${teamId}`], async () => {
		const res = await axios.get(`${BACKEND_API_URL}/api/teams/${teamId}`, {
			headers: getHeaders()
		});
		return res.data;
	});

export const useTeamCreate = () => {
	const queryClient = useQueryClient();
	return useMutation(
		async (payload: TTeamPayload) => {
			const res = await axios.post(`${BACKEND_API_URL}/api/teams`, payload, {
				headers: getHeaders()
			});
			return res.data;
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['GET_TEAMS']);
			}
		}
	);
};

export const useTeamUpdate = (teamId: string) => {
	const queryClient = useQueryClient();
	return useMutation(
		async (payload: TTeamPayload) => {
			const res = await axios.put(`${BACKEND_API_URL}/api/teams/${teamId}`, payload, {
				headers: getHeaders()
			});
			return res.data;
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries([`GET_TEAM_${teamId}`]);
			}
		}
	);
};
