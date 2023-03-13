import React from 'react';
import { HeadFC, Link } from 'gatsby';
import { Box, Button, Heading, Spinner, Stack, Text, useDisclosure } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import dayjs from 'dayjs';
import { Avatar, LayoutDashboard } from '@/components';
import { TaskForm } from '@/forms';
import { useTasksList } from '@/hooks/tasks';
import { getFullName } from '@/helpers';

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
					<Spinner size="xl" />
				) : (
					<Box>
						{TASKS_LIST.length > 0 ? (
							<Box
								display="flex"
								flexDirection={{ base: 'column', row: 'row' }}
								flexWrap="wrap"
								gap="1.5rem"
							>
								{TASKS_LIST.map((task: TTask) => (
									<Link key={`task-card-${task._id}`} to={`/tasks/${task._id}`}>
										<Box
											w={{
												base: '100%',
												md: '400px'
											}}
											display="flex"
											justifyContent="space-between"
											p="1rem"
											border="1px solid lightgrey"
										>
											<Stack direction="column">
												<Text fontSize="2xl" fontWeight="semibold">
													{task.title}
												</Text>

												<Text>Created on: {dayjs(task.createdAt).format('YYYY-MM-DD')}</Text>

												{task.dueDate && (
													<Text>Due date: {dayjs(task.createdAt).format('YYYY-MM-DD')}</Text>
												)}

												<Stack direction="row" alignItems="center">
													<Text>Assigned to:</Text>
													<Stack direction="row" alignItems="center">
														<Avatar user={task.assignedTo} size="sm" />
														<Text>{getFullName(task.assignedTo)}</Text>
													</Stack>
												</Stack>
											</Stack>
										</Box>
									</Link>
								))}
							</Box>
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
