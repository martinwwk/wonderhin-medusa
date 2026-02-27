'use client';

import BottomNavigation from "@/layouts/header/mobile-navigation";
import BackToTopButton from "@/components/shared/back-to-top";
import Header from "@/layouts/header";
import Footer from '@/layouts/footer';

import React from "react";

export default function ModernLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
      <div className="min-h-screen relative">
       
          {/* Panel Header Layout */}
          {
             <Header />
          }
          <main
              className="relative "
              style={{WebkitOverflowScrolling: 'touch'}}
          >
              {children}
          </main>
          
          {/* Panel - Footer Layout */}
          {
               <Footer/>
          }
          
          <BottomNavigation />
          <BackToTopButton/>
      </div>
  );
}
