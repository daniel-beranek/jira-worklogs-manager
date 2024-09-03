'use client';

import { Button, Input, Spinner } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { setEncryptedCookie, getDecryptedCookie } from '@/actions/cookies';
import { useDebounce } from '@/hooks/useDebounce';
import { EyeFilledIcon, EyeSlashFilledIcon } from '@nextui-org/shared-icons';

const ConfigurationPage = () => {
	const [url, setUrl] = useState('');
	const [user, setUser] = useState('');
	const [token, setToken] = useState('');
	useEffect(() => {
		(async () => {
			setUrl((await getDecryptedCookie('url')) ?? '');
			setUser((await getDecryptedCookie('user')) ?? '');
			setToken((await getDecryptedCookie('token')) ?? '');
		})();
	}, []);

	const [debouncedUrl, debouncingUrl] = useDebounce(url);
	const [debouncedUser, debouncingUser] = useDebounce(user);
	const [debouncedToken, debouncingToken] = useDebounce(token);

	const [urlDescription, setUrlDescription] = useState('');
	const [userDescription, setUserDescription] = useState('');
	const [tokenDescription, setTokenDescription] = useState('');
	useEffect(() => {
		(async () => {
			if (debouncedUrl !== (await getDecryptedCookie('url'))) setUrlDescription('Value not stored, submit the value.');
			else setUrlDescription('');
		})();
	}, [debouncedUrl]);
	useEffect(() => {
		(async () => {
			if (debouncedUser !== (await getDecryptedCookie('user'))) setUserDescription('Value not stored, submit the value.');
			else setUserDescription('');
		})();
	}, [debouncedUser]);
	useEffect(() => {
		(async () => {
			if (debouncedToken !== (await getDecryptedCookie('token'))) setTokenDescription('Value not stored, submit the value.');
			else setTokenDescription('');
		})();
	}, [debouncedToken]);

	const handleSubmit = async (name: string, value: string) => {
		await setEncryptedCookie(name, value);
		const res = await getDecryptedCookie(name);
		if (res === url) setUrlDescription('');
		if (res === user) setUserDescription('');
		if (res === token) setTokenDescription('');
	};

	const [isTokenVisible, setIsTokenVisible] = useState(false);

	return (
		<div>
			<Input
				type="url"
				label="URL"
				placeholder="nextui.org"
				startContent={
					<div className="pointer-events-none flex items-center">
						<span className="text-small text-default-400">https://</span>
					</div>
				}
				value={url}
				onChange={(e) => setUrl(e.target.value)}
				onKeyDown={(e) => e.key === 'Enter' && handleSubmit('url', url)}
				description={!debouncingUrl && urlDescription}
			/>
			{debouncingUrl && <Spinner />}
			<Button
				onClick={() => handleSubmit('url', url)}
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
				type={isTokenVisible ? 'text' : 'password'}
				label="Token"
				placeholder="abcdefgh"
				value={token}
				onChange={(e) => setToken(e.target.value)}
				onKeyDown={(e) => e.key === 'Enter' && handleSubmit('token', token)}
				description={!debouncingToken && tokenDescription}
				endContent={
					<button
						className="focus:outline-none"
						type="button"
						onClick={() => setIsTokenVisible((prevValue) => !prevValue)}
						aria-label="toggle password visibility">
						{isTokenVisible ? (
							<EyeSlashFilledIcon className="pointer-events-none text-2xl text-default-400" />
						) : (
							<EyeFilledIcon className="pointer-events-none text-2xl text-default-400" />
						)}
					</button>
				}
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
