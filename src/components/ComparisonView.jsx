import React, { useState } from 'react';
import { BarChart3, TrendingUp, CheckSquare, Square } from 'lucide-react';
import { formatDateTime } from '../utils/formatters';

const ComparisonItem = ({ label, values, unit = '', highlight = false }) => (
    <div className={`p-3 sm:p-3 rounded-lg border touch-manipulation ${highlight ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-black/20 border-white/10'}`}>
        <div className="text-sm sm:text-xs text-gray-300 mb-2 sm:mb-1">{label}</div>
        <div className="flex gap-3 sm:gap-2">
            {values.map((value, index) => (
                <div key={index} className="flex-1">
                    <div className="text-base sm:text-sm font-mono text-white text-center">{value || '-'}{unit}</div>
                </div>
            ))}
        </div>
    </div>
);

const SessionHeader = ({ sheet, index }) => (
    <div className="bg-gray-800/50 p-4 sm:p-3 rounded-lg">
        <div className="text-base sm:text-sm font-semibold text-cyan-300 mb-1">セッション {index + 1}</div>
        <div className="text-sm sm:text-xs text-gray-300 mb-1">{formatDateTime(sheet.dateTime)}</div>
        <div className="text-sm sm:text-xs text-gray-400 truncate">{sheet.trackName} • {sheet.vehicle}</div>
        <div className="text-sm sm:text-xs text-gray-400">{sheet.sessionType}</div>
    </div>
);

export const ComparisonView = ({ setupSheets, selectedSheetIds, onToggleSelection }) => {
    const [selectedSessions, setSelectedSessions] = useState(selectedSheetIds || []);

    const handleToggleSession = (sheetId) => {
        const newSelection = selectedSessions.includes(sheetId)
            ? selectedSessions.filter(id => id !== sheetId)
            : [...selectedSessions, sheetId].slice(-4); // 最大4セッション
        
        setSelectedSessions(newSelection);
        onToggleSelection?.(newSelection);
    };

    const selectedSheets = selectedSessions.map(id => 
        setupSheets.find(sheet => sheet.id === id)
    ).filter(Boolean);

    const getValueDifference = (values) => {
        if (values.length < 2) return false;
        const numValues = values.map(v => parseFloat(v || 0));
        const min = Math.min(...numValues);
        const max = Math.max(...numValues);
        return (max - min) > 0.1; // 差があれば highlight
    };

    return (
        <div className="space-y-6">
            {/* セッション選択 */}
            <div className="bg-gray-900/10 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-3 mb-6 sm:mb-4">
                    <div className="flex items-center gap-3">
                        <BarChart3 className="text-blue-400 size-7 sm:size-6" size={28} />
                        <h2 className="text-3xl sm:text-2xl font-bold text-white">セッション比較</h2>
                    </div>
                    <div className="sm:ml-auto text-base sm:text-sm text-gray-400 font-medium">
                        {selectedSessions.length}/4 選択
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-3 mb-4">
                    {setupSheets.slice(0, 12).map(sheet => (
                        <div
                            key={sheet.id}
                            onClick={() => handleToggleSession(sheet.id)}
                            className={`p-4 sm:p-3 rounded-lg border cursor-pointer transition-all min-h-touch touch-manipulation ${
                                selectedSessions.includes(sheet.id)
                                    ? 'bg-cyan-500/20 border-cyan-400'
                                    : 'bg-black/20 border-white/10 hover:bg-white/5 active:bg-white/10'
                            }`}
                        >
                            <div className="flex items-start gap-3 sm:gap-2">
                                {selectedSessions.includes(sheet.id) ? (
                                    <CheckSquare size={20} className="sm:size-4 text-cyan-400 mt-1 flex-shrink-0" />
                                ) : (
                                    <Square size={20} className="sm:size-4 text-gray-400 mt-1 flex-shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="text-base sm:text-sm font-medium text-white truncate">
                                        {formatDateTime(sheet.dateTime)}
                                    </div>
                                    <div className="text-sm sm:text-xs text-gray-300 truncate">
                                        {sheet.trackName} • {sheet.sessionType}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 比較表示 */}
            {selectedSheets.length >= 2 && (
                <div className="bg-gray-900/10 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl p-4 sm:p-6">
                    <h3 className="text-2xl sm:text-xl font-bold text-white mb-6">詳細比較</h3>

                    {/* モバイル用: セッションヘッダー表示 */}
                    <div className="block sm:hidden mb-6">
                        <div className="grid grid-cols-1 gap-3">
                            {selectedSheets.map((sheet, index) => (
                                <SessionHeader key={sheet.id} sheet={sheet} index={index} />
                            ))}
                        </div>
                    </div>

                    {/* デスクトップ用: ヘッダー */}
                    <div className="hidden sm:grid gap-3 mb-6" style={{gridTemplateColumns: `200px repeat(${selectedSheets.length}, 1fr)`}}>
                        <div></div>
                        {selectedSheets.map((sheet, index) => (
                            <SessionHeader key={sheet.id} sheet={sheet} index={index} />
                        ))}
                    </div>

                    <div className="space-y-8 sm:space-y-6">
                        {/* 環境データ */}
                        <div>
                            <h4 className="text-xl sm:text-lg font-semibold text-cyan-300 mb-4 sm:mb-3">環境データ</h4>
                            
                            {/* モバイル用レイアウト */}
                            <div className="block sm:hidden space-y-4">
                                <div>
                                    <div className="text-base font-medium text-gray-300 mb-3">天候</div>
                                    <div className="grid gap-2" style={{gridTemplateColumns: `repeat(${selectedSheets.length}, 1fr)`}}>
                                        {selectedSheets.map((sheet, index) => (
                                            <div key={`weather-${sheet.id}`} className="p-3 bg-black/20 rounded-lg text-center">
                                                <div className="text-xs text-gray-400 mb-1">#{index + 1}</div>
                                                <div className="text-sm text-white">{sheet.environment?.weather || '-'}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                <div>
                                    <div className="text-base font-medium text-gray-300 mb-3">気温</div>
                                    <ComparisonItem 
                                        label=""
                                        values={selectedSheets.map(s => s.environment?.airTemp)}
                                        unit="°C"
                                        highlight={getValueDifference(selectedSheets.map(s => s.environment?.airTemp))}
                                    />
                                </div>
                                
                                <div>
                                    <div className="text-base font-medium text-gray-300 mb-3">路温</div>
                                    <ComparisonItem 
                                        label=""
                                        values={selectedSheets.map(s => s.environment?.trackTemp)}
                                        unit="°C"
                                        highlight={getValueDifference(selectedSheets.map(s => s.environment?.trackTemp))}
                                    />
                                </div>
                            </div>

                            {/* デスクトップ用レイアウト */}
                            <div className="hidden sm:grid gap-3" style={{gridTemplateColumns: `200px repeat(${selectedSheets.length}, 1fr)`}}>
                                <div className="text-sm font-medium text-gray-300 flex items-center">天候</div>
                                {selectedSheets.map(sheet => (
                                    <div key={`weather-${sheet.id}`} className="p-2 bg-black/20 rounded text-sm text-white">
                                        {sheet.environment?.weather || '-'}
                                    </div>
                                ))}

                                <div className="text-sm font-medium text-gray-300 flex items-center">気温</div>
                                <ComparisonItem 
                                    label=""
                                    values={selectedSheets.map(s => s.environment?.airTemp)}
                                    unit="°C"
                                    highlight={getValueDifference(selectedSheets.map(s => s.environment?.airTemp))}
                                />

                                <div className="text-sm font-medium text-gray-300 flex items-center">路温</div>
                                <ComparisonItem 
                                    label=""
                                    values={selectedSheets.map(s => s.environment?.trackTemp)}
                                    unit="°C"
                                    highlight={getValueDifference(selectedSheets.map(s => s.environment?.trackTemp))}
                                />
                            </div>
                        </div>

                        {/* タイヤ圧 */}
                        <div>
                            <h4 className="text-xl sm:text-lg font-semibold text-blue-300 mb-4 sm:mb-3">タイヤ空気圧</h4>
                            
                            {/* モバイル用レイアウト */}
                            <div className="block sm:hidden space-y-6">
                                <div>
                                    <h5 className="text-base font-medium text-gray-300 mb-4">走行前（冷間）</h5>
                                    <div className="space-y-3">
                                        {['FL', 'FR', 'RL', 'RR'].map(position => (
                                            <div key={position}>
                                                <div className="text-base font-medium text-gray-300 mb-2">{position}</div>
                                                <ComparisonItem 
                                                    label=""
                                                    values={selectedSheets.map(s => s.setupBefore?.tires?.pressure?.[position.toLowerCase()])}
                                                    unit="kPa"
                                                    highlight={getValueDifference(selectedSheets.map(s => s.setupBefore?.tires?.pressure?.[position.toLowerCase()]))}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h5 className="text-base font-medium text-gray-300 mb-4">走行後（温間）</h5>
                                    <div className="space-y-3">
                                        {['FL', 'FR', 'RL', 'RR'].map(position => (
                                            <div key={position}>
                                                <div className="text-base font-medium text-gray-300 mb-2">{position}</div>
                                                <ComparisonItem 
                                                    label=""
                                                    values={selectedSheets.map(s => s.setupAfter?.tires?.pressure?.[position.toLowerCase()])}
                                                    unit="kPa"
                                                    highlight={getValueDifference(selectedSheets.map(s => s.setupAfter?.tires?.pressure?.[position.toLowerCase()]))}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* デスクトップ用レイアウト */}
                            <div className="hidden sm:block space-y-4">
                                <div>
                                    <h5 className="text-sm font-medium text-gray-300 mb-2">走行前（冷間）</h5>
                                    <div className="grid gap-2" style={{gridTemplateColumns: `120px repeat(${selectedSheets.length}, 1fr)`}}>
                                        {['FL', 'FR', 'RL', 'RR'].map(position => (
                                            <React.Fragment key={position}>
                                                <div className="text-sm text-gray-300 flex items-center">{position}</div>
                                                <ComparisonItem 
                                                    label=""
                                                    values={selectedSheets.map(s => s.setupBefore?.tires?.pressure?.[position.toLowerCase()])}
                                                    unit="kPa"
                                                    highlight={getValueDifference(selectedSheets.map(s => s.setupBefore?.tires?.pressure?.[position.toLowerCase()]))}
                                                />
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h5 className="text-sm font-medium text-gray-300 mb-2">走行後（温間）</h5>
                                    <div className="grid gap-2" style={{gridTemplateColumns: `120px repeat(${selectedSheets.length}, 1fr)`}}>
                                        {['FL', 'FR', 'RL', 'RR'].map(position => (
                                            <React.Fragment key={position}>
                                                <div className="text-sm text-gray-300 flex items-center">{position}</div>
                                                <ComparisonItem 
                                                    label=""
                                                    values={selectedSheets.map(s => s.setupAfter?.tires?.pressure?.[position.toLowerCase()])}
                                                    unit="kPa"
                                                    highlight={getValueDifference(selectedSheets.map(s => s.setupAfter?.tires?.pressure?.[position.toLowerCase()]))}
                                                />
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ダンパー設定 - モバイル用簡略化 */}
                        <div>
                            <h4 className="text-xl sm:text-lg font-semibold text-orange-300 mb-4 sm:mb-3">ダンパー設定</h4>
                            
                            {/* モバイル用レイアウト */}
                            <div className="block sm:hidden space-y-4">
                                {['FL', 'FR', 'RL', 'RR'].map(corner => (
                                    <div key={corner} className="border border-white/10 rounded-lg p-4">
                                        <h5 className="text-base font-medium text-gray-300 mb-3">{corner}</h5>
                                        <div className="space-y-3">
                                            <div>
                                                <div className="text-base font-medium text-gray-300 mb-2">Bump</div>
                                                <ComparisonItem 
                                                    values={selectedSheets.map(s => s.setupBefore?.suspension?.dampers?.[corner.toLowerCase()]?.bump)}
                                                    highlight={getValueDifference(selectedSheets.map(s => s.setupBefore?.suspension?.dampers?.[corner.toLowerCase()]?.bump))}
                                                />
                                            </div>
                                            <div>
                                                <div className="text-base font-medium text-gray-300 mb-2">Rebound</div>
                                                <ComparisonItem 
                                                    values={selectedSheets.map(s => s.setupBefore?.suspension?.dampers?.[corner.toLowerCase()]?.rebound)}
                                                    highlight={getValueDifference(selectedSheets.map(s => s.setupBefore?.suspension?.dampers?.[corner.toLowerCase()]?.rebound))}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* デスクトップ用レイアウト */}
                            <div className="hidden sm:block space-y-4">
                                {['FL', 'FR', 'RL', 'RR'].map(corner => (
                                    <div key={corner} className="border border-white/10 rounded-lg p-3">
                                        <h5 className="text-sm font-medium text-gray-300 mb-2">{corner}</h5>
                                        <div className="grid gap-2" style={{gridTemplateColumns: `80px repeat(${selectedSheets.length}, 1fr)`}}>
                                            <div className="text-sm text-gray-300 flex items-center">Bump</div>
                                            <ComparisonItem 
                                                values={selectedSheets.map(s => s.setupBefore?.suspension?.dampers?.[corner.toLowerCase()]?.bump)}
                                                highlight={getValueDifference(selectedSheets.map(s => s.setupBefore?.suspension?.dampers?.[corner.toLowerCase()]?.bump))}
                                            />
                                            <div className="text-sm text-gray-300 flex items-center">Rebound</div>
                                            <ComparisonItem 
                                                values={selectedSheets.map(s => s.setupBefore?.suspension?.dampers?.[corner.toLowerCase()]?.rebound)}
                                                highlight={getValueDifference(selectedSheets.map(s => s.setupBefore?.suspension?.dampers?.[corner.toLowerCase()]?.rebound))}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ドライバーメモ */}
                        <div>
                            <h4 className="text-xl sm:text-lg font-semibold text-purple-300 mb-4 sm:mb-3">ドライバーメモ</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-3" style={{gridTemplateColumns: selectedSheets.length > 2 ? '1fr' : `repeat(${selectedSheets.length}, 1fr)`}}>
                                {selectedSheets.map((sheet, index) => (
                                    <div key={`notes-${sheet.id}`} className="p-4 sm:p-3 bg-black/20 rounded-lg border border-white/10">
                                        <div className="text-sm sm:text-xs text-gray-400 mb-2">
                                            セッション {index + 1} • {formatDateTime(sheet.dateTime)}
                                        </div>
                                        <div className="text-base sm:text-sm text-gray-200 leading-relaxed">
                                            {sheet.driverNotes?.freeText || 'メモなし'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};