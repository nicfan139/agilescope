import React, { useState } from 'react';
import type { HeadFC, PageProps } from 'gatsby';
import { useForm } from 'react-hook-form';
import {
	Box,
	Button,
	Heading,
	InputGroup,
	InputLeftAddon,
	Input,
	Text,
	Stack,
	useToast
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { LayoutCenter } from '@/components';
import { handleError } from '@/helpers';
import { useAuthLogin, useAuthValidateOtp } from '@/hooks';

export const Head: HeadFC = () => <title>Login | AgileScope</title>;

interface ILoginForm {
	email: string;
	password: string;
}

type TLoginState = 'form' | 'success' | 'otp';

const LoginPage = ({}: PageProps): React.ReactElement => {
	const { handleSubmit, register } = useForm<ILoginForm>({
		defaultValues: {
			email: '',
			password: ''
		}
	});
	const authLogin = useAuthLogin();
	const authValidateOtp = useAuthValidateOtp();
	const toast = useToast();

	const [state, setState] = useState<TLoginState>('form');
	const [accessToken, setAccessToken] = useState<string>('');
	const [otp, setOtp] = useState<string>('');

	const handleAuthSuccess = (accessToken: string) => {
		if (typeof window !== 'undefined') {
			setTimeout(() => {
				window.location.href = '/dashboard';
			}, 4000);
			localStorage.setItem('agileScope-accessToken', accessToken);
		}
		setState('success');
	};

	const onCredentialsSubmit = async (form: ILoginForm) => {
		try {
			const res = await authLogin.mutateAsync(form);
			if (res.status === 200) {
				const { otpEnabled, token } = res.data;
				if (otpEnabled) {
					setState('otp');
					setAccessToken(token);
				} else {
					handleAuthSuccess(token);
				}
			} else {
				toast({
					status: 'error',
					title: res.data.errorMessage
				});
			}
		} catch (e: unknown) {
			handleError(e);
		}
	};

	const onOtpSubmit = async () => {
		try {
			const res = await authValidateOtp.mutateAsync({
				accessToken,
				otp
			});
			if (res.status === 201) {
				handleAuthSuccess(accessToken);
			} else {
				toast({
					status: 'error',
					title: res.data.errorMessage
				});
			}
		} catch (e: unknown) {
			handleError(e);
		}
	};

	return (
		<LayoutCenter backgroundColor="whitesmoke">
			<Box p="1.5rem" w="full" maxW="lg" backgroundColor="white">
				<Heading as="h1" size="xl" mb="1.5rem">
					Login to AgileScope
				</Heading>

				{state === 'form' && (
					<form onSubmit={handleSubmit(onCredentialsSubmit)}>
						<InputGroup mb="1rem">
							<InputLeftAddon children="Email" />
							<Input
								type="text"
								{...register('email', { required: true })}
								isDisabled={authLogin.isLoading}
							/>
						</InputGroup>

						<InputGroup mb="1rem">
							<InputLeftAddon children="Password" />
							<Input
								type="password"
								{...register('password', { required: true })}
								isDisabled={authLogin.isLoading}
							/>
						</InputGroup>

						<Button
							type="submit"
							variant="solid"
							colorScheme="green"
							isLoading={authLogin.isLoading}
						>
							Submit
						</Button>
					</form>
				)}

				{state === 'otp' && (
					<Box>
						<Text mb="0.5rem" fontSize="sm" fontStyle="italic">
							Please check your inbox for the email with the provided one-time password, and enter
							it below:
						</Text>

						<InputGroup mb="1.5rem">
							<InputLeftAddon children="One-time password" />
							<Input type="text" onChange={(e) => setOtp(e.target.value)} maxLength={6} />
						</InputGroup>

						<Button
							colorScheme="green"
							onClick={onOtpSubmit}
							isLoading={authValidateOtp.isLoading}
							isDisabled={!Boolean(otp) || otp?.length !== 6}
						>
							Submit
						</Button>
					</Box>
				)}

				{state === 'success' && (
					<Stack>
						<Stack direction="row" alignItems="center">
							<CheckCircleIcon boxSize={8} color="green" />
							<Text fontSize="2xl" fontWeight="semibold">
								Success!
							</Text>
						</Stack>
						<Text>You will be automatically redirected in a few moments</Text>
					</Stack>
				)}
			</Box>
		</LayoutCenter>
	);
};

export default LoginPage;
