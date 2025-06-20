import React from 'react';
import { ArrowLeft, Car } from 'lucide-react';
import { CollapsibleCard } from './common/CollapsibleCard';
import { SwitchField } from './common/SwitchField';

export const SettingsPage = ({ configs, setConfigs, onBack, vehicleList }) => {
    const handleToggle = (vehicle, key) => {
        setConfigs(prev => ({ 
            ...prev, 
            [vehicle]: { 
                ...prev[vehicle], 
                [key]: !prev[vehicle][key] 
            } 
        }));
    };

    return (
        <div className="bg-gray-900/10 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl p-4 sm:p-6">
             <div className="flex items-center mb-6 gap-4">
                <button 
                    onClick={onBack} 
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
                >
                    <ArrowLeft />
                </button>
                <h2 className="text-3xl font-bold text-white tracking-wider">車種別項目設定</h2>
            </div>
            <div className="space-y-6">
                {vehicleList.map(vehicle => (
                    <CollapsibleCard key={vehicle} title={vehicle} icon={<Car className="text-cyan-400"/>} defaultOpen={true}>
                        <div className="space-y-4">
                             <SwitchField 
                                 label="サスペンション設定" 
                                 checked={!!configs[vehicle]?.suspension} 
                                 onChange={() => handleToggle(vehicle, 'suspension')} 
                             />
                        </div>
                    </CollapsibleCard>
                ))}
            </div>
        </div>
    );
};