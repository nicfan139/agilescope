import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
	Box,
	Drawer,
	DrawerOverlay,
	DrawerContent,
	DrawerBody,
	FormControl,
	FormLabel,
	Input,
	Textarea,
	useToast
} from '@chakra-ui/react';
import { TMultiSelectOption, MultiSelect } from '@/components';
import { getFullName } from '@/helpers';
import { useUsersList, useTeamCreate, useTeamUpdate } from '@/hooks';
import { FormHeader, FormFooter } from './shared';
import { handleError } from '@/helpers';

interface ITeamFormProps {
	isOpen: boolean;
	onClose: () => void;
	team?: TTeam;
}

interface ITeamFormState {
	name: string;
	description: string;
	members: Array<TMultiSelectOption>;
}

const TeamForm = ({ isOpen, onClose, team }: ITeamFormProps): React.ReactElement => {
	const { handleSubmit, register, reset, setValue, watch } = useForm<ITeamFormState>({
		defaultValues: {
			name: team?.name,
			description: team?.description,
			members: team?.members?.map((m) => ({ label: getFullName(m), value: m._id })) ?? []
		}
	});
	const { data: usersListData } = useUsersList();
	const teamCreate = useTeamCreate();
	const teamUpdate = useTeamUpdate(team?._id as string);
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

	const onSubmit = async (form: ITeamFormState) => {
		if (form.members.length === 0) {
			toast({
				status: 'warning',
				title: 'A team must have at least one member'
			});
		} else {
			try {
				const payload = {
					...form,
					members: form.members.map((m) => m.value)
				} as TTeamPayload;

				let data;
				if (team) {
					data = await teamUpdate.mutateAsync(payload);
				} else {
					data = await teamCreate.mutateAsync(payload);
				}

				if (data.team) {
					if (!team) {
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
				handleError(e, toast);
			}
		}
	};

	const FORM_STATE = watch();
	const IS_SUBMITTING = teamCreate.isLoading || teamUpdate.isLoading;

	return (
		<Drawer isOpen={isOpen} placement="right" onClose={onClose} size="lg">
			<DrawerOverlay />
			<DrawerContent>
				<FormHeader title={team ? 'Update team' : 'Add a new team'} />

				<form onSubmit={handleSubmit(onSubmit)}>
					<DrawerBody h="calc(100vh - 160px)" pt="1rem" pb="2rem">
						<Box display="flex" flexDirection="column" gap="1rem">
							<FormControl isRequired>
								<FormLabel>Name</FormLabel>
								<Input
									placeholder={`e.g. "The main team"`}
									{...register('name', { required: true })}
								/>
							</FormControl>

							<FormControl isRequired>
								<FormLabel>Description</FormLabel>
								<Textarea
									placeholder={`e.g. "This team does important stuff"`}
									{...register('description', { required: true })}
								/>
							</FormControl>

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

export default TeamForm;
