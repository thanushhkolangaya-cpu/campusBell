import React, { useState } from 'react';
import { X, User, Hash, Phone, Layers, LogOut, Check, Building2, Calendar, Award } from 'lucide-react';
import { UserSettings } from '../types';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (updates: Partial<UserSettings>) => void;
  onLogout: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onLogout,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(settings.studentName);
  const [rollNumber, setRollNumber] = useState(settings.rollNumber);
  const [phoneNumber, setPhoneNumber] = useState(settings.phoneNumber || '');
  const [batch, setBatch] = useState<'B1' | 'B2'>(settings.selectedBatch);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      studentName: name.trim() || settings.studentName,
      rollNumber: rollNumber.trim().toUpperCase() || settings.rollNumber,
      phoneNumber: phoneNumber.trim() || undefined,
      selectedBatch: batch,
    });
    setIsEditing(false);
  };

  const initials = settings.studentName
    ? settings.studentName
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'ST';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Student Profile & ID</h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isEditing ? (
          <div className="p-6 space-y-5">
            {/* College ID Card representation */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950 to-slate-900 text-white relative overflow-hidden shadow-md">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-base text-white border border-white/20 shadow-inner">
                    {initials}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white tracking-tight leading-tight">
                      {settings.studentName}
                    </h4>
                    <span className="font-mono text-xs text-indigo-300 font-bold block mt-0.5">
                      Roll: {settings.rollNumber}
                    </span>
                    {settings.phoneNumber && (
                      <span className="font-mono text-[11px] text-slate-300 block">
                        Ph: {settings.phoneNumber}
                      </span>
                    )}
                  </div>
                </div>

                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-500/80 text-white shadow-xs">
                  Batch {settings.selectedBatch}
                </span>
              </div>

              <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs text-indigo-200">
                <div>
                  <span className="text-[10px] uppercase text-indigo-300 block">Classroom</span>
                  <span className="font-semibold text-white">Room {settings.defaultRoom}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-indigo-300 block">Section & Cycle</span>
                  <span className="font-semibold text-white">Sem {settings.semesterSection} · Physics</span>
                </div>
              </div>
            </div>

            {/* Quick Batch Switcher */}
            <div>
              <span className="text-xs font-semibold text-slate-700 block mb-2">
                Active Laboratory Batch
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ selectedBatch: 'B1' })}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                    settings.selectedBatch === 'B1'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>Batch B1</span>
                  {settings.selectedBatch === 'B1' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </button>

                <button
                  type="button"
                  onClick={() => onUpdateSettings({ selectedBatch: 'B2' })}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                    settings.selectedBatch === 'B2'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>Batch B2</span>
                  {settings.selectedBatch === 'B2' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                {settings.selectedBatch === 'B1'
                  ? 'Assigned: Tue Physics Lab · Wed Data Science Lab · Sat C Lab'
                  : 'Assigned: Tue C Programming Lab · Wed Physics Lab · Sat Data Science Lab'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setName(settings.studentName);
                  setRollNumber(settings.rollNumber);
                  setPhoneNumber(settings.phoneNumber || '');
                  setBatch(settings.selectedBatch);
                  setIsEditing(true);
                }}
                className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Edit Student Details
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-1.5 py-2 px-3 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                title="Switch student account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Switch / Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Student Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                Roll Number / USN
              </label>
              <input
                type="text"
                required
                value={rollNumber}
                onChange={e => setRollNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono uppercase rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                Phone / Mobile Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder="+91 98801 23456"
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                Lab Batch
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setBatch('B1')}
                  className={`py-2 text-xs font-bold rounded-xl border cursor-pointer ${
                    batch === 'B1' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200'
                  }`}
                >
                  Batch B1
                </button>
                <button
                  type="button"
                  onClick={() => setBatch('B2')}
                  className={`py-2 text-xs font-bold rounded-xl border cursor-pointer ${
                    batch === 'B2' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200'
                  }`}
                >
                  Batch B2
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl cursor-pointer shadow-xs"
              >
                Save Details
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
