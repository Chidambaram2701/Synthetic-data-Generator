import React from 'react';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

export default function StatusBanner({ status, message }) {
    if (status === 'idle') return null;

    const styles = {
        training: 'bg-indigo-50 border-indigo-200 text-indigo-700',
        generating: 'bg-blue-50 border-blue-200 text-blue-700',
        success: 'bg-green-50 border-green-200 text-green-700',
        error: 'bg-red-50 border-red-200 text-red-700',
    };

    const icons = {
        training: <Loader2 className="w-5 h-5 animate-spin" />,
        generating: <Loader2 className="w-5 h-5 animate-spin" />,
        success: <CheckCircle className="w-5 h-5" />,
        error: <AlertTriangle className="w-5 h-5" />,
    };

    return (
        <div className={clsx(
            "flex items-center gap-3 px-4 py-3 rounded-lg border shadow-sm transition-all duration-300",
            styles[status]
        )}>
            {icons[status]}
            <span className="font-medium text-sm">{message}</span>
        </div>
    );
}
