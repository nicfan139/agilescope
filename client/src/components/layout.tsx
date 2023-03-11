import React from 'react';
import { Box, StyleProps } from '@chakra-ui/react';

interface ILayoutProps extends StyleProps {
	children: React.ReactNode;
}

export const LayoutCenter = ({ children, ...otherProps }: ILayoutProps): React.ReactElement => (
	<Box
		h="100vh"
		w="100vw"
		display="flex"
		justifyContent="center"
		alignItems="center"
		backgroundColor="whitesmoke"
		{...otherProps}
	>
		{children}
	</Box>
);
