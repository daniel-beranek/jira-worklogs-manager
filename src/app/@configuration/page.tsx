'use client';

import { Button, Input, Spinner } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { setCookie, getCookie } from '@/actions/cookies';
import { useDebounce } from '@/hooks/useDebounce';

const ConfigurationPage = () => {
	const [api, setApi] = useState('');
	const [user, setUser] = useState('');
	const [token, setToken] = useState('');
	useEffect(() => {
		(async () => {
			setApi((await getCookie('api')) ?? '');
			setUser((await getCookie('user')) ?? '');
			setToken((await getCookie('token')) ?? '');
		})();
	}, []);

	const [debouncedApi, debouncingApi] = useDebounce(api);
	const [debouncedUser, debouncingUser] = useDebounce(user);
	const [debouncedToken, debouncingToken] = useDebounce(token);

	const [apiDescription, setApiDescription] = useState('');
	const [userDescription, setUserDescription] = useState('');
	const [tokenDescription, setTokenDescription] = useState('');
	useEffect(() => {
		(async () => {
			if (debouncedApi !== (await getCookie('api'))) setApiDescription('Value not stored, submit the value.');
			else setApiDescription('');
		})();
	}, [debouncedApi]);
	useEffect(() => {
		(async () => {
			if (debouncedUser !== (await getCookie('user'))) setUserDescription('Value not stored, submit the value.');
			else setUserDescription('');
		})();
	}, [debouncedUser]);
	useEffect(() => {
		(async () => {
			if (debouncedToken !== (await getCookie('token'))) setTokenDescription('Value not stored, submit the value.');
			else setTokenDescription('');
		})();
	}, [debouncedToken]);

	const handleSubmit = async (name: string, value: string) => {
		await setCookie(name, value);
		const res = await getCookie(name);
		if (res === api) setApiDescription('');
		if (res === user) setUserDescription('');
		if (res === token) setTokenDescription('');
	};

	return (
		<div>
			<Input
				type="url"
				label="API"
				placeholder="nextui.org"
				startContent={
					<div className="pointer-events-none flex items-center">
						<span className="text-small text-default-400">https://</span>
					</div>
				}
				value={api}
				onChange={(e) => setApi(e.target.value)}
				onKeyDown={(e) => e.key === 'Enter' && handleSubmit('api', api)}
				description={!debouncingApi && apiDescription}
			/>
			{debouncingApi && <Spinner />}
			<Button
				onClick={() => handleSubmit('api', api)}
				color="primary">
				Submit
			</Button>

			<Input
				type="text"
				label="User"
				placeholder="John Doe"
				value={user}
				onChange={(e) => setUser(e.target.value)}
				onKeyDown={(e) => e.key === 'Enter' && handleSubmit('user', user)}
				description={!debouncingUser && userDescription}
			/>
			{debouncingUser && <Spinner />}
			<Button
				onClick={() => handleSubmit('user', user)}
				color="primary">
				Submit
			</Button>

			<Input
				type="text"
				label="Token"
				placeholder="abcdefgh"
				value={token}
				onChange={(e) => setToken(e.target.value)}
				onKeyDown={(e) => e.key === 'Enter' && handleSubmit('token', token)}
				description={!debouncingToken && tokenDescription}
			/>
			{debouncingToken && <Spinner />}
			<Button
				onClick={() => handleSubmit('token', token)}
				color="primary">
				Submit
			</Button>
		</div>
	);
};
export default ConfigurationPage;
