"use client";

import styles from "./profile.module.css";
import React, { useContext, useState, useEffect } from "react";
import api from "@/utils/api";
import moment from "moment";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Components
import { Input } from "../../../components/Input";
import { Message } from "@/components/Message";
import { Spinner } from "@/components/Spinner";

// Hooks
import useFlashMessage from "../../../hooks/useFlashMessage";

// Context
import { Context } from "@/context/UserContext";

interface IUser {
	_id: string;
	email: string;
	name: string;
	image: string;
	subscriptionInfo: ISubInfo[];
	[key: string]: string | undefined | ISubInfo[];
	// Outras propriedades, se houver
}

interface ISubInfo {
	id: string;
	plan: IPlan; // Alterado para um único objeto, não um array
	status: string;
	default_payment_method: IDefaultPaymentMethod;
	current_period_end: number;
}

interface IPlan {
	nickname: string;
	amount: number;
	currency: string;
}

interface IDefaultPaymentMethod {
	card: ICard;
}

interface ICard {
	last4: number;
}

function Profile() {
	const [user, setUser] = useState<IUser | null>(null);
	const [token, setToken] = useState(
		typeof window !== "undefined" ? localStorage.getItem("token") || "" : ""
	);
	const { setFlashMessage } = useFlashMessage();
	const [preview, setPreview] = useState<File | null>(null); // Defina o tipo File para o estado preview
	const { loading }: any = useContext(Context);

	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		if (!token) {
			router.push("/login");
			return;
		}

		const fetchData = async () => {
			const { data } = await api.get("/users/checkuser", {
				headers: {
					Authorization: `Bearer ${JSON.parse(token)}`,
				},
			});
			setUser(data);
			setIsLoading(false);
		};
		fetchData();
	}, [token, router]);

	const handleUpdateProfile = async (evt: React.FormEvent) => {
		// Adicione o tipo React.FormEvent
		evt.preventDefault();

		// Set isLoading to true when submitting the form
		setIsLoading(true);

		let msgType = "success";

		const formData = new FormData();

		// Verifica se user não é nulo antes de acessar suas propriedades
		if (user) {
			// Adicione user data ao FormData
			Object.keys(user).forEach((key) =>
				formData.append(key, user[key] as string)
			);
		}

		if (preview) {
			formData.append("profileImage", preview);
		}

		try {
			if (user) {
				const response = await api.patch(
					`/users/edit/${user._id}`,
					formData,
					{
						headers: {
							Authorization: `Bearer ${JSON.parse(token)}`,
							"Content-Type": "multipart/form-data",
						},
					}
				);

				setFlashMessage(response.data.message, msgType);
			}
		} catch (error: any) {
			console.error("Error updating profile:", error);
			msgType = "error";
			setFlashMessage(error.response.data, msgType);
		}

		// Set isLoading back to false after the request is complete
		setIsLoading(false);
	};

	function onFileChange(evt: React.ChangeEvent<HTMLInputElement>) {
		if (evt.target.files && evt.target.files[0]) {
			setPreview(evt.target.files[0]);
		}
	}

	function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
		if (user) {
			setUser({ ...user, [evt.target.name]: evt.target.value });
		}
	}

	function traduzirStatus(statusEmIngles: string) {
		const traducoes: any = {
			active: "Ativo",
			canceled: "Cancelado",
		};

		return traducoes[statusEmIngles] || statusEmIngles;
	}

	async function manageSubscription(evt: React.MouseEvent) {
		evt.preventDefault();

		if (token) {
			try {
				const { data } = await api.get("/stripe/customer-portal", {
					headers: {
						Authorization: `Bearer ${JSON.parse(token)}`,
					},
				});
				window.open(data, "_self");
			} catch (error) {
				console.error("Error requesting Stripe:", error);
			}
		} else {
			alert("Error trying to manage subscription!");
		}
	}

	return (
		<section className="min-h-screen flex flex-col items-center justify-center gap-4 mt-8 mb-16">
			{isLoading ? ( // Show a Spinner when isLoading is true
				<Spinner />
			) : (
				<div className="flex flex-col gap-8">
					<h1 className="bg-pink-800 text-center text-2xl py-2 shadow-xl rounded">
						Meu Perfil
					</h1>
					<div className="w-full flex flex-row gap-8">
						<form
							className="flex flex-col justify-center items-center gap-4"
							onSubmit={handleUpdateProfile}>
							<Message />

							<label className={styles.labelArq}>
								{user && (user.image || preview) ? (
									<div className={styles.previewContainer}>
										<Image
											className="rounded-md w-44 h-44"
											src={
												preview
													? URL.createObjectURL(
															preview
													  )
													: `${process.env.NEXT_PUBLIC_IMAGES}/${user.image}`
											}
											alt={user.name}
											width={64}
											height={96}
											unoptimized
											priority
										/>
									</div>
								) : (
									<div className="flex justify-center items-center">
										<span>Enviar Arquivo</span>
										<input
											className={styles.file}
											type="file"
											name="profileImage"
											onChange={onFileChange}
										/>
									</div>
								)}
							</label>

							<div>
								<Input
									text="E-mail"
									type="email"
									name="email"
									placeholder="Digite o e-mail"
									handleOnChange={handleChange}
									value={user ? user.email : ""}
								/>
								<Input
									text="Nome"
									type="text"
									name="name"
									placeholder="Digite o nome"
									handleOnChange={handleChange}
									value={user ? user.name : ""}
								/>
							</div>

							<div>
								<Input
									text="Senha"
									type="password"
									name="password"
									placeholder="Digite a sua senha"
									handleOnChange={handleChange}
								/>
								<Input
									text="Confirmação de senha"
									type="password"
									name="confirmPassword"
									placeholder="Confirme a sua senha"
									handleOnChange={handleChange}
								/>
							</div>
							<article>
								<button className="bg-blue-800 hover:bg-blue-600 transition-all ease-in duration-200 text-white p-2 rounded px-14 w-64 shadow-lg">
									{loading ? "Processando..." : "Atualizar"}
								</button>
							</article>
							{/* <pre>{JSON.stringify(subscription, null, 4)}</pre> */}
						</form>
						<div className="flex flex-row justify-center gap-10">
							{user && user.subscriptionInfo ? (
								user.subscriptionInfo.map((sub) => (
									<div key={sub.id}>
										<section>
											<h4 className="font-bold">
												Plano: {sub.plan.nickname}
											</h4>
											<h5>
												Mensalidade:{" "}
												{(
													sub.plan.amount / 100
												).toLocaleString("pt-BR", {
													style: "currency",
													currency: sub.plan.currency,
												})}
											</h5>
											<p>
												Status:{" "}
												{traduzirStatus(sub.status)}
											</p>
											<p>
												Cartão terminado em: ••••{" "}
												{
													sub.default_payment_method
														.card.last4
												}
											</p>
											<p className="mb-4">
												Seu plano expira em:{" "}
												{moment(
													sub.current_period_end *
														1000
												)
													.format("DD/MM/YYYY")
													.toString()}
											</p>
											<button
												onClick={manageSubscription}
												className="bg-green-700 hover:bg-green-600 transition-all ease-in duration-200 text-white rounded w-full px-5 py-2">
												Gerenciar Assinatura
											</button>
										</section>
									</div>
								))
							) : (
								<div>
									Sem informações de assinatura disponíveis
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</section>
	);
}

export default Profile;
