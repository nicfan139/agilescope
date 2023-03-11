import React from 'react';
import { HeadFC } from 'gatsby';
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import { LayoutCenter } from '@/components';

export const Head: HeadFC = () => <title>Not found | AgileScope</title>;

const NotFoundPage = (): React.ReactElement => {
	return (
		<LayoutCenter>
			<Box>
				<Heading as="h1" mb="1rem">
					Page not found
				</Heading>

				<Text mb="1rem">Sorry 😔, we couldn’t find what you were looking for.</Text>

				<Button as="a" href="/" variant="solid" colorScheme="green">
					Return to home
				</Button>
			</Box>
		</LayoutCenter>
	);
};

export default NotFoundPage;
