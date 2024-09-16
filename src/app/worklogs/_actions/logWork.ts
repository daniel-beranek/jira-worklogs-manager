'use server';
import { getMultipleDecryptedCookies } from '@/lib/actions';
import { Action, JiraData } from '@/types/types';

export const logWork: Action<'success', 'issueKeyOrId' | 'date' | 'timeSpentSeconds'> = async ({
	issueKeyOrId,
	date,
	timeSpentSeconds
}) => {
	const cookieRes = await getMultipleDecryptedCookies('url', 'token');
	if (cookieRes.status !== 'success') return cookieRes;
	const { url, token } = cookieRes.data;

	const address = `https://${url}/rest/api/2/issue/${issueKeyOrId}/worklog`;
	const config = {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			timeSpentSeconds,
			started: new Date(date).toISOString().replace('Z', '-0500')
		})
	};

	const res = await fetch(address, config);
	const json: JiraData<'addWorklog'> = await res.json();
	console.log(json);

	if (!res.ok) return { status: 'error', errors: json.errorMessages ?? [] };
	return { status: 'success', data: 'success' };
};
