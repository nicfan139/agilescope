import React from 'react';
import { HeadFC, PageProps } from 'gatsby';
import {
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
import { TeamForm } from '@/forms';
import { useTeamDetails } from '@/hooks';

export const Head: HeadFC = () => <title>Team | AgileScope</title>;

const TeamPage = ({ params }: PageProps): React.ReactElement => {
	const { teamId } = params;
	const { isLoading, data } = useTeamDetails(teamId);
	const { isOpen, onOpen, onClose } = useDisclosure();

	if (isLoading || !data) {
		return <Spinner size="xl" color="green" />;
	}

	const TEAM_DETAILS = data?.team as TTeam;

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
					<Box flexDirection="column">
						<Text fontSize="2xl" fontWeight="semibold">
							Team:
						</Text>
						<Heading as="h1" size="2xl" mb="0.25rem">
							{TEAM_DETAILS.name}
						</Heading>
						<Text fontSize="sm" fontStyle="italic">
							Last updated on {dayjs(TEAM_DETAILS.updatedAt).format('YYYY-MM-DD hh:mm a')}
						</Text>
					</Box>

					<Button
						colorScheme="green"
						leftIcon={<EditIcon />}
						onClick={onOpen}
						ml={{ base: 0, md: '2rem' }}
					>
						Update
					</Button>
				</Box>

				<TeamForm {...{ isOpen, onClose, team: TEAM_DETAILS }} />

				<Text fontSize="lg" color="gray.500" mb="1rem">
					{TEAM_DETAILS.description}
				</Text>

				<Divider />

				<Stack my="1rem">
					<Heading as="h3" fontSize="xl">
						Members ({TEAM_DETAILS.members.length})
					</Heading>
					<Stack direction="row" flexWrap="wrap" spacing="2rem">
						{TEAM_DETAILS.members.map((m, index) => (
							<Avatar key={`team-member-${index}`} user={m} showName />
						))}
					</Stack>
				</Stack>
			</LayoutDashboard>
		</main>
	);
};

export default TeamPage;
