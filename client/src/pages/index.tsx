import React from 'react';
import type { HeadFC } from 'gatsby';
import { Spinner } from '@chakra-ui/react';
import { LayoutCenter } from '@/components';

export const Head: HeadFC = () => <title>AgileScope</title>;

const IndexPage = (): React.ReactElement => {
	return (
		<main>
			<LayoutCenter>
				<Spinner size="xl" color="green" />
			</LayoutCenter>
		</main>
	);
};

export default IndexPage;
