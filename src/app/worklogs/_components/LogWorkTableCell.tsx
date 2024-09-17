import { EditIcon } from '@nextui-org/shared-icons';
import {
	Button,
	Checkbox,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	TimeInput
} from '@nextui-org/react';
import { Worklogs } from '@/app/worklogs/_actions';
import { useState } from 'react';

export const LogWorkTableCell = ({ data }: Readonly<{ data: Worklogs[number] }>) => {
	const [isOpen, setIsOpen] = useState(false);

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
								<TimeInput label="Event Time" />
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
									onPress={onClose}>
									Sign in
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};
