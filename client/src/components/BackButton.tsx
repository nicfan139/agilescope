import React from 'react';
import { navigate } from 'gatsby';
import { Button } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';

const BackButton = (): React.ReactElement => (
	<Button
		onClick={() => navigate(-1)}
		variant="ghost"
		leftIcon={<ChevronLeftIcon boxSize={6} />}
		pl="0.25rem"
		pr="1rem"
	>
		Back
	</Button>
);

export default BackButton;
