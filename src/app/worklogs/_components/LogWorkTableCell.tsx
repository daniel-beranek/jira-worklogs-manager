import { EditIcon } from '@nextui-org/shared-icons';
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	TimeInput,
	DateInput
} from '@nextui-org/react';

import { LoggedWork, logWork, Worklogs } from '@/app/worklogs/_actions';
import { useState } from 'react';
import { parseDate, Time } from '@internationalized/date';
import { toast } from 'react-hot-toast/headless';
import classNames from 'classnames';
import { IssuesAutocomplete } from '@/app/worklogs/_components/IssuesAutocomplete';

export const LogWorkTableCell = ({
	data,
	onFetchSuccess,
	isWeekend
}: Readonly<{ data: Worklogs[number]; onFetchSuccess: (data: LoggedWork) => void; isWeekend: boolean }>) => {
	const [isOpen, setIsOpen] = useState(false);
	const [issueKey, setIssueKey] = useState<string | null>(null);
	const [timeValue, setTimeValue] = useState(new Time(0, 0));

	const handleLogWork = async () => {
		if (!issueKey) return toast.error('No issue selected');

		const res = await logWork({
			issueKeyOrId: issueKey,
			date: data.date,
			timeSpentSeconds: `${timeValue.hour * 3600 + timeValue.minute * 60 + timeValue.second}`
		});
		if (res.status === 'success') {
			onFetchSuccess(res.data);
			setIsOpen(false);
			toast.success('Worklog created');
		}
		if (res.status === 'error') res.errors.forEach((error) => toast.error(error));
	};

	const buttonClassnames = classNames({ 'opacity-disabled data-[hover=true]:opacity-45': isWeekend });

	return (
		<>
			<Button
				className={buttonClassnames}
				isIconOnly
				size="sm"
				variant="flat"
				onClick={() => {
					setIsOpen(true);
				}}>
				<EditIcon />
			</Button>
			<Modal
				isOpen={isOpen}
				onOpenChange={() => setIsOpen((prevState) => !prevState)}
				placement="center"
				size="2xl"
				className="m-2">
				<ModalContent>
					<>
						<ModalHeader>Log work</ModalHeader>
						<ModalBody>
							<IssuesAutocomplete onSelectionChange={(key) => setIssueKey(key)} />
							<DateInput
								label={'Worklog date'}
								labelPlacement="outside"
								isReadOnly
								isDisabled
								defaultValue={parseDate(data.date.slice(0, 10))}
							/>
							<TimeInput
								label="Time spent"
								labelPlacement="outside"
								value={timeValue}
								onChange={setTimeValue}
							/>
						</ModalBody>
						<ModalFooter>
							<Button
								color="primary"
								onPress={handleLogWork}>
								Submit
							</Button>
						</ModalFooter>
					</>
				</ModalContent>
			</Modal>
		</>
	);
};
