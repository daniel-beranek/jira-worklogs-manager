import { useState, useEffect } from 'react';

export const useDebounce = <T>(value: T, delay: number = 1000 /*1sec*/): [T, boolean] => {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);
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
