import React, { useRef } from 'react';
import { navigate } from 'gatsby';
import {
	AlertDialog,
	AlertDialogOverlay,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogBody,
	AlertDialogFooter,
	Button,
	Stack,
	useDisclosure,
	useToast
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { handleError } from '@/helpers';
import { useTaskDelete } from '@/hooks';

interface IDeleteTaskDialogProps {
	taskId: string;
	isDisabled: boolean;
}

const DeleteTaskDialog = ({ taskId, isDisabled }: IDeleteTaskDialogProps): React.ReactElement => {
	const { onOpen, isOpen, onClose } = useDisclosure();
	const cancelRef = useRef(null);
	const taskDelete = useTaskDelete();
	const toast = useToast();

	const onDeleteTask = async () => {
		try {
			const res = await taskDelete.mutateAsync(taskId);
			if (res.status === 204) {
				onClose();
				navigate('/tasks');
			} else {
				toast({
					status: 'error',
					title: 'Unable to delete task'
				});
			}
		} catch (e: unknown) {
			handleError(e, toast);
		}
	};

	return (
		<>
			<Button colorScheme="red" leftIcon={<DeleteIcon />} onClick={onOpen} isDisabled={isDisabled}>
				Delete
			</Button>

			<AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize="2xl" fontWeight="bold">
							Delete task
						</AlertDialogHeader>

						<AlertDialogBody>Are you sure? This action cannot be undone.</AlertDialogBody>

						<AlertDialogFooter>
							<Stack direction="row">
								<Button ref={cancelRef} onClick={onClose}>
									Cancel
								</Button>
								<Button
									colorScheme="red"
									onClick={onDeleteTask}
									isLoading={taskDelete.isLoading}
									isDisabled={taskDelete.isLoading}
								>
									Delete
								</Button>
							</Stack>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	);
};

export default DeleteTaskDialog;
