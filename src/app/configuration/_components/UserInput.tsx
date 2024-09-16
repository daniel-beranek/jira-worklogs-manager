'use client';

import { Button, Input, Skeleton, Spinner } from '@nextui-org/react';
import { useCookieInput } from '@/app/configuration/_hooks/useCookieInput';
import { InfoIcon } from '@nextui-org/shared-icons';

const UserInput = () => {
	const { mounted, value, setValue, description, isProcessingValue, handleSubmit } = useCookieInput('user');

	return (
		<Skeleton
			isLoaded={mounted}
			className="rounded-lg">
			<div
				className="flex gap-2"
				style={{ alignItems: description ? 'center' : 'end' }}>
				<Input
					type="text"
					label="User"
					labelPlacement="outside"
					value={value}
					onChange={(e) => setValue(e.target.value)}
					onKeyDown={(e) => description && e.key === 'Enter' && handleSubmit(value)}
					description={
						description && (
							<span className="flex items-center gap-1">
								<InfoIcon />
								{description}
							</span>
						)
					}
					endContent={isProcessingValue && <Spinner color="default" />}
				/>
				<Button
					onClick={() => handleSubmit(value)}
					isDisabled={!description}
					color="primary">
					Submit
				</Button>
			</div>
		</Skeleton>
	);
};

export default UserInput;
