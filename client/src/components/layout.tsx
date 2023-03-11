import React from 'react';
import { Link } from 'gatsby';
import { Box, Button, Heading, Text, StyleProps } from '@chakra-ui/react';
import { handleLogout } from '@/helpers';
import { useUserContext } from '@/contexts';

interface ILayoutProps extends StyleProps {
	children: React.ReactNode;
}

export const LayoutCenter = ({ children, ...otherProps }: ILayoutProps): React.ReactElement => (
	<Box
		position="fixed"
		top={0}
		left={0}
		right={0}
		bottom={0}
		display="flex"
		justifyContent="center"
		alignItems="center"
		backgroundColor="whitesmoke"
		{...otherProps}
	>
		{children}
	</Box>
);

export const LayoutDashboard = ({ children }: ILayoutProps): React.ReactElement => {
	const { currentUser } = useUserContext();
	return (
		<Box display="flex" h="100vh">
			<Box
				display={{
					base: 'none',
					md: 'flex'
				}}
				flexDirection="column"
				justifyContent="space-between"
				h="100%"
				w="500px"
				p="1rem"
				borderRight="1px solid green"
			>
				<Link to="/">
					<Heading as="h2" size="lg">
						AgileScope
					</Heading>
				</Link>

				<Box display="flex" flexDirection="column" gap="1rem" fontSize="1.5rem">
					<Link to="/">Dashboard</Link>
					<Link to="/projects">Projects</Link>
					<Link to="/sprints">Sprints</Link>
					<Link to="/tasks">Tasks</Link>
					<Link to="/teams">Teams</Link>
				</Box>

				<Box display="flex" flexDirection="column" gap="0.25rem">
					<Text>
						Logged in as: {currentUser?.firstName} {currentUser?.lastName}
					</Text>
					<Text>({currentUser?.email})</Text>
					<Button onClick={handleLogout}>Logout</Button>
				</Box>
			</Box>

			<Box h="100%" overflowY="auto" p="2rem">
				{children}
			</Box>
		</Box>
	);
};
