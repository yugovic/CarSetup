import React from 'react';
import { Save, RotateCcw, Car, Thermometer, Sparkles, Wrench, SlidersHorizontal } from 'lucide-react';
import { CollapsibleCard } from './common/CollapsibleCard';
import { InputField } from './common/InputField';
import { SelectField } from './common/SelectField';
import { DriverNotesEditor } from './DriverNotesEditor';
import { AIAdvisor } from './AIAdvisor';

export const EditableSetupSheet = ({ 
    sheet, 
    onSheetChange, 
    onSave, 
    onRevert, 
    hasUnsavedChanges, 
    vehicleConfigs,
    trackList,
    vehicleList 
}) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        const keys = name.split('.');
        const newSheet = JSON.parse(JSON.stringify(sheet));
        let current = newSheet;
        
        for (let i = 0; i < keys.length - 1; i++) {
            if (current[keys[i]] === undefined) current[keys[i]] = {};
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        onSheetChange(newSheet);
    };

    const handleNotesChange = (newNotes) => {
        const newSheet = JSON.parse(JSON.stringify(sheet));
        newSheet.driverNotes = newNotes;
        onSheetChange(newSheet);
    };

    if (!sheet) return null;
    
    const currentVehicleConfig = vehicleConfigs[sheet.vehicle] || {};

    return (
        <div className="bg-gray-900/10 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl p-4 sm:p-6 relative pb-20 sm:pb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                <h2 className="text-xl sm:text-3xl font-bold text-white tracking-wider">セットアップ詳細</h2>
                {hasUnsavedChanges && (
                    <>
                        {/* デスクトップ用ボタン */}
                        <div className="hidden sm:flex items-center gap-2 animate-pulse">
                            <div className="flex gap-3">
                               <button 
                                   onClick={onRevert} 
                                   className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition-all shadow-md"
                               >
                                   <RotateCcw size={18} /> Revert
                               </button>
                               <button 
                                   onClick={onSave} 
                                   className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold py-2 px-4 rounded-lg transition-all shadow-lg hover:shadow-emerald-500/50"
                               >
                                   <Save size={18} /> Save
                               </button>
                            </div>
                        </div>
                        
                        {/* モバイル用フローティングアクションボタン */}
                        <div className="sm:hidden fixed bottom-6 right-6 z-50 flex flex-col gap-3">
                            <button 
                                onClick={onRevert} 
                                className="w-12 h-12 bg-gray-600 hover:bg-gray-500 text-white rounded-full shadow-xl flex items-center justify-center transition-all"
                            >
                                <RotateCcw size={16} />
                            </button>
                            <button 
                                onClick={onSave} 
                                className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold rounded-full shadow-xl flex items-center justify-center transition-all"
                            >
                                <Save size={18} />
                            </button>
                        </div>
                    </>
                 )}
            </div>

            <div className="flex flex-col gap-6">
                <CollapsibleCard title="基本情報" icon={<Car className="text-cyan-400"/>} defaultOpen={true}>
                    <div className="space-y-4">
                        <SelectField label="車両" name="vehicle" value={sheet.vehicle} onChange={handleChange}>
                            {vehicleList.map(v => <option key={v} value={v}>{v}</option>)}
                        </SelectField>
                        <SelectField label="サーキット" name="trackName" value={sheet.trackName} onChange={handleChange}>
                            {trackList.map(t => <option key={t} value={t}>{t}</option>)}
                        </SelectField>
                        <InputField label="日時" name="dateTime" type="datetime-local" value={sheet.dateTime} onChange={handleChange} />
                        <InputField label="ドライバー" name="driver" value={sheet.driver} onChange={handleChange} />
                        <InputField label="セッション" name="sessionType" value={sheet.sessionType} onChange={handleChange} />
                    </div>
                </CollapsibleCard>

                <CollapsibleCard title="走行環境" icon={<Thermometer className="text-cyan-400"/>} defaultOpen={true}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <InputField label="天候" name="environment.weather" value={sheet.environment.weather} onChange={handleChange} />
                        <InputField label="気温(°C)" name="environment.airTemp" type="number" value={sheet.environment.airTemp} onChange={handleChange} />
                        <InputField label="路温(°C)" name="environment.trackTemp" type="number" value={sheet.environment.trackTemp} onChange={handleChange} />
                        <InputField label="湿度(%)" name="environment.humidity" type="number" value={sheet.environment.humidity} onChange={handleChange} />
                        <InputField label="気圧(hPa)" name="environment.pressure" type="number" value={sheet.environment.pressure} onChange={handleChange} />
                    </div>
                </CollapsibleCard>
                
                <CollapsibleCard title="走行前 タイヤ空気圧 (冷間)" icon={<Sparkles className="text-cyan-400"/>} defaultOpen={true}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <InputField label="FL (kPa)" name="setupBefore.tires.pressure.fl" type="number" value={sheet.setupBefore?.tires?.pressure?.fl} onChange={handleChange} />
                        <InputField label="FR (kPa)" name="setupBefore.tires.pressure.fr" type="number" value={sheet.setupBefore?.tires?.pressure?.fr} onChange={handleChange} />
                        <InputField label="RL (kPa)" name="setupBefore.tires.pressure.rl" type="number" value={sheet.setupBefore?.tires?.pressure?.rl} onChange={handleChange} />
                        <InputField label="RR (kPa)" name="setupBefore.tires.pressure.rr" type="number" value={sheet.setupBefore?.tires?.pressure?.rr} onChange={handleChange} />
                    </div>
                </CollapsibleCard>

                <CollapsibleCard title="走行後 タイヤ空気圧 (温間)" icon={<Sparkles className="text-red-400" />} defaultOpen={true}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <InputField label="FL (kPa)" name="setupAfter.tires.pressure.fl" type="number" value={sheet.setupAfter?.tires?.pressure?.fl} onChange={handleChange} />
                        <InputField label="FR (kPa)" name="setupAfter.tires.pressure.fr" type="number" value={sheet.setupAfter?.tires?.pressure?.fr} onChange={handleChange} />
                        <InputField label="RL (kPa)" name="setupAfter.tires.pressure.rl" type="number" value={sheet.setupAfter?.tires?.pressure?.rl} onChange={handleChange} />
                        <InputField label="RR (kPa)" name="setupAfter.tires.pressure.rr" type="number" value={sheet.setupAfter?.tires?.pressure?.rr} onChange={handleChange} />
                    </div>
                </CollapsibleCard>

                <CollapsibleCard title="詳細設定（ディープ設定）" icon={<Wrench className="text-cyan-400"/>} defaultOpen={false}>
                    <div className="space-y-6">
                        <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-3">
                            <p className="text-amber-300 text-sm font-medium">⚠️ 物理的な作業を伴う設定項目</p>
                            <p className="text-amber-200/80 text-xs mt-1">これらの設定変更には車両の分解・組み立て作業が必要です</p>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold text-gray-300 border-b border-white/10 pb-2 mb-3">タイヤ詳細</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <InputField label="メーカー" name="setupBefore.tires.brand" value={sheet.setupBefore?.tires?.brand} onChange={handleChange} />
                                <InputField label="コンパウンド" name="setupBefore.tires.compound" value={sheet.setupBefore?.tires?.compound} onChange={handleChange} />
                                <InputField label="走行距離(km)" name="setupBefore.tires.mileage" type="number" value={sheet.setupBefore?.tires?.mileage} onChange={handleChange} />
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold text-gray-300 border-b border-white/10 pb-2 mb-3">エンジン・オイル</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <InputField label="オイルメーカー" name="setupBefore.engine.oilBrand" value={sheet.setupBefore?.engine?.oilBrand} onChange={handleChange} />
                                <InputField label="オイル粘度" name="setupBefore.engine.oilViscosity" value={sheet.setupBefore?.engine?.oilViscosity} onChange={handleChange} />
                                <InputField label="オイル走行距離(km)" name="setupBefore.engine.oilMileage" type="number" value={sheet.setupBefore?.engine?.oilMileage} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                </CollapsibleCard>
                
                {currentVehicleConfig.suspension && (
                    <>
                        <CollapsibleCard title="サスペンション（詳細設定）" icon={<SlidersHorizontal className="text-cyan-400"/>} defaultOpen={false}>
                            <div className="space-y-4">
                                <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-3">
                                    <p className="text-amber-300 text-sm font-medium">⚠️ 車高調整</p>
                                    <p className="text-amber-200/80 text-xs mt-1">車両のジャッキアップと専用工具が必要な作業です</p>
                                </div>
                                
                                <h4 className="font-semibold text-gray-300 border-b border-white/10 pb-2">車高 (mm)</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <InputField label="フロント" name="setupBefore.suspension.rideHeight.front" type="number" value={sheet.setupBefore?.suspension?.rideHeight?.front} onChange={handleChange} />
                                    <InputField label="リア" name="setupBefore.suspension.rideHeight.rear" type="number" value={sheet.setupBefore?.suspension?.rideHeight?.rear} onChange={handleChange} />
                                </div>
                                
                                <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                                    <p className="text-blue-300 text-sm">💡 ダンパー設定はクイック入力モードで調整できます</p>
                                </div>
                            </div>
                        </CollapsibleCard>
                    </>
                )}
                
                <DriverNotesEditor notes={sheet.driverNotes} onNotesChange={handleNotesChange} />
                
                <AIAdvisor sheet={sheet} />
            </div>
        </div>
    );
};