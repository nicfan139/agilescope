import React, { useState, useMemo } from 'react';
import type { HeadFC } from 'gatsby';
import {
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionIcon,
	AccordionPanel,
	Badge,
	Box,
	Button,
	Heading,
	IconButton,
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
	useDisclosure
} from '@chakra-ui/react';
import { AddIcon, EditIcon } from '@chakra-ui/icons';
import { Avatar, HoveredLink, LayoutDashboard } from '@/components';
import { DATE_FORMAT } from '@/constants';
import { SprintForm } from '@/forms';
import { getPriorityColour, getStatusColour } from '@/helpers';
import { useSprintsList } from '@/hooks';
import dayjs from 'dayjs';

export const Head: HeadFC = () => <title>Sprints | AgileScope</title>;

const SprintsPage = (): React.ReactElement => {
	const { isLoading, data } = useSprintsList();
	const { onOpen, isOpen, onClose } = useDisclosure();

	const [selectedSprint, setSelectedSprint] = useState<TSprint>();

	const SPRINTS_LIST = data?.sprints;

	const DEFAULT_OPEN_INDEX = useMemo(() => {
		if (SPRINTS_LIST) {
			if (typeof window !== 'undefined' && window.location.search) {
				const SPRINT_ID = window.location.search.replace('?sprintId=', '');
				return [SPRINTS_LIST.findIndex((s: TSprint) => s._id === SPRINT_ID)];
			}

			const CURRENT_SPRINT = SPRINTS_LIST.findIndex((s: TSprint) => {
				const currentDate = dayjs();
				return currentDate.isAfter(s.startDate) && currentDate.isBefore(s.endDate);
			});
			if (CURRENT_SPRINT !== -1) {
				return [CURRENT_SPRINT];
			}
			return [];
		}
		return [];
	}, [SPRINTS_LIST]);

	return (
		<main>
			<LayoutDashboard>
				<Box display="flex" justifyContent="space-between" alignItems="center" mb="1.5rem">
					<Heading as="h1" size="2xl">
						Sprints
					</Heading>

					{SPRINTS_LIST && (
						<Button colorScheme="green" leftIcon={<AddIcon />} onClick={onOpen}>
							Add Sprint
						</Button>
					)}
				</Box>

				<SprintForm
					{...{
						isOpen,
						onClose: () => {
							setSelectedSprint(undefined);
							onClose();
						},
						sprint: selectedSprint
					}}
				/>

				{isLoading || !data ? (
					<Spinner size="xl" color="green" />
				) : (
					<Box>
						{SPRINTS_LIST.length > 0 ? (
							<Accordion defaultIndex={DEFAULT_OPEN_INDEX}>
								{SPRINTS_LIST.map((sprint: TSprint, index: number) => (
									<AccordionItem key={`sprint-card-${index}`}>
										<h3>
											<AccordionButton display="flex" justifyContent="space-between">
												<Stack direction="row" alignItems="center">
													<Text fontSize="xl" fontWeight="bold">
														{sprint.name}
													</Text>

													<Text fontSize="sm">
														{dayjs(sprint.startDate).format(DATE_FORMAT)} to{' '}
														{dayjs(sprint.endDate).format(DATE_FORMAT)}
													</Text>
												</Stack>

												<Stack direction="row" alignItems="center">
													<IconButton
														aria-label="edit"
														variant="outline"
														icon={<EditIcon />}
														onClick={() => {
															setSelectedSprint(sprint);
															onOpen();
														}}
													/>
													<AccordionIcon />
												</Stack>
											</AccordionButton>
										</h3>
										<AccordionPanel>
											{sprint.tasks.length > 0 ? (
												<TableContainer>
													<Table variant="simple">
														<Thead>
															<Tr>
																<Th>Task</Th>
																<Th>Project</Th>
																<Th>Assigned to</Th>
																<Th>Priority</Th>
																<Th>Status</Th>
																<Th>Due date</Th>
															</Tr>
														</Thead>
														<Tbody>
															{sprint.tasks.map((task) => (
																<Tr
																	key={`sprint-task-${task._id}`}
																	fontSize="sm"
																	_hover={{ backgroundColor: 'gray.100' }}
																>
																	<Td>
																		<HoveredLink to={`/tasks/${task._id}`} label={task.title} />
																	</Td>
																	<Td>
																		<HoveredLink
																			to={`/projects/${task.project._id}`}
																			label={task.project.title}
																		/>
																	</Td>
																	<Td>
																		<Avatar user={task.assignedTo} size="sm" showName />
																	</Td>
																	<Td>
																		<Badge colorScheme={getPriorityColour(task.priority)}>
																			{task.priority}
																		</Badge>
																	</Td>
																	<Td>
																		<Badge colorScheme={getStatusColour(task.status)}>
																			{task.status}
																		</Badge>
																	</Td>
																	<Td>
																		{task.dueDate ? dayjs(task.dueDate).format(DATE_FORMAT) : '-'}
																	</Td>
																</Tr>
															))}
														</Tbody>
													</Table>
												</TableContainer>
											) : (
												<Text fontSize="sm" fontStyle="italic">
													No tasks assigned for this sprint
												</Text>
											)}
										</AccordionPanel>
									</AccordionItem>
								))}
							</Accordion>
						) : (
							<Text>No sprints to display. Create one to get started!</Text>
						)}
					</Box>
				)}
			</LayoutDashboard>
		</main>
	);
};

export default SprintsPage;
