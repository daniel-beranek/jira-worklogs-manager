'use client';

import {
	Input,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	Button,
	DateRangePicker,
	type DateValue,
	type RangeValue,
	getKeyValue
} from '@nextui-org/react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useEffect, useMemo, useState } from 'react';
import { endOfMonth, getLocalTimeZone, startOfMonth, today } from '@internationalized/date';

export default function App() {
	const [apiStorage, setApiStorage] = useLocalStorage('api', '');
	const [userStorage, setUserStorage] = useLocalStorage('user', '');
	const [tokenStorage, setTokenStorage] = useLocalStorage('token', '');

	const [api, setApi] = useState(apiStorage);
	const [user, setUser] = useState(userStorage);
	const [token, setToken] = useState(tokenStorage);
	const [dateRange, setDateRange] = useState<RangeValue<DateValue>>({
		start: startOfMonth(today(getLocalTimeZone())),
		end: endOfMonth(today(getLocalTimeZone()))
	});
	const [loading, setLoading] = useState(false);

	const [worklogs, setWorklogs] = useState<unknown[]>([]);

	useEffect(() => {
		console.log(worklogs);
	}, [worklogs]);

	const handleFetch = async () => {
		setLoading(true);
		const worklogsBuffer: unknown[] = [];
		try {
			const issuesWithRequestedWorklogsRes = await fetch(
				`https://${api}/search?jql=worklogAuthor = "${user}" AND worklogDate > ${dateRange.start.toString()} AND worklogDate < ${dateRange.end.toString()}`,
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
					const issueWorklogsRes = await fetch(`jira-proxy/issue/${issue.key}/worklog`, {
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
								Date.parse(issueWorklog.started) > Date.parse(dateRange.start.toString()) &&
								Date.parse(issueWorklog.started) < Date.parse(dateRange.end.toString())
						)
					);
				})
			);

			setWorklogs(
				worklogsBuffer.reduce<any>((acc, v) => {
					const worklogDate = new Date(v.started).toLocaleDateString();
					if (!acc[worklogDate]) {
						acc[worklogDate] = [];
					}
					acc[worklogDate].push(v);
					return acc;
				}, {})
			);
		} catch (error) {
			console.error(error);
		}
		setLoading(false);
	};

	const columns = [
		{
			key: 'date',
			label: 'DATE'
		},
		{
			key: 'timeSpent',
			label: 'TIME SPENT'
		},
		{
			key: 'worklogs',
			label: 'WORKLOGS'
		}
	];

	const rows = useMemo(() => {
		return Object.entries(worklogs).map(([date, worklogs]) => {
			return {
				key: date,
				date,
				timeSpent: worklogs.reduce((acc, v) => acc + v.timeSpentSeconds, 0),
				worklogs: worklogs.map((worklog) => worklog.id).join()
			};
		});
	}, [worklogs]);

	if (loading) return <div>Loading...</div>;

	return (
		<div>
			<Input
				type="url"
				label="API"
				placeholder="nextui.org"
				startContent={
					<div className="pointer-events-none flex items-center">
						<span className="text-small text-default-400">https://</span>
					</div>
				}
				value={api}
				onChange={(e) => setApi(e.target.value)}
			/>
			<Button
				onClick={() => setApiStorage(api)}
				color="primary">
				Submit
			</Button>

			<Input
				type="text"
				label="User"
				placeholder="John Doe"
				value={user}
				onChange={(e) => setUser(e.target.value)}
			/>

			<Button
				onClick={() => setUserStorage(user)}
				color="primary">
				Submit
			</Button>

			<Input
				type="text"
				label="Token"
				placeholder="abcdefgh"
				value={token}
				onChange={(e) => setToken(e.target.value)}
			/>

			<Button
				onClick={() => setTokenStorage(token)}
				color="primary">
				Submit
			</Button>

			<DateRangePicker
				label="Date range"
				className="max-w-xs"
				visibleMonths={2}
				value={dateRange}
				onChange={setDateRange}
			/>

			<Button
				onClick={handleFetch}
				color="primary">
				Fetch
			</Button>

			<Table aria-label="Worklog table">
				<TableHeader columns={columns}>{(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}</TableHeader>
				<TableBody items={rows}>
					{(item) => <TableRow key={item.key}>{(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}</TableRow>}
				</TableBody>
			</Table>
		</div>
	);
}
