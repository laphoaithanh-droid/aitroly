import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  User,
  Eye,
  EyeOff,
  UserCheck,
  GraduationCap,
  Sparkles,
  School,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LoginModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setAuthModalOpen,
    login,
    classes,
    activeClass,
    students,
    teacherProfile,
    setDbModalOpen,
    getTeacherPassword
  } = useApp();

  const [activeTab, setActiveTab] = useState<'teacher' | 'student'>('teacher');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string>(activeClass?.id || '');

  // Pre-fill active class and teacher credentials when modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      const cls = classes.find(c => c.id === selectedClassId) || activeClass;
      if (activeTab === 'teacher') {
        const clean = cls.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        setUsername(`thhn_${clean}`);
        setPassword(getTeacherPassword ? getTeacherPassword(cls.id) : 'Thhn_12@');
      } else {
        const sampleSt = (cls.students && cls.students[0]) || students[0];
        setUsername(sampleSt?.username || `hs${cls.name.toLowerCase()}01`);
        setPassword(sampleSt?.password || '123456');
      }
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [isAuthModalOpen, activeTab, selectedClassId, activeClass, classes]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const res = login(username, password);
      setIsLoading(false);

      if (res.success) {
        setSuccessMessage(res.message);
        setTimeout(() => {
          setAuthModalOpen(false);
          setSuccessMessage('');
          setUsername('');
          setPassword('');
        }, 800);
      } else {
        setErrorMessage(res.message);
      }
    }, 250);
  };

  const handleSelectClassTeacher = (c: typeof classes[0]) => {
    setSelectedClassId(c.id);
    const clean = c.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    setUsername(`thhn_${clean}`);
    setPassword(getTeacherPassword ? getTeacherPassword(c.id) : 'Thhn_12@');
    setErrorMessage('');
  };

  const handleFillStudentDemo = (stUsername: string, stPassword?: string) => {
    setUsername(stUsername);
    setPassword(stPassword || '123456');
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#0B1428] via-[#5538F5] to-[#9B20F5] p-5 text-white relative">
          <button
            onClick={() => setAuthModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/25 text-amber-200 text-[11px] font-bold border border-amber-300/30">
              <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
              CỔNG ĐĂNG NHẬP HỆ THỐNG
            </span>
            <span className="text-white/60 text-xs">|</span>
            <span className="text-white/90 text-xs font-semibold">
              Trường Tiểu học Hoài Nhơn
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Đăng Nhập Tài Khoản</span>
          </h2>
          <p className="text-xs text-purple-200 mt-1">
            Ứng dụng AI Lớp học Thông minh – Trường Tiểu học Hoài Nhơn
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 p-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('teacher');
              setErrorMessage('');
            }}
            className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'teacher'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Giáo Viên (thhn_#malop#)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('student');
              setErrorMessage('');
            }}
            className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'student'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Học Sinh (Từ Google Sheet)</span>
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Instructions Box */}
          {activeTab === 'teacher' ? (
            <div className="bg-purple-50 rounded-2xl p-3.5 border border-purple-200 text-xs text-purple-900 space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-purple-800">
                <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Chọn Lớp & Giáo viên đăng nhập (Tự động lưu cho các lần sau):</span>
              </div>

              {/* Quick Class & Teacher Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                {classes.map(c => {
                  const isSelected = (selectedClassId === c.id) || (!selectedClassId && activeClass.id === c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSelectClassTeacher(c)}
                      className={`text-left p-2 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-purple-600 text-white border-purple-700 shadow-sm'
                          : 'bg-white hover:bg-purple-100 text-slate-800 border-purple-200'
                      }`}
                    >
                      <div>
                        <div className="font-bold flex items-center gap-1">
                          <School className={`w-3.5 h-3.5 ${isSelected ? 'text-purple-200' : 'text-purple-600'}`} />
                          <span>Lớp {c.name} (Khối {c.grade})</span>
                        </div>
                        <div className={`text-[11px] ${isSelected ? 'text-purple-100' : 'text-slate-500'}`}>
                          GVCN: {c.teacherName || teacherProfile?.fullName || teacherProfile?.name || 'Giáo viên'}
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="pt-1 text-[11px] text-slate-600 border-t border-purple-200/60 flex items-center justify-between">
                <span>Tên ĐN: <code className="font-mono font-bold text-purple-900 bg-purple-200/60 px-1 py-0.5 rounded">{username}</code></span>
                <span>Mật khẩu: <code className="font-mono font-bold text-purple-900 bg-purple-200/60 px-1 py-0.5 rounded">{password}</code></span>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50 rounded-2xl p-3.5 border border-emerald-200 text-xs text-emerald-900 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Quy định tài khoản Học sinh:</span>
              </div>
              <p className="text-[11px] text-slate-700 leading-relaxed">
                Tên đăng nhập và mật khẩu của học sinh được <strong>nạp trực tiếp từ link Google Sheet đã liên kết mặc định</strong> của lớp học.
              </p>

              {/* Sample student accounts in active class */}
              <div className="pt-1">
                <div className="text-[10px] text-slate-500 font-medium mb-1">
                  Gợi ý tài khoản học sinh Lớp {activeClass.name} (nhấn để điền):
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-white/70 rounded-xl border border-emerald-200/60">
                  {students.slice(0, 6).map((st) => {
                    const stUser = st.username || `hs${activeClass.name.toLowerCase()}${st.stt < 10 ? '0' + st.stt : st.stt}`;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => handleFillStudentDemo(stUser, st.password || '123456')}
                        className="px-2 py-1 rounded-lg bg-white hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-[11px] font-medium transition-colors"
                        title={`Tên: ${st.fullName} - MK: ${st.password || '123456'}`}
                      >
                        {st.fullName} ({stUser})
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalOpen(false);
                    setDbModalOpen(true);
                  }}
                  className="text-[11px] text-emerald-700 hover:text-emerald-900 underline font-semibold flex items-center gap-1"
                >
                  <FileSpreadsheet className="w-3 h-3 text-emerald-600" />
                  <span>Xem/Đồng bộ lại Google Sheet danh sách lớp</span>
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Tên đăng nhập</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  {activeTab === 'teacher' ? 'Cấu trúc: thhn_#malop#' : 'Cột Tên đăng nhập trong Google Sheet'}
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={activeTab === 'teacher' ? `Ví dụ: thhn_${(activeClass?.name || '3c1').toLowerCase().replace(/[^a-z0-9]/g, '')}` : `Ví dụ: hs${(activeClass?.name || '3c1').toLowerCase().replace(/[^a-z0-9]/g, '')}01 hoặc tên đăng nhập`}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-medium text-slate-800 placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Mật khẩu</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  {activeTab === 'teacher' ? 'Mặc định: Thhn_12@' : 'Mật khẩu từ Google Sheet'}
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-medium text-slate-800 placeholder:text-slate-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 whitespace-pre-line animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                <div>{errorMessage}</div>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <div className="font-semibold">{successMessage}</div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                activeTab === 'teacher'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-purple-600/30'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-600/30'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>{isLoading ? 'Đang xác thực...' : 'Đăng Nhập'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
            Bảo mật & Phân quyền AI Class 2026–2027
          </span>
          <button
            onClick={() => setAuthModalOpen(false)}
            className="text-slate-600 hover:text-slate-900 font-semibold"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
