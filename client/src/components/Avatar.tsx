import React from 'react';
import { Avatar as ChakraAvatar, StyleProps } from '@chakra-ui/react';
import { getFullName } from '@/helpers';

interface IAvatarProps extends StyleProps {
	user: TUser;
	size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Avatar = ({ user, size = 'md', ...otherProps }: IAvatarProps): React.ReactElement => {
	const FULL_NAME = getFullName(user);
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
