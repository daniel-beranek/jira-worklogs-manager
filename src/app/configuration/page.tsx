'use client';

import { Button, Card, CardBody, Input, Spinner, Skeleton } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { setEncryptedCookie, getDecryptedCookie } from '@/actions/cookies';
import { useDebounce } from '@/hooks/useDebounce';
import { EyeFilledIcon, EyeSlashFilledIcon } from '@nextui-org/shared-icons';

const ConfigurationPage = () => {
	const [initialLoading, setInitialLoading] = useState(true);

	const [url, setUrl] = useState('');
	const [urlDescription, setUrlDescription] = useState('');
	const [isLoadingUrl, setIsLoadingUrl] = useState(false);
	const [debouncedUrl, debouncingUrl] = useDebounce(url);
	const [user, setUser] = useState('');
	const [userDescription, setUserDescription] = useState('');
	const [isLoadingUser, setIsLoadingUser] = useState(false);
	const [debouncedUser, debouncingUser] = useDebounce(user);
	const [token, setToken] = useState('');
	const [tokenDescription, setTokenDescription] = useState('');
	const [isLoadingToken, setIsLoadingToken] = useState(false);
	const [debouncedToken, debouncingToken] = useDebounce(token);
	const [isTokenVisible, setIsTokenVisible] = useState(false);

	useEffect(() => {
		(async () => {
			const urlCookieRes = await getDecryptedCookie({ name: 'url' });
			const userCookieRes = await getDecryptedCookie({ name: 'user' });
			const tokenCookieRes = await getDecryptedCookie({ name: 'token' });

			if (urlCookieRes.status === 'success') setUrl(urlCookieRes.data);
			if (userCookieRes.status === 'success') setUser(userCookieRes.data);
			if (tokenCookieRes.status === 'success') setToken(tokenCookieRes.data);

			setInitialLoading(false);
		})();
	}, []);

	useEffect(() => {
		if (debouncingUrl) setIsLoadingUrl(true);
		else if (debouncedUrl !== null)
			(async () => {
				const urlCookieRes = await getDecryptedCookie({ name: 'url' });
				if (urlCookieRes.status === 'success' && urlCookieRes.data === debouncedUrl) setUrlDescription('');
				else setUrlDescription('Value not stored, submit the value.');
				setIsLoadingUrl(false);
			})();
	}, [debouncedUrl, debouncingUrl]);
	useEffect(() => {
		if (debouncingUser) setIsLoadingUser(true);
		else if (debouncedUser !== null)
			(async () => {
				const userCookieRes = await getDecryptedCookie({ name: 'user' });
				if (userCookieRes.status === 'success' && userCookieRes.data === debouncedUser) setUserDescription('');
				else setUserDescription('Value not stored, submit the value.');
				setIsLoadingUser(false);
			})();
	}, [debouncedUser, debouncingUser]);
	useEffect(() => {
		if (debouncingToken) setIsLoadingToken(true);
		else if (debouncedToken !== null)
			(async () => {
				const tokenCookieRes = await getDecryptedCookie({ name: 'token' });
				if (tokenCookieRes.status === 'success' && tokenCookieRes.data === debouncedToken)
					setTokenDescription('');
				else setTokenDescription('Value not stored, submit the value.');
				setIsLoadingToken(false);
			})();
	}, [debouncedToken, debouncingToken]);

	const handleSubmit = async (name: 'url' | 'user' | 'token', value: string) => {
		await setEncryptedCookie({ name, value });
		const res = await getDecryptedCookie({ name });
		if (res.status !== 'success') return;
		if (name === 'url' && res.data === url) setUrlDescription('');
		if (name === 'user' && res.data === user) setUserDescription('');
		if (name === 'token' && res.data === token) setTokenDescription('');
	};

	return (
		<Card>
			<CardBody className="flex flex-col gap-4">
				<Skeleton
					isLoaded={!initialLoading}
					className="rounded-lg">
					<div
						className="flex gap-2"
						style={{ alignItems: urlDescription ? 'center' : 'end' }}>
						<Input
							type="url"
							label="URL"
							labelPlacement="outside"
							startContent={
								url && (
									<div className="pointer-events-none flex items-center">
										<span className="text-small text-default-400">https://</span>
									</div>
								)
							}
							value={url}
							onChange={(e) => setUrl(e.target.value)}
							onKeyDown={(e) => urlDescription && e.key === 'Enter' && handleSubmit('url', url)}
							description={urlDescription}
							endContent={isLoadingUrl && <Spinner color="default" />}
						/>
						<Button
							onClick={() => handleSubmit('url', url)}
							isDisabled={!urlDescription}
							color="primary">
							Submit
						</Button>
					</div>
				</Skeleton>

				<Skeleton
					isLoaded={!initialLoading}
					className="rounded-lg">
					<div
						className="flex gap-2"
						style={{ alignItems: userDescription ? 'center' : 'end' }}>
						<Input
							type="text"
							label="User"
							labelPlacement="outside"
							value={user}
							onChange={(e) => setUser(e.target.value)}
							onKeyDown={(e) => e.key === 'Enter' && handleSubmit('user', user)}
							description={userDescription}
							endContent={isLoadingUser && <Spinner color="default" />}
						/>
						<Button
							onClick={() => handleSubmit('user', user)}
							isDisabled={!userDescription}
							color="primary">
							Submit
						</Button>
					</div>
				</Skeleton>

				<Skeleton
					isLoaded={!initialLoading}
					className="rounded-lg">
					<div
						className="flex gap-2"
						style={{ alignItems: tokenDescription ? 'center' : 'end' }}>
						<Input
							type={isTokenVisible ? 'text' : 'password'}
							label="Token"
							labelPlacement="outside"
							value={token}
							onChange={(e) => setToken(e.target.value)}
							onKeyDown={(e) => e.key === 'Enter' && handleSubmit('token', token)}
							description={tokenDescription}
							endContent={
								<div className="flex items-center gap-2">
									{isLoadingToken && <Spinner color="default" />}
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
								</div>
							}
						/>
						<Button
							onClick={() => handleSubmit('token', token)}
							isDisabled={!tokenDescription}
							color="primary">
							Submit
						</Button>
					</div>
				</Skeleton>
			</CardBody>
		</Card>
	);
};
export default ConfigurationPage;
