'use client';

import { Button, Input, Spinner } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { setEncryptedCookie, getDecryptedCookie } from '@/actions/cookies';
import { useDebounce } from '@/hooks/useDebounce';
import { EyeFilledIcon, EyeSlashFilledIcon } from '@nextui-org/shared-icons';

const ConfigurationPage = () => {
	const [isLoading, setIsLoading] = useState(true);

	const [url, setUrl] = useState('');
	const [user, setUser] = useState('');
	const [token, setToken] = useState('');
	useEffect(() => {
		(async () => {
			const urlCookieRes = await getDecryptedCookie({ name: 'url' });
			const userCookieRes = await getDecryptedCookie({ name: 'user' });
			const tokenCookieRes = await getDecryptedCookie({ name: 'token' });

			if (urlCookieRes.status === 'success') setUrl(urlCookieRes.data);
			if (userCookieRes.status === 'success') setUser(userCookieRes.data);
			if (tokenCookieRes.status === 'success') setToken(tokenCookieRes.data);

			setIsLoading(false);
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
			const urlCookieRes = await getDecryptedCookie({ name: 'url' });
			if (urlCookieRes.status === 'success' && urlCookieRes.data === debouncedUrl) setUrlDescription('');
			else setUrlDescription('Value not stored, submit the value.');
		})();
	}, [debouncedUrl]);
	useEffect(() => {
		(async () => {
			const userCookieRes = await getDecryptedCookie({ name: 'user' });
			if (userCookieRes.status === 'success' && userCookieRes.data === debouncedUser) setUserDescription('');
			else setUserDescription('Value not stored, submit the value.');
		})();
	}, [debouncedUser]);
	useEffect(() => {
		(async () => {
			const tokenCookieRes = await getDecryptedCookie({ name: 'token' });
			if (tokenCookieRes.status === 'success' && tokenCookieRes.data === debouncedToken) setTokenDescription('');
			else setTokenDescription('Value not stored, submit the value.');
		})();
	}, [debouncedToken]);

	const handleSubmit = async (name: string, value: string) => {
		await setEncryptedCookie({ name, value });
		const res = await getDecryptedCookie({ name });
		if (res.status !== 'success') return;
		if (res.data === url) setUrlDescription('');
		if (res.data === user) setUserDescription('');
		if (res.data === token) setTokenDescription('');
	};

	const [isTokenVisible, setIsTokenVisible] = useState(false);

	if (isLoading) return <Spinner />;

	return (
		<div>
			<Input
				type="url"
				label="URL"
				placeholder="your.jira.com"
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
				placeholder="Your Jira Username"
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
				placeholder="Your Jira Token"
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
