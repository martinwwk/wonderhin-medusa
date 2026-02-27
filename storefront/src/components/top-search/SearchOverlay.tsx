// SearchOverlay.tsx

import cn from 'classnames';
import React from "react";
interface Props {
    onClick: () => void;
    displaySearch?: boolean;
    displayMobileSearch?: boolean;
}
const SearchOverlay: React.FC<Props> = ({ displayMobileSearch, displaySearch,  onClick }) => (
    <div
        className={cn(
            'overlay cursor-pointer  w-full h-full bg-black/30  top-0 start-0  absolute tingle-modal z-20',
            {
                'block': displayMobileSearch || displaySearch,
                'hidden': !(displayMobileSearch || displaySearch),
            }
        )}
        onClick={onClick}
    />
);

export default SearchOverlay;
