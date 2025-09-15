
import React from 'react';

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <div className="w-12 h-12 border-4 border-slate-300 border-t-sky-500 rounded-full animate-spin"></div>
    <p className="mt-4 text-slate-600 font-medium">Generating your personalized plan...</p>
    <p className="mt-2 text-sm text-slate-500">This can take a moment. Great things are worth the wait!</p>
  </div>
);

export default LoadingSpinner;
