import { useState, useEffect } from 'react';

export const useDebounce = <T>(value: T, delay: number = 500 /*0.5sec*/): [T | null, boolean] => {
	const [debouncedValue, setDebouncedValue] = useState<T | null>(null);
	const [debouncing, setDebouncing] = useState<boolean>(false);

	useEffect(() => {
		setDebouncing(true);
		const timeout = setTimeout(() => {
			setDebouncedValue(value);
			setDebouncing(false);
		}, delay);

		return () => {
			clearTimeout(timeout);
			setDebouncing(false);
		};
	}, [value, delay]);

	return [debouncedValue, debouncing];
};
