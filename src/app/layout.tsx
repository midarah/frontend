import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ThemeProviderWrapper } from "@/components/ThemeProviderWrapper";

import { Toaster } from "react-hot-toast";

// Components
import { Navbar } from "../components/Navbar";
import { Footer } from "@/components/Footer";

// Context
import { UserProvider } from "@/context/UserContext";

const poppins = Poppins({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
	title: "Midara",
	description: "O melhor site Hentai Brasileiro",
};

interface IPropsChildren {
	children: React.ReactNode;
}

export default function RootLayout({ children }: IPropsChildren) {
	return (
		<html lang="pt-BR">
			<head>
				<head>
					<link rel="icon" href="/favicon.png" type="image/png" />
					{/* Você pode especificar vários formatos de favicon aqui, se desejar */}
				</head>
				<link
					href="https://cdn.jsdelivr.net/npm/daisyui@3.7.7/dist/full.css"
					rel="stylesheet"
					type="text/css"
				/>
			</head>
			<body className={poppins.className}>
				<ThemeProviderWrapper>
					<UserProvider>
						<Navbar />
						<Toaster
							position="bottom-center"
							reverseOrder={false}
							toastOptions={{ duration: 2000 }}
						/>
						{children}
						<Footer />
					</UserProvider>
				</ThemeProviderWrapper>
			</body>
		</html>
	);
}
