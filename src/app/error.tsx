'use client';
import { useEffect } from 'react';
import { Button, CardBody, Card, CardHeader } from '@nextui-org/react';

const AppError = ({ error, reset }: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) => {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<Card className="mx-auto w-fit">
			<CardBody className="flex flex-row items-center justify-center gap-3">
				<h2>Oops, uncaught error occurred 🐛</h2>
				<Button
					color="primary"
					onClick={() => reset()}>
					Try again
				</Button>
			</CardBody>
		</Card>
	);
};
export default AppError;
