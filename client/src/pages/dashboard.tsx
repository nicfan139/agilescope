import React from 'react';
import { HeadFC, Link } from 'gatsby';
import { Box, Heading, Spinner, Stack, Text } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import dayjs from 'dayjs';
import { LayoutCenter, LayoutDashboard } from '@/components';
import { DATE_FORMAT } from '@/constants';
import { useUserContext } from '@/contexts';

export const Head: HeadFC = () => <title>Dashboard | AgileScope</title>;

const DashboardPage = (): React.ReactElement => {
	const { currentUser } = useUserContext();

	if (!currentUser) {
		return (
			<LayoutCenter>
				<Spinner size="xl" color="green" />
			</LayoutCenter>
		);
	}

	return (
		<main>
			<LayoutDashboard>
				<Heading as="h1" size="2xl" mb="1.5rem">
					Dashboard
				</Heading>

				<Text mb="1.5rem" fontStyle="italic">
					Welcome to AgileScope {currentUser.firstName}! Go ahead and start managing your projects,
					sprints, and tasks.
				</Text>

				<Stack direction="row" mb="2rem">
					<Text>Today's date:</Text>
					<Text fontWeight="semibold">{dayjs().format(DATE_FORMAT)}</Text>
				</Stack>

				<Box display="flex" flexDirection="column" gap="2rem">
					<Stack direction="row" alignItems="center" fontWeight="semibold">
						<ArrowForwardIcon boxSize={6} />
						<Link to="/projects">View projects</Link>
					</Stack>
					<Stack direction="row" alignItems="center" fontWeight="semibold">
						<ArrowForwardIcon boxSize={6} />
						<Link to="/sprints">View sprints</Link>
					</Stack>
					<Stack direction="row" alignItems="center" fontWeight="semibold">
						<ArrowForwardIcon boxSize={6} />
						<Link to="/tasks">View tasks</Link>
					</Stack>
				</Box>
			</LayoutDashboard>
		</main>
	);
};

export default DashboardPage;
