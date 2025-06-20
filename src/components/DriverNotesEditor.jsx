import React from 'react';
import { Wrench } from 'lucide-react';
import { CollapsibleCard } from './common/CollapsibleCard';
import { SelectField } from './common/SelectField';

export const DriverNotesEditor = ({ notes, onNotesChange }) => {
    const handleCornerChange = (speed, phase, value) => {
        const newNotes = JSON.parse(JSON.stringify(notes || {}));
        if (!newNotes.cornerBalance) {
            newNotes.cornerBalance = {
                lowSpeed: { entry: 'neutral', mid: 'neutral', exit: 'neutral' },
                midSpeed: { entry: 'neutral', mid: 'neutral', exit: 'neutral' },
                highSpeed: { entry: 'neutral', mid: 'neutral', exit: 'neutral' }
            };
        }
        newNotes.cornerBalance[speed][phase] = value;
        onNotesChange(newNotes);
    };

    const handleTextChange = (e) => {
        const newNotes = JSON.parse(JSON.stringify(notes || {}));
        newNotes.freeText = e.target.value;
        onNotesChange(newNotes);
    };

    const cornerSpeeds = [
        { key: 'lowSpeed', label: '低速' },
        { key: 'midSpeed', label: '中速' },
        { key: 'highSpeed', label: '高速' },
    ];
    
    const cornerPhases = [
        { key: 'entry', label: '侵入' },
        { key: 'mid', label: '中間' },
        { key: 'exit', label: '出口' },
    ];
    
    const balanceOptions = { 
        'neutral': 'ニュートラル', 
        'under': 'アンダー', 
        'over': 'オーバー' 
    };

    return (
        <CollapsibleCard title="ドライバーメモ" icon={<Wrench className="text-cyan-400"/>} defaultOpen={false}>
            <div className="space-y-6">
                <div>
                    <h4 className="font-semibold text-gray-300 border-b border-white/10 pb-2 mb-3">コーナー挙動</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-center">
                            <thead>
                                <tr className="text-gray-400">
                                    <th className="p-2"></th>
                                    {cornerPhases.map(phase => (
                                        <th key={phase.key} className="p-2 font-medium">{phase.label}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {cornerSpeeds.map(speed => (
                                    <tr key={speed.key} className="border-t border-white/10">
                                        <th className="p-2 text-left font-medium text-gray-300">{speed.label}</th>
                                        {cornerPhases.map(phase => (
                                            <td key={phase.key} className="p-1">
                                                <SelectField 
                                                    label=""
                                                    value={notes?.cornerBalance?.[speed.key]?.[phase.key] || 'neutral'}
                                                    onChange={(e) => handleCornerChange(speed.key, phase.key, e.target.value)}
                                                    className="text-xs"
                                                >
                                                    {Object.entries(balanceOptions).map(([value, label]) => (
                                                        <option key={value} value={value}>{label}</option>
                                                    ))}
                                                </SelectField>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-300 border-b border-white/10 pb-2 mb-3">フリーコメント</h4>
                    <textarea 
                        value={notes?.freeText || ''} 
                        onChange={handleTextChange} 
                        rows="5" 
                        className="w-full h-full flex-grow bg-black/20 border border-white/10 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 focus:outline-none transition-all" 
                    />
                </div>
            </div>
        </CollapsibleCard>
    );
};