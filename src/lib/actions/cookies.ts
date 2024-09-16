'use server';

import 'server-only';
import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';
import { Action, StandardizedResponse } from '@/types/types';

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

export const getDecryptedCookie: Action<string, 'name'> = async ({ name }) => {
	const encryptedCookie = cookies().get(name)?.value;
	if (typeof encryptedCookie === 'undefined') {
		return {
			errors: [
				`Could not get value of '${name}'. Please make sure you have it set in your configuration tab, have cookies allowed in your browser and try again.`
			],
			status: 'error'
		};
	}
	const jwtVerifyResult = await jwtVerify<{ value: string }>(encryptedCookie, encodedSecret, {
		algorithms: ['HS256']
	});
	return { data: jwtVerifyResult.payload.value, status: 'success' };
};

export const getMultipleDecryptedCookies = async <T extends string>(
	...names: T[]
): Promise<StandardizedResponse<Record<T, string>>> => {
	const errors: string[] = [];
	const isValidReturnType = (obj: Record<string, unknown>): obj is Record<T, string> => {
		let isValid: boolean = true;
		names.forEach((name, i) => {
			if (typeof obj[name] !== 'string' || !obj[name].length) {
				errors.push(
					`Could not get value of '${name}'. Please make sure you have it set in your configuration tab, have cookies allowed in your browser and try again.`
				);
				isValid = false;
			}
			if (i === 0 && Object.keys(obj).length !== names.length) {
				errors.push(
					'Could not get all data. Please make sure you have cookies allowed in your browser and try again.'
				);
				isValid = false;
			}
		});
		return isValid;
	};

	const decryptedCookieEntries = await Promise.all(
		names.map<Promise<[name: T, value: string | undefined]>>(async (name) => {
			const cookieRes = await getDecryptedCookie({ name });
			if (cookieRes.status !== 'success') return [name, undefined];
			return [name, cookieRes.data];
		})
	);
	const cookies = Object.fromEntries(decryptedCookieEntries);
	return isValidReturnType(cookies) ? { data: cookies, status: 'success' } : { errors, status: 'error' };
};
