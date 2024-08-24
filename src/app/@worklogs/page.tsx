'use client';

import {
	Button,
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
import { useEffect, useMemo, useState } from 'react';
import { endOfMonth, getLocalTimeZone, startOfMonth, today } from '@internationalized/date';
import { getIssuesContainingRequestedWorklogs, getRequestedWorklogs } from './actions';
import Link from 'next/link';

const WorklogsTable = () => {
	const [dateRange, setDateRange] = useState<RangeValue<DateValue>>({
		start: startOfMonth(today(getLocalTimeZone())),
		end: endOfMonth(today(getLocalTimeZone()))
	});

	const [issues, setIssues] = useState<unknown[]>([]);
	const [worklogs, setWorklogs] = useState<Record<string, unknown>>({});

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
				timeSpent: `${worklogs.reduce((acc, v) => acc + v.timeSpentSeconds, 0) / (60 * 60)}h`,
				worklogs: (
					<ul>
						{worklogs.map((worklog) => (
							<li key={worklog.id}>
								<Link href={worklog.self}>{worklog.id}</Link>
							</li>
						))}
					</ul>
				)
			};
		});
	}, [worklogs]);
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
					const hello = await getIssuesContainingRequestedWorklogs(dateRange.start.toString(), dateRange.end.toString());
					setIssues(hello);
					console.log(hello);
					const bye = await getRequestedWorklogs(dateRange.start.toString(), dateRange.end.toString(), hello);
					setWorklogs(bye);
					console.log(bye);
				}}
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
};
export default WorklogsTable;
