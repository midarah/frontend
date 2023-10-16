"use client";

import React, { useState, useEffect } from "react";
import api from "@/utils/api";
import Link from "next/link";

interface IUser {
	blocked?: boolean;
	error?: boolean;
	// Adicione outras propriedades necessárias aqui
}

export default function Dashboard() {
	const [user, setUser] = useState<IUser>({});
	const [token, setToken] = useState(
		typeof window !== "undefined" ? localStorage.getItem("token") || "" : ""
	);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const { data } = await api.get("/users/checkuser", {
					headers: {
						Authorization: `Bearer ${JSON.parse(token)}`,
					},
				});

				if (
					data.email !== "rguedes_arq@hotmail.com" ||
					data._id !== "651bc6b2f38811c8aa09f6e7"
				) {
					// Defina um estado para indicar que o usuário não atende aos requisitos
					setUser({ blocked: true });
				} else {
					setUser(data);
				}
			} catch (error) {
				console.error("Erro ao buscar dados do usuário:", error);
				// Defina um estado para indicar um erro de busca de dados
				setUser({ error: true });
			}
		};
		fetchData();
	}, [token]);

	return (
		<section className="min-h-screen mt-8 flex justify-center items-center">
			{user.blocked ? (
				<h1 className="text-xl">
					Você não tem permissão para acessar o Dashboard.
				</h1>
			) : user.error ? (
				<h1>Ocorreu um erro ao buscar os dados do usuário.</h1>
			) : (
				<div className="flex flex-row justify-center gap-3">
					<Link
						className="bg-green-500 p-2 rounded mb-3"
						href="../catalog">
						Acessar Catálogo
					</Link>
					<Link
						className="bg-green-500 p-2 rounded mb-3"
						href="/dashboard/hentaicreate">
						Cadastrar Hentai
					</Link>
				</div>
			)}
		</section>
	);
}
