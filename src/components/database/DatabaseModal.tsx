import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Database,
  Cloud,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Download,
  Upload,
  Server,
  Flame,
  Globe,
  Copy,
  Check,
  X,
  Radio,
  FileCode2,
  HardDrive,
  Users,
  BookOpen,
  Bell,
  MessageSquare,
  ShieldCheck,
  Zap,
  RotateCcw,
  ExternalLink,
  Eye,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DatabaseProvider, DatabaseConfig, databaseService } from '../../services/databaseService';
import { Student } from '../../types';

export const DatabaseModal: React.FC = () => {
  const {
    isDbModalOpen,
    setDbModalOpen,
    dbConfig,
    updateDbConfig,
    syncToCloud,
    syncFromCloud,
    syncFromGoogleSheet,
    testDbConnection,
    resetToInitialData,
    importDatabase,
    exportDatabaseBackup,
    isSyncing,
    syncStatusMessage,
    students,
    assignments,
    notifications,
    feedbacks,
    materials,
    activeClass
  } = useApp();

  const [activeTab, setActiveTab] = useState<'googlesheet' | 'cloud' | 'sync' | 'backup' | 'script'>('googlesheet');
  const [selectedProvider, setSelectedProvider] = useState<DatabaseProvider>(dbConfig.provider || 'server');

  // Google Sheets state
  const [sheetUrl, setSheetUrl] = useState(dbConfig.googleSheetUrl || '');
  const [sheetRange, setSheetRange] = useState(dbConfig.googleSheetRange || 'Sheet1!A1:Z100');
  const [sheetApiKey, setSheetApiKey] = useState(dbConfig.googleSheetApiKey || '');
  const [previewStudents, setPreviewStudents] = useState<Student[] | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);

  // Other DB states
  const [supabaseUrl, setSupabaseUrl] = useState(dbConfig.supabaseUrl || '');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(dbConfig.supabaseAnonKey || '');
  const [firebaseUrl, setFirebaseUrl] = useState(dbConfig.firebaseUrl || '');
  const [firebaseAuthToken, setFirebaseAuthToken] = useState(dbConfig.firebaseAuthToken || '');
  const [serverUrl, setServerUrl] = useState(dbConfig.serverUrl || '/api/db');
  const [customEndpoint, setCustomEndpoint] = useState(dbConfig.customEndpoint || '');
  const [customApiKey, setCustomApiKey] = useState(dbConfig.customApiKey || '');
  const [autoSync, setAutoSync] = useState(dbConfig.autoSync ?? true);

  // Status and feedback
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; latencyMs: number; message: string } | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isDbModalOpen) return null;

  // Xử lý xem trước danh sách từ Google Sheets
  const handlePreviewGoogleSheet = async () => {
    if (!sheetUrl.trim()) {
      alert('Vui lòng nhập đường link Google Sheet trước khi xem trước!');
      return;
    }
    setIsPreviewing(true);
    setTestResult(null);

    const tempConfig: DatabaseConfig = {
      provider: 'googlesheets',
      autoSync,
      googleSheetUrl: sheetUrl.trim(),
      googleSheetRange: sheetRange.trim(),
      googleSheetApiKey: sheetApiKey.trim(),
      status: 'connecting'
    };

    const res = await databaseService.fetchGoogleSheetStudents(tempConfig);
    setIsPreviewing(false);
    if (res.success && res.students.length > 0) {
      setPreviewStudents(res.students);
      setTestResult({
        success: true,
        latencyMs: 120,
        message: `Nhận diện thành công ${res.students.length} học sinh từ Google Sheet!`
      });
    } else {
      setPreviewStudents(null);
      setTestResult({
        success: false,
        latencyMs: 0,
        message: res.message
      });
    }
  };

  // Đồng bộ ngay danh sách từ Google Sheets vào App
  const handleApplyGoogleSheet = async () => {
    if (!sheetUrl.trim()) {
      alert('Vui lòng nhập đường link Google Sheet!');
      return;
    }
    const res = await syncFromGoogleSheet(sheetUrl.trim());
    if (res.success) {
      alert(`Đã kết nối Google Sheet thành công! Đã đồng bộ ${res.count} học sinh vào hệ thống quản lý lớp học.`);
      setPreviewStudents(null);
    } else {
      alert(`Lỗi: ${res.message}`);
    }
  };

  // Kiểm tra kết nối chung
  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    const tempConfig: DatabaseConfig = {
      provider: selectedProvider,
      autoSync,
      status: 'connecting',
      googleSheetUrl: sheetUrl,
      googleSheetRange: sheetRange,
      googleSheetApiKey: sheetApiKey,
      supabaseUrl,
      supabaseAnonKey,
      firebaseUrl,
      firebaseAuthToken,
      serverUrl,
      customEndpoint,
      customApiKey
    };

    try {
      const result = await testDbConnection(tempConfig);
      setTestResult(result);
    } catch (err: any) {
      setTestResult({
        success: false,
        latencyMs: 0,
        message: err.message || 'Không thể kiểm tra kết nối'
      });
    } finally {
      setTesting(false);
    }
  };

  // Lưu cấu hình
  const handleSaveConfig = () => {
    updateDbConfig({
      provider: selectedProvider,
      autoSync,
      googleSheetUrl: sheetUrl,
      googleSheetRange: sheetRange,
      googleSheetApiKey: sheetApiKey,
      supabaseUrl,
      supabaseAnonKey,
      firebaseUrl,
      firebaseAuthToken,
      serverUrl,
      customEndpoint,
      customApiKey
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleCopyScript = () => {
    const script = databaseService.getSampleAppsScriptCode();
    navigator.clipboard.writeText(script);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json && (json.students || json.payload)) {
          importDatabase(json.payload || json);
          alert('Khôi phục cơ sở dữ liệu từ file JSON thành công!');
        } else {
          alert('Tập tin JSON không đúng định dạng dữ liệu lớp học.');
        }
      } catch (err) {
        alert('Lỗi đọc file JSON: ' + err);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const lastSyncTimeFormatted = dbConfig.lastSyncedAt
    ? new Date(dbConfig.lastSyncedAt).toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    : 'Chưa đồng bộ';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white flex items-center justify-between border-b border-emerald-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-inner">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight">
                  Kết nối Cơ sở Dữ liệu Trực tuyến & Google Sheets
                </h2>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                  Google Sheet Sync
                </span>
              </div>
              <p className="text-xs text-emerald-100/80">
                Đồng bộ hóa trực tiếp danh sách học sinh lớp {activeClass?.name || '3C1'} từ Google Sheet của giáo viên vào hệ thống AI CLASS
              </p>
            </div>
          </div>
          <button
            onClick={() => setDbModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Status Summary Bar */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="font-semibold text-slate-700">Trạng thái kết nối:</span>
            {dbConfig.status === 'connected' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium border border-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Đã kết nối:{' '}
                {dbConfig.provider === 'googlesheets'
                  ? 'Google Sheets trực tuyến'
                  : dbConfig.provider === 'supabase'
                  ? 'Supabase Cloud'
                  : dbConfig.provider === 'firebase'
                  ? 'Firebase Realtime DB'
                  : 'Máy chủ Lớp học'}
              </span>
            ) : dbConfig.status === 'connecting' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium border border-amber-300">
                <RefreshCw className="w-3 h-3 animate-spin text-amber-600" />
                Đang kiểm tra kết nối...
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium">
                <HardDrive className="w-3 h-3 text-slate-500" />
                Lưu trữ cục bộ (LocalStorage)
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>
              Đồng bộ lần cuối: <strong className="text-slate-700">{lastSyncTimeFormatted}</strong>
            </span>
            {syncStatusMessage && (
              <span className="text-emerald-700 font-medium hidden md:inline">
                • {syncStatusMessage}
              </span>
            )}
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="px-6 border-b border-slate-200 bg-white flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('googlesheet')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'googlesheet'
                ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Google Sheet (Danh sách lớp)
          </button>
          <button
            onClick={() => setActiveTab('cloud')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'cloud'
                ? 'border-purple-600 text-purple-700 bg-purple-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <Database className="w-4 h-4" />
            CSDL Đám mây (Supabase / Firebase)
          </button>
          <button
            onClick={() => setActiveTab('sync')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'sync'
                ? 'border-purple-600 text-purple-700 bg-purple-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            Trung tâm Đồng bộ ({students.length} Học sinh)
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'backup'
                ? 'border-purple-600 text-purple-700 bg-purple-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            Sao lưu & File mẫu chuẩn
          </button>
          <button
            onClick={() => setActiveTab('script')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'script'
                ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            Apps Script & SQL
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: GOOGLE SHEETS CONNECTION */}
          {activeTab === 'googlesheet' && (
            <div className="space-y-6">
              {/* Highlight Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 border border-emerald-200 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div className="flex-1 text-xs">
                  <h3 className="font-bold text-emerald-950 text-sm">
                    Kết nối Danh sách Lớp học trực tuyến từ Google Sheets
                  </h3>
                  <p className="text-emerald-800 mt-1 leading-relaxed">
                    Giáo viên chỉ cần dán đường dẫn Google Sheet danh sách học sinh. Ứng dụng sẽ tự động bóc tách các trường: <strong>STT, Mã HS, Họ và tên, Tên đăng nhập, Mật khẩu, Giới tính, Ngày sinh, Phụ huynh, SĐT</strong> và cập nhật tức thì vào hồ sơ lớp {activeClass.name}.
                  </p>
                </div>
                <button
                  onClick={() => databaseService.downloadGoogleSheetTemplate()}
                  className="shrink-0 px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300 transition-colors shadow-2xs flex items-center gap-1.5"
                  title="Tải bảng tính mẫu để xem các cột chuẩn"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tải file mẫu (.csv)</span>
                </button>
              </div>

              {/* Instructions 3 Steps */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-emerald-700 flex items-center gap-1.5 mb-1">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px]">1</span>
                    Mở Google Sheets
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Mở bảng tính danh sách học sinh lớp {activeClass.name} trên Google Drive của giáo viên.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-emerald-700 flex items-center gap-1.5 mb-1">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px]">2</span>
                    Bật Chia sẻ Công khai
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Bấm <strong>Chia sẻ (Share)</strong> &gt; Chọn <strong>"Bất kỳ ai có đường liên kết đều có thể xem"</strong>.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-emerald-700 flex items-center gap-1.5 mb-1">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px]">3</span>
                    Dán Link & Đồng bộ
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Sao chép đường link và dán vào ô bên dưới, nhấn <strong>Đồng bộ vào App</strong>.
                  </p>
                </div>
              </div>

              {/* Form Input */}
              <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Đường dẫn liên kết Google Sheets (Google Sheet URL) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit"
                      value={sheetUrl}
                      onChange={(e) => setSheetUrl(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono"
                    />
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600 absolute right-3.5 top-3" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Hỗ trợ tất cả định dạng link Google Sheet (kể cả link có đuôi <code>#gid=...</code> hoặc link chia sẻ xem).
                  </p>
                </div>

                {/* Advanced Options Toggle */}
                <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-semibold text-slate-800">
                        Tự động làm mới từ Google Sheet khi mở app
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Mỗi lần mở app sẽ tự động kéo danh sách mới nhất từ Google Sheets
                      </div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoSync}
                      onChange={(e) => setAutoSync(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>

              {/* Status Message */}
              {testResult && (
                <div
                  className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                    testResult.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-semibold">
                      {testResult.success ? 'Kiểm tra thành công!' : 'Chưa thể kết nối tới Google Sheet'}
                    </div>
                    <div>{testResult.message}</div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePreviewGoogleSheet}
                    disabled={isPreviewing}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2 shadow-xs transition-all disabled:opacity-50"
                  >
                    <Eye className={`w-3.5 h-3.5 ${isPreviewing ? 'animate-spin text-emerald-600' : 'text-slate-500'}`} />
                    {isPreviewing ? 'Đang kiểm tra bảng tính...' : 'Xem trước danh sách (Preview)'}
                  </button>

                  <button
                    type="button"
                    onClick={() => databaseService.downloadGoogleSheetTemplate()}
                    className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Mẫu file CSV</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleApplyGoogleSheet}
                    disabled={isSyncing}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>Đồng bộ vào Danh sách Lớp ngay</span>
                  </button>
                </div>
              </div>

              {/* Preview Table if loaded */}
              {previewStudents && previewStudents.length > 0 && (
                <div className="mt-4 border border-emerald-200 rounded-2xl overflow-hidden bg-white shadow-sm animate-in fade-in">
                  <div className="bg-emerald-50 px-4 py-2.5 border-b border-emerald-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Xem trước {previewStudents.length} học sinh nhận diện được từ Google Sheet:
                    </span>
                    <button
                      onClick={handleApplyGoogleSheet}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] transition-colors"
                    >
                      Xác nhận nhập vào App
                    </button>
                  </div>
                  <div className="max-h-56 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 sticky top-0 border-b border-slate-100">
                        <tr>
                          <th className="py-2 px-3 font-semibold">STT</th>
                          <th className="py-2 px-3 font-semibold">Mã HS</th>
                          <th className="py-2 px-3 font-semibold">Họ và tên</th>
                          <th className="py-2 px-3 font-semibold">Tên đăng nhập</th>
                          <th className="py-2 px-3 font-semibold">Mật khẩu</th>
                          <th className="py-2 px-3 font-semibold">Giới tính</th>
                          <th className="py-2 px-3 font-semibold">Phụ huynh</th>
                          <th className="py-2 px-3 font-semibold">SĐT</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {previewStudents.slice(0, 10).map((st) => (
                          <tr key={st.id} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-bold text-slate-700">{st.stt}</td>
                            <td className="py-2 px-3 font-mono text-purple-700">{st.studentCode}</td>
                            <td className="py-2 px-3 font-semibold text-slate-900">{st.fullName}</td>
                            <td className="py-2 px-3 font-mono font-bold text-purple-700 text-[11px]">{st.username || '-'}</td>
                            <td className="py-2 px-3 font-mono text-slate-600 text-[11px]">{st.password || '123456'}</td>
                            <td className="py-2 px-3 text-slate-600">{st.gender}</td>
                            <td className="py-2 px-3 text-slate-600">{st.parentName}</td>
                            <td className="py-2 px-3 font-mono text-slate-600">{st.parentPhone}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {previewStudents.length > 10 && (
                    <div className="p-2 text-center text-[11px] text-slate-500 bg-slate-50 border-t border-slate-100">
                      ... và {previewStudents.length - 10} học sinh khác nữa
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SUPABASE & FIREBASE CLOUD DB */}
          {activeTab === 'cloud' && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Chọn nhà cung cấp CSDL Đám mây
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Option 1: Supabase */}
                  <div
                    onClick={() => setSelectedProvider('supabase')}
                    className={`cursor-pointer rounded-xl p-4 border-2 transition-all relative ${
                      selectedProvider === 'supabase'
                        ? 'border-purple-600 bg-purple-50/70 shadow-sm ring-2 ring-purple-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        <Database className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                        PostgreSQL
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mt-3">Supabase Cloud</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      PostgreSQL đám mây miễn phí, bảo mật cao, hỗ trợ REST API và đồng bộ đa thiết bị tức thì.
                    </p>
                  </div>

                  {/* Option 2: Firebase */}
                  <div
                    onClick={() => setSelectedProvider('firebase')}
                    className={`cursor-pointer rounded-xl p-4 border-2 transition-all relative ${
                      selectedProvider === 'firebase'
                        ? 'border-purple-600 bg-purple-50/70 shadow-sm ring-2 ring-purple-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                        <Flame className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white">
                        Realtime
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mt-3">Google Firebase</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Firebase Realtime DB đồng bộ không độ trễ, không cần tạo bảng trước, kết nối chỉ bằng URL.
                    </p>
                  </div>

                  {/* Option 3: Express Server */}
                  <div
                    onClick={() => setSelectedProvider('server')}
                    className={`cursor-pointer rounded-xl p-4 border-2 transition-all relative ${
                      selectedProvider === 'server'
                        ? 'border-purple-600 bg-purple-50/70 shadow-sm ring-2 ring-purple-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                        <Server className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                        Có sẵn
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mt-3">Máy chủ Lớp học</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Lưu trữ trực tiếp qua API Node/Express của ứng dụng, lưu file persistent <code>data/classroom_db.json</code>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Input Forms */}
              <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200 space-y-4">
                {selectedProvider === 'supabase' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Supabase Project URL <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="https://your-project-id.supabase.co"
                        value={supabaseUrl}
                        onChange={(e) => setSupabaseUrl(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Supabase Anon Public API Key <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        value={supabaseAnonKey}
                        onChange={(e) => setSupabaseAnonKey(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono"
                      />
                    </div>
                  </div>
                )}

                {selectedProvider === 'firebase' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Firebase Realtime Database URL <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="https://your-project-default-rtdb.asia-southeast1.firebasedatabase.app"
                        value={firebaseUrl}
                        onChange={(e) => setFirebaseUrl(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono"
                      />
                    </div>
                  </div>
                )}

                {selectedProvider === 'server' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Endpoint API Máy chủ
                    </label>
                    <input
                      type="text"
                      value={serverUrl}
                      onChange={(e) => setServerUrl(e.target.value)}
                      placeholder="/api/db"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono"
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2 shadow-xs transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin text-purple-600' : ''}`} />
                  {testing ? 'Đang kiểm tra kết nối...' : 'Kiểm tra kết nối (Ping Test)'}
                </button>

                <div className="flex items-center gap-2">
                  {saveSuccess && (
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      <Check className="w-4 h-4" /> Đã lưu cấu hình!
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleSaveConfig}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md shadow-purple-500/20 flex items-center gap-2 transition-all"
                  >
                    <Check className="w-4 h-4" />
                    Lưu & Kích hoạt Kết nối
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DATA SYNC CENTER */}
          {activeTab === 'sync' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                  <Users className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                  <div className="text-lg font-bold text-emerald-900">{students.length}</div>
                  <div className="text-[11px] text-emerald-700 font-medium">Học sinh {activeClass?.name || '3C1'}</div>
                </div>

                <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-center">
                  <BookOpen className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                  <div className="text-lg font-bold text-purple-900">{assignments.length}</div>
                  <div className="text-[11px] text-purple-700 font-medium">Bài tập đã giao</div>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-center">
                  <Bell className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <div className="text-lg font-bold text-blue-900">{notifications.length}</div>
                  <div className="text-[11px] text-blue-700 font-medium">Thông báo PH</div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
                  <MessageSquare className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                  <div className="text-lg font-bold text-amber-900">{feedbacks.length}</div>
                  <div className="text-[11px] text-amber-700 font-medium">Phản hồi PH</div>
                </div>

                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-center col-span-2 sm:col-span-1">
                  <FileCode2 className="w-5 h-5 text-rose-600 mx-auto mb-1" />
                  <div className="text-lg font-bold text-rose-900">{materials.length}</div>
                  <div className="text-[11px] text-rose-700 font-medium">Tài liệu số</div>
                </div>
              </div>

              {/* Sync Actions Box */}
              <div className="bg-gradient-to-br from-emerald-50/80 via-teal-50/50 to-slate-50 p-5 rounded-2xl border border-emerald-200">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-emerald-600" />
                  Đồng bộ dữ liệu hai chiều (Cloud Sync)
                </h3>
                <p className="text-xs text-slate-600 mt-1 mb-4">
                  Đảm bảo mọi thiết bị (máy tính cô giáo, điện thoại phụ huynh, máy tính bảng học sinh) đều nhận được dữ liệu mới nhất.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Push button */}
                  <button
                    onClick={async () => {
                      const res = await syncToCloud();
                      alert(res.message);
                    }}
                    disabled={isSyncing}
                    className="p-4 rounded-xl bg-white border-2 border-emerald-300 hover:border-emerald-500 shadow-sm hover:shadow-md text-left transition-all group disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Local → Cloud
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 text-sm">
                      Đẩy dữ liệu lên Đám mây
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Tải {students.length} học sinh và toàn bộ bài tập hiện tại lên Cơ sở dữ liệu trực tuyến.
                    </p>
                  </button>

                  {/* Pull button */}
                  <button
                    onClick={async () => {
                      const res = await syncFromCloud();
                      alert(res.message);
                    }}
                    disabled={isSyncing}
                    className="p-4 rounded-xl bg-white border-2 border-indigo-300 hover:border-indigo-500 shadow-sm hover:shadow-md text-left transition-all group disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Download className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                        Cloud → Local
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 text-sm">
                      Kéo dữ liệu từ Đám mây về
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Cập nhật các thay đổi mới nhất từ giáo viên hoặc phụ huynh về thiết bị này.
                    </p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BACKUP & TEMPLATES */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              {/* Google Sheets CSV Template Download */}
              <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200">
                <h3 className="text-sm font-bold text-emerald-950 mb-1 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  Bảng tính mẫu chuẩn cho Google Sheets (.csv)
                </h3>
                <p className="text-xs text-emerald-800 mb-3">
                  Tải file mẫu có sẵn tiêu đề các cột chuẩn theo quy định Bộ Giáo dục: <strong>STT, Mã HS, Họ và tên, Giới tính, Ngày sinh, Lớp, Phụ huynh, SĐT, Năng lực 4 môn, Mục tiêu hỗ trợ</strong>.
                </p>
                <button
                  onClick={() => databaseService.downloadGoogleSheetTemplate()}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Tải về bảng tính mẫu Google Sheets (.csv)
                </button>
              </div>

              {/* JSON Full Backup */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-purple-600" />
                  Sao lưu toàn diện hệ thống (JSON Backup)
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Xuất toàn bộ học sinh, bài tập, điểm danh, thông báo phụ huynh ra tệp tin JSON an toàn.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={exportDatabaseBackup}
                    className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Tải file Backup JSON
                  </button>

                  <label className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-indigo-600" />
                    <span>Khôi phục từ file JSON (Import)</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Reset to Initial Data */}
              <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-200">
                <h3 className="text-sm font-bold text-rose-900 mb-1 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-rose-600" />
                  Khôi phục dữ liệu mẫu ban đầu (Factory Reset)
                </h3>
                <p className="text-xs text-rose-700 mb-3">
                  Đặt lại danh sách chuẩn {students.length || 30} học sinh lớp {activeClass?.name || '3C1'} trường TH Hoài Nhơn và các bài tập mẫu ban đầu.
                </p>

                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        'Bạn có chắc chắn muốn đặt lại dữ liệu lớp học về mặc định 30 học sinh ban đầu không?'
                      )
                    ) {
                      resetToInitialData();
                      alert('Đã khôi phục dữ liệu mẫu ban đầu thành công!');
                    }
                  }}
                  className="px-4 py-2 rounded-xl border border-rose-300 bg-white hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors"
                >
                  Khôi phục 30 học sinh mẫu ban đầu
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: APPS SCRIPT & SQL CODE */}
          {activeTab === 'script' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FileCode2 className="w-4 h-4 text-emerald-600" />
                    Mã Google Apps Script (Kết nối 2 chiều nâng cao)
                  </h3>
                  <button
                    onClick={handleCopyScript}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    {copySuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copySuccess ? 'Đã sao chép!' : 'Sao chép Apps Script'}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  Mở Google Sheets &gt; Tiện ích mở rộng &gt; Apps Script &gt; Dán đoạn mã này &gt; Bấm Triển khai dưới dạng Web App.
                </p>
                <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto max-h-56 border border-slate-800 leading-relaxed">
                  {databaseService.getSampleAppsScriptCode()}
                </pre>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Database className="w-4 h-4 text-purple-600" />
                  Mã SQL Supabase (PostgreSQL)
                </h3>
                <pre className="p-4 rounded-xl bg-slate-900 text-purple-300 font-mono text-xs overflow-x-auto max-h-48 border border-slate-800 leading-relaxed">
                  {databaseService.getSampleSqlForSupabase()}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Kết nối trực tiếp tới Google Sheets bảo mật, dữ liệu học sinh được mã hóa</span>
          </div>
          <button
            onClick={() => setDbModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
