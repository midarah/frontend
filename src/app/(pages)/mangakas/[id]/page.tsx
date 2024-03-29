"use client";

import { useState, useEffect } from "react";
import api from "@/utils/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "./style.module.css";
import { useRouter } from "next/navigation";

// React Icons
import { RiBook2Fill } from "react-icons/ri";
import { FaTwitter } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

// Components
import { Spinner } from "@/components/Spinner";

interface IHentai {
	_id: string;
	title: string;
	mangaka: string;
	format: string;
	image: string;
	// outras propriedades
}

interface IMangaka {
	mangakaName: string;
	information: string;
	twitter: string;
	image: string;
}

function MangakaDetails() {
	const { id } = useParams();
	const [mangaka, setMangaka] = useState<IMangaka | null>(null);
	const [hentais, setHentais] = useState<IHentai[]>([]);
	const [token] = useState(localStorage.getItem("token") || "");
	const [isLoading, setIsLoading] = useState(true); // Add a loading state

	const router = useRouter();

	useEffect(() => {
		const fetchData = async () => {
			await api.get(`/mangakas/${id}`).then((response) => {
				setMangaka(response.data.mangaka);
			});

			await api.get(`/hentais`).then((response) => {
				setHentais(response.data.hentais);
			});
			setIsLoading(false);
		};
		fetchData();
	}, [id, token, router]);

	if (isLoading || !mangaka || hentais.length === 0) {
		return (
			<section className="min-h-screen flex flex-col justify-center items-center mt-4 mb-16">
				<h1>
					<Spinner />
				</h1>
			</section>
		);
	}

	return (
		<section className="min-h-screen">
			{mangaka.mangakaName && (
				<main className="grid grid-cols-10 gap-4 bg-pink-700">
					<div className="col-start-2 col-span-8 flex flex-col">
						<div className="flex flex-row mt-4">
							<Image
								className="w-64 h-96 rounded-lg mb-4 shadow-lg"
								src={`${process.env.NEXT_PUBLIC_IMAGES}/${mangaka.image}`}
								alt={mangaka.mangakaName}
								width={64}
								height={96}
								unoptimized
								priority
							/>
							<div className="flex flex-col ml-8 mr-8">
								<h1 className="text-center text-white text-2xl mt-4 mb-2">
									{mangaka.mangakaName}
								</h1>

								<hr className="w-full h-px bg-gray-200 border-0" />

								<p className="mt-2 mb-3 text-white">
									<strong>Informations:</strong>{" "}
									{mangaka.information}
								</p>
							</div>
						</div>

						<Link
							target="_BLANK"
							className="bg-black hover:bg-gray-900 transition-all ease-in duration-200 text-white p-2 rounded px-14 w-64 mb-4 flex flex-row justify-center items-center gap-4 shadow-md"
							href={mangaka.twitter}>
							<FaXTwitter size={20} />
							Twitter
						</Link>
					</div>
				</main>
			)}
			<article className="grid grid-cols-10 mt-6 mb-10">
				<div className="col-start-2 col-span-8 py-4 rounded-lg bg-pink-700 shadow-lg">
					<h1 className="text-center text-white text-2xl">
						Mangas and Doujinshis from {mangaka.mangakaName}
					</h1>
				</div>

				<div className="col-start-2 col-span-8 flex flex-row justify-center mt-6 mb-6 gap-8 breakLine">
					{Object.values(hentais).map((hentai) => {
						if (hentai.mangaka.includes(mangaka.mangakaName)) {
							return (
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
										<h3 className="flex flex-row items-center gap-4">
											<RiBook2Fill size={20} />
											<p className="titleOverflow">
												{hentai.title}
											</p>
										</h3>
									</div>
									<Link
										className="bg-blue-800 hover:bg-blue-600 transition-all ease-in duration-200 text-white text-center p-2 rounded px-14 w-64 shadow-lg"
										href={
											hentai.format == "Manga"
												? `/mangas/${hentai._id}`
												: `/doujinshis/${hentai._id}`
										}>
										Hentai Page
									</Link>
								</div>
							);
						}
						return null;
					})}
				</div>
			</article>
		</section>
	);
}

export default MangakaDetails;
