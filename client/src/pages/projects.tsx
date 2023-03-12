import React from 'react';
import type { HeadFC, PageProps } from 'gatsby';
import { Box, Button, Heading, Spinner, Stack, Tag, Text, useDisclosure } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import dayjs from 'dayjs';
import { LayoutDashboard } from '@/components';
import { AddProjectForm } from '@/forms';
import { getComplexityColour, getPriorityColour, getStatusColour } from '@/helpers';
import { useProjectsList } from '@/hooks';

export const Head: HeadFC = () => <title>Projects | AgileScope</title>;

const ProjectsPage = ({}: PageProps): React.ReactElement => {
	const { isLoading, data } = useProjectsList();
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<main>
			<LayoutDashboard>
				<Box display="flex" justifyContent="space-between" alignItems="center" mb="1.5rem">
					<Heading as="h1" size="2xl">
						Projects
					</Heading>

					<Button
						colorScheme="green"
						leftIcon={<AddIcon />}
						onClick={onOpen}
						display={{ base: 'none', md: 'flex' }}
					>
						Add Project
					</Button>
				</Box>

				<AddProjectForm {...{ isOpen, onClose }} />

				{isLoading || !data ? (
					<Spinner size="xl" />
				) : (
					<Box>
						{data.projects.length > 0 ? (
							<Box
								display="flex"
								flexDirection={{ base: 'column', row: 'row' }}
								flexWrap="wrap"
								gap="1.5rem"
							>
								{data.projects.map((project: TProject) => (
									<Box
										w="100%"
										maxW={{
											base: 'unset',
											md: '360px'
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
											<Text>Members: {project.members.length}</Text>
											<Text>Tasks: {project.tasks.length}</Text>
										</Stack>

										<Stack alignItems="flex-end">
											<Text>Created on: {dayjs(project.createdAt).format('YYYY-MM-DD')}</Text>

											<Text>
												Complexity:{' '}
												<Tag colorScheme={getComplexityColour(project.complexity)}>
													{project.complexity}
												</Tag>
											</Text>

											<Text>
												Priority:{' '}
												<Tag colorScheme={getPriorityColour(project.priority)}>
													{project.priority}
												</Tag>
											</Text>

											<Text>
												Status:{' '}
												<Tag colorScheme={getStatusColour(project.status)}>{project.status}</Tag>
											</Text>
										</Stack>
									</Box>
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
