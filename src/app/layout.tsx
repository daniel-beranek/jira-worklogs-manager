import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AppProviders from './providers';
import { type ReactNode } from 'react';
import Header from '@/app/_components/Header';
import Toaster from '@/app/_components/Toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Jira Worklogs Manager',
	description: 'Manage your Jira work logs in one simple dashboard'
};

const AppLayout = ({
	children
}: Readonly<{
	children: ReactNode;
}>) => {
	return (
		<html
			lang="en"
			className="light">
			<body className={inter.className}>
				<AppProviders>
					<Header />
					<main className="container mx-auto px-2">{children}</main>
					<Toaster />
				</AppProviders>
			</body>
		</html>
	);
};
export default AppLayout;
