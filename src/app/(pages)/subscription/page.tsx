"use client";

import React, { useEffect, useState, useContext } from "react";
import api from "@/utils/api";

// Components
import { PriceCard } from "@/components/PriceCard";

// Hooks

// Context
import { Spinner } from "@/components/Spinner";

function SubscriptionPage() {
	const [user, setUser] = useState({});
	const [token, setToken] = useState(
		typeof window !== "undefined" ? localStorage.getItem("token") || "" : ""
	);
	const [prices, setPrices] = useState([]);

	interface IPrice {
		id: string;
		nickname: string;
		unit_amount: number;
		// Outras propriedades de price, se houver
	}

	useEffect(() => {
		const fetchData = async () => {
			const { data } = await api.get("/users/checkuser", {
				headers: {
					Authorization: `Bearer ${JSON.parse(token)}`,
				},
			});
			// console.log(token);
			// console.log(data);
			setUser(data);
		};
		fetchData();
	}, [token]);

	useEffect(() => {
		const fetchPrices = async () => {
			const { data } = await api.get("/stripe/prices");
			// console.log("prices get request", data);
			setPrices(data);
		};
		fetchPrices();
	}, []);

	if (!prices || prices.length === 0) {
		return (
			<section className="min-h-screen flex flex-col justify-center items-center mt-4 mb-16">
				<h1>
					<Spinner />
				</h1>
			</section>
		);
	}

	async function handleClick(evt: React.MouseEvent, price: IPrice) {
		evt.preventDefault();
		if (token) {
			try {
				const { data } = await api.post(
					"/stripe/create-subscription",
					{
						priceId: price.id,
					},
					{
						headers: {
							Authorization: `Bearer ${JSON.parse(token)}`,
						},
					}
				);
				window.open(data, "_self");
			} catch (error) {
				// Lide com erros de requisição aqui, se necessário
				console.error("Erro na solicitação ao Stripe:", error);
			}
		} else {
			// É possível redirecionar o usuário
			alert("Erro ao tentar realizar a assinatura!");
		}
	}

	return (
		<div className="h-screen container-fluid flex flex-col items-center mt-16">
			<h1 className="pt-5 fw-bold text-2xl">
				Choose the Perfect Plans for You
			</h1>
			<h2 className="lead pb-4 text-xl">
				Subscribe to one of the plans below:
			</h2>
			<h3>
				※ Don&apos;t worry, the description on the Invoice will not
				mention the website content. We will be discreet! ※
			</h3>
			<h3>
				※ Why do we charge a monthly fee?: This amount helps us keep the
				site up and running! ※
			</h3>
			<div className="offset-md-3 col-md-6 flex flex-col items-center justify-center mt-8">
				<div className="flex flex-row gap-8">
					{prices &&
						prices.map((price: IPrice) => (
							<PriceCard
								key={price.id}
								price={price}
								handleSubscription={handleClick}
							/>
						))}
				</div>
			</div>
		</div>
	);
}

export default SubscriptionPage;
