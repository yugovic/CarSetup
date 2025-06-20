import { useState, useEffect } from 'react';
import { initialSetupSheets } from '../data/initialData';

export const useSetupSheets = () => {
    const [setupSheets, setSetupSheets] = useState([]);
    const [selectedSheetId, setSelectedSheetId] = useState(null);
    const [activeSheetData, setActiveSheetData] = useState(null);
    const [originalSheetData, setOriginalSheetData] = useState(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    useEffect(() => {
        const sortedSheets = [...initialSetupSheets].sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
        setSetupSheets(sortedSheets);
        if (sortedSheets.length > 0) { 
            setSelectedSheetId(sortedSheets[0].id); 
        }
    }, []);

    useEffect(() => {
        if (selectedSheetId) {
            const sheet = setupSheets.find(s => s.id === selectedSheetId);
            setActiveSheetData(sheet ? JSON.parse(JSON.stringify(sheet)) : null);
            setOriginalSheetData(sheet ? JSON.parse(JSON.stringify(sheet)) : null);
            setHasUnsavedChanges(false);
        } else {
            setActiveSheetData(null);
            setOriginalSheetData(null);
        }
    }, [selectedSheetId, setupSheets]);
    
    useEffect(() => {
        if (!activeSheetData || !originalSheetData) { 
            setHasUnsavedChanges(false); 
            return; 
        }
        setHasUnsavedChanges(JSON.stringify(activeSheetData) !== JSON.stringify(originalSheetData));
    }, [activeSheetData, originalSheetData]);

    const handleSave = () => {
        const newSheets = setupSheets.map(s => s.id === activeSheetData.id ? activeSheetData : s);
        newSheets.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
        setSetupSheets(newSheets);
        setOriginalSheetData(JSON.parse(JSON.stringify(activeSheetData)));
    };

    const handleRevert = () => { 
        setActiveSheetData(JSON.parse(JSON.stringify(originalSheetData))); 
    };
    
    const createNewSheet = (baseSheet = null) => {
        const newSheet = baseSheet ? JSON.parse(JSON.stringify(baseSheet)) : { 
            vehicle: 'Roadster', 
            trackName: '富士スピードウェイ', 
            environment: {}, 
            setupBefore: { 
                tires: { pressure: {} }, 
                engine: {}, 
                suspension: { 
                    rideHeight: {}, 
                    dampers: { fl:{}, fr:{}, rl:{}, rr:{} } 
                } 
            }, 
            setupAfter: { tires: { pressure: {} } }, 
            driverNotes: {
                freeText: '',
                cornerBalance: {
                    lowSpeed: { entry: 'neutral', mid: 'neutral', exit: 'neutral' },
                    midSpeed: { entry: 'neutral', mid: 'neutral', exit: 'neutral' },
                    highSpeed: { entry: 'neutral', mid: 'neutral', exit: 'neutral' }
                }
            }
        };
        
        newSheet.id = `session-${Date.now()}`;
        newSheet.dateTime = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        newSheet.sessionType = baseSheet ? `${baseSheet.sessionType || 'New Session'} (コピー)` : 'New Session';
        
        const newSheets = [newSheet, ...setupSheets].sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
        setSetupSheets(newSheets);
        setSelectedSheetId(newSheet.id);
    };
    
    const handleAddNew = () => createNewSheet();
    
    const handleCopy = () => {
        if (selectedSheetId) {
            createNewSheet(setupSheets.find(s => s.id === selectedSheetId));
        } else {
            alert("コピー元のセッションを選択してください。");
        }
    };
    
    const handleDelete = () => {
        if (!selectedSheetId || !window.confirm('このセットアップシートを本当に削除しますか？')) return;
        const newSheets = setupSheets.filter(s => s.id !== selectedSheetId);
        setSetupSheets(newSheets);
        setSelectedSheetId(newSheets.length > 0 ? newSheets[0].id : null);
    };

    return {
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
    };
};