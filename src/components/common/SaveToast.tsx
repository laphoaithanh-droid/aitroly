import React from 'react';
import { CheckCircle2, X, HardDrive, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SaveToast: React.FC = () => {
  const { saveToastMessage, setSaveToastMessage } = useApp();

  if (!saveToastMessage) return null;

  return (
    <aside
      aria-label="Thông báo lưu dữ liệu"
      className="fixed top-4 right-4 z-50 max-w-md w-full sm:w-auto animate-in slide-in-from-top-4 fade-in duration-300"
    >
      <div className="bg-slate-900/95 backdrop-blur-md text-white border border-emerald-500/50 rounded-2xl p-4 shadow-2xl flex items-start gap-3 ring-4 ring-emerald-500/10">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        </div>

        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-emerald-300 flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5" />
              <span>HỆ THỐNG ĐÃ LƯU DỮ LIỆU AN TOÀN</span>
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-100 mt-1 leading-snug">
            {saveToastMessage}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Mọi thay đổi trên Lớp học, Học sinh, Bài tập, Học liệu & Trò chơi đã được cập nhật.
          </p>
        </div>

        <button
          onClick={() => setSaveToastMessage(null)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Đóng thông báo"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
