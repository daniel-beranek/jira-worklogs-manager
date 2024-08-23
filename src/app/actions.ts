'use server';

export async function fetchWorklogs(api, user, token, dateRangeStart, dateRangeEnd) {
	const worklogsBuffer: unknown[] = [];
	try {
		const issuesWithRequestedWorklogsRes = await fetch(
			`https://${api}/search?jql=worklogAuthor = "${user}" AND worklogDate > ${dateRangeStart} AND worklogDate < ${dateRangeEnd}`,
			{
				headers: { Authorization: `Bearer ${token}` }
			}
		);
		const { startAt, maxResults, total, issues } = await issuesWithRequestedWorklogsRes.json();
		if (total > maxResults) {
			console.warn('Warning: total > maxResults');
		}

		await Promise.all(
			issues.map(async (issue) => {
				// this call should accept query params to filter the results by date and pagination
				// (https://developer.atlassian.com/cloud/jira/platform/rest/v2/api-group-issue-worklogs/#api-rest-api-2-issue-issueidorkey-worklog-get)
				// however it does not seem to work
				const issueWorklogsRes = await fetch(`https://${api}/issue/${issue.key}/worklog`, {
					headers: { Authorization: `Bearer ${token}` }
				});
				const { startAt, maxResults, total, worklogs: issueWorklogs } = await issueWorklogsRes.json();
				if (total > maxResults) {
					console.warn('Warning: total > maxResults');
				}

				worklogsBuffer.push(
					...issueWorklogs.filter(
						(issueWorklog) =>
							issueWorklog.author.name === user &&
							Date.parse(issueWorklog.started) > Date.parse(dateRangeStart) &&
							Date.parse(issueWorklog.started) < Date.parse(dateRangeEnd)
					)
				);
			})
		);
	} catch (error) {
		console.error(error);
	}
	return worklogsBuffer;
}
