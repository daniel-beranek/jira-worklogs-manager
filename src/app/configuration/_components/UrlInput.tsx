'use client';

import { Button, Input, Skeleton, Spinner } from '@nextui-org/react';
import { useCookieInput } from '@/app/configuration/_hooks/useCookieInput';
import { InfoIcon } from '@nextui-org/shared-icons';

const UrlInput = () => {
	const { mounted, value, setValue, description, isProcessingValue, handleSubmit } = useCookieInput('url');

	return (
		<Skeleton
			isLoaded={mounted}
			className="rounded-lg">
			<div
				className="flex gap-2"
				style={{ alignItems: description ? 'center' : 'end' }}>
				<Input
					type="url"
					label="URL"
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
					startContent={
						value && (
							<div className="pointer-events-none flex items-center">
								<span className="text-small text-default-400">https://</span>
							</div>
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

export default UrlInput;
