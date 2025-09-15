import React from 'react';

export const RunnerIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      d="M13.5 4.06c0-1.31.94-2.51 2.24-2.65A2.75 2.75 0 0 1 18.5 4v5.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5V4.06zM6 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12-2.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zM12.5 12.5v7.45c0 .58-.47 1.05-1.05 1.05h-.01c-.52 0-.96-.37-1.03-.88l-1.1-7.53c-.09-.64.16-1.28.66-1.72l3-3.2c.7-.74 1.83-.78 2.58-.08.75.7.79 1.84.08 2.58l-2.22 2.33c-.45.47-.71 1.08-.71 1.73z"
    />
    <path d="M7 15.5c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z" />
  </svg>
);

export const FlagIcon = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={className}
    >
        <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z" />
    </svg>
);

export const CalendarIcon = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={className}
    >
        <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
    </svg>
);

export const CheckIcon = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={className}
    >
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
    </svg>
);

export const XIcon = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={className}
    >
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
    </svg>
);

export const PencilIcon = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={className}
    >
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
    </svg>
);

export const SparkleIcon = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={className}
    >
        <path d="M12 2.5l1.55 3.15 3.45.5 -2.5 2.45 .6 3.45L12 10l-3.1 1.95 .6-3.45 -2.5-2.45 3.45-.5L12 2.5zM19 10l-1.55 3.15-3.45.5 2.5 2.45-.6 3.45L19 18l3.1-1.95-.6-3.45 2.5-2.45-3.45-.5L19 10zM5 10l-1.55 3.15-3.45.5 2.5 2.45-.6 3.45L5 18l3.1-1.95-.6-3.45 2.5-2.45-3.45-.5L5 10z" />
    </svg>
);
