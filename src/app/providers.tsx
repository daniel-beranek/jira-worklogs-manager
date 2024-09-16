'use client';

import { NextUIProvider } from '@nextui-org/react';
import { type ReactNode, useEffect } from 'react';
import { I18nProvider } from '@react-aria/i18n';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const AppProviders = ({ children }: Readonly<{ children: ReactNode }>) => {
	const [holidayCountry, setHolidayCountry] = useLocalStorage('holidayCountry', '');
	useEffect(() => {
		document.cookie = `holidayCountry=${holidayCountry}`;
	}, [holidayCountry]);

	return (
		<I18nProvider>
			<NextUIProvider>{children}</NextUIProvider>
		</I18nProvider>
	);
};
export default AppProviders;
