import React from 'react';
import { Link } from 'gatsby';
import { Text } from '@chakra-ui/react';

interface IHoveredLink {
	to: string;
	label: string;
}

const HoveredLink = ({ to, label }: IHoveredLink): React.ReactElement => (
	<Link to={to}>
		<Text _hover={{ textDecoration: 'underline' }}>{label}</Text>
	</Link>
);

export default HoveredLink;
