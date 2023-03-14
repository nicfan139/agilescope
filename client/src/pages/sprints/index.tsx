import React from 'react';
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
	Text,
	useDisclosure
} from '@chakra-ui/react';
import { AddIcon, CheckIcon } from '@chakra-ui/icons';
import { LayoutDashboard } from '@/components';
import { SprintForm } from '@/forms';
import { getFullName, getStatusColour } from '@/helpers';
import { useSprintsList } from '@/hooks';
import dayjs from 'dayjs';

export const Head: HeadFC = () => <title>Sprints | AgileScope</title>;

const SprintsPage = (): React.ReactElement => {
	const { isLoading, data } = useSprintsList();
	const { onOpen, isOpen, onClose } = useDisclosure();

	const SPRINTS_LIST = data?.sprints;

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
						<Stack direction="row" mb="1rem">
							<Text>Today's date:</Text>
							<Text fontWeight="semibold">{dayjs().format('YYYY-MM-DD')}</Text>
						</Stack>

						{SPRINTS_LIST.length > 0 ? (
							<Accordion>
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
										<AccordionPanel pb={4}>
											<Stack>
												<Text fontWeight="semibold">Tasks:</Text>

												<Box>
													{sprint.tasks.length > 0 ? (
														sprint.tasks.map((task) => (
															<Link key={`sprint-task-${task._id}`} to={`/tasks/${task._id}`}>
																<Stack
																	direction="row"
																	justifyContent="space-between"
																	p="0.25rem"
																	_hover={{ bgColor: 'whitesmoke' }}
																>
																	<Stack direction="row" alignItems="center">
																		<CheckIcon
																			color="green"
																			visibility={
																				task.status === 'completed' ? 'visible' : 'hidden'
																			}
																		/>
																		<Text>{task.title}</Text>
																	</Stack>

																	<Stack direction="row" alignItems="center">
																		<Text>{getFullName(task.assignedTo)}</Text>
																		<Badge colorScheme={getStatusColour(task.status)}>
																			{task.status}
																		</Badge>
																	</Stack>
																</Stack>
															</Link>
														))
													) : (
														<Text fontSize="sm" fontStyle="italic">
															No tasks assigned for this sprint
														</Text>
													)}
												</Box>
											</Stack>
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
