'use client';

import {
	Button,
	Chip,
	DateRangePicker,
	type DateValue,
	getKeyValue,
	type RangeValue,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow
} from '@nextui-org/react';
import { useMemo, useState } from 'react';
import { endOfMonth, getLocalTimeZone, startOfMonth, today } from '@internationalized/date';
import { getIssuesContainingRequestedWorklogs, getRequestedWorklogs } from './actions';
import Link from 'next/link';

const WorklogsPage = () => {
	const [dateRange, setDateRange] = useState<RangeValue<DateValue>>({
		start: startOfMonth(today(getLocalTimeZone())),
		end: endOfMonth(today(getLocalTimeZone()))
	});

	const [issues, setIssues] = useState<Awaited<ReturnType<typeof getIssuesContainingRequestedWorklogs>>>([]);
	const [worklogs, setWorklogs] = useState<Awaited<ReturnType<typeof getRequestedWorklogs>>>({});

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
			key: 'issues',
			label: 'ISSUES'
		}
	];

	const rows = useMemo(() => {
		return Object.entries(worklogs)
			.map(([date, worklogs]) => {
				const formatedDate = new Date(date).toLocaleDateString();

				const timeSpentSeconds = worklogs.reduce((acc, v) => acc + (v.timeSpentSeconds ?? 0), 0);
				const timeSpentHours = Math.floor(timeSpentSeconds / 3600);
				const timeSpentMinutes = Math.floor((timeSpentSeconds % 3600) / 60);
				const timeSpent = `${timeSpentHours}h${timeSpentMinutes > 0 ? ` ${timeSpentMinutes}m` : ''}`;

				return {
					key: date,
					date: formatedDate,
					timeSpent,
					issues: (
						<ul className="flex gap-1">
							{worklogs.map((worklog) => {
								const worklogIssue = issues.find((v) => v.id === worklog.issueId);
								if (!worklogIssue) return <li key={worklog.id}>Issue for worklog ${worklog.id} not found</li>;
								return (
									<li key={worklog.id}>
										{worklog.self && URL.canParse(worklog.self) ? (
											<Link
												target="_blank"
												rel="noopener noreferrer"
												href={`https://${new URL(worklog.self).hostname}/browse/${worklogIssue.key}`}>
												<Chip variant="flat">{worklogIssue.key}</Chip>
											</Link>
										) : (
											<Chip variant="light">{worklogIssue.key}</Chip>
										)}
									</li>
								);
							})}
						</ul>
					)
				};
			})
			.sort((a, b) => a.key.localeCompare(b.key));
	}, [worklogs, issues]);
	return (
		<div>
			<DateRangePicker
				label="Date range"
				className="max-w-xs"
				visibleMonths={2}
				value={dateRange}
				onChange={setDateRange}
			/>

			<Button
				onClick={async () => {
					const issuesRes = await getIssuesContainingRequestedWorklogs(dateRange.start.toString(), dateRange.end.toString());
					setIssues(issuesRes);
					const worklogsRes = await getRequestedWorklogs(dateRange.start.toString(), dateRange.end.toString(), issuesRes);
					setWorklogs(worklogsRes);
				}}
				color="primary">
				Fetch
			</Button>

			<Table aria-label="Worklog table">
				<TableHeader columns={columns}>
					{(column) => (
						<TableColumn
							align="center"
							//allowsSorting={column.key === 'date'}
							key={column.key}>
							{column.label}
						</TableColumn>
					)}
				</TableHeader>
				<TableBody
					items={rows}
					emptyContent="Click 'Fetch' to get worklogs">
					{(item) => <TableRow key={item.key}>{(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}</TableRow>}
				</TableBody>
			</Table>
		</div>
	);
};
export default WorklogsPage;
