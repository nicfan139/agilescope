import React from 'react';
import { HeadFC, PageProps, Link } from 'gatsby';
import {
	Badge,
	Box,
	Button,
	Divider,
	Heading,
	Spinner,
	Stack,
	Table,
	TableContainer,
	Thead,
	Th,
	Td,
	Tr,
	Tbody,
	Text,
	Tooltip,
	useDisclosure
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import dayjs from 'dayjs';
import { Avatar, BackButton, HoveredLink, LayoutDashboard } from '@/components';
import { DATE_FORMAT } from '@/constants';
import { useUserContext } from '@/contexts';
import { ProjectForm } from '@/forms';
import { useProjectDetails } from '@/hooks';
import { getComplexityColour, getFullName, getPriorityColour, getStatusColour } from '@/helpers';

export const Head: HeadFC = () => <title>Project | AgileScope</title>;

const ProjectPage = ({ params }: PageProps): React.ReactElement => {
	const { projectId } = params;
	const { isLoading, data } = useProjectDetails(projectId);
	const { currentUser } = useUserContext();
	const { isOpen, onOpen, onClose } = useDisclosure();

	if (isLoading || !data) {
		return <Spinner size="xl" color="green" />;
	}

	const PROJECT_DETAILS = data?.project as TProject;
	const PROJECT_OWNER = PROJECT_DETAILS?.createdBy;
	const CURRENT_USER_OWNS_PROJECT = currentUser?._id === PROJECT_OWNER?._id;

	return (
		<main>
			<LayoutDashboard>
				<BackButton />

				<Box
					display="flex"
					flexDirection={{ base: 'column', md: 'row' }}
					gap="1rem"
					justifyContent="space-between"
					alignItems={{ base: 'flex-start', md: 'center' }}
					mt="0.5rem"
					mb="1.5rem"
				>
					<Box>
						<Text fontSize="2xl" fontWeight="semibold">
							Project:
						</Text>

						<Heading as="h1" size="2xl" mb="0.25rem">
							{PROJECT_DETAILS.title}
						</Heading>

						<Box fontSize="xs" fontStyle="italic">
							<Text>
								Created by {getFullName(PROJECT_OWNER)} on{' '}
								{dayjs(PROJECT_DETAILS.createdAt).format(DATE_FORMAT)}
							</Text>
							<Text>
								Last updated on {dayjs(PROJECT_DETAILS.updatedAt).format('YYYY-MM-DD hh:mm a')}
							</Text>
						</Box>
					</Box>

					<Tooltip
						label={`Only the original project creator (${getFullName(
							PROJECT_OWNER
						)}) can make modifications`}
						hasArrow
						isDisabled={CURRENT_USER_OWNS_PROJECT}
					>
						<Button
							colorScheme="green"
							leftIcon={<EditIcon />}
							onClick={onOpen}
							ml={{ base: 0, md: '2rem' }}
							isDisabled={!CURRENT_USER_OWNS_PROJECT}
						>
							Update
						</Button>
					</Tooltip>
				</Box>

				<ProjectForm {...{ isOpen, onClose, project: PROJECT_DETAILS }} />

				<Text fontSize="lg" color="gray.500" mb="1rem">
					{PROJECT_DETAILS.description || 'No description for this task'}
				</Text>

				<Divider />

				<Box display="flex" flexWrap="wrap" gap={{ base: '2rem', md: '3rem' }} my="1rem">
					<Stack alignItems="flex-start">
						<Heading as="h3" fontSize="xl">
							Complexity
						</Heading>
						<Badge colorScheme={getComplexityColour(PROJECT_DETAILS.complexity)}>
							{PROJECT_DETAILS.complexity}
						</Badge>
					</Stack>

					<Stack alignItems="flex-start">
						<Heading as="h3" fontSize="xl">
							Priority
						</Heading>
						<Badge colorScheme={getPriorityColour(PROJECT_DETAILS.priority)}>
							{PROJECT_DETAILS.priority}
						</Badge>
					</Stack>

					<Stack alignItems="flex-start">
						<Heading as="h3" fontSize="xl">
							Status
						</Heading>
						<Badge colorScheme={getStatusColour(PROJECT_DETAILS.status)}>
							{PROJECT_DETAILS.status}
						</Badge>
					</Stack>
				</Box>

				<Divider />

				<Stack my="1rem">
					<Heading as="h3" fontSize="xl">
						Members ({PROJECT_DETAILS.members.length})
					</Heading>
					<Stack direction="row" flexWrap="wrap" spacing="2rem">
						{PROJECT_DETAILS.members.map((m, index) => (
							<Avatar key={`project-member-${index}`} user={m} showName />
						))}
					</Stack>
				</Stack>

				<Divider />

				<Stack my="1rem">
					<Heading as="h3" fontSize="xl">
						Tasks ({PROJECT_DETAILS.tasks.length})
					</Heading>

					{PROJECT_DETAILS.tasks.length > 0 ? (
						<TableContainer>
							<Table variant="simple">
								<Thead>
									<Tr>
										<Th>Task</Th>
										<Th>Assigned to</Th>
										<Th>Sprint</Th>
										<Th>Priority</Th>
										<Th>Status</Th>
										<Th>Due date</Th>
									</Tr>
								</Thead>
								<Tbody>
									{PROJECT_DETAILS.tasks.map((task) => (
										<Tr
											key={`project-task-${task._id}`}
											fontSize="sm"
											_hover={{ backgroundColor: 'gray.100' }}
										>
											<Td>
												<HoveredLink to={`/tasks/${task._id}`}>{task.title}</HoveredLink>
											</Td>
											<Td>
												<Avatar user={task.assignedTo} size="sm" showName />
											</Td>
											<Td>
												<HoveredLink to={`/sprints?sprintId=${task.sprint._id}`}>
													{task.sprint.name}
												</HoveredLink>
											</Td>
											<Td>
												<Badge colorScheme={getPriorityColour(task.priority)}>
													{task.priority}
												</Badge>
											</Td>
											<Td>
												<Badge colorScheme={getStatusColour(task.status)}>{task.status}</Badge>
											</Td>
											<Td>{task.dueDate ? dayjs(task.dueDate).format(DATE_FORMAT) : '-'}</Td>
										</Tr>
									))}
								</Tbody>
							</Table>
						</TableContainer>
					) : (
						<Text>
							This project has no tasks.{' '}
							<Link to="/tasks" style={{ textDecoration: 'underline' }}>
								Visit the tasks page
							</Link>{' '}
							to create one, and assign it to this project.
						</Text>
					)}
				</Stack>
			</LayoutDashboard>
		</main>
	);
};

export default ProjectPage;
