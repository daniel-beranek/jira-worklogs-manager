import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast/headless';

export const useLocalStorage = <T>(key: string, initialValue: T) => {
	const [storedValue, setStoredValue] = useState<T>(initialValue);

	useEffect(() => {
		setStoredValue(() => {
			try {
				const item = window.localStorage.getItem(key);
				return item ? JSON.parse(item) : initialValue;
			} catch (error) {
				toast.error(
					'This app needs access to local storage to run properly. Please enable it in your browser.',
					{
						duration: 10000
					}
				);
				return initialValue;
			}
		});
	}, [initialValue, key]);

	const setValue = (value: T | ((val: T) => T)) => {
		try {
			const valueToStore = value instanceof Function ? value(storedValue) : value;
			setStoredValue(valueToStore);
			window.localStorage.setItem(key, JSON.stringify(valueToStore));
		} catch (error) {
			toast.error('This app needs access to local storage to run properly. Please enable it in your browser.', {
				duration: 10000
			});
		}
	};
	return [storedValue, setValue] as const;
};
