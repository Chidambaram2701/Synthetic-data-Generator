import React from 'react';
import { Table } from 'lucide-react';

export default function PreviewTable({ title, data }) {
    if (!data || data.length === 0) return null;

    const headers = Object.keys(data[0]);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                <Table className="w-4 h-4 text-slate-500" />
                <h3 className="font-semibold text-slate-700">{title}</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-600">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-100">
                        <tr>
                            {headers.map((header) => (
                                <th key={header} className="px-6 py-3 font-medium whitespace-nowrap">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.slice(0, 10).map((row, idx) => (
                            <tr key={idx} className="bg-white border-b border-slate-50 hover:bg-slate-50 last:border-0">
                                {headers.map((header) => (
                                    <td key={`${idx}-${header}`} className="px-6 py-3 whitespace-nowrap">
                                        {row[header]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 text-center">
                Showing first 10 rows
            </div>
        </div>
    );
}
