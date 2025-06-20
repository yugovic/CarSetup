import { useState, useEffect } from 'react';

export const useDeviceType = () => {
    const [deviceType, setDeviceType] = useState('desktop');
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const [isDesktop, setIsDesktop] = useState(true);

    useEffect(() => {
        const checkDevice = () => {
            const width = window.innerWidth;
            const userAgent = navigator.userAgent;
            
            // User Agentでの判定
            const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(userAgent);
            const isTabletDevice = /iPad|Android/i.test(userAgent) && width >= 768;
            
            // 画面幅での判定も組み合わせる
            if (width < 640 && isMobileDevice) {
                setDeviceType('mobile');
                setIsMobile(true);
                setIsTablet(false);
                setIsDesktop(false);
            } else if (width >= 640 && width < 1024 && (isMobileDevice || isTabletDevice)) {
                setDeviceType('tablet');
                setIsMobile(false);
                setIsTablet(true);
                setIsDesktop(false);
            } else {
                setDeviceType('desktop');
                setIsMobile(false);
                setIsTablet(false);
                setIsDesktop(true);
            }
        };

        checkDevice();
        window.addEventListener('resize', checkDevice);
        
        return () => {
            window.removeEventListener('resize', checkDevice);
        };
    }, []);

    return {
        deviceType,
        isMobile,
        isTablet,
        isDesktop
    };
};