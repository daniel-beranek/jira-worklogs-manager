import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

// Currently only redirects to worklogs or configuration pages
const AppPage = () => {
	const token = cookies().get('token');
	const url = cookies().get('url');
	const user = cookies().get('user');
	if (typeof url === 'undefined' || typeof user === 'undefined' || typeof token === 'undefined')
		redirect('/configuration');
	redirect('/worklogs');
};
export default AppPage;
