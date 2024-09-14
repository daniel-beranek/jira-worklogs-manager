import { useEffect, useMemo, useState } from 'react';
import type { DateValue, RangeValue } from '@nextui-org/react';
import {
	endOfMonth,
	endOfWeek,
	getLocalTimeZone,
	startOfMonth,
	startOfWeek,
	today as todayInternationalized
} from '@internationalized/date';
import { useLocale } from '@react-aria/i18n';

type PredefinedDateRanges = 'today' | 'thisWeek' | 'thisMonth' | 'last15Days' | 'last30Days';
export const useDateRange = () => {
	const { locale } = useLocale();

	const predefinedDateRanges = useMemo<Record<PredefinedDateRanges, RangeValue<DateValue>>>(
		() => ({
			today: {
				start: todayInternationalized(getLocalTimeZone()),
				end: todayInternationalized(getLocalTimeZone())
			},
			thisWeek: {
				start: startOfWeek(todayInternationalized(getLocalTimeZone()), locale),
				end: endOfWeek(todayInternationalized(getLocalTimeZone()), locale)
			},
			thisMonth: {
				start: startOfMonth(todayInternationalized(getLocalTimeZone())),
				end: endOfMonth(todayInternationalized(getLocalTimeZone()))
			},
			last15Days: {
				start: todayInternationalized(getLocalTimeZone()).subtract({ days: 15 }),
				end: todayInternationalized(getLocalTimeZone())
			},
			last30Days: {
				start: todayInternationalized(getLocalTimeZone()).subtract({ days: 30 }),
				end: todayInternationalized(getLocalTimeZone())
			}
		}),
		[locale]
	);

	const [dateRange, _setDateRange] = useState<RangeValue<DateValue>>(predefinedDateRanges.last30Days);
	const [selectedDateRange, setSelectedDateRange] = useState<PredefinedDateRanges | 'custom'>('last30Days');

	const setDateRange = (value: PredefinedDateRanges | RangeValue<DateValue>) => {
		if (typeof value === 'object') _setDateRange(value);
		else _setDateRange(predefinedDateRanges[value]);
	};

	useEffect(() => {
		const entries = Object.entries(predefinedDateRanges) as [
			keyof typeof predefinedDateRanges,
			RangeValue<DateValue>
		][];

		const startFormatted = dateRange.start.toDate(getLocalTimeZone()).getDate();
		const endFormatted = dateRange.end.toDate(getLocalTimeZone()).getDate();

		for (const [key, value] of entries) {
			const predefinedStartFormatted = value.start.toDate(getLocalTimeZone()).getDate();
			const predefinedEndFormatted = value.end.toDate(getLocalTimeZone()).getDate();

			if (startFormatted === predefinedStartFormatted && endFormatted === predefinedEndFormatted) {
				setSelectedDateRange(key);
				break;
			}
			setSelectedDateRange('custom');
		}
	}, [dateRange, predefinedDateRanges]);

	return {
		dateRange,
		selectedDateRange,
		setDateRange
	};
};
