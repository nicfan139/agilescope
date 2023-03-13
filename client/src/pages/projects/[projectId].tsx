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
import { EditIcon, ChevronLeftIcon } from '@chakra-ui/icons';
import dayjs from 'dayjs';
import { Avatar, LayoutDashboard } from '@/components';
import { useUserContext } from '@/contexts';
import { ProjectForm } from '@/forms';
import { useProjectDetails } from '@/hooks';
import { getComplexityColour, getPriorityColour, getStatusColour } from '@/helpers';

export const Head: HeadFC = () => <title>Project | AgileScope</title>;

const ProjectPage = ({ params }: PageProps): React.ReactElement => {
	const { projectId } = params;
	const { isLoading, data } = useProjectDetails(projectId);
	const { currentUser } = useUserContext();
	const { isOpen, onOpen, onClose } = useDisclosure();

	if (isLoading || !data) {
		return <Spinner size="xl" />;
	}

	const PROJECT_DETAILS = data?.project as TProject;
	const PROJECT_OWNER = PROJECT_DETAILS?.createdBy;
	const CURRENT_USER_OWNS_PROJECT = currentUser?._id === PROJECT_OWNER?._id;

	return (
		<main>
			<LayoutDashboard>
				<Link to="/projects">
					<Button variant="ghost" leftIcon={<ChevronLeftIcon boxSize={6} />} px="0.25rem">
						Back to projects
					</Button>
				</Link>

				<Box display="flex" justifyContent="space-between" alignItems="center" my="1.5rem">
					<Box>
						<Heading as="h1" size="2xl" mb="0.25rem">
							{PROJECT_DETAILS.title}
						</Heading>

						<Box fontSize="xs" fontStyle="italic">
							<Text>
								Created by {PROJECT_OWNER.firstName} {PROJECT_OWNER.lastName} on{' '}
								{dayjs(PROJECT_DETAILS.createdAt).format('YYYY-MM-DD')}
							</Text>
							<Text>
								Last updated on {dayjs(PROJECT_DETAILS.updatedAt).format('YYYY-MM-DD hh:mm a')}
							</Text>
						</Box>
					</Box>

					{CURRENT_USER_OWNS_PROJECT && (
						<Button
							colorScheme="green"
							leftIcon={<EditIcon />}
							onClick={onOpen}
							display={{ base: 'none', md: 'flex' }}
						>
							Update
						</Button>
					)}
				</Box>

				<ProjectForm {...{ isOpen, onClose, project: PROJECT_DETAILS }} />

				<Text fontSize="lg" color="gray.500" mb="1rem">
					{PROJECT_DETAILS.description}
				</Text>

				<Divider />

				<Stack direction="row" flexWrap="wrap" spacing={{ base: '1rem', md: '2rem' }} my="1rem">
					<Box>
						<Heading as="h3" fontSize="2xl">
							Complexity
						</Heading>
						<Badge colorScheme={getComplexityColour(PROJECT_DETAILS.complexity)}>
							{PROJECT_DETAILS.complexity}
						</Badge>
					</Box>

					<Box>
						<Heading as="h3" fontSize="2xl">
							Priority
						</Heading>
						<Badge colorScheme={getPriorityColour(PROJECT_DETAILS.priority)}>
							{PROJECT_DETAILS.priority}
						</Badge>
					</Box>

					<Box>
						<Heading as="h3" fontSize="2xl">
							Status
						</Heading>
						<Badge colorScheme={getStatusColour(PROJECT_DETAILS.status)}>
							{PROJECT_DETAILS.status}
						</Badge>
					</Box>
				</Stack>

				<Divider />

				<Stack my="1rem">
					<Heading as="h3" fontSize="2xl">
						Members ({PROJECT_DETAILS.members.length})
					</Heading>
					<Stack direction="row" flexWrap="wrap">
						{PROJECT_DETAILS.members.map((m, index) => (
							<Avatar key={`project-member-${index}`} user={m} />
						))}
					</Stack>
				</Stack>

				<Divider />

				<Stack my="1rem">
					<Heading as="h3" fontSize="2xl">
						Tasks ({PROJECT_DETAILS.tasks.length})
					</Heading>
				</Stack>
			</LayoutDashboard>
		</main>
	);
};

export default ProjectPage;
