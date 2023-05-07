import { Inter as FontSans } from "next/font/google";
import localFont from "next/font/local";

import "~styles/globals.css";

import { ModeToggle } from "~/components/mode-toggle";
import { ThemeProvider } from "~/components/theme-provider";
import SupabaseListener from "~/lib/supabase/supabase-listener";
import SupabaseProvider from "~/lib/supabase/supabase-provider";
import { Analytics } from "~components/analytics";
import { TailwindIndicator } from "~components/tailwind-indicator";
import { Toaster } from "~components/ui/toaster";
import { siteConfig } from "~config/site";
import { createServerClient } from "~lib/supabase/supabase-server";
import { cn } from "~lib/utils";

const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});

// Font files can be colocated inside of `pages`
const fontHeading = localFont({
	src: "../assets/fonts/CalSans-SemiBold.woff2",
	variable: "--font-heading",
});

interface RootLayoutProps {
	children: React.ReactNode;
}

export const metadata = {
	title: {
		default: siteConfig.name,
		template: `%s | ${siteConfig.name}`,
	},
	description: siteConfig.description,
	keywords: [
		"Next.js",
		"React",
		"Tailwind CSS",
		"Server Components",
		"Radix UI",
	],
	authors: [
		{
			name: "Evgeny Kirichuk",
			url: "https://kirichuk.me",
		},
	],
	creator: "kirichuk",
	themeColor: [
		{
			media: "(prefers-color-scheme: light)",
			color: "white",
		},
		{
			media: "(prefers-color-scheme: dark)",
			color: "black",
		},
	],
	openGraph: {
		type: "website",
		locale: "en_US",
		url: siteConfig.url,
		title: siteConfig.name,
		description: siteConfig.description,
		siteName: siteConfig.name,
	},
	twitter: {
		card: "summary_large_image",
		title: siteConfig.name,
		description: siteConfig.description,
		images: [`${siteConfig.url}/og.jpg`],
		creator: "@shadcn",
	},
	icons: {
		icon: "/favicon.ico",
		shortcut: "/favicon-16x16.png",
		apple: "/apple-touch-icon.png",
	},
	manifest: `${siteConfig.url}/site.webmanifest`,
};

export default async function RootLayout({
	children,
}: RootLayoutProps) {
	const supabase = createServerClient();

	const {
		data: { session },
	} = await supabase.auth.getSession();

	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body
				className={cn(
					"min-h-screen bg-background font-sans antialiased",
					fontSans.variable,
					fontHeading.variable
				)}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
				>
					<SupabaseProvider session={session}>
						{children}
					</SupabaseProvider>

					<Analytics />
					<Toaster />
					<TailwindIndicator />
					<div className="absolute bottom-4 right-4">
						<ModeToggle />
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
