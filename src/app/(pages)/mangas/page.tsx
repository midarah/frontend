"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { RiPenNibFill, RiBook2Fill } from "react-icons/ri";
import Image from "next/image";

import api from "@/utils/api";
import styles from "./mangas.module.css";

// Components
import { Spinner } from "@/components/Spinner";

interface IHentai {
	_id: string;
	title: string;
	description: string;
	mangaka: string;
	format: string;
	image: string;
	tags: string[];
	updatedAt: string;
}

function Mangas() {
	const [hentais, setHentais] = useState<IHentai[]>([]);
	const [loading, setLoading] = useState(true);
	const [displayedItems, setDisplayedItems] = useState(16);

	useEffect(() => {
		api.get("/hentais").then((response) => {
			setHentais(response.data.hentais);
		});
	}, []);

	if (!hentais || hentais.length === 0) {
		return (
			<section className="min-h-screen flex flex-col justify-center items-center mt-4 mb-16">
				<h1>
					<Spinner />
				</h1>
			</section>
		);
	}

	// Ordenar os hentais com base na data de atualização
	const sortedHentais = hentais
		.map((hentai: IHentai) => ({
			...hentai,
			updatedAt: new Date(hentai.updatedAt),
		}))
		.sort((a, b) => {
			const dateA = a.updatedAt.getTime(); // Converta Date para número
			const dateB = b.updatedAt.getTime(); // Converta Date para número

			return dateB - dateA;
		});

	const handleLoadMore = () => {
		const newDisplayCount = displayedItems + 20;
		setDisplayedItems(newDisplayCount);
	};

	return (
		<section className="min-h-screen flex flex-col items-center mt-8 mb-16">
			<a
				href="#"
				className={`bg-blue-800 hover:bg-blue-600 transition-all ease-in duration-200 shadow-xl ${styles.btn}`}></a>

			<article className="grid grid-cols-10">
				<div className="col-start-2 col-span-8 py-4 rounded-lg bg-pink-700 shadow-lg">
					<h1 className="text-center text-white text-2xl">
						Hentai Mangas
					</h1>
				</div>

				<div className="col-start-2 col-span-8 flex flex-row justify-center mt-6 mb-6 gap-8 overflow-visible">
					<div className="breakLine flex flex-row justify-center gap-4 static">
						{sortedHentais
							.filter((hentai) => hentai.format === "Manga")
							.slice(0, displayedItems)
							.map((hentai) => (
								<div className="flex flex-col" key={hentai._id}>
									<div className="mb-2">
										<Image
											className="w-64 h-96 rounded-lg mb-2 shadow-lg"
											src={`${process.env.NEXT_PUBLIC_IMAGES}/${hentai.image}`}
											alt={hentai.title}
											width={64}
											height={96}
											unoptimized
											priority
										/>
										<h3 className="mb-2 flex flex-row items-center gap-4">
											<RiBook2Fill size={20} />
											<p className="titleOverflow">
												{hentai.title}
											</p>
										</h3>
										<h2 className="flex flex-row items-center gap-4 text-ellipsis overflow-hidden">
											<RiPenNibFill size={20} />
											{hentai.mangaka}
										</h2>
									</div>
									<Link
										className="bg-blue-800 hover:bg-blue-600 transition-all ease-in duration-200 text-white text-center p-2 rounded px-14 shadow-lg"
										href={`/mangas/${hentai._id}`}>
										Hentai Page
									</Link>
								</div>
							))}
						{hentais.length === 0 && (
							<p>There are no Doujinshis in the catalog</p>
						)}
					</div>
				</div>
			</article>

			{loading ? (
				<div>
					{/* Se houver mais itens para carregar, mostre o botão "Carregar Mais" */}
					{displayedItems < sortedHentais.length && (
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

export default Mangas;
