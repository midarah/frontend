"use client";

import { useState, useEffect } from "react";
import api from "@/utils/api";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// React Icons
import { RiPenNibFill, RiBook2Fill } from "react-icons/ri";

// Hooks
import useFlashMessage from "@/hooks/useFlashMessage";

// Components
import { Spinner } from "@/components/Spinner";

type Tag = {
	tagName: string;
	definition: string;
	image: string;
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
}

function TagDetails() {
	const { id } = useParams();
	const [tag, setTag] = useState<Tag>({
		tagName: "",
		definition: "",
		image: "",
		// inicialize outras propriedades, se necessário
	});
	const [hentais, setHentais] = useState<IHentai[]>([]);
	const [token] = useState(localStorage.getItem("token") || "");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			await api.get(`/tags/${id}`).then((response) => {
				setTag(response.data.tag);
			});

			await api.get(`/hentais`).then((response) => {
				setHentais(response.data.hentais);
			});
			setIsLoading(false);
		};
		fetchData();
	}, [id, token]);

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
			{tag.tagName && (
				<main className="grid grid-cols-10 gap-4 bg-pink-700">
					<div className="col-start-2 col-span-8 flex flex-row mt-8">
						<Image
							className="w-64 h-96 rounded-lg mb-8 shadow-md"
							src={`${process.env.NEXT_PUBLIC_IMAGES}/${tag.image}`}
							alt={tag.tagName}
							width={64}
							height={96}
							unoptimized
							priority
						/>
						<div className="flex flex-col ml-8 mr-8">
							<h1 className="text-center text-2xl mt-4 mb-2">
								{tag.tagName}
							</h1>

							<hr className="w-full h-px bg-gray-200 border-0" />

							<p className="mt-2 mb-3">
								<strong>Definição:</strong> {tag.definition}
							</p>
						</div>
					</div>
				</main>
			)}
			<article className="grid grid-cols-10 mt-6 mb-10">
				<div className="col-start-2 col-span-8 py-4 rounded-lg bg-pink-700">
					<h1 className="text-center text-2xl">
						Hentais com Tag {tag.tagName}
					</h1>
				</div>

				<div className="col-start-2 col-span-8 flex flex-row justify-center mt-6 mb-6 gap-8 breakLine">
					{Object.values(hentais).map((hentai) => {
						if (hentai.tags.includes(tag.tagName)) {
							return (
								<div className="flex flex-col" key={hentai._id}>
									<div className="mb-2">
										<Image
											className="w-64 h-96 rounded-lg mb-2 shadow-md"
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
										className="bg-blue-800 hover:bg-blue-600 transition-all ease-in duration-200 text-white p-2 rounded px-14 w-64"
										href={
											hentai.format == "Manga"
												? `/mangas/${hentai._id}`
												: `/doujinshis/${hentai._id}`
										}>
										Página do Hentai
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

export default TagDetails;
