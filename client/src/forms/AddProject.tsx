import React from 'react';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import {
	Button,
	Divider,
	Drawer,
	DrawerOverlay,
	DrawerCloseButton,
	DrawerContent,
	DrawerHeader,
	DrawerBody,
	DrawerFooter,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Select,
	Textarea,
	useToast,
	Box
} from '@chakra-ui/react';
import { MultiSelect, TMultiSelectOption } from '@/components';
import { COMPLEXITY_OPTIONS, PRIORITY_OPTIONS, STATUS_OPTIONS } from '@/constants';
import { useUserContext } from '@/contexts';
import { useUsersList, useProjectCreate } from '@/hooks';

interface IAddProjectProps {
	isOpen: boolean;
	onClose: () => void;
}

interface IAddProjectForm {
	title: string;
	description: string;
	complexity: TComplexityValue;
	priority: TPriorityValue;
	status: TStatusValue;
	members: Array<TMultiSelectOption>;
}

const AddProject = ({ isOpen, onClose }: IAddProjectProps): React.ReactElement => {
	const { currentUser } = useUserContext();
	const { handleSubmit, register, reset, setValue, watch } = useForm<IAddProjectForm>({
		defaultValues: {
			members: []
		}
	});
	const { data: usersListData } = useUsersList();
	const projectCreate = useProjectCreate();
	const toast = useToast();

	const onSubmit = async (form: IAddProjectForm) => {
		if (form.members.length === 0) {
			toast({
				status: 'warning',
				title: 'A project must have at least one member'
			});
		} else {
			try {
				const payload = {
					...form,
					createdBy: currentUser?._id as string,
					members: form.members.map((m) => m.value)
				};

				const data = await projectCreate.mutateAsync(payload);

				if (data.project) {
					reset();
					onClose();
				} else {
					toast({
						status: 'error',
						title: data.errorMessage
					});
				}
			} catch (e: unknown) {
				const error = e as AxiosError;
				const data = error.response?.data as { errorMessage: string };
				toast({
					status: 'error',
					title: data.errorMessage
				});
			}
		}
	};

	const USERS_LIST =
		usersListData?.users?.map((user: TUser) => ({
			label: `${user.firstName} ${user.lastName}`,
			value: user._id
		})) ?? [];

	const FORM_STATE = watch();

	return (
		<Drawer isOpen={isOpen} placement="right" onClose={onClose} size="lg">
			<DrawerOverlay />
			<DrawerContent>
				<DrawerCloseButton size="lg" />
				<DrawerHeader>
					<Heading as="h2" size="xl">
						Add a new project
					</Heading>
				</DrawerHeader>

				<Divider />

				<form onSubmit={handleSubmit(onSubmit)}>
					<DrawerBody>
						<Box display="flex" flexDirection="column" gap="1rem">
							<FormControl isRequired>
								<FormLabel>Title</FormLabel>
								<Input
									placeholder={`e.g. "Build new product"`}
									{...register('title', { required: true })}
								/>
							</FormControl>

							<FormControl>
								<FormLabel>Description</FormLabel>
								<Textarea
									placeholder={`e.g. "Based on the list of requirements discussed in the meeting"`}
									{...register('description')}
								/>
							</FormControl>

							<Box display="flex" flexDirection={{ base: 'column', md: 'row' }} gap="1rem">
								<FormControl isRequired>
									<FormLabel>Complexity</FormLabel>
									<Select
										placeholder="Select complexity"
										{...register('complexity', { required: true })}
									>
										{COMPLEXITY_OPTIONS.map(({ label, value }) => (
											<option value={value}>{label}</option>
										))}
									</Select>
								</FormControl>

								<FormControl isRequired>
									<FormLabel>Priority</FormLabel>
									<Select
										placeholder="Select priority"
										{...register('priority', { required: true })}
									>
										{PRIORITY_OPTIONS.map(({ label, value }) => (
											<option value={value}>{label}</option>
										))}
									</Select>
								</FormControl>

								<FormControl isRequired>
									<FormLabel>Status</FormLabel>
									<Select placeholder="Select status" {...register('status', { required: true })}>
										{STATUS_OPTIONS.map(({ label, value }) => (
											<option value={value}>{label}</option>
										))}
									</Select>
								</FormControl>
							</Box>

							<FormControl isRequired display="flex" flexDirection="column" alignItems="flex-start">
								<FormLabel>Members</FormLabel>
								<MultiSelect
									placeholder="Select members"
									selected={FORM_STATE.members}
									options={USERS_LIST}
									onSelect={(option) => setValue('members', [...FORM_STATE.members, option])}
									onUnselect={(option) =>
										setValue(
											'members',
											FORM_STATE.members.filter((m) => m.value !== option.value)
										)
									}
								/>
							</FormControl>
						</Box>
					</DrawerBody>

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
							isLoading={projectCreate.isLoading}
						>
							Submit
						</Button>
					</DrawerFooter>
				</form>
			</DrawerContent>
		</Drawer>
	);
};

export default AddProject;
