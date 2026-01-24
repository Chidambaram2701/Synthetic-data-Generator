import React, { useCallback } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';

export default function UploadCard({ onFileUpload, fileInfo, error }) {
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            validateAndUpload(files[0]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleFileSelect = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            validateAndUpload(files[0]);
        }
    };

    const validateAndUpload = (file) => {
        if (file.name.endsWith('.csv')) {
            onFileUpload(file);
        } else {
            alert('Please upload a .csv file');
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-600" />
                Upload Dataset
            </h2>

            <div
                className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById('fileInput').click()}
            >
                <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    accept=".csv"
                    onChange={handleFileSelect}
                />

                {fileInfo ? (
                    <div className="flex flex-col items-center text-green-600">
                        <CheckCircle className="w-10 h-10 mb-2" />
                        <p className="font-medium text-slate-900">{fileInfo.name}</p>
                        <p className="text-sm text-slate-500">{(fileInfo.size / 1024).toFixed(2)} KB</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-slate-500">
                        <FileSpreadsheet className="w-10 h-10 mb-2 text-slate-400" />
                        <p className="font-medium text-slate-900">Drag & Drop CSV file here</p>
                        <p className="text-sm">or click to browse</p>
                    </div>
                )}
            </div>

            {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}
        </div>
    );
}
