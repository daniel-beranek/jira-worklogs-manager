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
import {
	DateTableCell,
	TimeSpentTableCell,
	IssuesTableCell,
	LogWorkTableCell,
	TableTopContent
} from '@/app/worklogs/_components';
import { Worklogs } from '@/app/worklogs/_actions';

const WorklogsPage = () => {
	const [worklogs, setWorklogs] = useState<Worklogs>([]);
	const [isLoading, setIsLoading] = useState(false);

	const columns = [
		{ key: 'date', label: 'DATE' },
		{ key: 'timeSpent', label: 'TIME SPENT' },
		{ key: 'issues', label: 'ISSUES' },
		{ key: 'logWork', label: 'LOG WORK' }
	];

	const rows = useMemo(
		() =>
			worklogs.map((w) => ({
				key: w.date,
				date: <DateTableCell data={w} />,
				timeSpent: <TimeSpentTableCell data={w} />,
				issues: <IssuesTableCell data={w} />,
				logWork: <LogWorkTableCell data={w} />
			})),
		[worklogs]
	);

	return (
		<Table
			shadow="md"
			isHeaderSticky
			aria-label="Worklog table"
			className="max-h-[calc(100dvh-5rem)]"
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
						align={column.key === 'date' ? 'start' : 'center'}
						// minWidth={0}
						width={
							column.key === 'date'
								? '300'
								: column.key === 'timeSpent'
									? '400'
									: column.key === 'issues'
										? '500'
										: column.key === 'logWork'
											? '100'
											: undefined
						}
						// maxWidth={1000}
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
