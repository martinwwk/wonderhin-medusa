'use client';
import BackToTopButton from '@/components/shared/back-to-top';
import BottomNavigation from "@/layouts/header/mobile-navigation";

import Header5 from "@/layouts/home5/header";
import Header3 from "@/layouts/home3/header";
import Header4 from "@/layouts/home4/header";
import Footer from '@/layouts/footer';
import {usePanel} from "@/hooks/use-panel";
import React from "react";
import RenderedHighLightedBar from "@/layouts/header/highlighted-bar";

export default function Home5Layout({
	                                    children,
                                    }: {
	children: React.ReactNode;
}) {
	const {selectedLayout,selectedFooter} = usePanel();
	return (
		<div className="min-h-screen relative">
			<RenderedHighLightedBar/>

			{/* Panel Header Layout */}
			{
				selectedLayout === 'Header3' ? <Header3 />
				: selectedLayout === 'Header4' ? <Header4 />
				: <Header5 />
			}
			<main
				className="relative "
				style={{
					WebkitOverflowScrolling: 'touch',
				}}
			>
				{children}
			</main>
			
			{/* Panel - Footer Layout */}
			{
				selectedFooter === 'Basic'   ? <Footer />
				: <Footer variant={"dark"} container={"small"}/>
			}

			<BottomNavigation/>
			<BackToTopButton/>
		</div>
	);
}
