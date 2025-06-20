import React, { useState } from 'react';
import { BrainCircuit, Sparkles } from 'lucide-react';
import { CollapsibleCard } from './common/CollapsibleCard';

export const AIAdvisor = ({ sheet }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [advice, setAdvice] = useState('');

    const handleGenerateAdvice = () => {
        setIsLoading(true);
        setAdvice('');
        setTimeout(() => {
            const sampleAdvice = `${sheet.trackName}の特性と、ドライバーメモの「${sheet.driverNotes?.freeText}」を考慮すると、フロントのスタビライザーを一段階柔らかくすることで、ターンイン時のアンダーステアが改善される可能性があります。`;
            setAdvice(sampleAdvice);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <CollapsibleCard title="AI セットアップアドバイザー" icon={<BrainCircuit className="text-purple-400"/>} defaultOpen={false}>
            <div className="space-y-4">
                <p className="text-sm text-gray-400">現在のセットアップとドライバーのメモを基に、AIが改善案を提案します。</p>
                <button 
                    onClick={handleGenerateAdvice} 
                    disabled={isLoading} 
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-lg transition-all disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/50"
                >
                    {isLoading ? '解析中...' : <><BrainCircuit size={18} /> アドバイスを生成</>}
                </button>
                {isLoading && (
                    <div className="text-center text-sm text-cyan-300 animate-pulse">
                        AIがセットアップを評価しています...
                    </div>
                )}
                {advice && (
                    <div className="bg-black/20 p-4 rounded-lg border border-purple-500/30">
                        <h4 className="font-semibold text-purple-300 flex items-center gap-2 mb-2">
                            <Sparkles size={18} /> AIからの提案
                        </h4>
                        <p className="text-gray-200 leading-relaxed">{advice}</p>
                    </div>
                )}
            </div>
        </CollapsibleCard>
    );
};