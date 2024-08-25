import { operations } from './jira';

// @ts-expect-error
// TS2536: Type '200' cannot be used to index type operations[T]['responses']
// TS2536: Type 'content' cannot be used to index type operations[T]['responses']['200']
// TS2536: Type 'application/ json' cannot be used to index type operations[T]['responses']['200']['content']
export type jira200Response<T extends keyof operations> = operations[T]['responses']['200']['content']['application/json'];
