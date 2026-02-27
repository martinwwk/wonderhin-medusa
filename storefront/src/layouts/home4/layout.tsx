'use client';

import BackToTopButton from '@/components/shared/back-to-top';
import BottomNavigation from "@/layouts/header/mobile-navigation";
import Header from '@/layouts/header';
import Header3 from "@/layouts/home3/header";
import Header4 from "@/layouts/home4/header";


import Footer from '@/layouts/footer';


import {usePanel} from "@/hooks/use-panel";
import React from "react";
import RenderedHighLightedBar from "@/layouts/header/highlighted-bar";

export default function Home4Layout({
	                                    children,
                                    }: {
	children: React.ReactNode;
}) {
	const { selectedLayout, selectedFooter } = usePanel();
	return (
		<div className="min-h-screen relative">
			<RenderedHighLightedBar className={"bg-linear-65 from-purple-500 to-pink-500"}/>

			{/* Panel Header Layout */}
			{
				selectedLayout === 'Basic' ? <Header />
				: selectedLayout === 'Header3' ? <Header3 />
				: <Header4 />
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
				selectedFooter === 'Footer5'   ? <Footer variant={"dark"}/>
				: <Footer/>
			}
			
			<BottomNavigation />
			<BackToTopButton/>
		</div>
	);
}
