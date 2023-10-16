"use client";

import { createContext } from "react";

import useAuth from "@/hooks/useAuth";

// Defina uma interface que represente os valores do contexto
interface IUserContext {
	register: (user: object) => Promise<void>;
	login: (user: object) => Promise<void>;
	logout: () => void;
	authenticated: boolean;
	loading: boolean;
}

const Context = createContext<IUserContext>({} as IUserContext);

interface IChildrenProps {
	children: React.ReactNode;
}

function UserProvider({ children }: IChildrenProps) {
	const { register, login, logout, authenticated, loading } = useAuth();

	return (
		<Context.Provider
			value={{ register, login, logout, authenticated, loading }}>
			{children}
		</Context.Provider>
	);
}

export { Context, UserProvider };
