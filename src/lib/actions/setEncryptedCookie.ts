'use server';

import 'server-only';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';
import { Action } from '@/types/types';

const cookieSecret = process.env.COOKIE_SECRET;
if (typeof cookieSecret === 'undefined') throw new Error('Missing COOKIE_SECRET env variable');
const encodedSecret = new TextEncoder().encode(cookieSecret);

export const setEncryptedCookie: Action<null, 'name' | 'value'> = async ({ name, value }) => {
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
	return { data: null, status: 'success' };
};
