'use client';

import { useToaster } from 'react-hot-toast/headless';
import Toast from '@/app/_components/Toast';
import { useState } from 'react';

const Toaster = () => {
	const [isPaused, setIsPaused] = useState(false);
	const {
		toasts,
		handlers: { startPause, endPause }
	} = useToaster();

	if (!toasts.length) return;

	return (
		<div
			className="container fixed bottom-0 right-0 z-50 flex max-w-md flex-col items-center gap-2 p-2"
			onMouseEnter={() => {
				startPause();
				setIsPaused(true);
			}}
			onMouseLeave={() => {
				endPause();
				setIsPaused(false);
			}}>
			{toasts.map((toast) => (
				<Toast
					key={toast.id}
					toast={toast}
					isPaused={isPaused}
				/>
			))}
		</div>
	);
};
export default Toaster;
