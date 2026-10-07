import React from 'react';
import { Bell, X, MapPin } from 'lucide-react';
import { InAppAlert } from '../types';

interface InAppToastContainerProps {
  alerts: InAppAlert[];
  onDismiss: (id: string) => void;
}

export const InAppToastContainer: React.FC<InAppToastContainerProps> = ({ alerts, onDismiss }) => {
  if (alerts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {alerts.map(alert => (
        <div
          key={alert.id}
          className="pointer-events-auto bg-slate-900 text-white rounded-2xl p-4 shadow-xl border border-slate-800 flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-200"
        >
          <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0 mt-0.5">
            <Bell className="w-4 h-4" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <h4 className="text-xs font-bold text-white truncate">
                {alert.title}
              </h4>
              <span className="text-[10px] text-slate-400 font-mono shrink-0">
                {alert.timeString}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-snug">
              {alert.message}
            </p>

            {alert.room && (
              <div className="flex items-center gap-1 text-[11px] text-indigo-300 mt-1.5 font-medium">
                <MapPin className="w-3 h-3 text-indigo-400" />
                <span>Venue: {alert.room}</span>
              </div>
            )}
          </div>

          <button
            onClick={() => onDismiss(alert.id)}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
