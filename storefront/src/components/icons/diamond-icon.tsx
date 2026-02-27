const DiamondIcon = ({
                       width = '12',
                       height = '12',
                       className = '',
                   }) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path fill="currentColor" d="M0 6c3 0 6-3 6-6 0 3 3 6 6 6-3 0-6 3-6 6 0-3-3-6-6-6Z"></path>
        </svg>
    );
};

export default DiamondIcon;
