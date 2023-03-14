import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import {
	Box,
	Drawer,
	DrawerOverlay,
	DrawerContent,
	DrawerBody,
	FormControl,
	FormLabel,
	Input,
	Select,
	Textarea,
	useToast
} from '@chakra-ui/react';
import { MultiSelect, TMultiSelectOption } from '@/components';
import { COMPLEXITY_OPTIONS, PRIORITY_OPTIONS, STATUS_OPTIONS } from '@/constants';
import { useUserContext } from '@/contexts';
import { getFullName } from '@/helpers';
import { useUsersList, useProjectCreate, useProjectUpdate } from '@/hooks';
import { FormHeader, FormFooter } from './shared';

interface IProjectFormProps {
	isOpen: boolean;
	onClose: () => void;
	project?: TProject;
}

interface IProjectFormState {
	title: string;
	description: string;
	complexity: TComplexityValue;
	priority: TPriorityValue;
	status: TStatusValue;
	members: Array<TMultiSelectOption>;
}

const ProjectForm = ({ isOpen, onClose, project }: IProjectFormProps): React.ReactElement => {
	const { currentUser } = useUserContext();
	const { handleSubmit, register, reset, setValue, watch } = useForm<IProjectFormState>({
		defaultValues: {
			title: project?.title ?? '',
			description: project?.description ?? '',
			complexity: project?.complexity,
			priority: project?.priority,
			status: project?.status,
			members: project?.members?.map((m) => ({ label: getFullName(m), value: m._id })) ?? []
		}
	});
	const { data: usersListData } = useUsersList();
	const projectCreate = useProjectCreate();
	const projectUpdate = useProjectUpdate(project?._id as string);
	const toast = useToast();

	const USERS_LIST = useMemo(() => {
		if (usersListData?.users) {
			return usersListData?.users?.map((user: TUser) => ({
				label: getFullName(user),
				value: user._id
			}));
		}
		return [];
	}, [usersListData]);

	const onSubmit = async (form: IProjectFormState) => {
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
				} as TProjectPayload;

				let data;
				if (project) {
					data = await projectUpdate.mutateAsync(payload);
				} else {
					data = await projectCreate.mutateAsync(payload);
				}

				if (data.project) {
					if (!project) {
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
				const error = e as AxiosError;
				const data = error.response?.data as { errorMessage: string };
				toast({
					status: 'error',
					title: data.errorMessage
				});
			}
		}
	};

	const FORM_STATE = watch();
	const IS_SUBMITTING = projectCreate.isLoading || projectUpdate.isLoading;

	return (
		<Drawer isOpen={isOpen} placement="right" onClose={onClose} size="lg">
			<DrawerOverlay />
			<DrawerContent>
				<FormHeader title={project ? 'Update project' : 'Add a new project'} />

				<form onSubmit={handleSubmit(onSubmit)}>
					<DrawerBody h="100%" maxH="calc(100vh - 160px)" pt="1rem" pb="2rem">
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
											<option key={`project-complexity-option-${value}`} value={value}>
												{label}
											</option>
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
											<option key={`project-priority-option-${value}`} value={value}>
												{label}
											</option>
										))}
									</Select>
								</FormControl>

								<FormControl isRequired>
									<FormLabel>Status</FormLabel>
									<Select placeholder="Select status" {...register('status', { required: true })}>
										{STATUS_OPTIONS.map(({ label, value }) => (
											<option key={`project-status-option-${value}`} value={value}>
												{label}
											</option>
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

					<FormFooter onClose={onClose} isSubmitting={IS_SUBMITTING} />
				</form>
			</DrawerContent>
		</Drawer>
	);
};

export default ProjectForm;
