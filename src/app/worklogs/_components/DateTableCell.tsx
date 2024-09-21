import { Worklogs } from '@/app/worklogs/_actions/getWorklogs';
import { getLocalTimeZone } from '@internationalized/date';
import { useLocale } from '@react-aria/i18n';
import { useMemo } from 'react';

export const DateTableCell = ({ data }: Readonly<{ data: Worklogs[number] }>) => {
	const { locale } = useLocale();

	const { day, date, holidays } = useMemo(() => {
		const dateInstance = new Date(data.date);
		const day = dateInstance.toLocaleDateString(locale, {
			timeZone: getLocalTimeZone(),
			weekday: 'long'
		});
		const date = dateInstance.toLocaleDateString(locale, {
			timeZone: getLocalTimeZone()
		});
		const holidays = data.isHoliday ? data.isHoliday.map((h) => ` - ${h.name}`).join(', ') : '';

		return { day, date, holidays };
	}, [data.date, data.isHoliday, locale]);

	return (
		<div>
			<p>{day}</p>
			<p className="text-tiny text-default-400">
				{date}
				{holidays}
			</p>
		</div>
	);
};
