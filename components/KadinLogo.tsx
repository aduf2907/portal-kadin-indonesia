
import React from 'react';

export const KadinLogo = ({ className }: { className?: string }) => (
  <svg 
    className={className}
    viewBox="0 0 100 100" 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="4"
  >
    <defs>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#fde047', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#d97706', stopOpacity: 1 }} />
      </linearGradient>
       <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#0369a1', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#0c4a6e', stopOpacity: 1 }} />
      </linearGradient>
    </defs>

    {/* Outer circle */}
    <circle cx="50" cy="50" r="48" stroke="url(#blueGradient)" strokeWidth="4" />

    {/* Stylized 'K' */}
    <path d="M 30 25 V 75" stroke="url(#goldGradient)" strokeWidth="6" strokeLinecap="round" />
    <path d="M 65 25 L 30 50 L 65 75" stroke="url(#goldGradient)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>

    {/* Globe-like lines */}
    <path d="M 40 20 C 50 40, 50 60, 40 80" stroke="url(#blueGradient)" strokeWidth="2.5" />
    <path d="M 60 20 C 50 40, 50 60, 60 80" stroke="url(#blueGradient)" strokeWidth="2.5" />
    <path d="M 25 50 H 75" stroke="url(#blueGradient)" strokeWidth="2.5" />
  </svg>
);
