export const getAccessToken = () => localStorage.getItem('agileScope-accessToken');

export const handleLogout = () => {
	localStorage.removeItem('agileScope-accessToken');
	window.location.href = '/login';
};
