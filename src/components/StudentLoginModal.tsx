import React, { useState } from 'react';
import {
  User,
  Hash,
  Phone,
  Layers,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building2,
  Users,
  ShieldCheck,
} from 'lucide-react';
import { UserSettings } from '../types';
import { CLASS_ROSTER_STUDENTS } from '../utils/defaultData';

interface StudentLoginModalProps {
  isOpen: boolean;
  onLogin: (name: string, rollNumber: string, batch: 'B1' | 'B2', phoneNumber?: string) => void;
  currentSettings: UserSettings;
  canDismiss?: boolean;
  onClose?: () => void;
}

export const StudentLoginModal: React.FC<StudentLoginModalProps> = ({
  isOpen,
  onLogin,
  currentSettings,
  canDismiss = false,
  onClose,
}) => {
  const [name, setName] = useState(currentSettings.studentName || '');
  const [rollNumber, setRollNumber] = useState(currentSettings.rollNumber || '');
  const [phoneNumber, setPhoneNumber] = useState(currentSettings.phoneNumber || '');
  const [batch, setBatch] = useState<'B1' | 'B2'>(currentSettings.selectedBatch || 'B1');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'custom' | 'roster'>('custom');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your student full name.');
      return;
    }
    if (!rollNumber.trim()) {
      setError('Please enter your roll number, USN, or student number.');
      return;
    }
    setError('');
    onLogin(
      name.trim(),
      rollNumber.trim().toUpperCase(),
      batch,
      phoneNumber.trim() || undefined
    );
  };

  const handleSelectStudentFromRoster = (student: typeof CLASS_ROSTER_STUDENTS[0]) => {
    setName(student.name);
    setRollNumber(student.rollNumber);
    setPhoneNumber(student.phoneNumber);
    setBatch(student.batch);
    setError('');
    // Auto login immediately or populate
    onLogin(student.name, student.rollNumber, student.batch, student.phoneNumber);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-6">
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 p-6 text-white relative">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-indigo-300 shadow-inner">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase font-bold tracking-wider text-indigo-300">
                    CampusBell Portal
                  </span>
                  <span className="text-[10px] bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-full border border-indigo-400/20 font-medium">
                    Sem I & Section A4
                  </span>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white">
                  Student Sign In
                </h2>
              </div>
            </div>

            {canDismiss && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="text-white/60 hover:text-white text-xs px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              >
                Close
              </button>
            )}
          </div>

          <p className="text-xs text-indigo-200/90 mt-1">
            Sign in with your name and roll number / contact number to sync your personalized timetable and lab batch alerts.
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-indigo-200 mt-3 pt-2.5 border-t border-white/10">
            <div className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Room M305</span>
            </div>
            <span>·</span>
            <span>Physics Cycle</span>
            <span>·</span>
            <span>Section A4</span>
          </div>
        </div>

        {/* Tab Switcher: Custom Entry vs Fast Class Directory */}
        <div className="flex border-b border-slate-100 bg-slate-50/60 px-6 pt-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`pb-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'custom'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Enter Your Details</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('roster')}
            className={`pb-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'roster'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Class Directory (1-Click Login)</span>
          </button>
        </div>

        {activeTab === 'custom' ? (
          /* Custom Login Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <span className="font-semibold">Error:</span> {error}
              </div>
            )}

            {/* Student Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Student Full Name *
                </span>
                <span className="text-[11px] text-slate-400 font-normal">e.g. Thanush H Kolangaya</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your student name"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900"
              />
            </div>

            {/* Numbers: Roll Number / USN and Phone / Mobile Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-slate-400" />
                    Roll No / USN *
                  </span>
                </label>
                <input
                  type="text"
                  required
                  value={rollNumber}
                  onChange={e => setRollNumber(e.target.value)}
                  placeholder="e.g. 1MS26CS042 or 42"
                  className="w-full px-3.5 py-2.5 text-sm font-mono uppercase tracking-wider rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    Phone / Mobile Number
                  </span>
                  <span className="text-[10px] text-slate-400">Optional</span>
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  placeholder="e.g. +91 98801 23456"
                  className="w-full px-3.5 py-2.5 text-sm font-mono rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900"
                />
              </div>
            </div>

            {/* Batch Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  Laboratory Batch Allocation *
                </span>
                <span className="text-[11px] text-indigo-600 font-medium">Controls your lab periods</span>
              </label>

              <div className="grid grid-cols-2 gap-3">
                {/* Batch B1 option */}
                <button
                  type="button"
                  onClick={() => setBatch('B1')}
                  className={`p-3.5 rounded-2xl border text-left transition-all relative cursor-pointer ${
                    batch === 'B1'
                      ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-600/10'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-bold text-slate-900">Batch B1</span>
                    {batch === 'B1' && (
                      <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    )}
                  </div>
                  <div className="space-y-0.5 text-[11px] text-slate-600">
                    <p>• Tue: Physics Lab (P-Block)</p>
                    <p>• Wed: Data Science Lab</p>
                    <p>• Sat: C Programming Lab</p>
                  </div>
                </button>

                {/* Batch B2 option */}
                <button
                  type="button"
                  onClick={() => setBatch('B2')}
                  className={`p-3.5 rounded-2xl border text-left transition-all relative cursor-pointer ${
                    batch === 'B2'
                      ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-600/10'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-bold text-slate-900">Batch B2</span>
                    {batch === 'B2' && (
                      <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    )}
                  </div>
                  <div className="space-y-0.5 text-[11px] text-slate-600">
                    <p>• Tue: C Programming Lab</p>
                    <p>• Wed: Physics Lab (P-Block)</p>
                    <p>• Sat: Data Science Lab</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Login & Open My Timetable</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          /* Class Roster 1-Click Quick Select */
          <div className="p-6 space-y-3">
            <p className="text-xs text-slate-600">
              Select your student profile from Section A4 below to immediately log in with verified Roll Number, Phone Number, and Batch:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
              {CLASS_ROSTER_STUDENTS.map(student => (
                <button
                  key={student.rollNumber}
                  type="button"
                  onClick={() => handleSelectStudentFromRoster(student)}
                  className="p-3 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all text-left flex items-start justify-between group cursor-pointer"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">
                        {student.name}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 font-bold block mt-0.5">
                      Roll: {student.rollNumber}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {student.phoneNumber}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white text-slate-700 transition-colors">
                    {student.batch}
                  </span>
                </button>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
              <span>Not in this list?</span>
              <button
                type="button"
                onClick={() => setActiveTab('custom')}
                className="text-indigo-600 hover:text-indigo-800 font-bold underline cursor-pointer"
              >
                Type Your Own Name & Number
              </button>
            </div>
          </div>
        )}

        {/* Security & Audit Notice */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
            <span>Login audit trail is recorded securely for creator verification</span>
          </div>
          <span className="font-mono text-[10px] text-slate-400">CampusBell v2.4</span>
        </div>
      </div>
    </div>
  );
};
