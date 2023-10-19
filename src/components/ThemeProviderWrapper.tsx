"use client";

import { ThemeProvider } from "next-themes";

interface IPropsChildren {
	children: React.ReactNode;
}

function ThemeProviderWrapper({ children }: IPropsChildren) {
	return (
		<ThemeProvider enableSystem={true} attribute="class">
			{children}
		</ThemeProvider>
	);
}

export { ThemeProviderWrapper };
