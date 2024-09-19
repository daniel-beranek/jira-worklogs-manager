'use server';
import { getMultipleDecryptedCookies } from '@/lib/actions';
import { Action, JiraData } from '@/types/types';

export type IssuePickerSections = NonNullable<JiraData<'getIssuePickerResource'>['sections']>;

const API_VERSION = process.env.API_VERSION;
if (typeof API_VERSION === 'undefined') throw new Error('Missing API_VERSION env variable');

export const searchIssues: Action<IssuePickerSections, 'query'> = async ({ query }) => {
	try {
		const cookieRes = await getMultipleDecryptedCookies('url', 'token');
		if (cookieRes.status !== 'success') return cookieRes;
		const { url, token } = cookieRes.data;

		const res = await fetch(`https://${url}/rest/api/${API_VERSION}/issue/picker?currentJQL&query=${query}`, {
			headers: { Authorization: `Bearer ${token}` }
		});
		const json: JiraData<'getIssuePickerResource'> = await res.json();
		if (!res.ok) return { status: 'error', errors: json.errorMessages ?? ['Something went wrong'] };

		return {
			status: 'success',
			data: json.sections ?? []
		};
	} catch (e) {
		console.error(e);
		return { status: 'error', errors: ['Something went wrong'] };
	}
};
