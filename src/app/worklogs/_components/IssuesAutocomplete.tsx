import { Autocomplete, AutocompleteItem, AutocompleteSection } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { IssuePickerSections, searchIssues } from '@/app/worklogs/_actions/searchIssues';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { toast } from 'react-hot-toast/headless';

export const IssuesAutocomplete = ({ onSelectionChange }: Readonly<{ onSelectionChange: (key: string) => void }>) => {
	const [issuePickerSections, setIssuePickerSections] = useState<IssuePickerSections>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [inputValue, setInputValue] = useState('');
	const [debouncedValue, isDebouncingValue] = useDebounce(inputValue);

	useEffect(() => {
		if (isDebouncingValue) setIsLoading(true);
		else if (debouncedValue !== null)
			(async () => {
				const res = await searchIssues({ query: debouncedValue });
				if (res.status === 'success') setIssuePickerSections(res.data);
				if (res.status === 'error') res.errors.map((error) => toast.error(error));
				setIsLoading(false);
			})();
		else setIsLoading(false);
	}, [debouncedValue, isDebouncingValue]);

	return (
		<Autocomplete
			autoFocus
			label="Search for issue"
			labelPlacement="outside"
			defaultItems={issuePickerSections}
			isLoading={isLoading}
			inputValue={inputValue}
			onInputChange={setInputValue}
			scrollShadowProps={{ visibility: 'bottom' }}
			onSelectionChange={(key) => {
				if (key) onSelectionChange(String(key));
			}}>
			{(issuePickerSection) => (
				<AutocompleteSection
					key={issuePickerSection.id}
					title={issuePickerSection.label}
					classNames={{
						heading: 'flex w-full sticky top-1 z-20 py-1.5 px-2 bg-default-100 shadow-small rounded-small'
					}}>
					{issuePickerSection.issues?.map((issue, i) => (
						<AutocompleteItem key={issue.key ?? i}>
							{`${issue.key} | ${issue.summaryText}`}
						</AutocompleteItem>
					)) ?? []}
				</AutocompleteSection>
			)}
		</Autocomplete>
	);
};
