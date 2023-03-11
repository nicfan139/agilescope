import React from 'react';
import type { HeadFC, PageProps } from 'gatsby';
import { Heading } from '@chakra-ui/react';
import { LayoutDashboard } from '@/components';

export const Head: HeadFC = () => <title>Tasks | AgileScope</title>;

const TasksPage = ({}: PageProps): React.ReactElement => {
	return (
		<main>
			<LayoutDashboard>
				<Heading as="h1" size="2xl" mb="1.5rem">
					Tasks
				</Heading>

				<p>
					Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ducimus sunt obcaecati deleniti
					eum ut voluptates quasi, dolorum repellendus corrupti quos inventore consectetur itaque,
					labore est officia molestiae placeat pariatur? Veritatis.
				</p>
			</LayoutDashboard>
		</main>
	);
};

export default TasksPage;
