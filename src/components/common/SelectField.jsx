import React from 'react';
import { ChevronsUpDown } from 'lucide-react';

export const SelectField = ({ label, name, value, onChange, children, ...props }) => (
    <div>
        {label && <label htmlFor={name} className="block text-base sm:text-sm font-medium text-gray-300 mb-2">{label}</label>}
        <div className="relative">
            <select 
                id={name} 
                name={name} 
                value={value || ''} 
                onChange={onChange} 
                {...props} 
                className="appearance-none w-full bg-black/20 border border-white/10 rounded-lg sm:rounded-md px-4 sm:px-3 py-3 sm:py-2 text-lg sm:text-base text-white focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 focus:outline-none transition-all min-h-touch sm:min-h-0 touch-manipulation"
            >
                {children}
            </select>
            <ChevronsUpDown className="absolute right-3 sm:right-3 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
        </div>
    </div>
);