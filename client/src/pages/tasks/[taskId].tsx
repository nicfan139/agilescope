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
	Text,
	useDisclosure
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import dayjs from 'dayjs';
import { Avatar, BackButton, LayoutDashboard } from '@/components';
import { DATE_FORMAT } from '@/constants';
import { useUserContext } from '@/contexts';
import { TaskForm } from '@/forms';
import { useTaskDetails } from '@/hooks';
import { getComplexityColour, getFullName, getPriorityColour, getStatusColour } from '@/helpers';

export const Head: HeadFC = () => <title>Task | AgileScope</title>;

const TaskPage = ({ params }: PageProps): React.ReactElement => {
	const { taskId } = params;
	const { isLoading, data } = useTaskDetails(taskId);
	const { currentUser } = useUserContext();
	const { isOpen, onOpen, onClose } = useDisclosure();

	if (isLoading || !data) {
		return <Spinner size="xl" color="green" />;
	}

	const TASK_DETAILS = data?.task as TTask;
	const TASK_OWNER = TASK_DETAILS?.createdBy;
	const CURRENT_USER_OWNS_TASK = currentUser?._id === TASK_OWNER?._id;

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
							Task:
						</Text>

						<Heading as="h1" size="2xl" mb="0.25rem">
							{TASK_DETAILS.title}
						</Heading>

						<Box fontSize="xs" fontStyle="italic">
							<Text>
								Created by {getFullName(TASK_OWNER)} on{' '}
								{dayjs(TASK_DETAILS.createdAt).format(DATE_FORMAT)}
							</Text>
							<Text>
								Last updated on {dayjs(TASK_DETAILS.updatedAt).format('YYYY-MM-DD hh:mm a')}
							</Text>
						</Box>
					</Box>

					{CURRENT_USER_OWNS_TASK && (
						<Button
							colorScheme="green"
							leftIcon={<EditIcon />}
							onClick={onOpen}
							ml={{ base: 0, md: '2rem' }}
						>
							Update
						</Button>
					)}
				</Box>

				<TaskForm {...{ isOpen, onClose, task: TASK_DETAILS }} />

				<Text fontSize="lg" color="gray.500" mb="1rem">
					{TASK_DETAILS.description || 'No description for this task'}
				</Text>

				<Divider />

				<Box display="flex" flexWrap="wrap" gap={{ base: '2rem', md: '4rem' }} my="1rem">
					<Stack justifyContent="space-between" alignItems="flex-start">
						<Heading as="h3" fontSize="xl">
							Assigned to
						</Heading>

						<Avatar user={TASK_DETAILS.assignedTo} size="sm" showName />
					</Stack>

					<Stack justifyContent="space-between" alignItems="flex-start">
						<Heading as="h3" fontSize="xl">
							Project
						</Heading>

						<Link to={`/projects/${TASK_DETAILS.project._id}`}>{TASK_DETAILS.project.title}</Link>
					</Stack>

					<Stack justifyContent="space-between" alignItems="flex-start">
						<Heading as="h3" fontSize="xl">
							Sprint
						</Heading>

						<Link to={`/sprints?sprintId=${TASK_DETAILS.sprint._id}`}>
							{TASK_DETAILS.sprint.name}
						</Link>
					</Stack>
				</Box>

				<Divider />

				<Box display="flex" flexWrap="wrap" gap={{ base: '2rem', md: '4rem' }} my="1rem">
					<Stack justifyContent="space-between" alignItems="flex-start">
						<Heading as="h3" fontSize="xl">
							Complexity
						</Heading>
						<Badge colorScheme={getComplexityColour(TASK_DETAILS.complexity)}>
							{TASK_DETAILS.complexity}
						</Badge>
					</Stack>

					<Stack justifyContent="space-between" alignItems="flex-start">
						<Heading as="h3" fontSize="xl">
							Priority
						</Heading>
						<Badge colorScheme={getPriorityColour(TASK_DETAILS.priority)}>
							{TASK_DETAILS.priority}
						</Badge>
					</Stack>

					<Stack justifyContent="space-between" alignItems="flex-start">
						<Heading as="h3" fontSize="xl">
							Status
						</Heading>
						<Badge colorScheme={getStatusColour(TASK_DETAILS.status)}>{TASK_DETAILS.status}</Badge>
					</Stack>

					<Stack justifyContent="space-between" alignItems="flex-start">
						<Heading as="h3" fontSize="xl">
							Due date
						</Heading>

						<Text>
							{TASK_DETAILS.dueDate ? dayjs(TASK_DETAILS.dueDate).format(DATE_FORMAT) : '-'}
						</Text>
					</Stack>

					{TASK_DETAILS.completedAt && (
						<Stack justifyContent="space-between" alignItems="flex-start">
							<Heading as="h3" fontSize="xl">
								Completed at
							</Heading>

							<Text>{dayjs(TASK_DETAILS.completedAt).format(DATE_FORMAT)}</Text>
						</Stack>
					)}
				</Box>
			</LayoutDashboard>
		</main>
	);
};

export default TaskPage;
