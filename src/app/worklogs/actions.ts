'use server';
import { getDecryptedCookie } from '@/actions/cookies';
import { jira200Response } from '@/types/jira.types';

export const getIssuesContainingRequestedWorklogs = async (dateStart: string, dateEnd: string) => {
	const url = await getDecryptedCookie('url');
	if (typeof url === 'undefined') throw new Error('url cookie not found');
	const user = await getDecryptedCookie('user');
	if (typeof user === 'undefined') throw new Error('user cookie not found');
	const token = await getDecryptedCookie('token');
	if (typeof token === 'undefined') throw new Error('token cookie not found');

	const res = await fetch(
		`https://${url}/rest/api/2/search?jql=worklogAuthor = "${user}" AND worklogDate > ${dateStart} AND worklogDate < ${dateEnd}`,
		{
			headers: { Authorization: `Bearer ${token}` }
		}
	);
	const json: jira200Response<'searchForIssuesUsingJql'> = await res.json();
	if (typeof json.issues === 'undefined') throw new Error('issues are undefined');
	return json.issues;
};

export const getRequestedWorklogs = async (
	dateStart: string,
	dateEnd: string,
	issues: Required<jira200Response<'searchForIssuesUsingJql'>>['issues']
) => {
	const url = await getDecryptedCookie('url');
	if (typeof url === 'undefined') throw new Error('url cookie not found');
	const user = await getDecryptedCookie('user');
	if (typeof user === 'undefined') throw new Error('user cookie not found');
	const token = await getDecryptedCookie('token');
	if (typeof token === 'undefined') throw new Error('token cookie not found');

	const worklogsBuffer = await Promise.all(
		issues.map(async (issue) => {
			// this call should accept query params to filter the results by date and pagination
			// (https://developer.atlassian.com/cloud/jira/platform/rest/v2/api-group-issue-worklogs/#api-rest-api-2-issue-issueidorkey-worklog-get)
			// however it does not seem to work
			const res = await fetch(`https://${url}/rest/api/2/issue/${issue.key}/worklog`, {
				headers: { Authorization: `Bearer ${token}` }
			});
			const json: jira200Response<'getIssueWorklog'> = await res.json();
			return json.worklogs;
		})
	);
	return worklogsBuffer.flat().reduce<Record<string, Required<jira200Response<'getIssueWorklog'>>['worklogs']>>((acc, v) => {
		if (!v || !v.author || !v.started) return acc;
		if (!(v.author.name === user && Date.parse(v.started) > Date.parse(dateStart) && Date.parse(v.started) < Date.parse(dateEnd))) return acc;

		const worklogDate = new Date(v.started).toISOString().slice(0, 10);
		if (!acc[worklogDate]) {
			acc[worklogDate] = new Array(v);
			return acc;
		} else {
			acc[worklogDate].push(v);
			return acc;
		}
	}, {});
};
