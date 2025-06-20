import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, Zap, Thermometer, Droplets, Gauge, Fuel } from 'lucide-react';

const StepIndicator = ({ currentStep, totalSteps }) => (
    <div className="flex justify-center gap-2 mb-6">
        {Array.from({ length: totalSteps }, (_, i) => (
            <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentStep 
                        ? 'w-8 bg-cyan-400' 
                        : i < currentStep 
                            ? 'w-2 bg-cyan-600' 
                            : 'w-2 bg-gray-600'
                }`}
            />
        ))}
    </div>
);

const MobileNumberInput = ({ label, value, onChange, unit = '', min, max, step = 1, icon: Icon }) => {
    const handleIncrement = () => {
        const newValue = parseFloat(value || 0) + step;
        if (!max || newValue <= max) {
            onChange(newValue.toString());
        }
    };

    const handleDecrement = () => {
        const newValue = parseFloat(value || 0) - step;
        if (!min || newValue >= min) {
            onChange(newValue.toString());
        }
    };

    return (
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
            <div className="flex items-center justify-center gap-3 mb-6">
                {Icon && (
                    <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl">
                        <Icon size={28} className="text-white" />
                    </div>
                )}
                <h3 className="text-2xl font-semibold text-white">{label}</h3>
            </div>
            
            <div className="flex items-center justify-center gap-4 mb-8">
                <button 
                    onClick={handleDecrement}
                    className="w-16 h-16 rounded-2xl bg-red-500/20 hover:bg-red-500/30 active:bg-red-500/40 text-red-400 flex items-center justify-center text-3xl font-bold transition-all active:scale-95"
                >
                    −
                </button>
                
                <div className="flex-1 max-w-xs">
                    <input
                        type="number"
                        inputMode="decimal"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full bg-black/30 text-center text-white text-5xl font-bold rounded-2xl border-2 border-white/20 outline-none focus:border-cyan-400 py-6 transition-colors"
                        min={min}
                        max={max}
                        step={step}
                    />
                    {unit && (
                        <p className="text-center text-gray-400 text-lg mt-2">{unit}</p>
                    )}
                </div>
                
                <button 
                    onClick={handleIncrement}
                    className="w-16 h-16 rounded-2xl bg-green-500/20 hover:bg-green-500/30 active:bg-green-500/40 text-green-400 flex items-center justify-center text-3xl font-bold transition-all active:scale-95"
                >
                    +
                </button>
            </div>
        </div>
    );
};

const TirePressureStep = ({ tires, onChange, position }) => {
    const positions = {
        fl: { label: 'フロント左', short: 'FL', color: 'from-blue-500 to-cyan-500' },
        fr: { label: 'フロント右', short: 'FR', color: 'from-blue-500 to-cyan-500' },
        rl: { label: 'リア左', short: 'RL', color: 'from-purple-500 to-pink-500' },
        rr: { label: 'リア右', short: 'RR', color: 'from-purple-500 to-pink-500' }
    };

    // 車のビジュアル表現でポジションを示す
    const CarPositionIndicator = ({ currentPosition }) => (
        <div className="relative w-48 h-64 mx-auto mb-6">
            {/* 車体の外枠 */}
            <div className="absolute inset-4 border-2 border-white/30 rounded-2xl"></div>
            
            {/* フロントの表示 */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">FRONT</div>
            
            {/* タイヤ位置 */}
            <div className={`absolute top-8 left-4 w-12 h-16 rounded-lg border-2 transition-all ${
                currentPosition === 'fl' ? 'bg-blue-500/40 border-blue-400 scale-110' : 'bg-white/10 border-white/20'
            }`}>
                <div className="flex items-center justify-center h-full text-xs font-bold">FL</div>
            </div>
            <div className={`absolute top-8 right-4 w-12 h-16 rounded-lg border-2 transition-all ${
                currentPosition === 'fr' ? 'bg-blue-500/40 border-blue-400 scale-110' : 'bg-white/10 border-white/20'
            }`}>
                <div className="flex items-center justify-center h-full text-xs font-bold">FR</div>
            </div>
            <div className={`absolute bottom-8 left-4 w-12 h-16 rounded-lg border-2 transition-all ${
                currentPosition === 'rl' ? 'bg-purple-500/40 border-purple-400 scale-110' : 'bg-white/10 border-white/20'
            }`}>
                <div className="flex items-center justify-center h-full text-xs font-bold">RL</div>
            </div>
            <div className={`absolute bottom-8 right-4 w-12 h-16 rounded-lg border-2 transition-all ${
                currentPosition === 'rr' ? 'bg-purple-500/40 border-purple-400 scale-110' : 'bg-white/10 border-white/20'
            }`}>
                <div className="flex items-center justify-center h-full text-xs font-bold">RR</div>
            </div>
            
            {/* リアの表示 */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">REAR</div>
            
            {/* 中央の矢印 */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-600 text-3xl">↑</div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="text-center mb-4">
                <h2 className="text-3xl font-bold text-white mb-2">タイヤ空気圧</h2>
                <p className="text-gray-400">走行前（冷間）</p>
            </div>
            
            {/* 車のポジション表示 */}
            <CarPositionIndicator currentPosition={position} />
            
            <div className={`p-4 bg-gradient-to-r ${positions[position].color} rounded-2xl`}>
                <p className="text-white text-center font-semibold text-lg mb-4">
                    {positions[position].label} ({positions[position].short})
                </p>
                <MobileNumberInput
                    value={tires?.pressure?.[position]}
                    onChange={(value) => onChange(`setupBefore.tires.pressure.${position}`, value)}
                    unit="kPa"
                    min={100}
                    max={300}
                    step={5}
                />
            </div>
        </div>
    );
};

export const QuickInputMobile = ({ sheet, onSheetChange, onSave, hasUnsavedChanges }) => {
    const [currentStep, setCurrentStep] = useState(0);
    
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

    if (!sheet) return null;

    const steps = [
        // 環境データ
        {
            component: (
                <div className="space-y-6">
                    <div className="text-center mb-4">
                        <h2 className="text-3xl font-bold text-white mb-2">環境データ</h2>
                        <p className="text-gray-400">現在の天候情報</p>
                    </div>
                    <MobileNumberInput
                        label="気温"
                        value={sheet.environment?.airTemp}
                        onChange={(value) => handleChange('environment.airTemp', value)}
                        unit="°C"
                        min={-10}
                        max={50}
                        icon={Thermometer}
                    />
                </div>
            )
        },
        {
            component: (
                <div className="space-y-6">
                    <MobileNumberInput
                        label="路面温度"
                        value={sheet.environment?.trackTemp}
                        onChange={(value) => handleChange('environment.trackTemp', value)}
                        unit="°C"
                        min={-10}
                        max={80}
                        icon={Thermometer}
                    />
                </div>
            )
        },
        // タイヤ圧力 - FL
        {
            component: (
                <TirePressureStep
                    tires={sheet.setupBefore?.tires}
                    onChange={handleChange}
                    position="fl"
                />
            )
        },
        // タイヤ圧力 - FR
        {
            component: (
                <TirePressureStep
                    tires={sheet.setupBefore?.tires}
                    onChange={handleChange}
                    position="fr"
                />
            )
        },
        // タイヤ圧力 - RL
        {
            component: (
                <TirePressureStep
                    tires={sheet.setupBefore?.tires}
                    onChange={handleChange}
                    position="rl"
                />
            )
        },
        // タイヤ圧力 - RR
        {
            component: (
                <TirePressureStep
                    tires={sheet.setupBefore?.tires}
                    onChange={handleChange}
                    position="rr"
                />
            )
        },
        // 燃料
        {
            component: (
                <div className="space-y-6">
                    <div className="text-center mb-4">
                        <h2 className="text-3xl font-bold text-white mb-2">燃料</h2>
                    </div>
                    <MobileNumberInput
                        label="燃料量"
                        value={sheet.setupBefore?.fuel}
                        onChange={(value) => handleChange('setupBefore.fuel', value)}
                        unit="L"
                        min={0}
                        max={100}
                        step={5}
                        icon={Fuel}
                    />
                </div>
            )
        }
    ];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else if (hasUnsavedChanges) {
            onSave();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    // スワイプ処理
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            handleNext();
        } else if (isRightSwipe) {
            handlePrev();
        }
    };

    return (
        <div 
            className="bg-gray-900/10 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl p-6 min-h-[600px] flex flex-col"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            {/* ヘッダー */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Zap className="text-yellow-400" size={28} />
                    <h2 className="text-2xl font-bold text-white">クイック入力</h2>
                </div>
                {hasUnsavedChanges && (
                    <div className="text-yellow-400 text-sm font-medium animate-pulse">
                        未保存
                    </div>
                )}
            </div>

            {/* ステップインジケーター */}
            <StepIndicator currentStep={currentStep} totalSteps={steps.length} />

            {/* コンテンツ */}
            <div className="flex-1 flex items-center justify-center">
                {steps[currentStep].component}
            </div>

            {/* ナビゲーションボタン */}
            <div className="flex justify-between items-center mt-8 gap-4">
                <button
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-semibold transition-all ${
                        currentStep === 0
                            ? 'bg-gray-700 text-gray-500 opacity-50'
                            : 'bg-white/10 text-white hover:bg-white/20 active:scale-95'
                    }`}
                >
                    <ChevronLeft size={20} />
                    戻る
                </button>

                <div className="text-center">
                    <p className="text-gray-400 text-sm">
                        {currentStep + 1} / {steps.length}
                    </p>
                </div>

                <button
                    onClick={handleNext}
                    className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-semibold transition-all active:scale-95 ${
                        currentStep === steps.length - 1 && hasUnsavedChanges
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-400 hover:to-emerald-400'
                            : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                >
                    {currentStep === steps.length - 1 ? (
                        <>
                            保存
                            <Check size={20} />
                        </>
                    ) : (
                        <>
                            次へ
                            <ChevronRight size={20} />
                        </>
                    )}
                </button>
            </div>

            {/* スワイプヒント */}
            <div className="text-center mt-4">
                <p className="text-gray-500 text-xs">
                    左右にスワイプして移動
                </p>
            </div>
        </div>
    );
};