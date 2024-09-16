import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { getDecryptedCookie, setEncryptedCookie } from '@/actions/cookies';
import { toast } from 'react-hot-toast/headless';

export const useCookieInput = (name: string) => {
	const [initialLoading, setInitialLoading] = useState(true);
	const [value, setValue] = useState('');
	const [description, setDescription] = useState('');
	const [isProcessingValue, setIsProcessingValue] = useState(false);
	const [debouncedValue, isDebouncingValue] = useDebounce(value);

	useEffect(() => {
		(async () => {
			const cookieRes = await getDecryptedCookie({ name });
			if (cookieRes.status === 'success') setValue(cookieRes.data);
			setInitialLoading(false);
		})();
	}, [name]);

	useEffect(() => {
		if (isDebouncingValue) setIsProcessingValue(true);
		else if (debouncedValue !== null)
			(async () => {
				const cookieRes = await getDecryptedCookie({ name });
				if (cookieRes.status === 'success' && cookieRes.data === debouncedValue) setDescription('');
				else setDescription('Value not stored.');
				setIsProcessingValue(false);
			})();
	}, [debouncedValue, isDebouncingValue, name]);

	const handleSubmit = async (value: string) => {
		await setEncryptedCookie({ name, value });
		const res = await getDecryptedCookie({ name });
		if (res.status === 'error') {
			toast.error(
				<p>
					Couldn&apos;t store value{value && <strong> {value}</strong>}, please make sure you have cookies
					allowed in your browser and try again later.
				</p>
			);
		}
		if (res.status === 'success' && res.data === value) {
			setDescription('');
			toast.success(<p>Value{value && <strong> {value}</strong>} stored successfully.</p>);
		}
	};

	return {
		initialLoading,
		value,
		setValue,
		description,
		isProcessingValue,
		handleSubmit
	};
};
