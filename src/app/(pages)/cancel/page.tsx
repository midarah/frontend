"use client";

import React, { useEffect, useState } from "react";
import api from "@/utils/api";
import { WarningTwoTone } from "@ant-design/icons";

// Context

function CancelPage() {
	const [user, setUser] = useState({});
	const [token, setToken] = useState(
		typeof window !== "undefined" ? localStorage.getItem("token") || "" : ""
	);

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

	return (
		<div className="h-screen container-fluid flex items-center justify-center">
			<div className="offset-md-3 text-center flex flex-col col-md-6 items-center justify-center">
				<WarningTwoTone style={{ fontSize: "50px" }} />
			</div>
		</div>
	);
}

export default CancelPage;
