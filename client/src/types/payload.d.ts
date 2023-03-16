type TProjectPayload = Pick<
	TProject,
	'title' | 'description' | 'complexity' | 'priority' | 'status'
> & {
	createdBy: string;
	members: Array<string>;
};

type TTaskPayload = Pick<
	TTask,
	'title' | 'description' | 'complexity' | 'priority' | 'status' | 'dueDate' | 'completedAt'
> & {
	assignedTo: string;
	project: string;
	sprint: string;
};

type TSprintPayload = Pick<TSprint, 'name' | 'startDate' | 'endDate'>;

type TTeamPayload = Omit<TTeam, '_id'> & {
	members: Array<string>;
};
