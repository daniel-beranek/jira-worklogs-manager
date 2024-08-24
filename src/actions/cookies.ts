'use server';

import 'server-only';
import { cookies } from 'next/headers';

export const setCookie = async (name: string, value: string, options: Record<string, unknown> = {}) => {
	cookies().set(name, value);
};

export const getCookie = async (name: string) => {
	return cookies().get(name)?.value;
};
