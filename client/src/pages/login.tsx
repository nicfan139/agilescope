import React from 'react';
import type { HeadFC, PageProps } from 'gatsby';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import {
	useToast,
	Box,
	Heading,
	InputGroup,
	InputLeftAddon,
	Input,
	Button
} from '@chakra-ui/react';
import { LayoutCenter } from '@/components';
import { useAuthLogin } from '@/hooks';

export const Head: HeadFC = () => <title>Login | AgileScope</title>;

interface ILoginForm {
	email: string;
	password: string;
}

const LoginPage = ({}: PageProps): React.ReactElement => {
	const { handleSubmit, register } = useForm<ILoginForm>({
		defaultValues: {
			email: '',
			password: ''
		}
	});
	const authLogin = useAuthLogin();
	const toast = useToast();

	const onSubmit = async (form: ILoginForm) => {
		try {
			const res = await authLogin.mutateAsync(form);
			if (res.status === 200) {
				if (typeof window !== 'undefined') {
					setTimeout(() => {
						window.location.href = '/dashboard';
					}, 4000);
				}
				toast({
					status: 'success',
					title: res.data.message,
					description: 'You will be redirected to the dashboard in a few moments.'
				});
				localStorage.setItem('agileScope-accessToken', res.data.token);
			} else {
				toast({
					status: 'error',
					title: res.data.errorMessage
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

	return (
		<LayoutCenter backgroundColor="whitesmoke">
			<Box p="1.5rem" w="full" maxW="lg" backgroundColor="white">
				<form onSubmit={handleSubmit(onSubmit)}>
					<Heading as="h1" size="2xl" mb="1.5rem">
						Login
					</Heading>

					<InputGroup mb="1rem">
						<InputLeftAddon children="Email" />
						<Input
							type="text"
							{...register('email', { required: true })}
							disabled={authLogin.isLoading}
						/>
					</InputGroup>

					<InputGroup mb="1rem">
						<InputLeftAddon children="Password" />
						<Input
							type="password"
							{...register('password', { required: true })}
							disabled={authLogin.isLoading}
						/>
					</InputGroup>

					<Button type="submit" variant="solid" colorScheme="green" isLoading={authLogin.isLoading}>
						Submit
					</Button>
				</form>
			</Box>
		</LayoutCenter>
	);
};

export default LoginPage;
