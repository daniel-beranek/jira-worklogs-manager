import { useState } from 'react';
import type { DateValue, RangeValue } from '@nextui-org/react';
import { endOfWeek, getLocalTimeZone, startOfWeek, today as todayInternationalized } from '@internationalized/date';
import { useLocale } from '@react-aria/i18n';

export const useDateRange = () => {
	const { locale } = useLocale();

	const today = {
		start: todayInternationalized(getLocalTimeZone()),
		end: todayInternationalized(getLocalTimeZone())
	};

	const thisWeek = {
		start: startOfWeek(todayInternationalized(getLocalTimeZone()), locale),
		end: endOfWeek(todayInternationalized(getLocalTimeZone()), locale)
	};

	const last15Days = {
		start: todayInternationalized(getLocalTimeZone()).subtract({ days: 15 }),
		end: todayInternationalized(getLocalTimeZone())
	};

	const last30Days = {
		start: todayInternationalized(getLocalTimeZone()).subtract({ days: 30 }),
		end: todayInternationalized(getLocalTimeZone())
	};

	const [dateRange, setDateRange] = useState<RangeValue<DateValue>>(last30Days);
	const [selectedDateRange, setSelectedDateRange] = useState<
		'custom' | 'today' | 'thisWeek' | 'last15Days' | 'last30Days'
	>('last30Days');

	const setCustom = (customRange: RangeValue<DateValue>) => {
		setDateRange(customRange);
		setSelectedDateRange('custom');
	};

	const setToday = () => {
		setDateRange(today);
		setSelectedDateRange('today');
	};

	const setThisWeek = () => {
		setDateRange(thisWeek);
		setSelectedDateRange('thisWeek');
	};

	const setLast15Days = () => {
		setDateRange(last15Days);
		setSelectedDateRange('last15Days');
	};

	const setLast30Days = () => {
		setDateRange(last30Days);
		setSelectedDateRange('last30Days');
	};

	return {
		dateRange,
		selectedDateRange,
		setCustom,
		setToday,
		setThisWeek,
		setLast15Days,
		setLast30Days
	};
};
