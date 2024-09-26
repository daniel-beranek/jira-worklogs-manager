'use client';

import { Spinner } from '@nextui-org/react';
import { useCallback, useEffect, useState } from 'react';

const AppLoading = () => {
	const getRandomMessage = useCallback(() => {
		const loadingMessages = [
			'Your worklogs are on their way. Almost there!',
			'Worklogs loading... Stay tuned for epic productivity!',
			'Diving into the depths of your JIRA data. Worklogs ahead!',
			'Your worklogs are being summoned from the digital realm.',
			'Unleashing the power of your JIRA worklogs. Stand by!',
			'Your worklogs are taking a scenic route. Enjoy the view!',
			'Your worklogs are being optimized for maximum efficiency. Stand by.',
			'Processing your worklogs. Algorithm engaged.',
			'Worklogs loading... Please hold while we search the galaxy for lost data.',
			"Your worklogs are trapped in a bureaucratic maze. We're working on rescuing them.",
			'Almost there... Just a few more millennia of loading time.',
			'The future of your worklogs is bright. Stay tuned.',
			'Your worklogs are about to fuel your productivity. Get ready to conquer the day!'
		];

		const randomIndex = Math.floor(Math.random() * loadingMessages.length);
		return loadingMessages[randomIndex];
	}, []);

	const [loadingMessage, setLoadingMessage] = useState(getRandomMessage);

	useEffect(() => {
		const interval = setInterval(() => {
			setLoadingMessage(getRandomMessage);
		}, 10 * 1000);
		return () => clearInterval(interval);
	}, [getRandomMessage]);

	return (
		<div className="flex h-[calc(100dvh-5rem)] flex-col items-center justify-center gap-3">
			<p className="text-center text-small">{loadingMessage}</p>
			<Spinner />
		</div>
	);
};
export default AppLoading;
