import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const CollapsibleCard = ({ title, icon, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    
    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg transition-all duration-300 overflow-hidden">
            <h3 
                className="text-lg font-bold text-cyan-300 p-4 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors" 
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-3">
                    {icon}
                    <span>{title}</span>
                </div>
                <ChevronDown 
                    size={20} 
                    className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                />
            </h3>
            <div className={`transition-all duration-500 ease-in-out grid ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className="px-4 pb-4">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};