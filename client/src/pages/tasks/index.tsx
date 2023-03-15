import React from 'react';
import { HeadFC, navigate } from 'gatsby';
import {
	Badge,
	Box,
	Button,
	Heading,
	Spinner,
	Table,
	TableContainer,
	Thead,
	Th,
	Td,
	Tr,
	Tbody,
	Text,
	useDisclosure
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import dayjs from 'dayjs';
import { Avatar, LayoutDashboard } from '@/components';
import { DATE_FORMAT } from '@/constants';
import { TaskForm } from '@/forms';
import { useTasksList } from '@/hooks/tasks';
import { getPriorityColour, getStatusColour } from '@/helpers';

export const Head: HeadFC = () => <title>Tasks | AgileScope</title>;

const TasksPage = (): React.ReactElement => {
	const { isLoading, data } = useTasksList();
	const { onOpen, isOpen, onClose } = useDisclosure();

	const TASKS_LIST = data?.tasks;

	return (
		<main>
			<LayoutDashboard>
				<Box display="flex" justifyContent="space-between" alignItems="center" mb="1.5rem">
					<Heading as="h1" size="2xl">
						Tasks
					</Heading>

					{TASKS_LIST && (
						<Button colorScheme="green" leftIcon={<AddIcon />} onClick={onOpen}>
							Add Task
						</Button>
					)}
				</Box>

				<TaskForm {...{ isOpen, onClose }} />

				{isLoading || !data ? (
					<Spinner size="xl" color="green" />
				) : (
					<Box>
						{TASKS_LIST.length > 0 ? (
							<TableContainer>
								<Table variant="simple">
									<Thead>
										<Tr>
											<Th>Task</Th>
											<Th>Assigned to</Th>
											<Th>Created on</Th>
											<Th>Due date</Th>
											<Th>Priority</Th>
											<Th>Status</Th>
										</Tr>
									</Thead>
									<Tbody>
										{TASKS_LIST.map((task: TTask) => (
											<Tr
												key={`task-row-${task._id}`}
												onClick={() => navigate(`/tasks/${task._id}`)}
												_hover={{ backgroundColor: 'gray.100', cursor: 'pointer' }}
											>
												<Td>
													<Text>{task.title}</Text>
												</Td>

												<Td>
													<Avatar user={task.assignedTo} size="sm" showName />
												</Td>

												<Td>{dayjs(task.createdAt).format(DATE_FORMAT)}</Td>

												<Td>{task.dueDate ? dayjs(task.dueDate).format(DATE_FORMAT) : '-'}</Td>

												<Td>
													<Badge colorScheme={getPriorityColour(task.priority)}>
														{task.priority}
													</Badge>
												</Td>

												<Td>
													<Badge colorScheme={getStatusColour(task.status)}>{task.status}</Badge>
												</Td>
											</Tr>
										))}
									</Tbody>
								</Table>
							</TableContainer>
						) : (
							<Text>No projects to display. Create one to get started!</Text>
						)}
					</Box>
				)}
			</LayoutDashboard>
		</main>
	);
};

export default TasksPage;
