import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => {
  return (
    <div 
      className={`bg-brand-primary/5 animate-pulse rounded-xl ${className}`}
      style={{
        backgroundImage: 'linear-gradient(90deg, transparent, rgba(206,56,190,0.05), transparent)',
        backgroundSize: '200% 100%',
      }}
    />
  );
};
