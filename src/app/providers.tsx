'use client';

import { NextUIProvider } from '@nextui-org/react';
import { type ReactNode, useEffect } from 'react';
import { I18nProvider } from '@react-aria/i18n';
import { useLocalStorage } from '@/lib/hooks';
import { ThemeProvider } from 'next-themes';

const AppProviders = ({ children }: Readonly<{ children: ReactNode }>) => {
	const [holidayCountry] = useLocalStorage('holidayCountry', '');
	useEffect(() => {
		document.cookie = `holidayCountry=${holidayCountry}`;
	}, [holidayCountry]);

	return (
		<I18nProvider>
			<NextUIProvider>
				<ThemeProvider
					attribute="class"
					enableSystem>
					{children}
				</ThemeProvider>
			</NextUIProvider>
		</I18nProvider>
	);
};
export default AppProviders;
