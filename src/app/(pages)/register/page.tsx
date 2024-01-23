"use client";

import { useContext, useState } from "react";
import Link from "next/link";

// Components
import { Input } from "@/components/Input";
import { Message } from "@/components/Message";

// Context
import { Context } from "@/context/UserContext";

function Register() {
	const [user, setUser] = useState<IUser>({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const { register, loading } = useContext(Context) as IUserContext;

	interface IUser {
		name: string;
		email: string;
		password: string;
		confirmPassword: string;
	}

	interface IUserContext {
		register: (user: object) => Promise<void>;
		loading: boolean;
	}

	function handleChange(evt: any) {
		setUser({ ...user, [evt.target.name]: evt.target.value });
	}

	async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
		evt.preventDefault();
		// Enviar um usuário para o banco de dados
		register(user);

		// // Mostrar console log no site em desenvolvimento
		// setOutput(JSON.stringify(user, null, 2));
	}

	return (
		<main className="h-screen flex flex-col justify-center items-center">
			<h1 className="text-2xl">Register</h1>
			<form className="w-1/4" onSubmit={handleSubmit}>
				<Message />
				<Input
					text="Name"
					type="text"
					name="name"
					placeholder="Type your name"
					handleOnChange={handleChange}
					value={user.name}
					multiple={false}
				/>

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

				<Input
					text="Password Confirmation"
					type="password"
					name="confirmPassword"
					placeholder="Confirm your password"
					handleOnChange={handleChange}
					value={user.confirmPassword}
					multiple={false}
				/>

				<button className="bg-blue-800 hover:bg-blue-600 transition-all ease-in duration-200 text-white rounded px-4 py-3 w-full mt-4 flex flex-row justify-center items-center gap-2 drop-shadow-md">
					{loading ? (
						<>
							<span className="loading loading-spinner"></span>
							Loading...
						</>
					) : (
						<>Sign Up</>
					)}
				</button>
			</form>

			<span className="mt-2">
				Already have an account?{" "}
				<Link
					className="text-blue-500 hover:text-blue-800 dark:text-blue-600 dark:hover:text-blue-400 transition-all ease-in duration-200 font-bold"
					href="/login">
					Login
				</Link>
			</span>

			{/* <pre className="flex justify-center mt-8">{output}</pre> */}
		</main>
	);
}

export default Register;
