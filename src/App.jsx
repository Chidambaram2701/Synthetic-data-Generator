import React, { useState } from 'react';
import { Upload, BrainCircuit, Download, Database, ShieldCheck } from 'lucide-react';
import UploadCard from './components/UploadCard';
import SettingsCard from './components/SettingsCard';
import PreviewTable from './components/PreviewTable';
import StatusBanner from './components/StatusBanner';
import { uploadDataset, trainModel, generateData, getSyntheticDownloadUrl, getModelDownloadUrl } from './api';

function App() {
    const [file, setFile] = useState(null);
    const [realDataPreview, setRealDataPreview] = useState([]);
    const [syntheticDataPreview, setSyntheticDataPreview] = useState([]);
    const [status, setStatus] = useState('idle'); // idle, training, generating, success, error
    const [statusMessage, setStatusMessage] = useState('');
    const [modelReady, setModelReady] = useState(false);
    const [generatedReady, setGeneratedReady] = useState(false);

    const [settings, setSettings] = useState({
        epochs: 100,
        rows_to_generate: 500,
        dropDuplicates: false,
        dropNulls: false,
    });

    const parseCSV = (file) => {
        // Simple client-side CSV preview (Optional: Better to get from server response)
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            const lines = text.split('\n').filter(line => line.trim() !== '');
            const headers = lines[0].split(',');
            const rows = lines.slice(1, 11).map(line => {
                const values = line.split(',');
                return headers.reduce((obj, header, i) => {
                    obj[header.trim()] = values[i];
                    return obj;
                }, {});
            });
            setRealDataPreview(rows);
        };
        reader.readAsText(file);
    };

    const handleFileUpload = async (uploadedFile) => {
        try {
            setFile(uploadedFile);
            setRealDataPreview([]); // Clear old preview
            parseCSV(uploadedFile);

            // Upload to server
            // await uploadDataset(uploadedFile); // Uncomment when backend is ready
            // For now, we assume frontend-only preview or immediate upload.
            // The prompt says "User uploads ... clicks Train". So maybe upload happens ON Train? Or effectively immediately.
            // Usually better to upload immediately to validate.

            setStatus('idle');
            setStatusMessage('');
        } catch (err) {
            console.error(err);
            setStatus('error');
            setStatusMessage('Failed to process file.');
        }
    };

    const handleTrain = async () => {
        if (!file) return;
        setStatus('training');
        setStatusMessage(`Training CTGAN model (${settings.epochs} epochs)... This may take a while.`);

        try {
            // First upload if not already
            await uploadDataset(file);

            await trainModel({
                epochs: settings.epochs,
                dropDuplicates: settings.dropDuplicates,
                dropNulls: settings.dropNulls
            });

            setStatus('success');
            setStatusMessage('Model trained successfully!');
            setModelReady(true);
        } catch (err) {
            console.error(err);
            setStatus('error');
            setStatusMessage(err.message || 'Training failed. Check backend logs.');
        }
    };

    const handleGenerate = async () => {
        if (!modelReady) return;
        setStatus('generating');
        setStatusMessage(`Generating ${settings.rows_to_generate} synthetic rows...`);

        try {
            const result = await generateData(settings.rows_to_generate);
            // Assume result.data is the array of rows for preview
            if (result.data) {
                setSyntheticDataPreview(result.data);
            } else {
                // Fallback if backend doesn't return data in response but needs download
                // We might need another call to fetch preview or just wait for download
            }

            setStatus('success');
            setStatusMessage('Synthetic dataset generated successfully!');
            setGeneratedReady(true);
        } catch (err) {
            console.error(err);
            setStatus('error');
            setStatusMessage('Generation failed.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-600 p-2 rounded-lg">
                            <ShieldCheck className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 leading-tight">Synthetic Data Generator</h1>
                            <p className="text-xs text-slate-500 font-medium">Privacy-Preserving CTGAN</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        {/* Optional Header Actions */}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Top Section: Upload & Settings */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <UploadCard onFileUpload={handleFileUpload} fileInfo={file} />
                    </div>
                    <div className="lg:col-span-2">
                        <SettingsCard settings={settings} setSettings={setSettings} disabled={status === 'training' || status === 'generating'} />
                    </div>
                </div>

                {/* Action Bar & Status */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1 w-full">
                        <StatusBanner status={status} message={statusMessage} />
                    </div>

                    <div className="flex flex-wrap gap-4 w-full md:w-auto justify-end">
                        <button
                            onClick={handleTrain}
                            disabled={!file || status === 'training'}
                            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-sm flex items-center gap-2 transition-all"
                        >
                            <BrainCircuit className="w-5 h-5" />
                            Train Model
                        </button>

                        <button
                            onClick={handleGenerate}
                            disabled={!modelReady || status === 'generating' || status === 'training'}
                            className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-sm flex items-center gap-2 transition-all"
                        >
                            <Database className="w-5 h-5" />
                            Generate Data
                        </button>
                    </div>
                </div>

                {/* Downloads Area */}
                {(modelReady || generatedReady) && (
                    <div className="flex gap-4 justify-end">
                        {modelReady && (
                            <a
                                href={getModelDownloadUrl()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-2 border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-medium rounded-lg flex items-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Download Model (.pkl)
                            </a>
                        )}
                        {generatedReady && (
                            <a
                                href={getSyntheticDownloadUrl()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-2 border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-medium rounded-lg flex items-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Download Synthetic CSV
                            </a>
                        )}
                    </div>
                )}

                {/* Previews */}
                <div className="space-y-8">
                    {realDataPreview.length > 0 && (
                        <PreviewTable title="Original Dataset Preview" data={realDataPreview} />
                    )}

                    {syntheticDataPreview.length > 0 && (
                        <PreviewTable title="Synthetic Dataset Preview" data={syntheticDataPreview} />
                    )}
                </div>

            </main>
        </div>
    );
}

export default App;
