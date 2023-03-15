import React from 'react';
import type { HeadFC, PageProps } from 'gatsby';
import { Heading, Stack, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { LayoutDashboard } from '@/components';

export const Head: HeadFC = () => <title>Dashboard | AgileScope</title>;

const DashboardPage = ({}: PageProps): React.ReactElement => {
	return (
		<main>
			<LayoutDashboard>
				<Heading as="h1" size="2xl" mb="1.5rem">
					Dashboard
				</Heading>

				<Stack direction="row" mb="1rem">
					<Text>Today's date:</Text>
					<Text fontWeight="semibold">{dayjs().format('YYYY-MM-DD')}</Text>
				</Stack>
			</LayoutDashboard>
		</main>
	);
};

export default DashboardPage;
