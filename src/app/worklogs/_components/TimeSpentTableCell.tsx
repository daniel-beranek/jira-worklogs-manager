import { Worklogs } from '@/app/worklogs/_actions/getWorklogs';
import { Progress } from '@nextui-org/react';
import { useMemo } from 'react';
import { useLocale } from '@react-aria/i18n';

export const TimeSpentTableCell = ({ data }: Readonly<{ data: Worklogs[number] }>) => {
	const { locale } = useLocale();

	const { value, valueLabel } = useMemo(() => {
		const totalTimeSpentHours = data.totalTimeSpentSeconds / 3600;

		const hours = Math.floor(totalTimeSpentHours);
		const hoursLocaleString = hours.toLocaleString(locale, {
			style: 'unit',
			unit: 'hour',
			unitDisplay: 'short'
		});

		const minutes = Math.floor((data.totalTimeSpentSeconds % 3600) / 60);
		const minutesLocaleString = minutes
			? minutes.toLocaleString(locale, {
					style: 'unit',
					unit: 'minute',
					unitDisplay: 'short'
				})
			: '';

		return {
			value: totalTimeSpentHours,
			valueLabel: `${hoursLocaleString} ${minutesLocaleString}`
		};
	}, [data.totalTimeSpentSeconds, locale]);

	return (
		<Progress
			value={value}
			maxValue={8}
			label={valueLabel}
			className="flex-col-reverse gap-1"
			classNames={{ label: 'text-tiny text-default-400', labelWrapper: 'justify-end' }}
			size="sm"
		/>
	);
};
