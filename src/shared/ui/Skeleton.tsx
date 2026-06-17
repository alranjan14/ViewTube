import React from "react";

export interface SkeletonProps {
  className?: string;
  variant?: "rectangular" | "circular" | "text";
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "rectangular",
}) => {
  const baseStyles = "animate-pulse bg-slate-200";
  
  const variants = {
    rectangular: "rounded-lg",
    circular: "rounded-full",
    text: "rounded h-4",
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`} />
  );
};

export default Skeleton;
