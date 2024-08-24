'use server';
import { getCookie } from '@/actions/cookies';

export const getIssuesContainingRequestedWorklogs = async (dateStart: string, dateEnd: string) => {
	const api = await getCookie('api');
	if (typeof api === 'undefined') throw new Error('api cookie not found');
	const user = await getCookie('user');
	if (typeof user === 'undefined') throw new Error('user cookie not found');
	const token = await getCookie('token');
	if (typeof token === 'undefined') throw new Error('token cookie not found');

	const res = await fetch(`https://${api}/search?jql=worklogAuthor = "${user}" AND worklogDate > ${dateStart} AND worklogDate < ${dateEnd}`, {
		headers: { Authorization: `Bearer ${token}` }
	});
	const json = await res.json();
	return json.issues;
};

export const getRequestedWorklogs = async (dateStart: string, dateEnd: string, issues: unknown[]) => {
	const api = await getCookie('api');
	if (typeof api === 'undefined') throw new Error('api cookie not found');
	const user = await getCookie('user');
	if (typeof user === 'undefined') throw new Error('user cookie not found');
	const token = await getCookie('token');
	if (typeof token === 'undefined') throw new Error('token cookie not found');

	const worklogsBuffer: unknown[] = [];
	await Promise.all(
		issues.map(async (issue) => {
			// this call should accept query params to filter the results by date and pagination
			// (https://developer.atlassian.com/cloud/jira/platform/rest/v2/api-group-issue-worklogs/#api-rest-api-2-issue-issueidorkey-worklog-get)
			// however it does not seem to work
			const res = await fetch(`https://${api}/issue/${issue.key}/worklog`, {
				headers: { Authorization: `Bearer ${token}` }
			});
			const json = await res.json();
			worklogsBuffer.push(...json.worklogs);
		})
	);
	return worklogsBuffer.reduce<Record<string, unknown[]>>((acc, v) => {
		if (!(v.author.name === user && Date.parse(v.started) > Date.parse(dateStart) && Date.parse(v.started) < Date.parse(dateEnd))) return acc;

		const worklogDate = new Date(v.started).toLocaleDateString();
		if (!acc[worklogDate]) {
			acc[worklogDate] = [];
		}
		acc[worklogDate].push(v);
		return acc;
	}, {});
};
