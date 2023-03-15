import React from 'react';
import { Avatar as ChakraAvatar, Stack, StyleProps, Text } from '@chakra-ui/react';
import { getFullName } from '@/helpers';

interface IAvatarProps extends StyleProps {
	user: TUser;
	size?: 'sm' | 'md' | 'lg' | 'xl';
	showName?: boolean;
}

const Avatar = ({
	user,
	size = 'md',
	showName,
	...otherProps
}: IAvatarProps): React.ReactElement => {
	const FULL_NAME = getFullName(user);

	if (showName) {
		return (
			<Stack direction="row" alignItems="center" {...otherProps}>
				<ChakraAvatar title={FULL_NAME} name={FULL_NAME} src={user.avatarUrl} size={size} />
				<Text>{FULL_NAME}</Text>
			</Stack>
		);
	}

	return (
		<ChakraAvatar
			title={FULL_NAME}
			name={FULL_NAME}
			src={user.avatarUrl}
			size={size}
			{...otherProps}
		/>
	);
};

export default Avatar;
