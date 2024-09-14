import { operations } from './jira';

export type JiraData<T extends keyof operations> =
	// @ts-expect-error
	// TS2536: Type '200' cannot be used to index type operations[T]['responses']
	// TS2536: Type 'content' cannot be used to index type operations[T]['responses']['200']
	// TS2536: Type 'application/ json' cannot be used to index type operations[T]['responses']['200']['content']
	operations[T]['responses']['200']['content']['application/json'] & {
		errorMessages?: string[];
		errors?: Record<string, string>;
	};

export type StandardizedResponse<T> =
	| { data: T; status: 'success' }
	| { errors: string[]; status: 'error' }
	| { status: 'idle' };

export type Action<T, P extends string | number | symbol = string> = (
	payload: Record<P, string>
) => Promise<StandardizedResponse<T>>;
