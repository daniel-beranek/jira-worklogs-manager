'use client';

import {
	getKeyValue,
	Spinner,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow
} from '@nextui-org/react';
import { useState, useMemo } from 'react';
import { type Worklogs } from './actions';
import DateTableCell from '@/app/worklogs/_components/DateTableCell';
import TimeSpentTableCell from '@/app/worklogs/_components/TimeSpentTableCell';
import IssuesTableCell from '@/app/worklogs/_components/IssuesTableCell';
import LogWorkTableCell from '@/app/worklogs/_components/LogWorkTableCell';
import TableTopContent from '@/app/worklogs/_components/TableTopContent';

const WorklogsPage = () => {
	const [worklogs, setWorklogs] = useState<Worklogs>([]);
	const [isLoading, setIsLoading] = useState(false);

	const columns = [
		{ key: 'date', label: 'DATE' },
		{ key: 'timeSpent', label: 'TIME SPENT' },
		{ key: 'issues', label: 'ISSUES' },
		{ key: 'logWork', label: 'LOG WORK' }
	];

	const rows = useMemo(() => {
		return worklogs.map((w) => ({
			key: w.date,
			date: <DateTableCell data={w} />,
			timeSpent: <TimeSpentTableCell data={w} />,
			issues: <IssuesTableCell data={w} />,
			logWork: <LogWorkTableCell data={w} />
		}));
	}, [worklogs]);

	return (
		<Table
			aria-label="Worklog table"
			topContent={
				<TableTopContent
					onFetch={({ data, isLoading }) => {
						setWorklogs(data);
						setIsLoading(isLoading);
					}}
				/>
			}>
			<TableHeader columns={columns}>
				{(column) => (
					<TableColumn
						//align="center"
						//allowsSorting={column.key === 'date'}
						key={column.key}>
						{column.label}
					</TableColumn>
				)}
			</TableHeader>
			<TableBody
				items={rows}
				isLoading={isLoading}
				loadingContent={<Spinner />}
				emptyContent="Click 'Fetch' to get worklogs">
				{(item) => (
					<TableRow key={item.key}>
						{(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
};
export default WorklogsPage;
