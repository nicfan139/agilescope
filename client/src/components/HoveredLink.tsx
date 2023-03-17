import React from 'react';
import { Link } from 'gatsby';
import { Text } from '@chakra-ui/react';

interface IHoveredLink {
	to: string;
	children: React.ReactNode;
}

const HoveredLink = ({ to, children }: IHoveredLink): React.ReactElement => (
	<Link to={to}>
		<Text _hover={{ textDecoration: 'underline' }}>{children}</Text>
	</Link>
);

export default HoveredLink;
