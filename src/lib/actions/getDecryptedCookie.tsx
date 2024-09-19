'use server';

import 'server-only';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { Action } from '@/types/types';

const COOKIE_SECRET = process.env.COOKIE_SECRET;
if (typeof COOKIE_SECRET === 'undefined') throw new Error('Missing COOKIE_SECRET env variable');
const encodedSecret = new TextEncoder().encode(COOKIE_SECRET);

export const getDecryptedCookie: Action<string, 'name'> = async ({ name }) => {
	const encryptedCookie = cookies().get(name)?.value;
	if (typeof encryptedCookie === 'undefined') {
		return {
			errors: [
				<p key={name}>
					Could not get value of <strong>{name}</strong>. Please make sure you have it set in your
					<strong> configuration</strong> tab, have cookies allowed in your browser and try again.
				</p>
			],
			status: 'error'
		};
	}
	const jwtVerifyResult = await jwtVerify<{ value: string }>(encryptedCookie, encodedSecret, {
		algorithms: ['HS256']
	});
	return { data: jwtVerifyResult.payload.value, status: 'success' };
};
