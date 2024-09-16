'use client';

import { Autocomplete, AutocompleteItem, Skeleton } from '@nextui-org/react';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';
import { useEffect, useMemo } from 'react';
import Holidays from 'date-holidays';

const CountryAutocomplete = () => {
	const [selectedHolidayCountry, setSelectedHolidayCountry] = useLocalStorage<string>('holidayCountry', 'init');
	useEffect(() => {
		document.cookie = `holidayCountry=${selectedHolidayCountry}`;
	}, [selectedHolidayCountry]);

	const holidayCountries = useMemo(() => {
		const holidays = new Holidays();
		return Object.entries(holidays.getCountries());
	}, []);

	return (
		<Skeleton
			isLoaded={selectedHolidayCountry !== 'init'}
			className="rounded-lg">
			<Autocomplete
				label="Country for holidays"
				labelPlacement="outside"
				defaultItems={holidayCountries}
				selectedKey={selectedHolidayCountry}
				onSelectionChange={(key) => setSelectedHolidayCountry(String(key))}>
				{([key, value]) => <AutocompleteItem key={key}>{`${value} (${key})`}</AutocompleteItem>}
			</Autocomplete>
		</Skeleton>
	);
};
export default CountryAutocomplete;
