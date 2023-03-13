import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserContextProvider } from './src/contexts';
import 'react-datepicker/dist/react-datepicker.css';

const client = new QueryClient();

export const wrapRootElement = ({ element }): React.ReactElement => (
	<QueryClientProvider client={client}>
		<UserContextProvider>{element}</UserContextProvider>
	</QueryClientProvider>
);
