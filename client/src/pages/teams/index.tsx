import React from 'react';
import { HeadFC, Link } from 'gatsby';
import { Box, Button, Heading, Spinner, Text, useDisclosure } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { LayoutDashboard } from '@/components';
import { TeamForm } from '@/forms';
import { useTeamsList } from '@/hooks';

export const Head: HeadFC = () => <title>Teams | AgileScope</title>;

const TeamsPage = (): React.ReactElement => {
	const { isLoading, data } = useTeamsList();
	const { onOpen, isOpen, onClose } = useDisclosure();

	const TEAMS_LIST = data?.teams;

	return (
		<main>
			<LayoutDashboard>
				<Box display="flex" justifyContent="space-between" alignItems="center" mb="1.5rem">
					<Heading as="h1" size="2xl">
						Teams
					</Heading>

					{TEAMS_LIST && (
						<Button colorScheme="green" leftIcon={<AddIcon />} onClick={onOpen}>
							Add Team
						</Button>
					)}
				</Box>

				<TeamForm {...{ isOpen, onClose }} />

				{isLoading || !data ? (
					<Spinner size="xl" color="green" />
				) : (
					<Box>
						{TEAMS_LIST.length > 0 ? (
							<Box display="flex" flexDirection="column" alignItems="flex-start" gap="1.5rem">
								{TEAMS_LIST.map((team: TTeam) => (
									<Link to={`/teams/${team._id}`}>
										<Box
											p="1rem"
											border="1px solid lightgrey"
											borderRadius="0.375rem"
											transition="all 0.3s"
											_hover={{
												boxShadow: 'lg'
											}}
										>
											<Text fontSize="xl" fontWeight="semibold">
												{team.name}
											</Text>
											<Text>{team.description}</Text>
										</Box>
									</Link>
								))}
							</Box>
						) : (
							<Text>No teams to display. Feel free to create one!</Text>
						)}
					</Box>
				)}
			</LayoutDashboard>
		</main>
	);
};

export default TeamsPage;
