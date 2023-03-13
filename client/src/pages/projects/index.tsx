import React from 'react';
import { HeadFC, Link } from 'gatsby';
import {
	AvatarGroup,
	Badge,
	Box,
	Button,
	Heading,
	Spinner,
	Stack,
	Text,
	useDisclosure
} from '@chakra-ui/react';
import { AddIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import dayjs from 'dayjs';
import { Avatar, LayoutDashboard } from '@/components';
import { ProjectForm } from '@/forms';
import { getComplexityColour, getPriorityColour, getStatusColour } from '@/helpers';
import { useProjectsList } from '@/hooks';

export const Head: HeadFC = () => <title>Projects | AgileScope</title>;

const ProjectsPage = (): React.ReactElement => {
	const { isLoading, data } = useProjectsList();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const PROJECTS_LIST = data?.projects;

	return (
		<main>
			<LayoutDashboard>
				<Box display="flex" justifyContent="space-between" alignItems="center" mb="1.5rem">
					<Heading as="h1" size="2xl">
						Projects
					</Heading>

					{PROJECTS_LIST && (
						<Button colorScheme="green" leftIcon={<AddIcon />} onClick={onOpen}>
							Add Project
						</Button>
					)}
				</Box>

				<ProjectForm {...{ isOpen, onClose }} />

				{isLoading || !data ? (
					<Spinner size="xl" />
				) : (
					<Box>
						{PROJECTS_LIST.length > 0 ? (
							<Box
								display="flex"
								flexDirection={{ base: 'column', row: 'row' }}
								flexWrap="wrap"
								gap="1.5rem"
							>
								{PROJECTS_LIST.map((project: TProject) => (
									<Link key={`project-card-${project._id}`} to={`/projects/${project._id}`}>
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
													{project.title}
												</Text>

												<Text>Created on: {dayjs(project.createdAt).format('YYYY-MM-DD')}</Text>

												<Stack direction="row" alignItems="center">
													<Text>Members:</Text>
													<AvatarGroup max={3}>
														{project.members.map((m, index) => (
															<Avatar key={`project-member-${index}`} user={m} size="sm" />
														))}
													</AvatarGroup>
												</Stack>

												<Text>Tasks: {project.tasks.length}</Text>
											</Stack>

											<Stack justifyContent="space-between" alignItems="flex-end">
												<Stack alignItems="flex-end">
													<Text>
														Complexity:{' '}
														<Badge colorScheme={getComplexityColour(project.complexity)}>
															{project.complexity}
														</Badge>
													</Text>

													<Text>
														Priority:{' '}
														<Badge colorScheme={getPriorityColour(project.priority)}>
															{project.priority}
														</Badge>
													</Text>

													<Text>
														Status:{' '}
														<Badge colorScheme={getStatusColour(project.status)}>
															{project.status}
														</Badge>
													</Text>
												</Stack>

												<ArrowForwardIcon boxSize={8} />
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

export default ProjectsPage;
