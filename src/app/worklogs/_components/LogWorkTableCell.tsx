import { EditIcon } from '@nextui-org/shared-icons';
import {
	Button,
	Checkbox,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	TimeInput,
	DateInput
} from '@nextui-org/react';
import { logWork, Worklogs } from '@/app/worklogs/_actions';
import { useState } from 'react';
import { parseDate, CalendarDate, Time } from '@internationalized/date';
import { toast } from 'react-hot-toast/headless';

export const LogWorkTableCell = ({ data }: Readonly<{ data: Worklogs[number] }>) => {
	const [isOpen, setIsOpen] = useState(false);
	const [timeValue, setTimeValue] = useState(new Time(0, 1));

	const worklogKey = 'PCFA-150';
	const worklogDate = data.date;
	const worklogTime = timeValue.hour * 3600 + timeValue.minute * 60 + timeValue.second;

	const handleSubmit = async () => {
		const res = await logWork({
			issueKeyOrId: worklogKey,
			date: worklogDate,
			timeSpentSeconds: worklogTime.toString()
		});
		if (res.status === 'success') {
			setIsOpen(false);
			toast.success('Worklog created');
		}
		if (res.status === 'error') res.errors.forEach((error) => toast.error(error));
	};

	return (
		<>
			<Button
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
				placement="top-center">
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader>Log work</ModalHeader>
							<ModalBody>
								{worklogKey}
								<DateInput
									label={'Worklog date'}
									labelPlacement="outside"
									isReadOnly
									isDisabled
									defaultValue={parseDate(worklogDate.slice(0, 10))}
								/>
								<TimeInput
									label="Time spent"
									labelPlacement="outside"
									value={timeValue}
									onChange={setTimeValue}
								/>
								<Checkbox
									classNames={{
										label: 'text-small'
									}}>
									Remember me
								</Checkbox>
							</ModalBody>
							<ModalFooter>
								<Button
									color="danger"
									variant="flat"
									onPress={onClose}>
									Close
								</Button>
								<Button
									color="primary"
									onPress={handleSubmit}>
									Submit
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};
