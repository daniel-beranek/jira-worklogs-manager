import { createContext, type ReactNode, useContext, useMemo, useState } from 'react';

type ContextState = {};

const Context = createContext<ContextState | undefined>(undefined);

const ContextProvider = ({
	children
}: Readonly<{
	children: ReactNode;
}>) => {
	const value = useMemo<ContextState>(() => ({}), []);
	return <Context.Provider value={value}>{children}</Context.Provider>;
};
export default ContextProvider;

export const useContextRequired = (): ContextState => {
	const context = useContext(Context);
	if (!context) {
		throw new Error("useContextRequired must be used within it's Provider");
	}
	return context;
};
