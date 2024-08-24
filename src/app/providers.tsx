import { NextUIProvider } from '@nextui-org/react';
import { type ReactNode } from 'react';

const AppProviders = ({ children }: Readonly<{ children: ReactNode }>) => {
	return <NextUIProvider>{children}</NextUIProvider>;
};
export default AppProviders;
