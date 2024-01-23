"use client";

import { useContext, useState } from "react";

// Components
import { Input } from "@/components/Input";
import { Message } from "@/components/Message";

// Context
import { Context } from "@/context/UserContext";
import Link from "next/link";

function Login() {
	const [user, setUser] = useState<IUser>({
		email: "",
		password: "",
	});
	const { login, loading } = useContext(Context) as IUserContext;

	interface IUser {
		email: string;
		password: string;
	}

	interface IUserContext {
		login: (user: object) => Promise<void>;
		loading: boolean;
	}

	function handleChange(evt: any) {
		setUser({ ...user, [evt.target.name]: evt.target.value });
	}

	function handleSubmit(evt: any) {
		evt.preventDefault();

		// Fazer login do usuário
		login(user);

		// // Mostrar console log no site em desenvolvimento
		// setOutput(JSON.stringify(user, null, 2));
	}

	return (
		<main className="h-screen flex flex-col justify-center items-center">
			<h1 className="text-2xl">Login Midara</h1>
			<form className="w-1/4" onSubmit={handleSubmit}>
				<Message />
				<Input
					text="Email"
					type="email"
					name="email"
					placeholder="Type your email"
					handleOnChange={handleChange}
					value={user.email}
					multiple={false}
				/>
				<Input
					text="Password"
					type="password"
					name="password"
					placeholder="Type your password"
					handleOnChange={handleChange}
					value={user.password}
					multiple={false}
				/>

				<button className="bg-blue-800 hover:bg-blue-600 transition-all ease-in duration-200 text-white rounded px-4 py-3 w-full mt-4 flex flex-row justify-center items-center gap-2 drop-shadow-md">
					{loading ? (
						<>
							<span className="loading loading-spinner"></span>
							Loading...
						</>
					) : (
						<>Login</>
					)}
				</button>

				{/* <button
					className="bg-blue-800 hover:bg-blue-500 duration-200 w-full rounded mt-6 p-3 drop-shadow-sm"
					type="submit">
					{loading ? "Processando..." : "Entrar"}
				</button> */}
			</form>

			<span className="mt-2">
				Not have an account yet?{" "}
				<Link
					className="text-blue-500 hover:text-blue-800 dark:text-blue-600 dark:hover:text-blue-400 transition-all ease-in duration-200 font-bold"
					href="/register">
					Sign Up
				</Link>
			</span>

			{/* <pre className="flex justify-center mt-8">{output}</pre> */}
		</main>
	);
}

export default Login;
