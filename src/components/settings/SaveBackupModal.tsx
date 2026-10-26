import React, { useState, useRef } from 'react';
import {
  Save,
  HardDrive,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  X,
  Clock,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  FolderOpen,
  Gamepad2,
  Users,
  BookOpen,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { databaseService } from '../../services/databaseService';

export const SaveBackupModal: React.FC = () => {
  const {
    isSaveModalOpen,
    setSaveModalOpen,
    manualSave,
    isSaving,
    lastSavedAt,
    exportFullBackup,
    importFullBackup,
    classes,
    students,
    subjects,
    assignments,
    materials,
    games,
    activeClass,
    teacherProfile
  } = useApp();

  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isSaveModalOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      alert('Vui lòng chọn tệp tin có định dạng .json!');
      return;
    }

    setIsImporting(true);
    setImportStatus('Đang đọc và khôi phục dữ liệu...');
    const result = await importFullBackup(file);
    setIsImporting(false);
    setImportStatus(result.message);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-amber-300 shadow-inner">
              <Save className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                <span>Trung Tâm Lưu Trữ & Sao Lưu Dữ Liệu</span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/40">
                  An toàn 100%
                </span>
              </h2>
              <p className="text-xs text-emerald-100">
                Lớp {activeClass.name} • {teacherProfile.school} • Giáo viên: {teacherProfile.name}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSaveModalOpen(false)}
            className="p-1 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Card 1: Main Manual Save Action */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-white border-2 border-emerald-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-extrabold text-sm text-emerald-950 uppercase tracking-wide">
                  Lưu dữ liệu vào bộ nhớ máy
                </span>
              </div>
              <p className="text-xs text-emerald-800">
                Ghi nhớ tức thì toàn bộ thay đổi của lớp học vào trình duyệt và tệp lưu trữ nội bộ.
              </p>
              <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5 pt-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Lần lưu gần nhất: <strong>{lastSavedAt ? `Lúc ${lastSavedAt}` : 'Chưa lưu trong phiên này'}</strong></span>
              </div>
            </div>

            <button
              onClick={() => manualSave()}
              disabled={isSaving}
              className="shrink-0 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>LƯU NGAY BÂY GIỜ</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Tip Banner */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="leading-relaxed">
              <strong>Phím tắt nhanh:</strong> Bạn có thể nhấn tổ hợp phím <kbd className="px-1.5 py-0.5 bg-white rounded border border-amber-300 font-mono text-[11px] font-bold text-amber-900 shadow-2xs">Ctrl + S</kbd> (hoặc <kbd className="px-1.5 py-0.5 bg-white rounded border border-amber-300 font-mono text-[11px] font-bold text-amber-900 shadow-2xs">Cmd + S</kbd>) bất cứ lúc nào khi đang soạn thảo hoặc chấm điểm để lưu ngay!
            </p>
          </div>

          {/* Card 2: Current Protected Data Stats */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 mb-2.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>DỮ LIỆU ĐANG ĐƯỢC HỆ THỐNG BẢO TOÀN TỰ ĐỘNG</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <Users className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                <div className="text-base font-extrabold text-slate-900">{classes.length}</div>
                <div className="text-[10px] text-slate-500 font-semibold">Lớp học</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <Users className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <div className="text-base font-extrabold text-slate-900">{students.length}</div>
                <div className="text-[10px] text-slate-500 font-semibold">Học sinh ({activeClass.name})</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <BookOpen className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
                <div className="text-base font-extrabold text-slate-900">{subjects.length}</div>
                <div className="text-[10px] text-slate-500 font-semibold">Môn học</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <FileText className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                <div className="text-base font-extrabold text-slate-900">{assignments.length}</div>
                <div className="text-[10px] text-slate-500 font-semibold">Bài tập</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <FolderOpen className="w-4 h-4 text-rose-600 mx-auto mb-1" />
                <div className="text-base font-extrabold text-slate-900">{materials.length}</div>
                <div className="text-[10px] text-slate-500 font-semibold">Học liệu số</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <Gamepad2 className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <div className="text-base font-extrabold text-slate-900">{games.length}</div>
                <div className="text-[10px] text-slate-500 font-semibold">Trò chơi</div>
              </div>
            </div>
          </div>

          {/* Card 3: Export & Import Full JSON Backup */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Export JSON Card */}
            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 font-bold text-xs text-purple-950">
                  <Download className="w-4 h-4 text-purple-600" />
                  <span>Xuất tệp sao lưu toàn diện (.JSON)</span>
                </div>
                <p className="text-[11px] text-purple-800 mt-1 leading-relaxed">
                  Tải toàn bộ dữ liệu (tất cả các lớp, danh sách học sinh, điểm tích lũy, bài tập, trò chơi tự tạo) về máy tính để lưu dự phòng vào USB hoặc gửi cho máy khác.
                </p>
              </div>

              <button
                onClick={exportFullBackup}
                className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải tệp sao lưu (.json) về máy</span>
              </button>
            </div>

            {/* Import JSON Card */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 font-bold text-xs text-blue-950">
                  <Upload className="w-4 h-4 text-blue-600" />
                  <span>Phục hồi dữ liệu từ tệp (.JSON)</span>
                </div>
                <p className="text-[11px] text-blue-800 mt-1 leading-relaxed">
                  Chọn tệp sao lưu .json đã lưu trước đó để khôi phục lại nguyên vẹn mọi dữ liệu trên bất kỳ máy tính hoặc trình duyệt nào trong 1 giây.
                </p>
              </div>

              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json,application/json"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isImporting}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isImporting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang khôi phục...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Chọn file .json để khôi phục</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {importStatus && (
            <div className="p-3 bg-slate-100 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{importStatus}</span>
            </div>
          )}

          {/* Card 4: Export Excel / CSV */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Xuất danh sách học sinh & bảng điểm (.CSV / Excel)</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Xuất file bảng tính chuẩn Thông tư 27 gồm STT, Mã HS, Họ tên, Điểm năng lực 4 môn, Phụ huynh & SĐT.
              </p>
            </div>
            <button
              onClick={() => databaseService.downloadGoogleSheetTemplate()}
              className="shrink-0 px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tải file Excel / CSV</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Tự động lưu khi thoát app: <strong>Đang BẬT</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSaveModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
            >
              Đóng
            </button>
            <button
              onClick={() => {
                manualSave();
                setSaveModalOpen(false);
              }}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Lưu & Đóng</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
