interface DividerProps {
  className?: string;
}

const Divider: React.FC<DividerProps> = ({ className = '' }) => {
  return <div className={`border-t border-border-base my-15 lg:my-20 ${className}`} />;
};

export default Divider;
