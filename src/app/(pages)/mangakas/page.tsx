"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

import api from "@/utils/api";
import { RiPenNibFill } from "react-icons/ri";
import styles from "./mangakas.module.css";

// Components
import { Spinner } from "@/components/Spinner";

interface IMangaka {
	_id: string;
	mangakaName: string;
	image: string;
	updatedAt: string;
}

function MangakasPage() {
	const [mangakas, setMangakas] = useState<IMangaka[]>([]);
	const [token, setToken] = useState(
		typeof window !== "undefined" ? localStorage.getItem("token") || "" : ""
	);
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [displayedItems, setDisplayedItems] = useState(40);

	useEffect(() => {
		const fetchData = async () => {
			await api.get("/mangakas").then((response) => {
				setMangakas(response.data.mangakas);
				// console.log(response.data.hentais);
			});
		};
		fetchData();
	}, [token, router]);

	if (!mangakas || mangakas.length === 0) {
		return (
			<section className="min-h-screen flex flex-col justify-center items-center mt-4 mb-16">
				<h1>
					<Spinner />
				</h1>
			</section>
		);
	}

	const handleLoadMore = () => {
		const newDisplayCount = displayedItems + 20;
		setDisplayedItems(newDisplayCount);
	};

	// Ordenar os hentais com base na data de atualização
	const sortedMangakas = mangakas
		.map((mangaka: IMangaka) => ({
			...mangaka,
			updatedAt: new Date(mangaka.updatedAt),
		}))
		.sort((a, b) => {
			const dateA = a.updatedAt.getTime(); // Converta Date para número
			const dateB = b.updatedAt.getTime(); // Converta Date para número

			return dateB - dateA;
		});

	return (
		<section className="min-h-screen flex flex-col items-center mt-8 mb-16">
			<a
				href="#"
				className={`bg-blue-800 hover:bg-blue-600 transition-all ease-in duration-200 shadow-xl ${styles.btn}`}></a>

			<article className="grid grid-cols-10">
				<div className="col-start-2 col-span-8 py-4 rounded-lg bg-pink-700 shadow-lg">
					<h1 className="text-center text-white text-2xl">
						Mangakas
					</h1>
				</div>

				<div className="col-start-2 col-span-8 flex flex-row justify-center mt-6 mb-6 gap-8 overflow-visible">
					<div className="breakLine flex flex-row justify-center gap-4 static">
						{mangakas.slice(0, displayedItems).map((mangaka) => (
							<div className="flex flex-col" key={mangaka._id}>
								<div className="mb-2">
									<Image
										className="w-64 h-96 rounded-lg mb-2 shadow-lg"
										src={`${process.env.NEXT_PUBLIC_IMAGES}/${mangaka.image}`}
										alt={mangaka.mangakaName}
										width={64}
										height={96}
										unoptimized
										priority
									/>
									<h3 className="flex flex-row items-center gap-4">
										<RiPenNibFill size={20} />
										<p className="titleOverflow">
											{mangaka.mangakaName}
										</p>
									</h3>
								</div>

								<Link
									className="bg-blue-800 hover:bg-blue-600 transition-all ease-in duration-200 text-white text-center p-2 rounded px-14 w-64 shadow-lg"
									href={`/mangakas/${mangaka._id}`}>
									Mangaka Page
								</Link>
							</div>
						))}
						{mangakas.length === 0 && (
							<p>There are no Mangakas in the catalog</p>
						)}
					</div>
				</div>
			</article>

			{loading ? (
				<div>
					{/* Se houver mais itens para carregar, mostre o botão "Carregar Mais" */}
					{displayedItems < sortedMangakas.length && (
						<button
							className="bg-blue-800 hover:bg-blue-600 transition-all ease-in duration-200 text-white rounded px-4 py-3 w-full mt-4 flex flex-row justify-center items-center gap-2 drop-shadow-md"
							onClick={handleLoadMore}>
							Carregar Mais
						</button>
					)}
				</div>
			) : (
				// Se não estiver carregando, exiba os itens e o botão "Carregar Mais"
				<button className="bg-blue-800 hover:bg-blue-600 transition-all ease-in duration-200 text-white rounded px-4 py-3 w-full mt-4 flex flex-row justify-center items-center gap-2 drop-shadow-md">
					<span className="loading loading-dots loading-md"></span>
				</button>
			)}
		</section>
	);
}

export default MangakasPage;
