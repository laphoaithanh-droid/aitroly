import React, { useState } from 'react';
import {
  Sparkles,
  UserCheck,
  GraduationCap,
  Users,
  ShieldCheck,
  Clock,
  ChevronDown,
  Database,
  Cloud,
  Key,
  Settings,
  FileSpreadsheet,
  School,
  BookOpen,
  Edit3,
  Layers,
  KeyRound,
  Lock,
  LogOut,
  LogIn,
  Save,
  HardDrive,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const Header: React.FC = () => {
  const {
    currentUser,
    switchRole,
    students,
    aiLiveStatus,
    setActiveView,
    dbConfig,
    setDbModalOpen,
    setApiKeyModalOpen,
    // Multi-Class
    classes,
    activeClassId,
    activeClass,
    setActiveClassId,
    setClassModalOpen,
    // Teacher Profile
    teacherProfile,
    setTeacherModalOpen,
    // Subjects
    subjects,
    setSubjectModalOpen,
    // Authentication & Credentials
    authSession,
    isAuthenticated,
    logout,
    setAuthModalOpen,
    setChangePasswordOpen,
    // Save & Backup
    manualSave,
    isSaving,
    lastSavedAt,
    setSaveModalOpen,
    // Cloud Database Multi-Device Sync
    cloudSyncState,
    cloudRevision,
    lastCloudSyncTime,
    forceCloudPull
  } = useApp();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const currentDate = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Competition Identity Ribbon */}
      <div className="bg-gradient-to-r from-[#0B1428] via-[#5538F5] to-[#9B20F5] text-white px-4 py-1.5 text-xs font-medium flex flex-wrap items-center justify-between gap-2 shadow-inner">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white font-semibold tracking-wide border border-white/30 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            SẢN PHẨM DỰ THI ỨNG DỤNG AI TRONG GIÁO DỤC TIỂU HỌC
          </span>
          <span className="hidden md:inline text-white/60">|</span>
          <button
            onClick={() => setClassModalOpen(true)}
            className="hidden md:inline-flex items-center gap-1 text-white/95 hover:text-white hover:underline transition-colors"
            title="Nhấn để đổi lớp hoặc sửa thông tin lớp"
          >
            <span>{activeClass.schoolName || teacherProfile.school}</span>
            <span className="font-bold text-amber-300 bg-white/10 px-1.5 py-0.2 rounded border border-white/20">
              Lớp {activeClass.name} (Khối {activeClass.grade})
            </span>
            <span className="text-white/70">({activeClass.schoolYear})</span>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-xs flex-wrap">
          {/* Quick Teacher Profile Edit Button */}
          <button
            onClick={() => setTeacherModalOpen(true)}
            className="inline-flex items-center gap-1 font-semibold text-amber-200 hover:text-amber-100 bg-amber-400/20 hover:bg-amber-400/30 px-2 py-0.5 rounded-full border border-amber-300/40 text-[11px] transition-colors"
            title="Đổi tên giáo viên, ảnh đại diện, danh xưng"
          >
            <Edit3 className="w-3 h-3 text-amber-300" />
            <span>GV: {teacherProfile.name}</span>
          </button>

          {/* Quick Multi-Class Switcher Modal Pill */}
          <button
            onClick={() => setClassModalOpen(true)}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/30 hover:bg-purple-500/45 text-purple-100 border border-purple-300/40 text-[11px] font-semibold transition-all"
            title="Chuyển đổi lớp học hoặc thêm lớp mới"
          >
            <School className="w-3 h-3 text-purple-300" />
            <span>Đổi lớp ({classes.length} lớp)</span>
          </button>

          {/* Quick Login / Account Pill */}
          <button
            onClick={() => setAuthModalOpen(true)}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/30 hover:bg-indigo-500/45 text-amber-200 border border-indigo-300/40 text-[11px] font-semibold transition-all"
            title="Tên đăng nhập hệ thống (Bấm để đăng nhập hoặc đổi tài khoản)"
          >
            <KeyRound className="w-3 h-3 text-amber-300" />
            <span>TK: {authSession?.username || `thhn_${activeClass.name.toLowerCase()}`}</span>
          </button>

          {/* Cloud Database Multi-Device Sync Indicator */}
          <button
            onClick={() => setDbModalOpen(true)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all border ${
              cloudSyncState === 'syncing'
                ? 'bg-amber-500/30 text-amber-200 border-amber-400/50 animate-pulse'
                : cloudSyncState === 'offline'
                ? 'bg-slate-700/50 text-slate-300 border-slate-500/50'
                : 'bg-emerald-500/25 text-emerald-200 border-emerald-400/50 hover:bg-emerald-500/35'
            }`}
            title={`CSDL Đám mây đồng bộ đa thiết bị (Phiên bản v${cloudRevision} - Lần đồng bộ: ${lastCloudSyncTime || 'Gần nhất'}). Bấm để quản lý CSDL.`}
          >
            <Database className="w-3.5 h-3.5 text-cyan-300" />
            <span>
              {cloudSyncState === 'syncing'
                ? 'Đang đồng bộ...'
                : cloudSyncState === 'offline'
                ? 'CSDL: Ngoại tuyến'
                : `☁️ CSDL Đám mây (v${cloudRevision})`}
            </span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                cloudSyncState === 'syncing'
                  ? 'bg-amber-400 animate-ping'
                  : cloudSyncState === 'offline'
                  ? 'bg-slate-400'
                  : 'bg-emerald-400'
              }`}
            />
          </button>

          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-[11px]">
            <span
              className={`w-2 h-2 rounded-full ${
                aiLiveStatus.hasKey ? 'bg-emerald-400 animate-ping' : 'bg-emerald-400'
              }`}
            />
            <span>
              {aiLiveStatus.hasKey ? 'Gemini 3.8 Flash' : 'AI Trợ lý Sẵn sàng'}
            </span>
          </div>

          <button
            onClick={() => setActiveView('competition')}
            className="hidden lg:inline-flex items-center gap-1 bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold px-2 py-0.5 rounded text-[11px] transition-colors"
          >
            Giới Thiệu
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="px-4 lg:px-6 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {activeClass.schoolName || teacherProfile.school}
              </h1>

              {/* Clickable Class badge with switcher */}
              <button
                onClick={() => setClassModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-xs shadow-xs hover:shadow transition-all group"
                title="Bấm để đổi lớp hoặc quản lý danh sách các lớp"
              >
                <School className="w-3.5 h-3.5 text-purple-200" />
                <span>Lớp {activeClass.name} (Khối {activeClass.grade})</span>
                <ChevronDown className="w-3 h-3 text-purple-200 group-hover:translate-y-0.5 transition-transform" />
              </button>

              {/* Quick Class Dropdown selection */}
              <select
                value={activeClassId}
                onChange={(e) => setActiveClassId(e.target.value)}
                className="hidden xl:inline-block text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg px-2 py-1 cursor-pointer transition-colors"
                title="Chọn nhanh lớp học"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    Lớp {c.name} - Khối {c.grade} ({c.students?.length || 0} HS)
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              {teacherProfile.slogan || '“Mô hình ứng dụng AI trong quản lý, giáo dục song ngữ và kết nối học sinh tiểu học”'}
            </p>
          </div>
        </div>

        {/* Right Section: Multi-Class, Subjects, Teacher, DB, Key, Role */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Subject Management Button */}
          <button
            onClick={() => setSubjectModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-xs font-semibold transition-all shadow-2xs"
            title="Thêm môn học mới, bật/tắt môn học và soạn bài học"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Môn học ({subjects.filter(s => s.enabled).length})</span>
            <span className="sm:hidden">Môn</span>
          </button>

          {/* Teacher Profile Edit Button */}
          <button
            onClick={() => setTeacherModalOpen(true)}
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold transition-all shadow-2xs"
            title="Đổi tên giáo viên, danh xưng, trường học, ảnh đại diện"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-600" />
            <span>GV: {teacherProfile.fullName || teacherProfile.name}</span>
          </button>

          {/* Prominent Save / Auto-Save Button */}
          <div className="inline-flex items-center shadow-xs rounded-xl overflow-hidden border border-emerald-500/80">
            <button
              onClick={() => manualSave()}
              disabled={isSaving}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 font-bold text-xs transition-all ${
                isSaving
                  ? 'bg-amber-100 text-amber-900 animate-pulse'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white'
              }`}
              title="Lưu toàn bộ dữ liệu ứng dụng ngay bây giờ (Phím tắt: Ctrl + S)"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Lưu dữ liệu</span>
                  {lastSavedAt && (
                    <span className="hidden xl:inline text-[10px] font-normal opacity-90">({lastSavedAt})</span>
                  )}
                </>
              )}
            </button>
            <button
              onClick={() => setSaveModalOpen(true)}
              className="px-2 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs transition-colors border-l border-emerald-500/50"
              title="Mở Trung tâm Quản lý Lưu Trữ & Sao Lưu Dữ Liệu"
            >
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          {/* Online Cloud Database & Google Sheets Modal Button */}
          <button
            onClick={() => setDbModalOpen(true)}
            className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-2xs ${
              cloudSyncState === 'syncing'
                ? 'border-amber-300 bg-amber-50 text-amber-900 animate-pulse'
                : cloudSyncState === 'offline'
                ? 'border-slate-300 bg-slate-50 text-slate-700'
                : 'border-cyan-200 hover:border-cyan-400 bg-cyan-50/70 hover:bg-cyan-100 text-cyan-900'
            }`}
            title="Cơ sở dữ liệu đám mây (Cloud Database) - Tự động đồng bộ trên mọi thiết bị và trình duyệt"
          >
            <Database className="w-3.5 h-3.5 text-cyan-600" />
            <span className="hidden lg:inline">
              {cloudSyncState === 'syncing'
                ? '☁️ Đang đồng bộ...'
                : `☁️ CSDL Đám mây (v${cloudRevision})`}
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                cloudSyncState === 'syncing'
                  ? 'bg-amber-500 animate-ping'
                  : cloudSyncState === 'offline'
                  ? 'bg-slate-400'
                  : 'bg-emerald-500'
              }`}
            />
          </button>

          {/* Settings API Key Button (Optional) */}
          <button
            onClick={() => setApiKeyModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-purple-200 bg-purple-50/70 hover:bg-purple-100 text-purple-900 text-xs font-semibold transition-all shadow-2xs"
            title="Cấu hình Google Gemini API Key (Tùy chọn - Hệ thống luôn sẵn sàng sử dụng)"
          >
            <Key className="w-3.5 h-3.5 text-purple-600" />
            <span className="hidden sm:inline">
              Khóa AI {aiLiveStatus.hasKey || (typeof window !== 'undefined' && localStorage.getItem('gemini_api_key')) ? '(Đã kết nối)' : '(Tùy chọn)'}
            </span>
            <span className="sm:hidden">AI Key</span>
            {(aiLiveStatus.hasKey || (typeof window !== 'undefined' && localStorage.getItem('gemini_api_key'))) && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            )}
          </button>

          {/* Authentication & Login Modal Button */}
          <button
            onClick={() => setAuthModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-semibold transition-all shadow-2xs"
            title="Đăng nhập tài khoản Giáo viên hoặc Học sinh"
          >
            <KeyRound className="w-3.5 h-3.5 text-purple-600" />
            <span className="hidden xl:inline">
              TK: {authSession?.username || (currentUser.role === 'teacher' ? `thhn_${activeClass.name.toLowerCase()}` : 'Học sinh')}
            </span>
            <span className="xl:hidden font-semibold">Tài khoản</span>
          </button>

          <div className="hidden 2xl:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="capitalize">{currentDate}</span>
          </div>

          {/* Quick Role Switcher for Evaluators / Users */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl px-2.5 sm:px-3 py-1.5 text-left transition-all shadow-2xs"
            >
              <img
                src={currentUser.role === 'teacher' ? teacherProfile.avatar : currentUser.avatar}
                alt={currentUser.role === 'teacher' ? teacherProfile.name : currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-500/30"
              />
              <div className="hidden sm:block">
                <div className="text-xs font-semibold text-slate-800 line-clamp-1">
                  {currentUser.role === 'teacher' ? (teacherProfile.fullName || teacherProfile.name) : currentUser.name}
                </div>
                <div className="text-[10px] font-medium text-purple-600 flex items-center gap-1">
                  {currentUser.role === 'teacher' && (
                    <>
                      <UserCheck className="w-3 h-3 text-purple-600" />
                      <span>{teacherProfile.title} Lớp {activeClass.name}</span>
                    </>
                  )}
                  {currentUser.role === 'student' && (
                    <>
                      <GraduationCap className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Học sinh {activeClass.name}</span>
                    </>
                  )}
                  {currentUser.role === 'parent' && (
                    <>
                      <Users className="w-3 h-3 text-blue-600" />
                      <span className="text-blue-700">Phụ huynh</span>
                    </>
                  )}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {/* Role Dropdown */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Chuyển đổi vai trò trải nghiệm
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Trải nghiệm phân quyền thực tế trong hệ sinh thái
                  </p>
                </div>

                <div className="p-1.5 space-y-1">
                  {/* Teacher Option */}
                  <button
                    onClick={() => {
                      switchRole('teacher');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                      currentUser.role === 'teacher'
                        ? 'bg-purple-50 text-purple-900 font-semibold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold shrink-0">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold">{teacherProfile.title} {teacherProfile.fullName || teacherProfile.name}</div>
                      <div className="text-[11px] text-slate-500">Toàn quyền quản lý lớp {activeClass.name}</div>
                    </div>
                  </button>

                  {/* Student Option */}
                  <button
                    onClick={() => {
                      switchRole('student', students[0]?.id || 's-1');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                      currentUser.role === 'student'
                        ? 'bg-emerald-50 text-emerald-900 font-semibold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold">{students[0]?.fullName || 'Em Nguyễn Bảo An'}</div>
                      <div className="text-[11px] text-slate-500">Góc học tập & Nhiệm vụ cá nhân</div>
                    </div>
                  </button>

                  {/* Parent Option */}
                  <button
                    onClick={() => {
                      switchRole('parent', students[0]?.id || 's-1');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                      currentUser.role === 'parent'
                        ? 'bg-blue-50 text-blue-900 font-semibold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold">{students[0]?.parentName || 'Phụ huynh học sinh'}</div>
                      <div className="text-[11px] text-slate-500">Xem tiến độ & kết nối cô giáo</div>
                    </div>
                  </button>
                </div>

                {/* Account & Password Actions */}
                <div className="p-1.5 border-t border-slate-100 bg-slate-50/70 space-y-1">
                  {currentUser.role === 'teacher' && (
                    <button
                      onClick={() => {
                        setShowRoleMenu(false);
                        setChangePasswordOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs text-purple-700 hover:bg-purple-100/70 font-semibold transition-colors"
                    >
                      <Lock className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span>Đổi mật khẩu Giáo viên</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setShowRoleMenu(false);
                      setAuthModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs text-slate-700 hover:bg-slate-100 font-semibold transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>Cổng Đăng Nhập (GV & HS)</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowRoleMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs text-rose-600 hover:bg-rose-50 font-semibold transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>Đăng xuất tài khoản</span>
                  </button>
                </div>

                <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  <span>Dữ liệu cá nhân được phân quyền bảo mật</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

