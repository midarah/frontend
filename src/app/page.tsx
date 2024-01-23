"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { RiPenNibFill, RiBook2Fill } from "react-icons/ri";
import { FaHashtag } from "react-icons/fa";
import api from "@/utils/api";
import Image from "next/image";
import Banner from "../../public/banner-midara.jpg";

// Components
import { Spinner } from "@/components/Spinner";

function HomePage() {
	const [hentais, setHentais] = useState([]);
	const [loading, setLoading] = useState(true);
	const [displayedItems, setDisplayedItems] = useState(40);
	// const alertShown = localStorage.getItem("alertShown");

	// if (!alertShown) {
	// 	// O alerta ainda não foi exibido
	// 	// Exiba o alerta aqui
	// 	alert("Mensagem Midara");

	// 	// Defina uma flag no localStorage para indicar que o alerta já foi exibido
	// 	localStorage.setItem("alertShown", "true");
	// }

	useEffect(() => {
		const fetchData = async () => {
			await api.get("/hentais").then((response) => {
				setHentais(response.data.hentais);
			});
		};
		fetchData();
	}, []);

	const handleLoadMore = () => {
		const newDisplayCount = displayedItems + 8;
		setDisplayedItems(newDisplayCount);
	};

	interface IHentai {
		_id: string;
		title: string;
		chapters: Array<{ titleChapter: string; imagesChapter: string[] }>;
		image: string;
		mangaka: string;
		format: string;
		updatedAt: string; // Adicione a data de atualização
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

	return (
		<>
			<section className="min-h-screen flex flex-col items-center mt-8 mb-16">
				<a
					href="#"
					className={`btn bg-blue-800 hover:bg-blue-600 transition-all ease-in duration-200 shadow-xl`}></a>
				<div className="mb-8">
					<Image
						className="rounded-xl shadow-xl"
						src={Banner}
						alt="Midara Banner"
						width={1280}
						unoptimized
						priority
					/>
				</div>

				<article className="grid grid-cols-10">
					<div className="col-start-2 col-span-8 py-4 rounded-lg bg-pink-700 shadow-lg">
						<h1 className="text-white text-center text-2xl px-4">
							New Releases
						</h1>
					</div>
					<div className=" mx-auto col-start-2 col-span-8 flex flex-row justify-center mt-6 mb-6 gap-8 overflow-visible">
						<div className="breakLine flex flex-row justify-center gap-4 static">
							{sortedHentais
								.slice(0, displayedItems)
								.map((hentai) => {
									const lastChapter =
										hentai.chapters[
											hentai.chapters.length - 1
										];
									const updatedAt = new Date(
										hentai.updatedAt
									).toLocaleString();

									return (
										<div
											className="flex flex-col"
											key={hentai._id}>
											<div className="flag bg-blue-800 hover:bg-blue-600 opacity-85 transition-all ease-in duration-200 text-white text-center font-bold p-2 absolute rounded-lg z-40 flex items-center">
												MH
											</div>

											<div className="mb-2">
												<Image
													className="w-64 h-96 rounded-lg mb-2 -z-50 shadow-lg"
													src={`${
														process.env
															.NEXT_PUBLIC_IMAGES
													}/${
														hentai.chapters.length >
														1
															? lastChapter
																	.imagesChapter[0]
															: hentai.image
													}`}
													alt=""
													width={64}
													height={96}
													unoptimized
													priority
												/>
												<h1 className="mb-1 flex flex-row items-center gap-4">
													<RiBook2Fill size={20} />
													<p className="titleOverflow">
														{hentai.title}
													</p>
												</h1>
												<h2 className="mb-1 flex flex-row items-center gap-4 text-ellipsis overflow-hidden">
													<FaHashtag size={20} />
													{hentai.chapters.length > 0
														? lastChapter.titleChapter
														: "Título indisponível"}
												</h2>
												<h2 className="flex flex-row items-center gap-4 text-ellipsis overflow-hidden">
													<RiPenNibFill size={20} />
													{hentai.mangaka}
												</h2>
											</div>

											<Link
												className="bg-blue-800 hover:bg-blue-600 transition-all ease-in duration-200 text-white text-center p-2 rounded px-14 w-64 drop-shadow-md"
												href={
													hentai.format === "Manga"
														? `/mangas/${hentai._id}`
														: `/doujinshis/${hentai._id}`
												}>
												Hentai Page
											</Link>
										</div>
									);
								})}
							{sortedHentais.length === 0 && <Spinner />}
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
		</>
	);
}

export default HomePage;
