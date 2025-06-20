import React, { useEffect, useRef } from 'react';
import { Zap, Thermometer, Droplets, Save, TrendingUp, Info } from 'lucide-react';

const DesktopNumberInput = ({ label, value, onChange, unit = '', min, max, step = 1, tabIndex, onEnter, compact = false, tooltip }) => {
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

    const placeholderText = label || tooltip || '';

    return (
        <div className={`relative bg-white/5 rounded border border-white/10 hover:border-cyan-400/50 transition-all group ${
            compact ? 'p-1' : 'p-2'
        }`} title={tooltip || label}>
            <div className="flex items-center gap-0.5">
                <input
                    ref={inputRef}
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholderText}
                    className={`flex-1 min-w-0 bg-transparent text-white font-mono placeholder-gray-500 outline-none transition-colors ${
                        compact ? 'text-xs px-1 py-0.5' : 'text-sm px-1.5 py-0.5'
                    }`}
                    min={min}
                    max={max}
                    step={step}
                    tabIndex={tabIndex}
                />
                {unit && <span className={`text-gray-500 flex-shrink-0 ${compact ? 'text-xs' : 'text-xs'} pr-1`}>{unit}</span>}
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
            <div className="space-y-0.5">
                <div className="text-xs text-gray-500 text-center font-medium">{label}</div>
                <div className="flex items-center gap-0.5">
                    {/* 走行前 */}
                    <div className="flex-1 min-w-0">
                        <DesktopNumberInput
                            value={beforeValue}
                            onChange={(value) => onChange(`setupBefore.tires.pressure.${position}`, value)}
                            unit=""
                            min={100}
                            max={350}
                            step={5}
                            tabIndex={tabIndex * 2}
                            compact={true}
                            tooltip={`${label} 走行前`}
                        />
                    </div>
                    
                    {/* 矢印 */}
                    <div className="text-gray-600 text-xs">→</div>
                    
                    {/* 走行後 */}
                    <div className="flex-1 min-w-0 relative">
                        <DesktopNumberInput
                            value={afterValue}
                            onChange={(value) => onChange(`setupAfter.tires.pressure.${position}`, value)}
                            unit=""
                            min={100}
                            max={350}
                            step={5}
                            tabIndex={tabIndex * 2 + 1}
                            compact={true}
                            tooltip={`${label} 走行後`}
                        />
                        {/* 差分表示 - 絶対配置で下に表示 */}
                        <div className="absolute -bottom-3.5 left-0 right-0 text-center">
                            {afterValue && beforeValue && diff !== 0 ? (
                                <span className={`text-xs font-mono ${
                                    diff > 0 ? 'text-red-500' : 'text-blue-500'
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
        <div className="bg-black/20 rounded p-2 border border-white/10">
            <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
                {['fl', 'fr', 'rl', 'rr'].map((position, index) => (
                    <div key={position} className="pb-3">
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

    const calculateAvgPressure = (sheet) => {
        if (!sheet?.setupBefore?.tires?.pressure) return 0;
        const pressures = Object.values(sheet.setupBefore.tires.pressure);
        const validPressures = pressures.filter(p => p && !isNaN(p));
        if (validPressures.length === 0) return 0;
        return validPressures.reduce((sum, p) => sum + parseFloat(p), 0) / validPressures.length;
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
        <div className="bg-gray-900 border border-white/10 rounded-lg p-4">
            {/* ヘッダー */}
            <div className="bg-black/20 rounded-lg p-3 mb-3 border border-white/10">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Zap className="text-yellow-400" size={18} />
                        <h2 className="text-xl font-bold text-white">クイック入力</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* リアルタイム統計 */}
                        <div className="flex items-center gap-3 text-xs">
                            <div className="flex items-center gap-1">
                                <span className="text-gray-400">平均圧:</span>
                                <span className="text-white font-mono">{calculateAvgPressure(sheet).toFixed(0)}kPa</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-gray-400">気温:</span>
                                <span className="text-white font-mono">{sheet.environment?.airTemp || '-'}°C</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-gray-400">路温:</span>
                                <span className="text-white font-mono">{sheet.environment?.trackTemp || '-'}°C</span>
                            </div>
                        </div>
                        {hasUnsavedChanges && (
                            <button 
                                onClick={onSave}
                                className="bg-green-500 hover:bg-green-400 text-white font-semibold py-1.5 px-3 rounded text-sm transition-all"
                            >
                                <Save size={14} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                    {/* 環境データ */}
                    <div className="border border-white/10 rounded p-3 bg-black/30">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                <Thermometer size={14} />
                                環境データ
                            </h3>
                        </div>
                        <div className="grid grid-cols-6 gap-1.5">
                            <div className="relative">
                                <select 
                                    value={sheet.environment?.weather || ''} 
                                    onChange={(e) => handleChange('environment.weather', e.target.value)}
                                    className="w-full bg-transparent text-white text-xs border border-white/10 rounded px-1 py-1 outline-none focus:border-cyan-400"
                                    tabIndex={1}
                                    title="天候"
                                >
                                    <option value="">天候</option>
                                    {weatherOptions.map(option => (
                                        <option key={option} value={option} className="bg-gray-800">
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <DesktopNumberInput 
                                tooltip="気温"
                                value={sheet.environment?.airTemp} 
                                onChange={(value) => handleChange('environment.airTemp', value)}
                                unit="°C"
                                min={-10}
                                max={50}
                                tabIndex={2}
                                compact={true}
                            />
                            <DesktopNumberInput 
                                tooltip="路面温度" 
                                value={sheet.environment?.trackTemp} 
                                onChange={(value) => handleChange('environment.trackTemp', value)}
                                unit="°C"
                                min={-10}
                                max={80}
                                tabIndex={3}
                                compact={true}
                            />
                            <DesktopNumberInput 
                                tooltip="湿度" 
                                value={sheet.environment?.humidity} 
                                onChange={(value) => handleChange('environment.humidity', value)}
                                unit="%"
                                min={0}
                                max={100}
                                tabIndex={4}
                                compact={true}
                            />
                            <DesktopNumberInput 
                                tooltip="気圧" 
                                value={sheet.environment?.pressure} 
                                onChange={(value) => handleChange('environment.pressure', value)}
                                unit="hPa"
                                min={950}
                                max={1050}
                                tabIndex={5}
                                compact={true}
                            />
                            <DesktopNumberInput 
                                tooltip="燃料量" 
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
                    <div className="border border-white/10 rounded p-3 bg-black/30">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                <Droplets size={14} />
                                タイヤ空気圧
                            </h3>
                            <div className="text-xs text-gray-500">
                                走行前 → 走行後 (kPa)
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
                    <div className="border border-white/10 rounded p-3 bg-black/30">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                <div className="w-3 h-3 bg-orange-400 rounded"></div>
                                ダンパー設定
                            </h3>
                            <div className="text-xs text-gray-500">
                                Bump / Rebound (click)
                            </div>
                        </div>
                        <div className="bg-black/20 rounded p-2 border border-white/10">
                            <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
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
        </div>
    );
};