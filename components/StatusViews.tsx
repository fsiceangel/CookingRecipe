import React from 'react';
import { LoadingIcon } from './Icons';

export const LoadingState: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex flex-col items-center justify-center h-64">
    <LoadingIcon />
    <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">{text}</p>
  </div>
);

export const ErrorState: React.FC<{ message: string }> = ({ message }) => (
  <div className="text-center col-span-full py-12 bg-red-100 dark:bg-red-900/40 rounded-lg">
    <p className="text-red-700 dark:text-red-400 font-semibold">{message}</p>
  </div>
);
