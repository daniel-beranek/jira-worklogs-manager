import { Worklogs } from '@/app/worklogs/actions';
import { Progress } from '@nextui-org/react';

const TimeSpentTableCell = ({ data }: Readonly<{ data: Worklogs[number] }>) => {
	return (
		<Progress
			value={data.totalTimeSpentSeconds / 3600}
			maxValue={8}
			aria-label="Time Spent"
			size="sm"
			showValueLabel={true}
			formatOptions={{
				style: 'unit',
				unit: 'hour',
				unitDisplay: 'short',
				maximumFractionDigits: 1
			}}
		/>
	);
};
export default TimeSpentTableCell;
