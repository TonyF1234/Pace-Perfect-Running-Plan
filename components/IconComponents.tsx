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