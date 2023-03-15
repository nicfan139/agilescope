import React from 'react';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import {
	Box,
	Drawer,
	DrawerOverlay,
	DrawerContent,
	DrawerBody,
	FormControl,
	FormLabel,
	Input,
	useToast
} from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import { useSprintCreate, useSprintUpdate } from '@/hooks';
import { FormHeader, FormFooter } from './shared';
import { handleError } from '@/helpers';

interface ISprintFormProps {
	isOpen: boolean;
	onClose: () => void;
	sprint?: TSprint;
}

interface ISprintFormState {
	name: string;
	startDate: Date | null;
	endDate: Date | null;
}

const SprintForm = ({ isOpen, onClose, sprint }: ISprintFormProps): React.ReactElement => {
	const { handleSubmit, register, reset, setValue, watch } = useForm<ISprintFormState>({
		defaultValues: {
			name: sprint?.name,
			startDate: sprint?.startDate ? new Date(sprint.startDate) : null,
			endDate: sprint?.endDate ? new Date(sprint.endDate) : null
		}
	});
	const sprintCreate = useSprintCreate();
	const sprintUpdate = useSprintUpdate(sprint?._id as string);
	const toast = useToast();

	const onSubmit = async (form: ISprintFormState) => {
		if (dayjs(form.startDate).isAfter(form.endDate)) {
			toast({
				status: 'warning',
				title: 'End date must be after the start date'
			});
		} else {
			try {
				const payload = {
					name: form.name,
					startDate: form.startDate?.toISOString(),
					endDate: form.endDate?.toISOString()
				} as TSprintPayload;

				let data;
				if (sprint) {
					data = await sprintUpdate.mutateAsync(payload);
				} else {
					data = await sprintCreate.mutateAsync(payload);
				}

				if (data.sprint) {
					if (!sprint) {
						reset();
					}
					onClose();
				} else {
					toast({
						status: 'error',
						title: data.errorMessage
					});
				}
			} catch (e: unknown) {
				handleError(e);
			}
		}
	};

	const FORM_STATE = watch();
	const IS_SUBMITTING = sprintCreate.isLoading || sprintUpdate.isLoading;

	return (
		<Drawer isOpen={isOpen} placement="right" onClose={onClose} size="lg">
			<DrawerOverlay />
			<DrawerContent>
				<FormHeader title={sprint ? 'Update sprint' : 'Add a new sprint'} />

				<form onSubmit={handleSubmit(onSubmit)}>
					<DrawerBody h="calc(100vh - 160px)" pt="1rem" pb="2rem">
						<Box display="flex" flexDirection="column" gap="1rem">
							<FormControl isRequired>
								<FormLabel>Name</FormLabel>
								<Input
									placeholder={`e.g. "Build new product"`}
									{...register('name', { required: true })}
								/>
							</FormControl>

							<Box display="flex" flexDirection={{ base: 'column', md: 'row' }} gap="1rem">
								<FormControl isRequired>
									<FormLabel>Start date</FormLabel>
									<DatePicker
										placeholderText="Select date"
										dateFormat="yyyy/MM/dd"
										todayButton="Today"
										selected={FORM_STATE.startDate}
										onChange={(date) => setValue('startDate', date)}
										customInput={<Input />}
									/>
								</FormControl>

								<FormControl isRequired>
									<FormLabel>End date</FormLabel>
									<DatePicker
										placeholderText="Select date"
										dateFormat="yyyy/MM/dd"
										todayButton="Today"
										selected={FORM_STATE.endDate}
										onChange={(date) => setValue('endDate', date)}
										customInput={<Input />}
									/>
								</FormControl>
							</Box>
						</Box>
					</DrawerBody>

					<FormFooter onClose={onClose} isSubmitting={IS_SUBMITTING} />
				</form>
			</DrawerContent>
		</Drawer>
	);
};

export default SprintForm;
