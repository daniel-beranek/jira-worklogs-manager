import { NextUIProvider } from '@nextui-org/react';
import { type ReactNode } from 'react';

export default function AppProviders({ children }: Readonly<{ children: ReactNode }>) {
	return <NextUIProvider>{children}</NextUIProvider>;
}
