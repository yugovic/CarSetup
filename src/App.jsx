import React, { useState, useEffect } from 'react';
import { Copy, Plus, Trash2, Settings, Zap, List, BarChart3, Activity } from 'lucide-react';
import { EditableSetupSheet } from './components/EditableSetupSheet';
import { SettingsPage } from './components/SettingsPage';
import { QuickInputView } from './components/QuickInputView';
import { CompactView } from './components/CompactView';
import { ComparisonView } from './components/ComparisonView';
import { Dashboard } from './components/Dashboard';
import { SelectField } from './components/common/SelectField';
import { useSetupSheets } from './hooks/useSetupSheets';
import { trackList, vehicleList } from './data/constants';
import { formatDateTime } from './utils/formatters';

// ビルドタイムスタンプ
const BUILD_TIMESTAMP = '2025/06/21 3:15';

export default function App() {
    const [view, setView] = useState('dashboard');
    const [vehicleConfigs, setVehicleConfigs] = useState({
        'Roadster': { suspension: false },
        'RS3 LMS TCR': { suspension: true },
    });

    // コンポーネントマウント時にビルドタイムスタンプを表示
    useEffect(() => {
        console.log('%c🚗 VELOCITY LOGGER', 'color: #00d9ff; font-size: 20px; font-weight: bold;');
        console.log(`%c📅 最終更新日時: ${BUILD_TIMESTAMP}`, 'color: #ffa500; font-size: 14px;');
        console.log('%c✨ Mobile-First Responsive Update', 'color: #00ff00; font-size: 12px;');
    }, []);

    const {
        setupSheets,
        selectedSheetId,
        setSelectedSheetId,
        activeSheetData,
        setActiveSheetData,
        hasUnsavedChanges,
        handleSave,
        handleRevert,
        handleAddNew,
        handleCopy,
        handleDelete
    } = useSetupSheets();

    return (
        <div 
            className="bg-gray-900 text-white min-h-screen font-sans bg-cover bg-fixed" 
            style={{backgroundImage: "url('https://images.unsplash.com/photo-1599577181262-299527186b5c?q=80&w=2940&auto=format&fit=crop')"}}
        >
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative z-10 container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
                {/* デスクトップ用ヘッダー */}
                <header className="hidden sm:flex flex-col lg:flex-row justify-between items-center mb-6 gap-4 p-4 bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-wider text-shadow-lg text-center sm:text-left">
                        <span className="text-cyan-300">VELOCITY</span> LOGGER
                    </h1>
                    
                    {/* デスクトップナビゲーション */}
                    <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
                        <button 
                            onClick={() => setView('dashboard')}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all text-sm font-medium ${
                                view === 'dashboard' ? 'bg-cyan-500 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            <Activity size={16} />
                            ダッシュボード
                        </button>
                        <button 
                            onClick={() => setView('compact')}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all text-sm font-medium ${
                                view === 'compact' ? 'bg-cyan-500 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            <List size={16} />
                            一覧
                        </button>
                        <button 
                            onClick={() => setView('quick')}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all text-sm font-medium ${
                                view === 'quick' ? 'bg-cyan-500 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            <Zap size={16} />
                            クイック入力
                        </button>
                        <button 
                            onClick={() => setView('comparison')}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all text-sm font-medium ${
                                view === 'comparison' ? 'bg-cyan-500 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            <BarChart3 size={16} />
                            比較
                        </button>
                        <button 
                            onClick={() => setView('detail')}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all text-sm font-medium ${
                                view === 'detail' ? 'bg-cyan-500 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            詳細
                        </button>
                    </div>
                    
                    {/* デスクトップアクションボタン */}
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={handleCopy} 
                            title="選択中のセッションをコピー" 
                            className="p-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all"
                        >
                            <Copy size={18} />
                        </button>
                        <button 
                            onClick={handleAddNew} 
                            title="新規作成" 
                            className="p-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all"
                        >
                            <Plus size={18} />
                        </button>
                        <button 
                            onClick={handleDelete} 
                            title="選択中のセッションを削除" 
                            className="p-3 bg-red-800/50 hover:bg-red-700/50 text-white font-semibold rounded-lg transition-all"
                        >
                            <Trash2 size={18} />
                        </button>
                        <button 
                            onClick={() => setView('settings')} 
                            title="車種別項目設定" 
                            className="p-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all"
                        >
                            <Settings size={18} />
                        </button>
                    </div>
                </header>

                {/* モバイル用ヘッダー */}
                <header className="block sm:hidden mb-4">
                    <div className="p-4 bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl">
                        <h1 className="text-2xl font-bold tracking-wider text-shadow-lg text-center">
                            <span className="text-cyan-300">VELOCITY</span> LOGGER
                        </h1>
                    </div>
                </header>
                
                <main className="pb-20 sm:pb-0">
                    {view === 'dashboard' && (
                        <Dashboard setupSheets={setupSheets} />
                    )}
                    
                    {view === 'compact' && (
                        <CompactView 
                            setupSheets={setupSheets}
                            selectedSheetId={selectedSheetId}
                            onSelectSheet={setSelectedSheetId}
                        />
                    )}
                    
                    {view === 'quick' && (
                        <>
                            {!selectedSheetId ? (
                                <div className="bg-gray-900/10 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl p-8 text-center">
                                    <h2 className="text-2xl font-bold text-white mb-4">セッションを選択してください</h2>
                                    <p className="text-gray-400 mb-6">クイック入力を使用するには、まずセッションを選択または作成してください。</p>
                                    <button 
                                        onClick={handleAddNew}
                                        className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-3 px-6 rounded-lg transition-all"
                                    >
                                        新規セッション作成
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="relative mb-6">
                                        <SelectField 
                                            label="" 
                                            name="session-selector" 
                                            value={selectedSheetId || ''} 
                                            onChange={(e) => setSelectedSheetId(e.target.value)}
                                        >
                                            <option value="" disabled>セッションを選択...</option>
                                            {setupSheets.map(sheet => (
                                                <option key={sheet.id} value={sheet.id}>
                                                    {formatDateTime(sheet.dateTime)} - {sheet.trackName} ({sheet.vehicle})
                                                </option>
                                            ))}
                                        </SelectField>
                                    </div>
                                    {activeSheetData && (
                                        <QuickInputView 
                                            sheet={activeSheetData} 
                                            onSheetChange={setActiveSheetData} 
                                            onSave={handleSave}
                                            hasUnsavedChanges={hasUnsavedChanges}
                                            previousSheet={setupSheets.find((_, index) => 
                                                setupSheets[index + 1]?.id === selectedSheetId
                                            )}
                                        />
                                    )}
                                </>
                            )}
                        </>
                    )}
                    
                    {view === 'comparison' && (
                        <ComparisonView 
                            setupSheets={setupSheets}
                            selectedSheetIds={[]}
                            onToggleSelection={() => {}}
                        />
                    )}
                    
                    {view === 'detail' && (
                        <>
                            <div className="relative mb-6">
                                <SelectField 
                                    label="" 
                                    name="session-selector" 
                                    value={selectedSheetId || ''} 
                                    onChange={(e) => setSelectedSheetId(e.target.value)}
                                >
                                    <option value="" disabled>セッションを選択...</option>
                                    {setupSheets.map(sheet => (
                                        <option key={sheet.id} value={sheet.id}>
                                            {formatDateTime(sheet.dateTime)} - {sheet.trackName} ({sheet.vehicle})
                                        </option>
                                    ))}
                                </SelectField>
                            </div>
                            {activeSheetData ? (
                                <EditableSetupSheet 
                                    sheet={activeSheetData} 
                                    onSheetChange={setActiveSheetData} 
                                    onSave={handleSave} 
                                    onRevert={handleRevert} 
                                    hasUnsavedChanges={hasUnsavedChanges} 
                                    vehicleConfigs={vehicleConfigs}
                                    trackList={trackList}
                                    vehicleList={vehicleList}
                                />
                            ) : (
                                <div className="text-center py-20 bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl">
                                    <h2 className="text-2xl font-semibold text-gray-300">セッションを選択してください</h2>
                                    <p className="text-gray-500 mt-2">上のプルダウンから表示・編集するセッションを選択するか、新規作成してください。</p>
                                </div>
                            )}
                        </>
                    )}
                    
                    {view === 'settings' && (
                        <SettingsPage 
                            configs={vehicleConfigs} 
                            setConfigs={setVehicleConfigs} 
                            onBack={() => setView('dashboard')}
                            vehicleList={vehicleList}
                        />
                    )}
                </main>

                {/* モバイル用ボトムナビゲーション */}
                <nav className="block sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-t border-white/10">
                    <div className="flex justify-around items-center py-2">
                        <button 
                            onClick={() => setView('dashboard')}
                            className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all touch-manipulation ${
                                view === 'dashboard' ? 'text-cyan-400' : 'text-gray-400'
                            }`}
                        >
                            <Activity size={20} />
                            <span className="text-xs font-medium">分析</span>
                        </button>
                        <button 
                            onClick={() => setView('compact')}
                            className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all touch-manipulation ${
                                view === 'compact' ? 'text-cyan-400' : 'text-gray-400'
                            }`}
                        >
                            <List size={20} />
                            <span className="text-xs font-medium">一覧</span>
                        </button>
                        <button 
                            onClick={() => setView('quick')}
                            className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all touch-manipulation ${
                                view === 'quick' ? 'text-cyan-400' : 'text-gray-400'
                            }`}
                        >
                            <Zap size={20} />
                            <span className="text-xs font-medium">入力</span>
                        </button>
                        <button 
                            onClick={() => setView('comparison')}
                            className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all touch-manipulation ${
                                view === 'comparison' ? 'text-cyan-400' : 'text-gray-400'
                            }`}
                        >
                            <BarChart3 size={20} />
                            <span className="text-xs font-medium">比較</span>
                        </button>
                        <button 
                            onClick={() => setView('detail')}
                            className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all touch-manipulation ${
                                view === 'detail' ? 'text-cyan-400' : 'text-gray-400'
                            }`}
                        >
                            <Settings size={20} />
                            <span className="text-xs font-medium">詳細</span>
                        </button>
                    </div>
                </nav>

                {/* モバイル用フローティングアクションボタン */}
                <div className="block sm:hidden fixed top-20 right-4 z-40 flex flex-col gap-3">
                    <button 
                        onClick={handleAddNew} 
                        className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-full shadow-xl flex items-center justify-center transition-all touch-manipulation"
                    >
                        <Plus size={20} />
                    </button>
                    <button 
                        onClick={() => setView('settings')} 
                        className="w-12 h-12 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full shadow-xl flex items-center justify-center transition-all touch-manipulation border border-white/20"
                    >
                        <Settings size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}