import React, { useState } from "react";
import Image from "next/image";

import { Input } from "./Input";

interface IHentai {
	title: string;
	description: string;
	images: string[];
	name: string;
	mangaka: string;
	tags: string;
	status: string;
	format: string;
}

interface IMangaFormProps {
	handleSubmit: (data: IHentai) => void; // Defina o tipo da função handleSubmit
	hentaiData: IHentai;
}

function MangaForm({ handleSubmit, hentaiData }: IMangaFormProps) {
	const [hentai, setHentai] = useState<IHentai>(hentaiData || { images: [] });
	const [preview, setPreview] = useState<File[]>([]);

	function onFileChange(evt: React.SyntheticEvent) {
		const fileInput = evt.target as HTMLInputElement;
		const files = fileInput.files;

		if (files) {
			const fileArray = Array.from(files);
			setPreview(fileArray);
			// Converte os objetos File em URLs
			const imageUrls = fileArray.map((file) =>
				URL.createObjectURL(file)
			);
			setHentai({ ...hentai, images: imageUrls });
		}
	}

	function handleChange(evt: React.SyntheticEvent) {
		const input = evt.target as HTMLInputElement;
		setHentai({ ...hentai, [input.name]: input.value });
	}

	function submit(evt: React.FormEvent) {
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
						  hentai.images.map((image, index) => (
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
					text="Capa do Hentai"
					type="file"
					name="images"
					handleOnChange={onFileChange}
					multiple={true}
				/>

				<Input
					text="Título do Mangá"
					type="text"
					name="title"
					placeholder="Digite o título..."
					handleOnChange={handleChange}
					value={hentai.title || ""}
				/>

				<Input
					text="Sinopse do Mangá"
					type="text"
					name="description"
					placeholder="Digite a sinopse..."
					handleOnChange={handleChange}
					value={hentai.description || ""}
				/>

				<Input
					text="Nome do Mangaká"
					type="text"
					name="mangaka"
					placeholder="Digite o nome do mangaka..."
					handleOnChange={handleChange}
					value={hentai.mangaka || ""}
				/>

				<Input
					text="Tags"
					type="text"
					name="tags"
					placeholder="Digite as tags..."
					handleOnChange={handleChange}
					value={hentai.tags || ""}
				/>

				<Input
					text="Status"
					type="text"
					name="status"
					placeholder="Informe o Status do projeto..."
					handleOnChange={handleChange}
					value={hentai.status || ""}
				/>

				<Input
					text="Formato"
					type="text"
					name="format"
					placeholder="Informe o formato da obra..."
					handleOnChange={handleChange}
					value={hentai.format || ""}
				/>

				<button
					className="bg-blue-800 hover:bg-blue-500 duration-200 w-full rounded mt-6 p-3 drop-shadow-sm"
					type="submit">
					Cadastrar Hentai
				</button>
			</form>
		</section>
	);
}

export { MangaForm };
