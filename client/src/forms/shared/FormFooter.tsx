import React from 'react';
import { Button, Divider, DrawerFooter } from '@chakra-ui/react';

interface IFormFooterProps {
	onClose: () => void;
	isSubmitting: boolean;
}

const FormFooter = ({ onClose, isSubmitting }: IFormFooterProps): React.ReactElement => (
	<>
		<Divider />

		<DrawerFooter>
			<Button size="lg" variant="ghost" colorScheme="green" onClick={onClose}>
				Cancel
			</Button>

			<Button
				type="submit"
				size="lg"
				variant="solid"
				colorScheme="green"
				isLoading={isSubmitting}
				isDisabled={isSubmitting}
			>
				Submit
			</Button>
		</DrawerFooter>
	</>
);

export default FormFooter;
