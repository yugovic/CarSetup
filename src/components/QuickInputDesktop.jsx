import React, { useEffect, useRef } from 'react';
import { Zap, Thermometer, Droplets, Save, TrendingUp, Info } from 'lucide-react';

const DesktopNumberInput = ({ label, value, onChange, unit = '', min, max, step = 1, tabIndex, onEnter, compact = false }) => {
    const inputRef = useRef(null);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && onEnter) {
            onEnter();
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            const newValue = parseFloat(value || 0) + step;
            if (!max || newValue <= max) {
                onChange(newValue.toString());
            }
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const newValue = parseFloat(value || 0) - step;
            if (!min || newValue >= min) {
                onChange(newValue.toString());
            }
        }
    };

    return (
        <div className={`bg-gradient-to-br from-white/5 to-white/10 rounded-lg border border-white/10 hover:border-cyan-400/50 transition-all group ${
            compact ? 'p-2' : 'p-3'
        }`}>
            {label && <label className="text-xs text-gray-400 block mb-1 truncate">{label}</label>}
            <div className="flex items-center gap-1">
                <input
                    ref={inputRef}
                    type="number"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={`flex-1 min-w-0 bg-black/30 text-white font-mono border border-white/20 rounded outline-none focus:border-cyan-400 transition-colors ${
                        compact ? 'text-xs px-1.5 py-0.5' : 'text-sm px-2 py-1'
                    }`}
                    min={min}
                    max={max}
                    step={step}
                    tabIndex={tabIndex}
                />
                {unit && <span className={`text-gray-400 flex-shrink-0 ${compact ? 'text-xs w-6' : 'text-xs w-8'}`}>{unit}</span>}
            </div>
        </div>
    );
};

const TirePressureComparison = ({ beforePressures, afterPressures, onChange, tabIndexStart }) => {
    // 差分を計算
    const calculateDiff = (before, after) => {
        const beforeVal = parseFloat(before || 0);
        const afterVal = parseFloat(after || 0);
        return afterVal - beforeVal;
    };

    const PressureInputWithDiff = ({ label, beforeValue, afterValue, position, tabIndex }) => {
        const diff = calculateDiff(beforeValue, afterValue);
        
        return (
            <div className="space-y-1">
                <div className="text-xs text-gray-400 text-center font-medium">{label}</div>
                <div className="flex items-center gap-1">
                    {/* 走行前 */}
                    <div className="flex-1 min-w-0">
                        <DesktopNumberInput
                            value={beforeValue}
                            onChange={(value) => onChange(`setupBefore.tires.pressure.${position}`, value)}
                            unit="kPa"
                            min={100}
                            max={350}
                            step={5}
                            tabIndex={tabIndex}
                            compact={true}
                        />
                    </div>
                    
                    {/* 矢印 */}
                    <div className="text-gray-500 text-xs px-1">→</div>
                    
                    {/* 走行後 */}
                    <div className="flex-1 min-w-0 relative">
                        <DesktopNumberInput
                            value={afterValue}
                            onChange={(value) => onChange(`setupAfter.tires.pressure.${position}`, value)}
                            unit="kPa"
                            min={100}
                            max={350}
                            step={5}
                            tabIndex={tabIndex + 4}
                            compact={true}
                        />
                        {/* 差分表示 - 絶対配置で下に表示 */}
                        <div className="absolute -bottom-5 left-0 right-0 text-center">
                            {afterValue && beforeValue && diff !== 0 ? (
                                <span className={`text-xs font-mono ${
                                    diff > 0 ? 'text-red-400' : 'text-blue-400'
                                }`}>
                                    {diff > 0 ? '+' : ''}{diff.toFixed(0)}
                                </span>
                            ) : (
                                <span className="text-xs text-transparent">-</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-black/20 rounded-xl p-2 border border-white/10">
            <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
                {['fl', 'fr', 'rl', 'rr'].map((position, index) => (
                    <div key={position} className="pb-4">
                        <PressureInputWithDiff
                            label={position.toUpperCase()}
                            beforeValue={beforePressures?.[position]}
                            afterValue={afterPressures?.[position]}
                            position={position}
                            tabIndex={tabIndexStart + index}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

const QuickStats = ({ sheet, previousSheet }) => {
    const calculateAvg = (pressures) => {
        if (!pressures) return 0;
        const values = Object.values(pressures).map(v => parseFloat(v || 0));
        return values.reduce((a, b) => a + b, 0) / values.length;
    };

    const currentAvg = calculateAvg(sheet.setupBefore?.tires?.pressure);
    const previousAvg = previousSheet ? calculateAvg(previousSheet.setupBefore?.tires?.pressure) : null;

    return (
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl p-4 border border-cyan-500/20">
            <h4 className="text-sm font-medium text-cyan-300 mb-3 flex items-center gap-2">
                <TrendingUp size={16} />
                クイック統計
            </h4>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-400">平均タイヤ圧:</span>
                    <span className="text-white font-mono">{currentAvg.toFixed(1)} kPa</span>
                </div>
                {previousAvg && (
                    <div className="flex justify-between">
                        <span className="text-gray-400">前回比:</span>
                        <span className={`font-mono ${currentAvg > previousAvg ? 'text-red-400' : 'text-blue-400'}`}>
                            {currentAvg > previousAvg ? '+' : ''}{(currentAvg - previousAvg).toFixed(1)} kPa
                        </span>
                    </div>
                )}
                <div className="flex justify-between">
                    <span className="text-gray-400">気温:</span>
                    <span className="text-white font-mono">{sheet.environment?.airTemp || '-'}°C</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">路温:</span>
                    <span className="text-white font-mono">{sheet.environment?.trackTemp || '-'}°C</span>
                </div>
            </div>
        </div>
    );
};

export const QuickInputDesktop = ({ sheet, onSheetChange, onSave, hasUnsavedChanges, previousSheet }) => {
    const handleChange = (path, value) => {
        const keys = path.split('.');
        const newSheet = JSON.parse(JSON.stringify(sheet));
        let current = newSheet;
        
        for (let i = 0; i < keys.length - 1; i++) {
            if (current[keys[i]] === undefined) current[keys[i]] = {};
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        onSheetChange(newSheet);
    };

    // キーボードショートカット
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ctrl/Cmd + S で保存
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                if (hasUnsavedChanges) {
                    onSave();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [hasUnsavedChanges, onSave]);

    if (!sheet) return null;

    const weatherOptions = ['晴れ', '曇り', '雨', '小雨', '大雨', '雪'];

    return (
        <div className="bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-gray-900/70 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-6">
            {/* ヘッダー */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl shadow-lg">
                        <Zap className="text-white" size={20} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">クイック入力</h2>
                </div>
                {hasUnsavedChanges && (
                    <button 
                        onClick={onSave}
                        className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-semibold py-2 px-4 rounded-lg transition-all text-sm"
                    >
                        <Save size={16} />
                        保存
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* メインコンテンツ */}
                <div className="xl:col-span-2 space-y-4">
                    {/* 環境データ */}
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                        <div className="flex items-center gap-2 mb-3">
                            <Thermometer className="text-cyan-400" size={16} />
                            <h3 className="text-lg font-semibold text-cyan-300">環境データ</h3>
                        </div>
                        <div className="grid grid-cols-6 gap-2">
                            <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-lg p-2 border border-white/10">
                                <label className="text-xs text-gray-400 block mb-1">天候</label>
                                <select 
                                    value={sheet.environment?.weather || ''} 
                                    onChange={(e) => handleChange('environment.weather', e.target.value)}
                                    className="w-full bg-black/30 text-white text-xs border border-white/20 rounded px-1 py-0.5 outline-none focus:border-cyan-400 transition-colors"
                                    tabIndex={1}
                                >
                                    <option value="">-</option>
                                    {weatherOptions.map(option => (
                                        <option key={option} value={option} className="bg-gray-800">
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <DesktopNumberInput 
                                label="気温" 
                                value={sheet.environment?.airTemp} 
                                onChange={(value) => handleChange('environment.airTemp', value)}
                                unit="°C"
                                min={-10}
                                max={50}
                                tabIndex={2}
                                compact={true}
                            />
                            <DesktopNumberInput 
                                label="路温" 
                                value={sheet.environment?.trackTemp} 
                                onChange={(value) => handleChange('environment.trackTemp', value)}
                                unit="°C"
                                min={-10}
                                max={80}
                                tabIndex={3}
                                compact={true}
                            />
                            <DesktopNumberInput 
                                label="湿度" 
                                value={sheet.environment?.humidity} 
                                onChange={(value) => handleChange('environment.humidity', value)}
                                unit="%"
                                min={0}
                                max={100}
                                tabIndex={4}
                                compact={true}
                            />
                            <DesktopNumberInput 
                                label="気圧" 
                                value={sheet.environment?.pressure} 
                                onChange={(value) => handleChange('environment.pressure', value)}
                                unit="hPa"
                                min={950}
                                max={1050}
                                tabIndex={5}
                                compact={true}
                            />
                            <DesktopNumberInput 
                                label="燃料" 
                                value={sheet.setupBefore?.fuel} 
                                onChange={(value) => handleChange('setupBefore.fuel', value)}
                                unit="L"
                                min={0}
                                max={100}
                                step={5}
                                tabIndex={6}
                                compact={true}
                            />
                        </div>
                    </div>

                    {/* タイヤ空気圧 */}
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Droplets className="text-blue-400" size={16} />
                                <h3 className="text-lg font-semibold text-blue-300">タイヤ空気圧</h3>
                            </div>
                            <div className="text-xs text-gray-400">
                                <span className="text-gray-300">走行前</span> → <span className="text-gray-300">走行後</span> (kPa)
                            </div>
                        </div>
                        <TirePressureComparison
                            beforePressures={sheet.setupBefore?.tires?.pressure}
                            afterPressures={sheet.setupAfter?.tires?.pressure}
                            onChange={handleChange}
                            tabIndexStart={7}
                        />
                    </div>

                    {/* ダンパー設定 */}
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-orange-400 rounded"></div>
                                <h3 className="text-lg font-semibold text-orange-300">ダンパー設定</h3>
                            </div>
                            <div className="text-xs text-gray-400">
                                <span className="text-gray-300">Bump</span> / <span className="text-gray-300">Rebound</span> (click)
                            </div>
                        </div>
                        <div className="bg-black/20 rounded-xl p-2 border border-white/10">
                            <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
                                {['fl', 'fr', 'rl', 'rr'].map((corner, index) => (
                                    <div key={corner} className="space-y-1">
                                        <div className="text-xs text-gray-400 text-center font-medium">{corner.toUpperCase()}</div>
                                        <div className="flex items-center gap-1">
                                            <div className="flex-1 min-w-0">
                                                <DesktopNumberInput 
                                                    value={sheet.setupBefore?.suspension?.dampers?.[corner]?.bump} 
                                                    onChange={(value) => handleChange(`setupBefore.suspension.dampers.${corner}.bump`, value)}
                                                    unit=""
                                                    min={0}
                                                    max={20}
                                                    tabIndex={14 + index * 2}
                                                    compact={true}
                                                />
                                            </div>
                                            <div className="text-gray-500 text-xs">/</div>
                                            <div className="flex-1 min-w-0">
                                                <DesktopNumberInput 
                                                    value={sheet.setupBefore?.suspension?.dampers?.[corner]?.rebound} 
                                                    onChange={(value) => handleChange(`setupBefore.suspension.dampers.${corner}.rebound`, value)}
                                                    unit=""
                                                    min={0}
                                                    max={20}
                                                    tabIndex={15 + index * 2}
                                                    compact={true}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* サイドパネル */}
                <div className="space-y-4">
                    {/* クイック統計 */}
                    <QuickStats sheet={sheet} previousSheet={previousSheet} />

                    {/* ショートカット一覧 */}
                    <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-xl p-4 border border-purple-500/20">
                        <h4 className="text-sm font-medium text-purple-300 mb-3 flex items-center gap-2">
                            <Info size={16} />
                            キーボードショートカット
                        </h4>
                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-gray-400">保存:</span>
                                <kbd className="px-2 py-1 bg-black/30 rounded text-gray-300">Ctrl+S</kbd>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">次の項目:</span>
                                <kbd className="px-2 py-1 bg-black/30 rounded text-gray-300">Tab</kbd>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">前の項目:</span>
                                <kbd className="px-2 py-1 bg-black/30 rounded text-gray-300">Shift+Tab</kbd>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">値を増やす:</span>
                                <kbd className="px-2 py-1 bg-black/30 rounded text-gray-300">↑</kbd>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">値を減らす:</span>
                                <kbd className="px-2 py-1 bg-black/30 rounded text-gray-300">↓</kbd>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};