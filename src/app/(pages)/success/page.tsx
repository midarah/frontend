"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { SyncOutlined } from "@ant-design/icons";

// Hooks

function SuccessPage() {
	const [user, setUser] = useState({});
	const [token, setToken] = useState(
		typeof window !== "undefined" ? localStorage.getItem("token") || "" : ""
	);
	const [prices, setPrices] = useState([]);

	const router = useRouter();

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
		const getSubscriptionStatus = async () => {
			const { data } = await api.get("/stripe/subscription-status", {
				headers: {
					Authorization: `Bearer ${JSON.parse(token)}`,
				},
			});
			// console.log("SUBSCRIPTION STATUS", data);

			if (data && data.length === 0) {
				router.push("/subscription");
			} else {
				router.push("profile");
			}
		};
		getSubscriptionStatus();
	}, [router, token]);

	return (
		<div className="h-screen container-fluid flex items-center justify-center">
			<div className="offset-md-3 text-center flex flex-col col-md-6 items-center justify-center">
				<SyncOutlined spin style={{ fontSize: "50px" }} />
			</div>
		</div>
	);
}

export default SuccessPage;
