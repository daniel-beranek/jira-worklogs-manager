import { NextUIProvider } from '@nextui-org/react';
import { type ReactNode } from 'react';
import ContextProvider from '@/Context';

const AppProviders = ({ children }: Readonly<{ children: ReactNode }>) => {
	return (
		<ContextProvider>
			<NextUIProvider>{children}</NextUIProvider>
		</ContextProvider>
	);
};
export default AppProviders;
