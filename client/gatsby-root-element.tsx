import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserContextProvider } from './src/contexts';
import 'react-datepicker/dist/react-datepicker.css';

const client = new QueryClient();

const RootElement = ({ children }): React.ReactElement => (
	<QueryClientProvider client={client}>
		<UserContextProvider>{children}</UserContextProvider>
	</QueryClientProvider>
);

export default RootElement;
