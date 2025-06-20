import React from 'react';
import { useDeviceType } from '../hooks/useDeviceType';
import { QuickInputMobile } from './QuickInputMobile';
import { QuickInputDesktop } from './QuickInputDesktop';

export const QuickInputView = ({ sheet, onSheetChange, onSave, hasUnsavedChanges, previousSheet }) => {
    const { isMobile, isTablet, isDesktop } = useDeviceType();

    // モバイルとタブレットではモバイル版を使用
    if (isMobile || isTablet) {
        return (
            <QuickInputMobile
                sheet={sheet}
                onSheetChange={onSheetChange}
                onSave={onSave}
                hasUnsavedChanges={hasUnsavedChanges}
            />
        );
    }

    // デスクトップではデスクトップ版を使用
    return (
        <QuickInputDesktop
            sheet={sheet}
            onSheetChange={onSheetChange}
            onSave={onSave}
            hasUnsavedChanges={hasUnsavedChanges}
            previousSheet={previousSheet}
        />
    );
};