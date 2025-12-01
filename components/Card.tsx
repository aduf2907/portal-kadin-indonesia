
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div className={`p-6 border-b border-slate-200 ${className}`}>
            {children}
        </div>
    )
}

export const CardContent: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div className={`p-6 ${className}`}>
            {children}
        </div>
    )
}

export const CardFooter: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div className={`p-6 bg-slate-50 border-t border-slate-200 ${className}`}>
            {children}
        </div>
    )
}


export default Card;
