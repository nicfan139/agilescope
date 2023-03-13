import React from 'react';
import { Divider, DrawerCloseButton, DrawerHeader, Heading } from '@chakra-ui/react';

interface IFormHeaderProps {
	title: string;
}

const FormHeader = ({ title }: IFormHeaderProps): React.ReactElement => (
	<>
		<DrawerCloseButton size="lg" />
		<DrawerHeader>
			<Heading as="h2" size="xl">
				{title}
			</Heading>
		</DrawerHeader>

		<Divider />
	</>
);

export default FormHeader;
