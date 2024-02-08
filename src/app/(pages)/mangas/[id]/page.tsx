"use client";

import { useState, useEffect } from "react";
import api from "@/utils/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// React Icons
import { BsBookHalf } from "react-icons/bs";
import { FaHashtag } from "react-icons/fa";

// Hooks
import useFlashMessage from "@/hooks/useFlashMessage";

// Components
import { Spinner } from "@/components/Spinner";

type Tag = {
	_id: string;
	tagName: string;
	// outras propriedades
};

type Mangaka = {
	_id: string;
	mangakaName: string;
	// outras propriedades, se houver
};

interface IHentai {
	_id: string;
	title: string;
	description: string;
	mangaka: string;
	format: string;
	image: string;
	tags: string[];
	status: string;
	chapters: IChapter[];
}

interface IChapter {
	_id: string;
	titleChapter: string;
	subtitleChapter: string;
	imagesChapter: string[];
}

function MangaDetails() {
	const { id } = useParams();
	const [hentai, setHentai] = useState<IHentai | null>(null);
	const [tags, setTags] = useState<Record<string, Tag>>({});
	const [mangakas, setMangakas] = useState<Record<string, Mangaka>>({});
	const { setFlashMessage } = useFlashMessage();
	const [token] = useState(localStorage.getItem("token") || "");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			await api.get(`/hentais/${id}`).then((response) => {
				setHentai(response.data.hentai);
			});

			await api.get(`/tags`).then((response) => {
				const tagsData = response.data.tags.reduce(
					(acc: { [key: string]: Tag }, tag: Tag) => {
						acc[tag._id] = tag;
						return acc;
					},
					{}
				);
				setTags(tagsData);
			});

			await api.get(`/mangakas`).then((response) => {
				const mangakasData = response.data.mangakas.reduce(
					(acc: Record<string, Mangaka>, mangaka: Mangaka) => {
						acc[mangaka.mangakaName] = mangaka;
						return acc;
					},
					{}
				);
				setMangakas(mangakasData);
				setIsLoading(false);
			});
		};
		fetchData();
	}, [id]);

	if (isLoading) {
		return (
			<div className="min-h-screen flex flex-col justify-center items-center mt-4 mb-16">
				<h1>
					<Spinner />
				</h1>
			</div>
		);
	}

	return (
		<section className="min-h-screen">
			{hentai?.format == "Manga" && (
				<main className="grid grid-cols-10 gap-4 bg-pink-700">
					<div className="col-start-2 col-span-8 flex flex-row mt-8">
						<Image
							className="w-64 h-96 rounded-md shadow-md flex flex-row justify-center mb-8"
							src={`${process.env.NEXT_PUBLIC_IMAGES}/${hentai.image}`}
							alt={hentai.title}
							width={64}
							height={96}
							unoptimized
							priority
						/>
						<div className="flex flex-col ml-8 mr-8">
							<h1 className="text-center text-white text-2xl mt-4 mb-2">
								{hentai.title}
							</h1>

							<hr className="w-full h-px bg-gray-200 border-0" />

							<p className="mt-2 mb-3 text-white">
								<strong>Sinopse:</strong> {hentai.description}
							</p>

							<h2 className="mb-2 text-white">
								<strong>Mangaka:</strong>{" "}
								{hentai.mangaka && (
									<Link
										href={
											mangakas[hentai.mangaka]
												? `/mangakas/${
														mangakas[hentai.mangaka]
															._id
												  }`
												: ""
										}
										className="bg-blue-800 hover:bg-blue-600 transition-all ease-in duration-200 border border-white px-3 rounded-xl mr-1">
										{hentai.mangaka}
									</Link>
								)}
							</h2>

							<h2 className="mb-2 text-white">
								<strong>Tags:</strong>{" "}
								{hentai.tags.map((tagEl, index) => {
									const matchingTag = Object.values(
										tags
									).find((tag) => tag.tagName === tagEl);

									return (
										<Link
											href={
												matchingTag
													? `/tags/${matchingTag._id}`
													: ""
											}
											className="bg-blue-800 hover:bg-blue-600 transition-all ease-in duration-200 border border-white px-3 rounded-xl mr-1"
											key={index}>
											{tagEl}
										</Link>
									);
								})}
							</h2>

							<h2 className="text-white">
								<strong>Status do Projeto:</strong>{" "}
								{hentai.status}
							</h2>
						</div>
					</div>
				</main>
			)}

			<article className="grid grid-cols-10 mt-6 mb-10">
				<div className="col-start-2 col-span-8 py-4 rounded-lg bg-pink-700">
					<h1 className="text-center text-white text-2xl">
						Capítulos
					</h1>
				</div>

				<div className="col-start-2 col-span-8 flex flex-row justify-center mt-6 mb-6 gap-8 breakLine">
					{hentai?.chapters &&
						hentai.chapters.map((chapter, chapterIndex) => (
							<div key={chapterIndex}>
								<div>
									{chapter.imagesChapter.length > 0 && (
										<Image
											className="w-64 h-96 rounded-lg shadow-lg"
											src={`${process.env.NEXT_PUBLIC_IMAGES}/${chapter.imagesChapter[0]}`}
											alt={chapter.titleChapter}
											key={chapterIndex}
											width={64}
											height={96}
											unoptimized
											priority
										/>
									)}
									{/* Restante do código para exibir informações adicionais do capítulo */}
								</div>

								<h3 className="flex flex-row items-center mt-2">
									<FaHashtag className="mr-3" size={20} />{" "}
									{chapter.titleChapter}
								</h3>
								<Link
									href={`/chapter/${chapter._id}`}
									className="flex flex-row items-center justify-center w-64 rounded p-2 mt-2 bg-blue-800 hover:bg-blue-600 transition-all ease-in duration-200 shadow-lg">
									<BsBookHalf className="mr-3" size={20} />
									Read Online
								</Link>
							</div>
						))}
				</div>
			</article>
		</section>
	);
}

export default MangaDetails;
