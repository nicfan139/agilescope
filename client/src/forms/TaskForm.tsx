import React, { useMemo } from 'react';
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
	Select,
	Textarea,
	useToast
} from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import { DATE_FORMAT, COMPLEXITY_OPTIONS, PRIORITY_OPTIONS, STATUS_OPTIONS } from '@/constants';
import { useUserContext } from '@/contexts';
import { getFullName, handleError } from '@/helpers';
import {
	useUsersList,
	useProjectsList,
	useSprintsList,
	useTaskCreate,
	useTaskUpdate
} from '@/hooks';
import { FormHeader, FormFooter } from './shared';

interface ITaskFormProps {
	isOpen: boolean;
	onClose: () => void;
	task?: TTask;
}

interface ITaskFormState {
	title: string;
	description: string;
	complexity: TComplexityValue;
	priority: TPriorityValue;
	status: TStatusValue;
	assignedTo: string;
	project: string;
	sprint: string;
	dueDate?: Date | null;
	completedAt?: Date | null;
}

interface ISelectOption {
	label: string;
	value: string;
}

const TaskForm = ({ isOpen, onClose, task }: ITaskFormProps): React.ReactElement => {
	const { currentUser } = useUserContext();
	const { handleSubmit, register, setValue, reset, watch } = useForm<ITaskFormState>({
		defaultValues: {
			title: task?.title ?? '',
			description: task?.description ?? '',
			complexity: task?.complexity,
			priority: task?.priority,
			status: task?.status,
			assignedTo: task?.assignedTo?._id,
			project: task?.project?._id,
			sprint: task?.sprint?._id,
			dueDate: task?.dueDate ? new Date(task.dueDate) : null,
			completedAt: task?.completedAt ? new Date(task.completedAt) : null
		}
	});
	const { data: usersListData } = useUsersList();
	const { data: projectsListData } = useProjectsList();
	const { data: sprintsListData } = useSprintsList();
	const taskCreate = useTaskCreate();
	const taskUpdate = useTaskUpdate(task?._id as string);
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

	const PROJECTS_LIST = useMemo(() => {
		if (projectsListData?.projects) {
			return projectsListData?.projects?.map((project: TProject) => ({
				label: project.title,
				value: project._id
			}));
		}
		return [];
	}, [projectsListData]);

	const SPRINTS_LIST = useMemo(() => {
		if (sprintsListData?.sprints) {
			return sprintsListData?.sprints?.map((sprint: TSprint) => ({
				label: `${sprint.name} (${dayjs(sprint.startDate).format(DATE_FORMAT)} to ${dayjs(
					sprint.endDate
				).format(DATE_FORMAT)})`,
				value: sprint._id
			}));
		}
		return [];
	}, [sprintsListData]);

	const onSubmit = async (form: ITaskFormState) => {
		try {
			const payload = {
				title: form.title,
				description: form.description,
				complexity: form.complexity,
				priority: form.priority,
				status: form.status,
				assignedTo: form.assignedTo,
				project: form.project,
				sprint: form.sprint,
				...(form.dueDate && {
					dueDate: form.dueDate.toISOString()
				}),
				...(form.completedAt && {
					completedAt: form.completedAt.toISOString()
				}),
				createdBy: currentUser?._id as string
			} as TTaskPayload;

			let data;
			if (task) {
				data = await taskUpdate.mutateAsync(payload);
			} else {
				data = await taskCreate.mutateAsync(payload);
			}

			if (data.task) {
				if (!task) {
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
	};

	const FORM_STATE = watch();
	const IS_SUBMITTING = taskCreate.isLoading || taskUpdate.isLoading;

	return (
		<Drawer isOpen={isOpen} placement="right" onClose={onClose} size="lg">
			<DrawerOverlay />
			<DrawerContent>
				<FormHeader title={task ? 'Update task' : 'Add a new task'} />

				<form onSubmit={handleSubmit(onSubmit)}>
					<DrawerBody h="100%" maxH="calc(100vh - 160px)" pt="1rem" pb="2rem">
						<Box display="flex" flexDirection="column" gap="1rem">
							<FormControl isRequired>
								<FormLabel>Title</FormLabel>
								<Input
									placeholder={`e.g. "Fix the bug"`}
									{...register('title', { required: true })}
								/>
							</FormControl>

							<FormControl>
								<FormLabel>Description</FormLabel>
								<Textarea
									placeholder={`e.g. "These are the steps to recreate the bug..."`}
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
											<option key={`task-complexity-option-${value}`} value={value}>
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
											<option key={`task-priority-option-${value}`} value={value}>
												{label}
											</option>
										))}
									</Select>
								</FormControl>

								<FormControl isRequired>
									<FormLabel>Status</FormLabel>
									<Select placeholder="Select status" {...register('status', { required: true })}>
										{STATUS_OPTIONS.map(({ label, value }) => (
											<option key={`task-status-option-${value}`} value={value}>
												{label}
											</option>
										))}
									</Select>
								</FormControl>
							</Box>

							<FormControl isRequired>
								<FormLabel>Assigned to</FormLabel>
								<Select placeholder="Select user" {...register('assignedTo', { required: true })}>
									{USERS_LIST.map(({ label, value }: ISelectOption) => (
										<option key={`task-assginee-option-${value}`} value={value}>
											{label}
										</option>
									))}
								</Select>
							</FormControl>

							<FormControl isRequired>
								<FormLabel>Project</FormLabel>
								<Select placeholder="Select project" {...register('project', { required: true })}>
									{PROJECTS_LIST.map(({ label, value }: ISelectOption) => (
										<option key={`task-project-option-${value}`} value={value}>
											{label}
										</option>
									))}
								</Select>
							</FormControl>

							<FormControl isRequired>
								<FormLabel>Sprint</FormLabel>
								<Select placeholder="Select sprint" {...register('sprint', { required: true })}>
									{SPRINTS_LIST.map(({ label, value }: ISelectOption) => (
										<option key={`task-sprint-option-${value}`} value={value}>
											{label}
										</option>
									))}
								</Select>
							</FormControl>

							<Box display="flex" flexDirection={{ base: 'column', md: 'row' }} gap="1rem">
								<FormControl>
									<FormLabel>Due date</FormLabel>
									<DatePicker
										placeholderText="Select date"
										dateFormat="yyyy/MM/dd"
										selected={FORM_STATE.dueDate}
										onChange={(date) => setValue('dueDate', date)}
										customInput={<Input />}
									/>
								</FormControl>

								<FormControl visibility={FORM_STATE.status === 'completed' ? 'visible' : 'hidden'}>
									<FormLabel>Completed at</FormLabel>
									<DatePicker
										placeholderText="Select date"
										dateFormat="yyyy/MM/dd"
										selected={FORM_STATE.completedAt}
										onChange={(date) => setValue('completedAt', date)}
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

export default TaskForm;
