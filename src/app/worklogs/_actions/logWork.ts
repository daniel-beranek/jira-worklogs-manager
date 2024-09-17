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

	const isoString = new Date(date).toISOString();
	const dateString = isoString.slice(0, 10);
	const jiraStarted = `${dateString}T12:00:00.000+0200`;

	const res = await fetch(`https://${url}/rest/api/2/issue/${issueKeyOrId}/worklog`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			timeSpentSeconds,
			started: jiraStarted
		})
	});
	const json: JiraData<'addWorklog', 201> = await res.json();
	if (!res.ok) return { status: 'error', errors: json.errorMessages ?? ['Something went wrong'] };
	console.log('started:', json.started, 'created:', json.created);
	return { status: 'success', data: 'success' };
};
