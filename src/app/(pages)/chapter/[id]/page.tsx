"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/utils/api";
import Image from "next/image";
import styles from "./chapter.module.css";

import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

import ChibiBunny from "../../../../../public/chibi-bunny.png";

// Components
import { Spinner } from "@/components/Spinner";

function Chapter() {
	const { id } = useParams();
	const [chapter, setChapter] = useState<IChapter | null>(null);
	const [hentais, setHentais] = useState<IHentai[]>([]);
	const [token] = useState(localStorage.getItem("token") || "");
	const [user, setUser] = useState({});
	const [subscriptionActive, setSubscriptionActive] = useState(false);

	const router = useRouter();

	interface IHentai {
		_id: string;
		title: string;
		chapters: IChapter[];
		images: string[];
		mangaka: string;
		format: string;
	}

	interface IChapter {
		_id: string;
		titleChapter: string;
		subtitleChapter: string;
		imagesChapter: string[];
	}

	// Desabilitar o menu de contexto do botão direito do mouse
	useEffect(() => {
		document.addEventListener("contextmenu", (e) => {
			e.preventDefault();
		});

		return () => {
			// Remover o event listener ao desmontar o componente
			document.removeEventListener("contextmenu", (e) => {
				e.preventDefault();
			});
		};
	}, []);

	useEffect(() => {
		if (!token) {
			router.push("/login"); // Redireciona para a página de login
			return; // Encerre o useEffect para evitar que o restante do código seja executado
		}
		api.get("/users/checkuser", {
			headers: {
				Authorization: `Bearer ${JSON.parse(token)}`,
			},
		})
			.then((response) => {
				setUser(response.data);
				if (response.data.subscriptionInfo.length > 0) {
					setSubscriptionActive(
						response.data.subscriptionInfo[0].status
					);
				}
			})
			.catch((error) => {
				// Lidar com o erro, se necessário
			});

		api.get("/hentais").then((response) => {
			const hentaisData = response.data.hentais;
			setHentais(hentaisData);

			const selectedChapter: IChapter | null = hentaisData.reduce(
				(foundChapter: IChapter | null, hentai: IHentai) => {
					const chapter = hentai.chapters.find(
						(chapter) => chapter._id === id
					);

					if (chapter) {
						return chapter;
					}

					return foundChapter;
				},
				null
			);
			setChapter(selectedChapter || null);
		});
	}, [id, token, router]);

	if (!chapter || hentais.length === 0) {
		return (
			<section className="min-h-screen flex flex-col justify-center items-center mt-4 mb-16">
				<h1>
					<Spinner />
				</h1>
			</section>
		);
	}

	const hentai = hentais.find((hentai: IHentai) =>
		hentai.chapters.some((chap) => chap._id === id)
	);

	const currentChapterIndex = hentai
		? hentai.chapters.findIndex((chap) => chap._id === chapter?._id)
		: -1;

	// Verificar a assinatura antes de retornar o JSX
	if (!hentai || String(subscriptionActive) !== "active") {
		return (
			<section className="min-h-screen flex flex-col justify-center items-center">
				<div className="mb-2">
					<Image
						src={ChibiBunny}
						alt="Chibi Bunny"
						width={400}
						unoptimized
						priority
					/>
				</div>
				<h1 className="text-2xl mb-2">
					You do not have an active subscription to access this page.
				</h1>
				<p className="mb-2">
					Become premium to have access to 100% of the content!
				</p>
				<Link
					className="bg-blue-800 hover:bg-blue-600 transition-all ease-in duration-200 drop-shadow-md mt-4 py-2 px-4 rounded"
					href="/subscription">
					Subscribe to Premium Plan
				</Link>
			</section>
		);
	}

	// Se a assinatura for ativa, retornar o JSX correspondente
	return (
		<section className="min-h-screen flex flex-col items-center mt-4 mb-16">
			<div className="mb-8"></div>
			<article className="grid grid-cols-10">
				<div className="col-start-2 col-span-8">
					<div className="py-4 rounded-lg bg-pink-700 mb-4 shadow-lg text-white">
						<h1 className="text-center text-2xl">
							{hentai?.title} ({chapter.titleChapter})
						</h1>
						<h3 className="text-center text-xl">
							{chapter.subtitleChapter}
						</h3>
					</div>
					<div className="col-start-2 col-span-8 flex flex-row justify-center mt-6 mb-6 gap-8 overflow-visible">
						<div className="breakLine flex flex-row justify-center gap-4 static">
							{chapter.imagesChapter.length > 0 ? (
								chapter.imagesChapter.map((image, index) => (
									<Image
										className="w-9/12 rounded-lg mb-2 shadow-xl"
										key={index}
										src={`${process.env.NEXT_PUBLIC_IMAGES}/${image}`}
										alt=""
										draggable="false"
										width={64}
										height={96}
										unoptimized
										priority
									/>
								))
							) : (
								<p>
									There are no images available for this
									chapter.
								</p>
							)}
						</div>
						<a
							href="#"
							className={`bg-blue-800 hover:bg-blue-600 transition-all ease-in duration-200 shadow-xl ${styles.btn}`}></a>
					</div>
				</div>
			</article>
			<div className="flex flex-row justify-center gap-8">
				{currentChapterIndex > 0 && (
					<Link
						className="bg-blue-800 hover:bg-blue-600 transition-all ease-in duration-200 drop-shadow-md py-2 pl-3 pr-4 rounded flex flex-row justify-center items-center gap-2"
						href={`/chapter/${
							hentai?.chapters[currentChapterIndex - 1]._id
						}`}>
						<BsChevronLeft size={20} />
						Previous Chapter
					</Link>
				)}
				{currentChapterIndex < hentai.chapters.length - 1 && (
					<Link
						className="bg-blue-800 hover:bg-blue-600 transition-all ease-in duration-200 drop-shadow-md py-2 pl-4 pr-3 rounded flex flex-row justify-center items-center gap-2"
						href={`/chapter/${
							hentai?.chapters[currentChapterIndex + 1]._id
						}`}>
						Next Chapter
						<BsChevronRight size={20} />
					</Link>
				)}
			</div>
		</section>
	);
}

export default Chapter;
