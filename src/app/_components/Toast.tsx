'use client';

import { Card, CardBody, Progress } from '@nextui-org/react';
import { CheckIcon, CloseFilledIcon } from '@nextui-org/shared-icons';
import { type Toast as ToastType } from 'react-hot-toast/headless';
import { useEffect, useState } from 'react';

export const Toast = ({ toast, isPaused }: Readonly<{ toast: ToastType; isPaused: boolean }>) => {
	const [intervalTick, setIntervalTick] = useState(0);
	useEffect(() => {
		const interval = setInterval(() => {
			setIntervalTick((prevState) => prevState + 1);
		}, 5);
		return () => clearInterval(interval);
	}, []);

	const [progressValue, setProgressValue] = useState(0);
	useEffect(() => {
		if (isPaused) return;
		setProgressValue((prevState) => prevState + 5);
	}, [intervalTick, isPaused]);

	const [toastTransform, setToastTransform] = useState('translateX(30rem)');

	useEffect(() => {
		let timeout: NodeJS.Timeout | undefined;
		if (toast.visible) {
			timeout = setTimeout(() => {
				setToastTransform('translateX(0rem)');
			}, 50);
		} else setToastTransform('translateX(30rem)');

		return () => clearTimeout(timeout);
	}, [toast.visible]);

	return (
		<Card
			className="w-full"
			style={{
				transition: 'transform 0.75s ease-in-out',
				transform: toastTransform
			}}
			isBlurred={true}
			isHoverable={true}
			{...toast.ariaProps}>
			<CardBody className="flex flex-row items-center gap-3 text-small">
				{toast.type === 'success' && <CheckIcon className="shrink-0 text-2xl text-success-400" />}
				{toast.type === 'error' && <CloseFilledIcon className="shrink-0 text-2xl text-danger-400" />}
				{typeof toast.message === 'function' ? toast.message(toast) : toast.message}
			</CardBody>
			<Progress
				aria-label="toast timeout progress"
				color={toast.type === 'success' ? 'success' : toast.type === 'error' ? 'danger' : undefined}
				value={progressValue}
				maxValue={toast.duration}
				disableAnimation={true}
				size="sm"
			/>
		</Card>
	);
};
