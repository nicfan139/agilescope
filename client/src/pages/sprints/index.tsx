import React, { useMemo } from 'react';
import { HeadFC, Link } from 'gatsby';
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
import { AddIcon } from '@chakra-ui/icons';
import { LayoutDashboard } from '@/components';
import { SprintForm } from '@/forms';
import { getFullName, getPriorityColour, getStatusColour } from '@/helpers';
import { useSprintsList } from '@/hooks';
import dayjs from 'dayjs';

export const Head: HeadFC = () => <title>Sprints | AgileScope</title>;

const SprintsPage = (): React.ReactElement => {
	const { isLoading, data } = useSprintsList();
	const { onOpen, isOpen, onClose } = useDisclosure();

	const SPRINTS_LIST = data?.sprints;

	const DEFAULT_OPEN_INDEX = useMemo(() => {
		if (SPRINTS_LIST) {
			if (window.location.search) {
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

				<SprintForm {...{ isOpen, onClose }} />

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
														{dayjs(sprint.startDate).format('YYYY-MM-DD')} to{' '}
														{dayjs(sprint.endDate).format('YYYY-MM-DD')}
													</Text>
												</Stack>

												<AccordionIcon />
											</AccordionButton>
										</h3>
										<AccordionPanel>
											{sprint.tasks.length > 0 ? (
												<TableContainer>
													<Table variant="simple">
														<Thead>
															<Tr>
																<Th>Task</Th>
																<Th>Assigned to</Th>
																<Th>Priority</Th>
																<Th>Status</Th>
															</Tr>
														</Thead>
														<Tbody>
															{sprint.tasks.map((task) => (
																<Tr>
																	<Td>
																		<Link to={`/tasks/${task._id}`}>
																			<Text>{task.title}</Text>
																		</Link>
																	</Td>
																	<Td>
																		<Text>{getFullName(task.assignedTo)}</Text>
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
