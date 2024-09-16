import { Button, ButtonGroup, DateRangePicker, Skeleton } from '@nextui-org/react';
import { getWorklogs, type Worklogs } from '@/app/worklogs/actions';
import { useEffect, useState } from 'react';
import { useDateRange } from '@/app/worklogs/_hooks/useDateRange';

const TableTopContent = ({
	onFetch
}: Readonly<{ onFetch: (params: { data: Worklogs; isLoading: boolean }) => void }>) => {
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);

	const [isLoading, setIsLoading] = useState(false);
	const [data, setData] = useState<Worklogs>([]);

	const { dateRange, setDateRange, selectedDateRange } = useDateRange();

	useEffect(() => {
		onFetch({ data, isLoading });
	}, [data, isLoading, onFetch]);

	return (
		<Skeleton
			isLoaded={mounted}
			className="rounded-lg">
			<div className="flex items-end justify-between gap-2">
				<DateRangePicker
					fullWidth={undefined}
					variant={undefined}
					radius={undefined}
					aria-label="Date range"
					className="max-w-xs"
					visibleMonths={2}
					value={dateRange}
					onChange={setDateRange}
				/>

				<ButtonGroup variant="flat">
					<Button
						color={selectedDateRange === 'today' ? 'primary' : 'default'}
						onClick={() => setDateRange('today')}>
						Today
					</Button>
					<Button
						color={selectedDateRange === 'thisWeek' ? 'primary' : 'default'}
						onClick={() => setDateRange('thisWeek')}>
						This week
					</Button>
					<Button
						color={selectedDateRange === 'thisMonth' ? 'primary' : 'default'}
						onClick={() => setDateRange('thisMonth')}>
						This month
					</Button>
					<Button
						color={selectedDateRange === 'last15Days' ? 'primary' : 'default'}
						onClick={() => setDateRange('last15Days')}>
						Last 15 days
					</Button>
					<Button
						color={selectedDateRange === 'last30Days' ? 'primary' : 'default'}
						onClick={() => setDateRange('last30Days')}>
						Last 30 days
					</Button>
				</ButtonGroup>
				<Button
					onClick={async () => {
						setIsLoading(true);

						const worklogsRes = await getWorklogs({
							dateStart: dateRange.start.toString(),
							dateEnd: dateRange.end.toString()
						});

						if (worklogsRes.status === 'success') {
							setData(worklogsRes.data);
						}

						setIsLoading(false);
					}}
					color="primary">
					Load worklogs
				</Button>
			</div>
		</Skeleton>
	);
};

export default TableTopContent;
