import { useState } from 'react';
import { AlertTriangle, Database, Smartphone, CheckCircle } from 'lucide-react';

const mockConflicts = [
  {
    id: 'crdt-err-001',
    patientName: 'Fatima S.',
    patientId: 'PT-8842',
    field: 'Severe Allergies',
    localValue: 'Penicillin (Anaphylaxis Risk)',
    remoteValue: 'None Known',
    localTimestamp: '2026-04-05T14:30:00Z',
    remoteTimestamp: '2026-04-05T09:15:00Z',
  }
];

export default function App() {
  const [conflicts, setConflicts] = useState(mockConflicts);

  const resolveConflict = (id: string, resolution: 'local' | 'remote') => {
    console.log(`Resolved ${id} using ${resolution} data.`);
    setConflicts(conflicts.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      <header className="mb-8 border-b pb-4 border-slate-200 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">OpenMed Lite</h1>
          <p className="text-slate-500 mt-1">Offline-First Clinical Records</p>
        </div>
        <div className="flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full font-medium text-sm">
          <AlertTriangle size={18} />
          <span>{conflicts.length} Pending Sync Conflicts</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold mb-6">Human-in-the-Loop Resolution Desk</h2>
        {conflicts.length === 0 ? (
          <div className="bg-green-50 border border-green-200 text-green-800 p-8 rounded-xl flex flex-col items-center">
            <CheckCircle size={48} className="mb-4 text-green-500" />
            <h3 className="text-xl font-bold">All CRDT States Synchronized</h3>
          </div>
        ) : (
          <div className="space-y-6">
            {conflicts.map((conflict) => (
              <div key={conflict.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="bg-slate-100 px-6 py-4 border-b border-slate-200 flex justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{conflict.patientName} ({conflict.patientId})</h3>
                    <p className="text-sm text-slate-500">Conflicting Field: <span className="font-semibold text-red-600">{conflict.field}</span></p>
                  </div>
                </div>
                <div className="grid grid-cols-2 divide-x divide-slate-200">
                  <div className="p-6 bg-amber-50/30">
                    <div className="flex items-center gap-2 mb-4 text-amber-700 font-semibold">
                      <Smartphone size={20} />
                      <h4>Local Clinic Node (Offline Entry)</h4>
                    </div>
                    <div className="p-4 bg-white border border-amber-200 rounded-lg shadow-inner mb-4">
                      <p className="text-lg font-medium">{conflict.localValue}</p>
                    </div>
                    <button onClick={() => resolveConflict(conflict.id, 'local')} className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg font-medium">
                      Keep Local Data
                    </button>
                  </div>
                  <div className="p-6 bg-blue-50/30">
                    <div className="flex items-center gap-2 mb-4 text-blue-700 font-semibold">
                      <Database size={20} />
                      <h4>Main Hospital Server</h4>
                    </div>
                    <div className="p-4 bg-white border border-blue-200 rounded-lg shadow-inner mb-4">
                      <p className="text-lg font-medium">{conflict.remoteValue}</p>
                    </div>
                    <button onClick={() => resolveConflict(conflict.id, 'remote')} className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 py-2 rounded-lg font-medium">
                      Overwrite with Server
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
