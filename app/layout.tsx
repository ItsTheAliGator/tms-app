import "./globals.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const defaultUrl = process.env.VERCEL_URL ? process.env.VERCEL_URL : "http://localhost:3000";

export const metadata: Metadata = {
	metadataBase: new URL(defaultUrl),
	title: "TMS App",
	description: "TMS App Proof of Concept",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={`${inter.className} bg-background text-foreground`}>
				<main className="min-h-screen flex flex-col items-center">{children}</main>
			</body>
		</html>
	);
}
