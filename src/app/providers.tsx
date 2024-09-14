'use client';

import { NextUIProvider } from '@nextui-org/react';
import { type ReactNode } from 'react';
import { I18nProvider } from '@react-aria/i18n';

const AppProviders = ({ children }: Readonly<{ children: ReactNode }>) => {
	return (
		<I18nProvider>
			<NextUIProvider>{children}</NextUIProvider>
		</I18nProvider>
	);
};
export default AppProviders;
