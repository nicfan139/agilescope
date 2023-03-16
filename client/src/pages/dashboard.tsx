import React from 'react';
import { HeadFC, Link } from 'gatsby';
import {
	Badge,
	Box,
	Heading,
	UnorderedList,
	ListItem,
	Spinner,
	Stack,
	Text
} from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import dayjs from 'dayjs';
import { LayoutCenter, LayoutDashboard } from '@/components';
import { DATE_FORMAT } from '@/constants';
import { useUserContext } from '@/contexts';
import { getStatusColour } from '@/helpers';
import { useUserDashboardData } from '@/hooks';

export const Head: HeadFC = () => <title>Dashboard | AgileScope</title>;

const DashboardPage = (): React.ReactElement => {
	const { currentUser } = useUserContext();
	const { isLoading, data } = useUserDashboardData(currentUser?._id);

	if (!currentUser || isLoading || !data) {
		return (
			<LayoutCenter>
				<Spinner size="xl" color="green" />
			</LayoutCenter>
		);
	}

	const USER_PROJECTS = data.projects;
	const USER_TASKS = data.tasks;

	return (
		<main>
			<LayoutDashboard>
				<Heading as="h1" size="2xl" mb="1.5rem">
					Dashboard
				</Heading>

				<Text mb="1.5rem" fontStyle="italic">
					Welcome to AgileScope {currentUser.firstName}! Go ahead and start managing your projects,
					sprints, tasks, and teams.
				</Text>

				<Stack direction="row" mb="2rem">
					<Text>Today's date:</Text>
					<Text fontWeight="semibold">{dayjs().format(DATE_FORMAT)}</Text>
				</Stack>

				<Box display="flex" flexDirection={{ base: 'column', md: 'row' }} gap="2rem">
					<Box
						position="relative"
						w="100%"
						p="1rem"
						border="1px solid lightgrey"
						borderRadius="0.375rem"
					>
						<Heading as="h3" size="md" mb="1rem">
							My projects
						</Heading>

						<UnorderedList mb="3rem">
							{USER_PROJECTS.length > 0 ? (
								USER_PROJECTS.map((project: TProject) => (
									<ListItem p="0.25rem" _hover={{ backgroundColor: 'gray.100' }}>
										<Link to={`/projects/${project._id}`}>
											<Box
												display="flex"
												flexDirection="row"
												justifyContent="space-between"
												alignItems="center"
											>
												<Text mr="1rem">{project.title}</Text>

												<Badge colorScheme={getStatusColour(project.status)}>
													{project.status}
												</Badge>
											</Box>
										</Link>
									</ListItem>
								))
							) : (
								<Text color="gray.500" fontStyle="italic">
									No projects to display
								</Text>
							)}
						</UnorderedList>

						<Stack
							position="absolute"
							bottom="1rem"
							right="1rem"
							direction="row"
							alignItems="center"
							fontWeight="semibold"
						>
							<ArrowForwardIcon boxSize={6} />
							<Link to="/projects">View all projects</Link>
						</Stack>
					</Box>

					<Box
						position="relative"
						w="100%"
						p="1rem"
						border="1px solid lightgrey"
						borderRadius="0.375rem"
					>
						<Heading as="h3" size="md" mb="1rem">
							My tasks
						</Heading>

						<UnorderedList mb="1rem">
							{USER_TASKS.length > 0 ? (
								USER_TASKS.map((task: TTask) => (
									<ListItem p="0.25rem" _hover={{ backgroundColor: 'gray.100' }}>
										<Link to={`/tasks/${task._id}`}>
											<Box
												display="flex"
												flexDirection="row"
												justifyContent="space-between"
												alignItems="center"
											>
												<Text mr="1rem">{task.title}</Text>

												<Badge colorScheme={getStatusColour(task.status)}>{task.status}</Badge>
											</Box>
										</Link>
									</ListItem>
								))
							) : (
								<Text color="gray.500" fontStyle="italic">
									No tasks to display
								</Text>
							)}
						</UnorderedList>

						<Stack
							position="absolute"
							bottom="1rem"
							right="1rem"
							direction="row"
							alignItems="center"
							fontWeight="semibold"
						>
							<ArrowForwardIcon boxSize={6} />
							<Link to="/tasks">View all tasks</Link>
						</Stack>
					</Box>
				</Box>
			</LayoutDashboard>
		</main>
	);
};

export default DashboardPage;
