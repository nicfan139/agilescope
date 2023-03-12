export const getComplexityColour = (complexity: TComplexityValue) => {
	switch (complexity) {
		case 'easy':
			return 'cyan';
		case 'medium':
			return 'yellow';
		case 'hard':
			return 'red';
	}
};

export const getPriorityColour = (priority: TPriorityValue) => {
	switch (priority) {
		case 'low':
			return 'cyan';
		case 'medium':
			return 'yellow';
		case 'high':
			return 'orange';
		case 'urgent':
			return 'red';
	}
};

export const getStatusColour = (status: TStatusValue) => {
	switch (status) {
		case 'ready':
			return 'cyan';
		case 'in-progress':
			return 'yellow';
		case 'review':
			return 'blue';
		case 'completed':
			return 'green';
	}
};
