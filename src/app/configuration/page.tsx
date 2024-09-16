import { Card, CardBody, Kbd, CardFooter, Spacer } from '@nextui-org/react';
import UserInput from '@/app/configuration/_components/UserInput';
import UrlInput from '@/app/configuration/_components/UrlInput';
import TokenInput from '@/app/configuration/_components/TokenInput';
import CountryAutocomplete from '@/app/configuration/_components/CountryAutocomplete';

const ConfigurationPage = () => {
	return (
		<Card>
			<CardBody className="flex flex-col gap-4">
				<UrlInput />
				<UserInput />
				<TokenInput />
				<CountryAutocomplete />
			</CardBody>
			<CardFooter className="justify-end text-tiny text-default-400">
				Press
				<Spacer />
				<Kbd
					className="text-tiny"
					keys={['enter']}
				/>
				<Spacer />
				to submit a value
			</CardFooter>
		</Card>
	);
};
export default ConfigurationPage;
