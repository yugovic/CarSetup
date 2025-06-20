export const formatDateTime = (isoString) => 
    isoString ? new Date(isoString).toLocaleString('ja-JP', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit' 
    }) : '';