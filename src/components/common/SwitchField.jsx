import React from 'react';

export const SwitchField = ({ label, checked, onChange }) => (
    <label className="flex items-center justify-between cursor-pointer bg-black/20 p-4 sm:p-3 rounded-lg border border-white/10 min-h-touch touch-manipulation">
        <span className="text-gray-200 font-medium text-base sm:text-sm pr-4">{label}</span>
        <div className="relative">
            <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
            <div className={`block w-16 h-10 sm:w-14 sm:h-8 rounded-full transition ${checked ? 'bg-gradient-to-r from-cyan-500 to-blue-500' : 'bg-gray-600'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-8 h-8 sm:w-6 sm:h-6 rounded-full transition transform ${checked ? 'translate-x-6 sm:translate-x-6' : ''}`}></div>
        </div>
    </label>
);