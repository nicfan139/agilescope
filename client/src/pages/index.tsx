import React, { useEffect } from 'react';
import type { HeadFC, PageProps } from 'gatsby';
import { AxiosError } from 'axios';
import { useToast, Button, Heading, Spinner } from '@chakra-ui/react';
import { LayoutCenter } from '@/components';
import { useUserContext } from '@/contexts';
import { getAccessToken } from '@/helpers';
import { useAuthValidateToken } from '@/hooks';

const ACCESS_TOKEN = getAccessToken();

export const Head: HeadFC = () => <title>AgileScope</title>;

const IndexPage = ({}: PageProps): React.ReactElement => {
	const { setCurrentUser } = useUserContext();
	const authValidateToken = useAuthValidateToken();
	const toast = useToast();

	const handleLogout = () => {
		localStorage.removeItem('agileScope-accessToken');
		window.location.href = '/login';
	};

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
		if (ACCESS_TOKEN) {
			validateAccessToken();
		} else {
			window.location.href = '/login';
		}
	}, []);

	if (!ACCESS_TOKEN || authValidateToken.isLoading)
		return (
			<LayoutCenter>
				<Spinner />
			</LayoutCenter>
		);

	return (
		<main>
			<Button onClick={handleLogout}>Logout</Button>

			<Heading as="h1" size="2xl" noOfLines={1}>
				Dashboard
			</Heading>

			<p>
				Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ducimus sunt obcaecati deleniti
				eum ut voluptates quasi, dolorum repellendus corrupti quos inventore consectetur itaque,
				labore est officia molestiae placeat pariatur? Veritatis.
			</p>
		</main>
	);
};

export default IndexPage;
