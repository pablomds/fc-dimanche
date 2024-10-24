import React from 'react';

interface IndexProps {
    children: React.ReactNode;
    className?: string;
}

const index: React.FC<IndexProps> = ({ children, className }) => {
  return (
    <div className={`min-h-[540px] min-w-[310px] max-w-[320px] md:w-1/2 md:h-3/5 lg:w-1/2 lg:max-w-[555px] lg:h-4/5 lg:max-h-[808px] px-4 lg:px-6 bg-[#FFFFFF] rounded-lg shadow-xl ${className}`}>
        {children}
    </div>
  )
}

export default index