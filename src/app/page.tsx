'use client';

import Link from 'next/link';
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
import { useEffect, useMemo, useState } from 'react';
import { endOfMonth, getLocalTimeZone, startOfMonth, today } from '@internationalized/date';
import { fetchWorklogs } from '@/app/actions';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function App() {
	const [api, setApi] = useState('');
	const [user, setUser] = useState('');
	const [token, setToken] = useState('');
	const [dateRange, setDateRange] = useState<RangeValue<DateValue>>({
		start: startOfMonth(today(getLocalTimeZone())),
		end: endOfMonth(today(getLocalTimeZone()))
	});
	const [loading, setLoading] = useState(false);

	const [worklogs, setWorklogs] = useState<unknown[]>([]);

	const [apiStorage, setApiStorage] = useLocalStorage('api', '');
	const [userStorage, setUserStorage] = useLocalStorage('user', '');
	const [tokenStorage, setTokenStorage] = useLocalStorage('token', '');

	useEffect(() => {
		setApi(apiStorage);
	}, [apiStorage]);
	useEffect(() => {
		setUser(userStorage);
	}, [userStorage]);
	useEffect(() => {
		setToken(tokenStorage);
	}, [tokenStorage]);

	useEffect(() => {
		console.log(worklogs);
	}, [worklogs]);

	const handleFetch = async () => {
		setLoading(true);

		const worklogsBuffer = await fetchWorklogs(api, user, token, dateRange.start.toString(), dateRange.end.toString());

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
