import React from 'react';
import { Activity, TrendingUp, TrendingDown, AlertTriangle, Clock, Target } from 'lucide-react';
import { formatDateTime } from '../utils/formatters';

const MetricCard = ({ title, value, unit, trend, color = 'blue', icon: Icon }) => {
    const colorClasses = {
        blue: 'from-blue-500 to-cyan-500',
        green: 'from-green-500 to-emerald-500',
        yellow: 'from-yellow-500 to-orange-500',
        red: 'from-red-500 to-pink-500',
        purple: 'from-purple-500 to-indigo-500'
    };

    const bgGradients = {
        blue: 'from-blue-500/10 to-cyan-500/10',
        green: 'from-green-500/10 to-emerald-500/10',
        yellow: 'from-yellow-500/10 to-orange-500/10',
        red: 'from-red-500/10 to-pink-500/10',
        purple: 'from-purple-500/10 to-indigo-500/10'
    };

    return (
        <div className={`bg-gradient-to-br ${bgGradients[color]} backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:scale-105 transition-transform duration-200 cursor-pointer`}>
            <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg`}>
                    <Icon size={20} className="text-white" />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-sm ${trend > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {trend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        <span className="font-semibold">{trend > 0 ? '+' : ''}{trend.toFixed(1)}{unit}</span>
                    </div>
                )}
            </div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">{title}</h3>
            <div className="text-2xl lg:text-3xl font-bold text-white">
                {value}<span className="text-sm lg:text-base text-gray-400 ml-1">{unit}</span>
            </div>
        </div>
    );
};

const TrendChart = ({ data, label, unit }) => {
    if (!data || data.length < 2) return null;

    const maxValue = Math.max(...data.map(d => parseFloat(d.value || 0)));
    const minValue = Math.min(...data.map(d => parseFloat(d.value || 0)));
    const range = maxValue - minValue || 1;

    return (
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    {label}トレンド
                </h3>
                <span className="text-sm text-gray-400">過去10セッション</span>
            </div>
            <div className="h-40 flex items-end gap-2">
                {data.slice(-10).map((point, index) => {
                    const height = ((parseFloat(point.value || 0) - minValue) / range) * 100;
                    return (
                        <div key={index} className="flex-1 flex flex-col items-center group">
                            <div className="relative w-full">
                                <div 
                                    className="w-full bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t-lg transition-all duration-300 hover:from-cyan-400 hover:to-blue-400"
                                    style={{ height: `${Math.max(height * 1.6, 10)}px` }}
                                >
                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {point.value}{unit}
                                    </div>
                                </div>
                            </div>
                            <div className="text-xs text-gray-500 mt-2 -rotate-45 origin-top-left transform translate-x-3">
                                {point.date}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="flex justify-between items-center mt-8 pt-4 border-t border-white/10">
                <div className="text-sm">
                    <span className="text-gray-500">最小: </span>
                    <span className="text-white font-semibold">{minValue.toFixed(1)}{unit}</span>
                </div>
                <div className="text-sm">
                    <span className="text-gray-500">最大: </span>
                    <span className="text-white font-semibold">{maxValue.toFixed(1)}{unit}</span>
                </div>
                <div className="text-sm">
                    <span className="text-gray-500">平均: </span>
                    <span className="text-white font-semibold">
                        {(data.reduce((sum, d) => sum + parseFloat(d.value || 0), 0) / data.length).toFixed(1)}{unit}
                    </span>
                </div>
            </div>
        </div>
    );
};

const RecentActivity = ({ setupSheets }) => {
    const recentSessions = setupSheets.slice(0, 8);

    return (
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
                    <Clock size={16} className="text-white" />
                </div>
                最近のセッション履歴
            </h3>
            <div className="space-y-3">
                {recentSessions.map((sheet, index) => (
                    <div key={sheet.id} className="flex items-center gap-4 p-4 bg-black/20 rounded-xl hover:bg-black/30 transition-colors cursor-pointer group">
                        <div className="relative">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                                index === 0 ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' : 'bg-gray-700 text-gray-300'
                            }`}>
                                {index + 1}
                            </div>
                            {index === 0 && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-white font-semibold">{sheet.trackName}</span>
                                <span className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded-full">{sheet.sessionType}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                <span>{formatDateTime(sheet.dateTime)}</span>
                                <span>•</span>
                                <span>{sheet.vehicle}</span>
                                <span>•</span>
                                <span>{sheet.driver}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-semibold text-white">{sheet.environment?.airTemp || '-'}°C</div>
                            <div className="text-xs text-gray-500">{sheet.environment?.weather || '-'}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const PerformanceInsights = ({ setupSheets }) => {
    const insights = [];

    // 気温トレンド分析
    const recentTemps = setupSheets.slice(0, 5).map(s => parseFloat(s.environment?.airTemp || 0));
    if (recentTemps.length >= 3) {
        const avgTemp = recentTemps.reduce((a, b) => a + b, 0) / recentTemps.length;
        if (avgTemp > 30) {
            insights.push({
                type: 'warning',
                message: '高温環境でのセッションが続いています。タイヤ圧の調整を検討してください。'
            });
        }
    }

    // バランス分析
    const latestSession = setupSheets[0];
    if (latestSession?.driverNotes?.cornerBalance) {
        const balanceTypes = Object.values(latestSession.driverNotes.cornerBalance).flatMap(speed => Object.values(speed));
        const underCount = balanceTypes.filter(b => b === 'under').length;
        const overCount = balanceTypes.filter(b => b === 'over').length;
        
        if (underCount > 4) {
            insights.push({
                type: 'info',
                message: 'アンダーステア傾向が見られます。フロントの設定を見直すことをお勧めします。'
            });
        } else if (overCount > 4) {
            insights.push({
                type: 'info',
                message: 'オーバーステア傾向が見られます。リアの設定を見直すことをお勧めします。'
            });
        }
    }

    return (
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
                    <Target size={16} className="text-white" />
                </div>
                AIパフォーマンス分析
            </h3>
            {insights.length > 0 ? (
                <div className="space-y-3">
                    {insights.map((insight, index) => (
                        <div key={index} className={`p-4 rounded-xl border-l-4 ${
                            insight.type === 'warning' 
                                ? 'bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-500' 
                                : 'bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border-blue-500'
                        }`}>
                            <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${
                                    insight.type === 'warning' ? 'bg-yellow-500/20' : 'bg-blue-500/20'
                                }`}>
                                    <AlertTriangle size={16} className={`${
                                        insight.type === 'warning' ? 'text-yellow-400' : 'text-blue-400'
                                    }`} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-white mb-1">
                                        {insight.type === 'warning' ? '⚠️ 注意' : '💡 アドバイス'}
                                    </p>
                                    <p className="text-sm text-gray-300 leading-relaxed">{insight.message}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-700/50 rounded-full flex items-center justify-center">
                        <Target size={24} className="text-gray-500" />
                    </div>
                    <p className="text-gray-400 text-sm">十分なデータが蓄積されていません</p>
                    <p className="text-gray-500 text-xs mt-1">3セッション以上のデータが必要です</p>
                </div>
            )}
        </div>
    );
};

export const Dashboard = ({ setupSheets }) => {
    if (!setupSheets || setupSheets.length === 0) {
        return (
            <div className="bg-gray-900/10 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">ダッシュボード</h2>
                <p className="text-gray-400">データがありません。セッションを作成してください。</p>
            </div>
        );
    }

    const latestSession = setupSheets[0];
    const previousSession = setupSheets[1];

    // トレンドデータの準備
    const temperatureTrend = setupSheets.slice(0, 10).reverse().map(s => ({
        value: s.environment?.airTemp,
        date: s.dateTime ? new Date(s.dateTime).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' }) : ''
    }));

    const avgColdPressure = latestSession.setupBefore?.tires?.pressure ? 
        ((parseFloat(latestSession.setupBefore.tires.pressure.fl || 0) + 
          parseFloat(latestSession.setupBefore.tires.pressure.fr || 0) + 
          parseFloat(latestSession.setupBefore.tires.pressure.rl || 0) + 
          parseFloat(latestSession.setupBefore.tires.pressure.rr || 0)) / 4) : 0;

    const prevAvgColdPressure = previousSession?.setupBefore?.tires?.pressure ? 
        ((parseFloat(previousSession.setupBefore.tires.pressure.fl || 0) + 
          parseFloat(previousSession.setupBefore.tires.pressure.fr || 0) + 
          parseFloat(previousSession.setupBefore.tires.pressure.rl || 0) + 
          parseFloat(previousSession.setupBefore.tires.pressure.rr || 0)) / 4) : null;

    const pressureTrend = prevAvgColdPressure ? avgColdPressure - prevAvgColdPressure : null;
    const tempTrend = previousSession?.environment?.airTemp ? 
        parseFloat(latestSession.environment?.airTemp || 0) - parseFloat(previousSession.environment.airTemp) : null;

    return (
        <div className="space-y-6">
            {/* ヘッダーセクション */}
            <div className="bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-gray-900/70 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg">
                            <Activity className="text-white" size={32} />
                        </div>
                        <div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-white">Performance Dashboard</h2>
                            <p className="text-gray-400 mt-1">リアルタイムパフォーマンス分析</p>
                        </div>
                    </div>
                    <div className="lg:ml-auto text-right">
                        <p className="text-sm text-gray-500">最終更新</p>
                        <p className="text-lg font-semibold text-gray-300">{formatDateTime(latestSession.dateTime)}</p>
                    </div>
                </div>

                {/* 主要指標 - デスクトップでは6カラム */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
                    <MetricCard
                        title="気温"
                        value={latestSession.environment?.airTemp || '-'}
                        unit="°C"
                        trend={tempTrend}
                        color="blue"
                        icon={TrendingUp}
                    />
                    <MetricCard
                        title="路温"
                        value={latestSession.environment?.trackTemp || '-'}
                        unit="°C"
                        color="red"
                        icon={TrendingUp}
                    />
                    <MetricCard
                        title="平均タイヤ圧"
                        value={avgColdPressure.toFixed(0)}
                        unit="kPa"
                        trend={pressureTrend}
                        color="purple"
                        icon={Activity}
                    />
                    <MetricCard
                        title="総セッション"
                        value={setupSheets.length}
                        unit="回"
                        color="green"
                        icon={Target}
                    />
                    <MetricCard
                        title="湿度"
                        value={latestSession.environment?.humidity || '-'}
                        unit="%"
                        color="yellow"
                        icon={Activity}
                    />
                    <MetricCard
                        title="気圧"
                        value={latestSession.environment?.pressure || '-'}
                        unit="hPa"
                        color="purple"
                        icon={TrendingUp}
                    />
                </div>

                {/* メインコンテンツエリア */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                    {/* 左側 - トレンドチャート（広い） */}
                    <div className="xl:col-span-2 space-y-6">
                        <TrendChart 
                            data={temperatureTrend} 
                            label="気温" 
                            unit="°C" 
                        />
                        
                        {/* タイヤ圧力サマリー */}
                        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                                タイヤ圧力分析
                            </h3>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-black/20 rounded-xl">
                                    <p className="text-gray-400 text-sm mb-1">FL</p>
                                    <p className="text-2xl font-bold text-white">{latestSession.setupBefore?.tires?.pressure?.fl || '-'}</p>
                                    <p className="text-xs text-gray-500">kPa</p>
                                </div>
                                <div className="text-center p-4 bg-black/20 rounded-xl">
                                    <p className="text-gray-400 text-sm mb-1">FR</p>
                                    <p className="text-2xl font-bold text-white">{latestSession.setupBefore?.tires?.pressure?.fr || '-'}</p>
                                    <p className="text-xs text-gray-500">kPa</p>
                                </div>
                                <div className="text-center p-4 bg-black/20 rounded-xl">
                                    <p className="text-gray-400 text-sm mb-1">RL</p>
                                    <p className="text-2xl font-bold text-white">{latestSession.setupBefore?.tires?.pressure?.rl || '-'}</p>
                                    <p className="text-xs text-gray-500">kPa</p>
                                </div>
                                <div className="text-center p-4 bg-black/20 rounded-xl">
                                    <p className="text-gray-400 text-sm mb-1">RR</p>
                                    <p className="text-2xl font-bold text-white">{latestSession.setupBefore?.tires?.pressure?.rr || '-'}</p>
                                    <p className="text-xs text-gray-500">kPa</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 右側 - セッション概要 */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                最新セッション
                            </h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-black/20 rounded-xl">
                                    <p className="text-xs text-gray-500 mb-1">サーキット</p>
                                    <p className="text-lg font-semibold text-white">{latestSession.trackName}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-black/20 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1">車両</p>
                                        <p className="text-sm font-medium text-white">{latestSession.vehicle}</p>
                                    </div>
                                    <div className="p-3 bg-black/20 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1">タイプ</p>
                                        <p className="text-sm font-medium text-white">{latestSession.sessionType}</p>
                                    </div>
                                </div>
                                <div className="p-3 bg-black/20 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">ドライバー</p>
                                    <p className="text-sm font-medium text-white">{latestSession.driver}</p>
                                </div>
                                <div className="p-3 bg-black/20 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">天候</p>
                                    <p className="text-sm font-medium text-white">{latestSession.environment?.weather || '-'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 下部セクション - フル幅活用 */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2">
                        <RecentActivity setupSheets={setupSheets} />
                    </div>
                    <div>
                        <PerformanceInsights setupSheets={setupSheets} />
                    </div>
                </div>
            </div>
        </div>
    );
};