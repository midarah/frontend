"use client";

import { useContext, useState, useEffect } from "react";
import api from "@/utils/api";

// Defina o tipo das props esperadas
interface IPriceCardProps {
	price: {
		nickname: string;
		unit_amount: number;
	};
	handleSubscription: (event: React.MouseEvent, price: any) => void; // Ajuste o tipo de price conforme necessário
}

const PriceCard: React.FC<IPriceCardProps> = ({
	price,
	handleSubscription,
}) => {
	const [user, setUser] = useState({});
	const [token] = useState(localStorage.getItem("token") || "");

	useEffect(() => {
		api.get("/users/checkuser", {
			headers: {
				Authorization: `Bearer ${JSON.parse(token)}`,
			},
		}).then((response) => {
			setUser(response.data);
		});
	}, [token]);

	const dynamicDescription = () => {
		if (price.nickname === "ERO SOLDIER") {
			return "✓ 1 month of access";
		} else if (price.nickname === "HENTAI HERO") {
			return "✓ 6 months of Access";
		} else if (price.nickname === "MIDARA KING") {
			return "✓ 1 year of Access";
		}
	};

	const dynamicDescription2 = () => {
		if (price.nickname === "ERO SOLDIER") {
			return "✓ Full access";
		} else if (price.nickname === "HENTAI HERO") {
			return "✓ Full access";
		} else if (price.nickname === "MIDARA KING") {
			return "✓ Full access";
		}
	};

	const dynamicDescription3 = () => {
		if (price.nickname === "ERO SOLDIER") {
			return "✗ Recommendations";
		} else if (price.nickname === "HENTAI HERO") {
			return "✓ Recommendations";
		} else if (price.nickname === "MIDARA KING") {
			return "✓ Recommendations";
		}
	};

	const dynamicDescription4 = () => {
		if (price.nickname === "ERO SOLDIER") {
			return "month";
		} else if (price.nickname === "HENTAI HERO") {
			return "semester";
		} else if (price.nickname === "MIDARA KING") {
			return "year";
		}
	};

	function cardStyle() {
		return price.nickname === "HENTAI HERO"
			? "drop-shadow-md bg-pink-700 border-4 border-blue-700"
			: "card drop-shadow-md bg-blue-500 text-white rounded-lg py-4 px-2";
	}

	function buttonStyle() {
		return price.nickname === "HENTAI HERO"
			? "bg-blue-800 transition-all ease-out duration-200 hover:bg-blue-500"
			: "bg-pink-700 hover:bg-pink-600";
	}

	return (
		<div className="flex flex-col columns-1 pt-5 text-black">
			<div
				className={`card drop-shadow-md bg-blue-500 text-white rounded-lg py-4 px-2 ${cardStyle()}`}>
				<div className="card-header mt-4">
					<h4 className="font-bold text-center text-lg">
						{price.nickname}
					</h4>
				</div>
				<div className="card-body">
					<h1 className="card-title pricing-card-name font-bold text-3xl flex justify-center">
						{(price.unit_amount / 100).toLocaleString("pt-BR", {
							style: "currency",
							currency: "USD",
						})}
						/{dynamicDescription4()}
					</h1>
					<ul className="list-none mt-3 mb-4">
						<li className="">
							<span className="ml-2">{dynamicDescription()}</span>
						</li>
						<li className="">
							<span className="ml-2">
								{dynamicDescription2()}
							</span>
						</li>
						<li className="">
							<span className="ml-2">
								{dynamicDescription3()}
							</span>
						</li>
					</ul>

					{/* <pre>{JSON.stringify(price, null, 4)}</pre> */}

					<button
						onClick={(evt) => handleSubscription(evt, price)}
						className={`text-white duration-200 px-20 py-4 rounded-md ${buttonStyle()}`}>
						Subscribe
					</button>
				</div>
			</div>
		</div>
	);
};

export { PriceCard };
