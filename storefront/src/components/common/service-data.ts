'use client';

import BoxIcon from "@/components/icons/featured/box-icon";
import SyncIcon from "@/components/icons/featured/sync-icon";
import FeedbackIcon from "@/components/icons/featured/feedback-icon";
import CardIcon from "@/components/icons/featured/card-icon";
import { ComponentType } from "react";

// Define the type for the icon props
interface IconProps {
    className?: string;
    width?: number;
    height?: number;
}
// Define the type for the data items
export interface ServiceData {
    id: number;
    icon: ComponentType<IconProps>;
    title: string;
    description: string;
    href: string;
}

export const HomeService: ServiceData[] = [
    {
        id: 1,
        icon: BoxIcon,
        title: 'Free Shipping',
        description: 'Enjoy free worldwide shipping and returns, with customs and duties taxes included.',
        href: '/',
    },
    {
        id: 2,
        icon: SyncIcon,
        title: 'Free Returns',
        description: 'Free returns within 15 days, please make sure the items are in undamaged condition.',
        href: '/',
    },
    {
        id: 3,
        icon: FeedbackIcon,
        title: 'Support Online',
        description: 'We support customers 24/7, send questions we will solve for you immediately.',
        href: '/',
    },
];


export const HomeThreeService: ServiceData[] = [
    {
        id: 1,
        icon: BoxIcon,
        title: 'Free Shipping',
        description: 'You will love at great low prices.',
        href: '/',
    },
    {
        id: 2,
        icon: SyncIcon,
        title: 'Free Returns',
        description: 'Within 15 days for an exchange.',
        href: '/',
    },
    {
        id: 3,
        icon: CardIcon,
        title: 'Flexible Payment',
        description: 'Pay with multiple credit cards.',
        href: '/',
    },
    {
        id: 4,
        icon: FeedbackIcon,
        title: 'Support Online',
        description: 'Outstanding premium support.',
        href: '/',
    },
];