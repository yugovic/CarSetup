import React from 'react';

export const InputField = ({ label, name, value, onChange, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-base sm:text-sm font-medium text-gray-300 mb-2">{label}</label>
        <input 
            id={name} 
            name={name} 
            value={value || ''} 
            onChange={onChange} 
            {...props} 
            className="w-full bg-black/20 border border-white/10 rounded-lg sm:rounded-md px-4 sm:px-3 py-3 sm:py-2 text-lg sm:text-base text-white focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 focus:outline-none transition-all min-h-touch sm:min-h-0 touch-manipulation" 
            inputMode={props.type === 'number' ? 'decimal' : undefined}
        />
    </div>
);