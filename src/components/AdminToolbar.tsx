import React, { useState } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import { useSite } from '../context/SiteContext';

export function AdminToolbar() {
    const { isAdmin, editMode, resetContent } = useSite();
    const [showReset, setShowReset] = useState(false);

    if (!isAdmin || !editMode) return null;

    const handleReset = () => {
        resetContent();
        window.location.reload();
    };

    return (
        <>
            {/* Floating toolbar */}
            <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
                <div className="flex h-2 w-2 animate-pulse rounded-full bg-blue-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Editing Mode
                </span>
                <div className="h-4 w-px bg-gray-200 dark:bg-gray-800" />
                <span className="text-xs text-gray-500">Hover over text or images to edit</span>
                <div className="h-4 w-px bg-gray-200 dark:bg-gray-800" />
                <button
                    onClick={() => setShowReset(true)}
                    className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset
                </button>
            </div>

            {/* Reset Confirmation */}
            {showReset && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="mx-4 w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">Reset All Content?</h3>
                                <p className="text-sm text-gray-500">This will restore default content and clear all your changes.</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleReset}
                                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                            >
                                Reset Everything
                            </button>
                            <button
                                onClick={() => setShowReset(false)}
                                className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
