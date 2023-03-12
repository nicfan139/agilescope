import React from 'react';
import { Link } from 'gatsby';
import {
	Avatar,
	Box,
	Button,
	Divider,
	Drawer,
	DrawerOverlay,
	DrawerCloseButton,
	DrawerContent,
	DrawerHeader,
	DrawerBody,
	DrawerFooter,
	Heading,
	Text,
	StyleProps,
	useDisclosure
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { NAV_LINKS } from '@/constants';
import { useUserContext } from '@/contexts';
import { handleLogout } from '@/helpers';

interface ILayoutProps extends StyleProps {
	children: React.ReactNode;
}

export const LayoutCenter = ({ children, ...otherProps }: ILayoutProps): React.ReactElement => (
	<Box
		position="fixed"
		top={0}
		left={0}
		right={0}
		bottom={0}
		display="flex"
		justifyContent="center"
		alignItems="center"
		backgroundColor="whitesmoke"
		{...otherProps}
	>
		{children}
	</Box>
);

export const LayoutDashboard = ({ children }: ILayoutProps): React.ReactElement => {
	const { currentUser } = useUserContext();
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<Box position="relative" display="flex" h="100vh">
			<Button
				colorScheme="green"
				leftIcon={<HamburgerIcon />}
				onClick={onOpen}
				zIndex="overlay"
				display={{ base: 'flex', md: 'none' }}
				alignItems="center"
				position="absolute"
				top="1rem"
				right="1rem"
			>
				Menu
			</Button>

			<Drawer isOpen={isOpen} placement="right" onClose={onClose} size="lg">
				<DrawerOverlay />
				<DrawerContent>
					<DrawerCloseButton size="lg" />
					<DrawerHeader>
						<Heading as="h2" size="xl">
							AgileScope
						</Heading>
					</DrawerHeader>

					<Divider />

					<Box display="flex" p="1rem">
						<Avatar
							size="md"
							name={`${currentUser?.firstName} ${currentUser?.lastName}`}
							src={currentUser?.avatarUrl}
						/>

						<Box ml="0.5rem">
							<Text>
								{currentUser?.firstName} {currentUser?.lastName}
							</Text>
							<Text>({currentUser?.email})</Text>
						</Box>
					</Box>

					<Divider />

					<DrawerBody display="flex" flexDirection="column" gap="2rem" mt="1rem" fontSize="1.5rem">
						{NAV_LINKS.map(({ label, href }) => (
							<Link to={href}>{label}</Link>
						))}
					</DrawerBody>

					<Divider />

					<DrawerFooter>
						<Button onClick={handleLogout} w="100%">
							Logout
						</Button>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>

			<Box
				display={{
					base: 'none',
					md: 'flex'
				}}
				flexDirection="column"
				justifyContent="space-between"
				h="100%"
				w="240px"
				p="1rem"
				borderRight="1px solid green"
			>
				<Link to="/">
					<Heading as="h2" size="xl">
						AgileScope
					</Heading>
				</Link>

				<Box display="flex" flexDirection="column" gap="1rem" fontSize="1.5rem">
					{NAV_LINKS.map(({ label, href }) => (
						<Link to={href}>{label}</Link>
					))}
				</Box>

				<Box display="flex" flexDirection="column" gap="1rem">
					<Box display="flex">
						<Avatar
							size="md"
							name={`${currentUser?.firstName} ${currentUser?.lastName}`}
							src={currentUser?.avatarUrl}
						/>

						<Box ml="0.5rem">
							<Text>
								{currentUser?.firstName} {currentUser?.lastName}
							</Text>
							<Text>({currentUser?.email})</Text>
						</Box>
					</Box>

					<Button onClick={handleLogout}>Logout</Button>
				</Box>
			</Box>

			<Box h="100%" w="100%" overflowY="auto" p="2rem">
				{children}
			</Box>
		</Box>
	);
};
