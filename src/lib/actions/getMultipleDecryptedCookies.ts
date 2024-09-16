'use server';

import 'server-only';
import { StandardizedResponse } from '@/types/types';
import { getDecryptedCookie } from '@/lib/actions/getDecryptedCookie';

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
