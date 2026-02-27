'use client';

import dynamic from 'next/dynamic';
import { useUI } from '@/hooks/use-UI';
import {Drawer} from '@/components/common/drawer/drawer';
import motionProps from '@/components/common/drawer/motion';
import React, {useEffect} from "react";
import {usePanel} from "@/hooks/use-panel";


const CartDrawer = dynamic(() => import('@/components/cart/cart-drawer'), {ssr: false});

const OrderDetails = dynamic(() => import('@/components/orders/order-drawer'), {ssr: false});

const PanelCustomizer = dynamic(() => import('@/components/panel/panel-drawer'), {ssr: false});

const CompareDrawer = dynamic(() => import('@/components/compare/compare-drawer'), {ssr: false});


export default function DrawerManaged() {
    const {displayDrawer, closeDrawer, drawerView} = useUI();
    const { selectedDirection } = usePanel();
    const dir = selectedDirection;
    const contentWrapperCSS = dir === 'ltr' ? {right: 0} : {left: 0};
    
    // Hide scrollbar when pane is open and restore when closed
    useEffect(() => {
        if (displayDrawer) {
            document.body.style.overflow = 'hidden';
            document.body.style.width = '100%';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [displayDrawer]);
    
    const getPlacement = (view: string, direction: string) => {
        if (view === 'SEARCH_SIDEBAR') return 'top';
        if (view === 'COMPARE_SIDEBAR') return 'bottom';
        return direction === 'rtl' ? 'left' : 'right';
    };
    
    return (
        <Drawer
            rootClassName={
                drawerView === 'ORDER_DETAILS' ? 'order-details-drawer' : ''
            }
            open={displayDrawer}
            placement={getPlacement(drawerView || '', dir)}
          
            onClose={closeDrawer}
            // @ts-ignore
            level={null}
            contentWrapperStyle={contentWrapperCSS}
            {...motionProps}
        >
            {drawerView === 'CART_SIDEBAR' && <CartDrawer />}
            {drawerView === 'ORDER_DETAILS' && <OrderDetails/>}
            {drawerView === 'PANEL_SIDEBAR' && <PanelCustomizer/>}
            {drawerView === 'COMPARE_SIDEBAR' && <CompareDrawer/>}
        </Drawer>
    );
}
