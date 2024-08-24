'use server';

import 'server-only';
import { cookies } from 'next/headers';
import { jwtDecrypt, jwtVerify, SignJWT } from 'jose';

const cookieSecret = process.env.COOKIE_SECRET;
if (typeof cookieSecret === 'undefined') throw new Error('Missing COOKIE_SECRET env variable');
const encodedSecret = new TextEncoder().encode(cookieSecret);

export const setEncryptedCookie = async (name: string, value: string) => {
	const expirationDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

	const encryptedValue = await new SignJWT({ value })
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime(expirationDate)
		.sign(encodedSecret);

	cookies().set(name, encryptedValue, {
		httpOnly: true,
		secure: true,
		expires: expirationDate,
		sameSite: 'strict',
		path: '/'
	});
};

export const getDecryptedCookie = async (name: string) => {
	const encryptedCookie = cookies().get(name)?.value;
	if (typeof encryptedCookie === 'undefined') return;
	const jwtVerifyResult = await jwtVerify<{ value: string }>(encryptedCookie, encodedSecret, { algorithms: ['HS256'] });
	return jwtVerifyResult.payload.value;
};
