import React, { useState } from 'react';
import { X, ShieldCheck, Lock, Download, Trash2, Search, Users, Layers, Clock, Laptop, Phone, Hash } from 'lucide-react';
import { LoginMemberRecord } from '../types';

interface CreatorPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  isCreatorVerified: boolean;
  onVerifyCreator: (passcode: string) => boolean;
  onLockCreator: () => void;
  loginMembers: LoginMemberRecord[];
  onClearMembers: () => void;
}

export const CreatorPortalModal: React.FC<CreatorPortalModalProps> = ({
  isOpen,
  onClose,
  isCreatorVerified,
  onVerifyCreator,
  onLockCreator,
  loginMembers,
  onClearMembers,
}) => {
  const [passcodeInput, setPasscodeInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [batchFilter, setBatchFilter] = useState<'all' | 'B1' | 'B2'>('all');

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onVerifyCreator(passcodeInput.trim());
    if (success) {
      setErrorMsg('');
      setPasscodeInput('');
    } else {
      setErrorMsg('Incorrect creator passcode. (Default PIN: 2026)');
    }
  };

  const handleExportCSV = () => {
    if (loginMembers.length === 0) return;
    const headers = ['ID', 'Student Name', 'Roll Number', 'Phone Number', 'Batch', 'Login Time', 'Device Info'];
    const rows = loginMembers.map(m => [
      `"${m.id}"`,
      `"${m.studentName}"`,
      `"${m.rollNumber}"`,
      `"${m.phoneNumber || '-'}"`,
      `"${m.batch}"`,
      `"${m.loginFormatted}"`,
      `"${m.deviceInfo}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `campusbell_student_members_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredMembers = loginMembers.filter(m => {
    if (batchFilter !== 'all' && m.batch !== batchFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = m.studentName.toLowerCase().includes(q);
      const matchRoll = m.rollNumber.toLowerCase().includes(q);
      const matchPhone = m.phoneNumber ? m.phoneNumber.toLowerCase().includes(q) : false;
      return matchName || matchRoll || matchPhone;
    }
    return true;
  });

  const b1Count = loginMembers.filter(m => m.batch === 'B1').length;
  const b2Count = loginMembers.filter(m => m.batch === 'B2').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Creator Administrative Portal
                </h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Creator Only
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Audited student member login details, roll numbers, phone numbers & batch allocations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {!isCreatorVerified ? (
          <div className="p-8 max-w-md mx-auto text-center space-y-4 my-auto">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-700">
              <Lock className="w-6 h-6 text-indigo-600" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-slate-900 tracking-tight">
                Creator Verification Required
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Student member login details are strictly protected and restricted to the app creator (thanushhkolangaya@gmail.com).
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-3 pt-2">
              <input
                type="password"
                required
                value={passcodeInput}
                onChange={e => setPasscodeInput(e.target.value)}
                placeholder="Enter Creator PIN (Default: 2026)"
                className="w-full px-4 py-2.5 text-center font-mono text-sm tracking-widest rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold"
              />

              {errorMsg && (
                <p className="text-xs text-rose-600 font-semibold">{errorMsg}</p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Authenticate as Creator
              </button>
            </form>

            <p className="text-[11px] text-slate-400 pt-1">
              Authorized Creator: thanushhkolangaya@gmail.com
            </p>
          </div>
        ) : (
          <div className="p-6 overflow-y-auto space-y-5 flex-1">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 block">Total Logged-in Students</span>
                <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                  {loginMembers.length}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 block">Batch B1 Enrolled</span>
                <span className="text-2xl font-bold font-mono text-indigo-600 tabular-nums">
                  {b1Count}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 block">Batch B2 Enrolled</span>
                <span className="text-2xl font-bold font-mono text-indigo-600 tabular-nums">
                  {b2Count}
                </span>
              </div>
            </div>

            {/* Filter & Action Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Filter by name, roll number, or phone..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={batchFilter}
                  onChange={e => setBatchFilter(e.target.value as 'all' | 'B1' | 'B2')}
                  className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white"
                >
                  <option value="all">All Batches</option>
                  <option value="B1">Batch B1 Only</option>
                  <option value="B2">Batch B2 Only</option>
                </select>

                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                  title="Download CSV export"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Table of Members */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Roll No / USN</th>
                      <th className="p-3">Phone Number</th>
                      <th className="p-3">Batch</th>
                      <th className="p-3">Login Timestamp</th>
                      <th className="p-3">Device / Client</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredMembers.length > 0 ? (
                      filteredMembers.map(m => (
                        <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 font-semibold text-slate-900">
                            {m.studentName}
                          </td>
                          <td className="p-3 font-mono font-bold text-slate-700">
                            {m.rollNumber}
                          </td>
                          <td className="p-3 font-mono text-slate-600 text-[11px]">
                            {m.phoneNumber || <span className="text-slate-400 italic">Not provided</span>}
                          </td>
                          <td className="p-3">
                            <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                              {m.batch}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                            {m.loginFormatted}
                          </td>
                          <td className="p-3 text-slate-500 text-[11px] truncate max-w-[140px]">
                            {m.deviceInfo}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400">
                          No login records matching this search query.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <button
                onClick={onClearMembers}
                className="text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Member Records</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={onLockCreator}
                  className="px-3 py-1.5 font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  Lock Creator Portal
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-1.5 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
