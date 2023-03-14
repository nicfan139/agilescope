type TUser = {
	_id: string;
	email: string;
	firstName: string;
	lastName: string;
	avatarUrl?: string;
};

type TProject = {
	_id: string;
	title: string;
	description: string;
	complexity: TComplexityValue;
	priority: TPriorityValue;
	status: TStatusValue;
	createdBy: TUser;
	members: Array<TUser>;
	tasks: Array<unknown>;
	startedAt?: string;
	completedAt?: string;
	dueDate?: string;
	createdAt: string;
	updatedAt: string;
};

type TTask = {
	_id: string;
	title: string;
	description: string;
	complexity: TComplexityValue;
	priority: TPriorityValue;
	status: TStatusValue;
	createdBy: TUser;
	assignedTo: TUser;
	project?: TProject;
	sprint?: TSprint;
	subtasks: Array<TUser>;
	dueDate?: string;
	completedAt?: string;
	createdAt: string;
	updatedAt: string;
};

type TSprint = {
	_id: string;
	name: string;
	tasks: Array<TTask>;
	startDate: string;
	endDate: string;
	createdAt: string;
	updatedAt: string;
};

type TComplexityValue = 'easy' | 'medium' | 'hard';
type TPriorityValue = 'low' | 'medium' | 'high' | 'urgent';
type TStatusValue = 'ready' | 'in-progress' | 'review' | 'completed';
