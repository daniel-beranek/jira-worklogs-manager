'use client';
import { useEffect } from 'react';
import { Button, CardBody, Card } from '@nextui-org/react';

const AppError = ({ error, reset }: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) => {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<Card>
			<CardBody>
				<h2 className="mb-2 text-center text-lg text-red-400">Oops, uncaught error occurred :o</h2>
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
