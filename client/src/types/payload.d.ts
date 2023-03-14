type TProjectPayload = Pick<
	TProject,
	'title' | 'description' | 'complexity' | 'priority' | 'status'
> & {
	createdBy: string;
};

type TTaskPayload = Pick<
	TTask,
	| 'title'
	| 'description'
	| 'complexity'
	| 'priority'
	| 'status'
	| 'project'
	| 'dueDate'
	| 'completedAt'
> & {
	assignedTo: string;
};

type TSprintPayload = Pick<TSprint, 'name' | 'startDate' | 'endDate'>;
