import type {Metadata} from "next";
import {Instrument_Sans} from "next/font/google";
import "./globals.css";

import ModalManaged from '@/components/common/modal/modalManaged';
import Providers from "@/app/provider/provider";
import DrawerManaged from "@/components/common/drawer/drawerManaged";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import PanelManaged from "@/components/panel/panel-managed";
import React from "react";

const instrument = Instrument_Sans({
    subsets: ['latin'],
    display: 'swap',
    preload: false, // Disable preloading
});


export const metadata: Metadata = {
    title: {
        template: 'Glozin | %s',
        default: 'Glozin',
    },
};

export default function RootLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" dir="ltr" suppressHydrationWarning>
        <body className={`${instrument.className}  antialiased bg-background`}>
        <Providers
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
                {children}
		<PanelManaged/>
                <ModalManaged/>
                <DrawerManaged/>
        </Providers>
        </body>
        </html>
    );
}
