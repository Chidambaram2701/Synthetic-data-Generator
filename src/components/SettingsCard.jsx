import React from 'react';
import { Settings, Sliders } from 'lucide-react';

export default function SettingsCard({ settings, setSettings, disabled }) {
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-600" />
                Training Settings
            </h2>

            <div className="space-y-6">
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-slate-700">Epochs</label>
                        <span className="text-sm text-indigo-600 font-semibold">{settings.epochs}</span>
                    </div>
                    <input
                        type="range"
                        name="epochs"
                        min="50"
                        max="500"
                        step="10"
                        value={settings.epochs}
                        onChange={handleChange}
                        disabled={disabled}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <p className="text-xs text-slate-400 mt-1">Number of training iterations</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Rows to Generate</label>
                    <input
                        type="number"
                        name="rows_to_generate"
                        min="100"
                        max="100000"
                        value={settings.rows_to_generate}
                        onChange={handleChange}
                        disabled={disabled}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    />
                </div>

                <div className="space-y-3 pt-2">
                    <label className="flex items-center gap-3 p-3 border border-slate-100 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                        <input
                            type="checkbox"
                            name="dropDuplicates"
                            checked={settings.dropDuplicates}
                            onChange={handleChange}
                            disabled={disabled}
                            className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                        />
                        <span className="text-sm font-medium text-slate-700">Drop Duplicates</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 border border-slate-100 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                        <input
                            type="checkbox"
                            name="dropNulls"
                            checked={settings.dropNulls}
                            onChange={handleChange}
                            disabled={disabled}
                            className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                        />
                        <span className="text-sm font-medium text-slate-700">Drop Missing Values</span>
                    </label>
                </div>
            </div>
        </div>
    );
}
