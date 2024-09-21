'use server';
import { getMultipleDecryptedCookies } from '@/lib/actions/getMultipleDecryptedCookies';
import { Action, JiraData } from '@/types/types';

export type LoggedWork = {
	date: string;
	timeSpentSeconds: number;
};

const API_VERSION = process.env.API_VERSION;
if (typeof API_VERSION === 'undefined') throw new Error('Missing API_VERSION env variable');

export const logWork: Action<LoggedWork, 'issueKeyOrId' | 'date' | 'timeSpentSeconds'> = async ({
	issueKeyOrId,
	date,
	timeSpentSeconds
}) => {
	try {
		const cookieRes = await getMultipleDecryptedCookies('url', 'token');
		if (cookieRes.status !== 'success') return cookieRes;
		const { url, token } = cookieRes.data;

		const isoString = new Date(date).toISOString();
		const dateString = isoString.slice(0, 10);
		const jiraStarted = `${dateString}T12:00:00.000+0200`;

		const res = await fetch(`https://${url}/rest/api/${API_VERSION}/issue/${issueKeyOrId}/worklog`, {
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
		if (typeof json.started === 'undefined' || typeof json.timeSpentSeconds === 'undefined')
			return {
				status: 'error',
				errors: [
					<p key={'missing response data'}>
						Work logged successfully but was unable to get details back, please{' '}
						<strong>reload the page</strong>
					</p>
				]
			};

		return {
			status: 'success',
			data: {
				timeSpentSeconds: json.timeSpentSeconds,
				date: new Date(json.started).toISOString()
			}
		};
	} catch (e) {
		console.error(e);
		return { status: 'error', errors: ['Something went wrong'] };
	}
};
