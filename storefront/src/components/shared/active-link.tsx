import Link from '@/components/shared/link';
import React, { ReactElement } from 'react';

// Define the props interface for ActiveLink
interface ActiveLinkProps {
    children: ReactElement<{ className?: string }>; // Specify that children has a className prop
    activeClassName: string;
    href: string;
}

const ActiveLink = ({
                        children,
                        activeClassName,
                        href,
                        ...props
                    }: ActiveLinkProps) => {
    const child = React.Children.only(children); // Ensure only one child
    const childClassName = child.props.className || ''; // Safely access className

    const className = `${childClassName} ${activeClassName}`.trim();

    return (
        <Link href={href} {...props}>
            {React.cloneElement(child, {
                className: className || undefined, // Pass merged className
            })}
        </Link>
    );
};

export default ActiveLink;