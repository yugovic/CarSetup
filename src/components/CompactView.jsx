import React from 'react';
import { Clock, MapPin, Car, Thermometer, Droplets, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatDateTime } from '../utils/formatters';

const StatusBadge = ({ label, value, unit = '', color = 'blue' }) => {
    const colorClasses = {
        blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        green: 'bg-green-500/20 text-green-300 border-green-500/30',
        yellow: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        red: 'bg-red-500/20 text-red-300 border-red-500/30',
        gray: 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    };

    return (
        <div className={`px-3 py-2 sm:px-2 sm:py-1 rounded-lg sm:rounded text-sm sm:text-xs border ${colorClasses[color]}`}>
            <div className="font-medium">{label}</div>
            <div className="font-mono text-base sm:text-xs">{value}{unit}</div>
        </div>
    );
};

const TrendIndicator = ({ current, previous, unit = '' }) => {
    if (!previous || !current) return <Minus size={16} className="sm:size-3 text-gray-400" />;
    
    const diff = parseFloat(current) - parseFloat(previous);
    if (Math.abs(diff) < 0.1) return <Minus size={16} className="sm:size-3 text-gray-400" />;
    
    return diff > 0 ? (
        <div className="flex items-center gap-1 text-red-400">
            <TrendingUp size={16} className="sm:size-3" />
            <span className="text-sm sm:text-xs font-medium">{diff > 0 ? '+' : ''}{diff.toFixed(1)}{unit}</span>
        </div>
    ) : (
        <div className="flex items-center gap-1 text-blue-400">
            <TrendingDown size={16} className="sm:size-3" />
            <span className="text-sm sm:text-xs font-medium">{diff.toFixed(1)}{unit}</span>
        </div>
    );
};

const SessionCard = ({ sheet, previousSheet, onClick, isSelected }) => {
    const avgColdPressure = sheet.setupBefore?.tires?.pressure ? 
        ((parseFloat(sheet.setupBefore.tires.pressure.fl || 0) + 
          parseFloat(sheet.setupBefore.tires.pressure.fr || 0) + 
          parseFloat(sheet.setupBefore.tires.pressure.rl || 0) + 
          parseFloat(sheet.setupBefore.tires.pressure.rr || 0)) / 4).toFixed(0) : '-';

    const avgHotPressure = sheet.setupAfter?.tires?.pressure ? 
        ((parseFloat(sheet.setupAfter.tires.pressure.fl || 0) + 
          parseFloat(sheet.setupAfter.tires.pressure.fr || 0) + 
          parseFloat(sheet.setupAfter.tires.pressure.rl || 0) + 
          parseFloat(sheet.setupAfter.tires.pressure.rr || 0)) / 4).toFixed(0) : '-';

    const getBalanceColor = (notes) => {
        if (!notes?.cornerBalance) return 'gray';
        const balanceTypes = Object.values(notes.cornerBalance).flatMap(speed => Object.values(speed));
        const underCount = balanceTypes.filter(b => b === 'under').length;
        const overCount = balanceTypes.filter(b => b === 'over').length;
        
        if (underCount > overCount + 2) return 'blue';
        if (overCount > underCount + 2) return 'red';
        if (underCount > 0 || overCount > 0) return 'yellow';
        return 'green';
    };

    const getBalanceText = (notes) => {
        if (!notes?.cornerBalance) return 'N/A';
        const balanceTypes = Object.values(notes.cornerBalance).flatMap(speed => Object.values(speed));
        const underCount = balanceTypes.filter(b => b === 'under').length;
        const overCount = balanceTypes.filter(b => b === 'over').length;
        
        if (underCount > overCount + 2) return 'アンダー傾向';
        if (overCount > underCount + 2) return 'オーバー傾向';
        if (underCount > 0 || overCount > 0) return '混在';
        return 'ニュートラル';
    };

    return (
        <div 
            onClick={onClick}
            className={`bg-white/5 backdrop-blur-xl border rounded-xl p-4 sm:p-6 cursor-pointer transition-all duration-200 hover:bg-white/10 min-h-touch sm:min-h-0 touch-manipulation ${
                isSelected ? 'border-cyan-400 bg-cyan-500/10' : 'border-white/10'
            }`}
        >
            {/* ヘッダー */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 text-cyan-300 font-semibold text-base sm:text-sm">
                        <Clock size={18} className="sm:size-4" />
                        {formatDateTime(sheet.dateTime)}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 sm:mt-1 text-base sm:text-sm text-gray-300">
                        <div className="flex items-center gap-1">
                            <MapPin size={16} className="sm:size-3" />
                            {sheet.trackName}
                        </div>
                        <div className="flex items-center gap-1">
                            <Car size={16} className="sm:size-3" />
                            {sheet.vehicle}
                        </div>
                    </div>
                </div>
                <div className="text-left sm:text-right">
                    <div className="text-base sm:text-sm font-medium text-white">{sheet.sessionType}</div>
                    <div className="text-sm sm:text-xs text-gray-400">{sheet.driver}</div>
                </div>
            </div>

            {/* 主要指標 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-2 mb-4 sm:mb-3">
                <StatusBadge 
                    label="気温" 
                    value={sheet.environment?.airTemp || '-'} 
                    unit="°C" 
                    color="blue" 
                />
                <StatusBadge 
                    label="路温" 
                    value={sheet.environment?.trackTemp || '-'} 
                    unit="°C" 
                    color="red" 
                />
                <StatusBadge 
                    label="冷間圧" 
                    value={avgColdPressure} 
                    unit="kPa" 
                    color="blue" 
                />
                <StatusBadge 
                    label="温間圧" 
                    value={avgHotPressure} 
                    unit="kPa" 
                    color="yellow" 
                />
            </div>

            {/* バランス情報 */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
                <StatusBadge 
                    label="挙動" 
                    value={getBalanceText(sheet.driverNotes)} 
                    color={getBalanceColor(sheet.driverNotes)} 
                />
                
                {previousSheet && (
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 text-sm sm:text-xs">
                        <div className="flex items-center gap-1">
                            <span className="text-gray-400 text-xs sm:text-xs">気温:</span>
                            <TrendIndicator 
                                current={sheet.environment?.airTemp} 
                                previous={previousSheet.environment?.airTemp}
                                unit="°C"
                            />
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-gray-400 text-xs sm:text-xs">圧力:</span>
                            <TrendIndicator 
                                current={avgColdPressure} 
                                previous={previousSheet.setupBefore?.tires?.pressure ? 
                                    ((parseFloat(previousSheet.setupBefore.tires.pressure.fl || 0) + 
                                      parseFloat(previousSheet.setupBefore.tires.pressure.fr || 0) + 
                                      parseFloat(previousSheet.setupBefore.tires.pressure.rl || 0) + 
                                      parseFloat(previousSheet.setupBefore.tires.pressure.rr || 0)) / 4).toFixed(0) : null}
                                unit="kPa"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* フリーコメント（プレビュー） */}
            {sheet.driverNotes?.freeText && (
                <div className="mt-4 sm:mt-3 p-3 sm:p-2 bg-black/20 rounded-lg sm:rounded text-sm sm:text-xs text-gray-300 border-l-4 sm:border-l-2 border-cyan-400">
                    <div className="line-clamp-2 sm:line-clamp-1">
                        {sheet.driverNotes.freeText}
                    </div>
                </div>
            )}
        </div>
    );
};

export const CompactView = ({ setupSheets, selectedSheetId, onSelectSheet }) => {
    return (
        <div className="space-y-4">
            <div className="bg-gray-900/10 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg"></div>
                    <h2 className="text-2xl font-bold text-white">セッション一覧</h2>
                    <div className="ml-auto text-sm text-gray-400">
                        {setupSheets.length} セッション
                    </div>
                </div>
                
                {setupSheets.length === 0 ? (
                    <div className="text-center py-20">
                        <h3 className="text-xl font-semibold text-gray-300">セッションがありません</h3>
                        <p className="text-gray-500 mt-2">新規作成ボタンから最初のセッションを作成してください。</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {setupSheets.map((sheet, index) => (
                            <SessionCard
                                key={sheet.id}
                                sheet={sheet}
                                previousSheet={index < setupSheets.length - 1 ? setupSheets[index + 1] : null}
                                onClick={() => onSelectSheet(sheet.id)}
                                isSelected={selectedSheetId === sheet.id}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};