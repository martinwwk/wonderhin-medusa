import React from 'react';

interface TextSplitProps {
    text: string;
    className?: string;
    tag?: React.ElementType;
}

export const useTextSplit = ({
                                 text,
                                 className='block',
                                 tag = 'span',
                             }: TextSplitProps): React.ReactElement[] => {
    if (!text) return [];

    const Tag = tag; // No need to explicitly type it; inferred from `tag`

    return text.split('\n').map((line, index) => (
        <Tag key={`text-split-${index}`} className={className}>
        {line}
        </Tag>
));
};
