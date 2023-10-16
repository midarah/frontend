import React, { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";

import { Input } from "./Input";

interface IChapterData {
	name: string;
	images: FileList; // Altere o tipo para FileList para representar múltiplos arquivos
	titleChapter: string;
	subtitleChapter: string;
	// Outras propriedades, se houver
}

interface IChapterFormProps {
	handleSubmit: (data: IChapterData) => void;
	hentaiData: IChapterData;
}

function ChapterForm({ handleSubmit, hentaiData }: IChapterFormProps) {
	const [hentai, setHentai] = useState<IChapterData>(
		hentaiData || {
			images: [],
			titleChapter: "",
			subtitleChapter: "",
		}
	);

	const [preview, setPreview] = useState<File[]>([]);

	function onFileChange(evt: ChangeEvent<HTMLInputElement>) {
		const fileInput = evt.target;
		if (fileInput.files) {
			setPreview(Array.from(fileInput.files));
			setHentai({ ...hentai, images: fileInput.files });
		}
	}

	function handleChange(evt: ChangeEvent<HTMLInputElement>) {
		setHentai({ ...hentai, [evt.target.name]: evt.target.value });
	}

	function submit(evt: FormEvent) {
		evt.preventDefault();
		handleSubmit(hentai);
	}

	return (
		<section>
			<form onSubmit={submit}>
				<div className="flex justify-center w-40 gap-2">
					{preview.length > 0
						? preview.map((image, index) => (
								<Image
									className="rounded"
									src={URL.createObjectURL(image)}
									alt={hentai.name}
									key={`${hentai.name} + ${index}`}
									width={64}
									height={96}
									unoptimized
									priority
								/>
						  ))
						: hentai.images &&
						  Array.from(hentai.images).map((image, index) => (
								<Image
									src={`http://localhost:5000/images/hentais/${image}`}
									alt={hentai.name}
									key={`${hentai.name} + ${index}`}
									width={64}
									height={96}
									unoptimized
									priority
								/>
						  ))}
				</div>
				<Input
					text="Páginas do Capítulo"
					type="file"
					name="images"
					handleOnChange={onFileChange}
					multiple={true}
				/>

				<Input
					text="Título do Capítulo"
					type="text"
					name="titleChapter"
					placeholder="Digite o título..."
					handleOnChange={handleChange}
					value={hentai.titleChapter || ""}
				/>

				<Input
					text="Subtítulo do Capítulo"
					type="text"
					name="subtitleChapter"
					placeholder="Digite a sinopse..."
					handleOnChange={handleChange}
					value={hentai.subtitleChapter || ""}
				/>

				<button
					className="bg-blue-800 hover:bg-blue-500 duration-200 w-full rounded mt-6 p-3 drop-shadow-sm"
					type="submit">
					Cadastrar Capítulo
				</button>
			</form>
		</section>
	);
}

export { ChapterForm };
