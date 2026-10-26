import React from 'react';
import {
  LayoutDashboard,
  Trophy,
  Users2,
  School,
  Languages,
  Calculator,
  BookOpenText,
  Laptop,
  Gamepad2,
  Bot,
  Sparkles,
  FolderOpen,
  HeartHandshake,
  BarChart3,
  Star,
  BookOpen,
  FileSpreadsheet,
  PlusCircle,
  Atom,
  Leaf,
  Compass,
  Lightbulb,
  PenTool,
  ChevronRight,
  Layers,
  Edit3,
  KeyRound,
  Lock,
  LogOut,
  LogIn,
  Save,
  ClipboardCheck
} from 'lucide-react';
import { useApp, NavView } from '../../context/AppContext';

interface NavItem {
  id: NavView;
  label: string;
  subLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
  roles?: ('teacher' | 'student' | 'parent')[];
}

const getSubjectIcon = (iconName: string) => {
  switch (iconName) {
    case 'Atom':
      return Atom;
    case 'Leaf':
      return Leaf;
    case 'Compass':
      return Compass;
    case 'Lightbulb':
      return Lightbulb;
    case 'PenTool':
      return PenTool;
    case 'HeartHandshake':
      return HeartHandshake;
    case 'Laptop':
      return Laptop;
    case 'Calculator':
      return Calculator;
    case 'Languages':
      return Languages;
    default:
      return BookOpen;
  }
};

export const Sidebar: React.FC<{ isOpenMobile: boolean; onCloseMobile: () => void }> = ({
  isOpenMobile,
  onCloseMobile
}) => {
  const {
    activeView,
    setActiveView,
    currentUser,
    students,
    assignments,
    notifications,
    dbConfig,
    setDbModalOpen,
    // Multi-Class
    classes,
    activeClassId,
    activeClass,
    setClassModalOpen,
    // Teacher
    teacherProfile,
    setTeacherModalOpen,
    // Dynamic Subjects
    subjects,
    activeSubjectId,
    setActiveSubjectId,
    setSubjectModalOpen,
    genericLessons,
    // Auth & Credentials
    authSession,
    setAuthModalOpen,
    setChangePasswordOpen,
    logout,
    // Save & Backup
    manualSave,
    isSaving,
    setSaveModalOpen
  } = useApp();

  const coreManagementItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Trung tâm điều hành',
      subLabel: `Dashboard lớp ${activeClass.name}`,
      icon: LayoutDashboard,
    },
    {
      id: 'competition',
      label: 'Sản phẩm dự thi AI',
      subLabel: 'Giới thiệu & Thuyết minh',
      icon: Trophy,
      badge: 'Đặc sắc',
      badgeColor: 'bg-amber-500 text-slate-900',
    },
    {
      id: 'students',
      label: `Hồ sơ học sinh ${activeClass.name}`,
      subLabel: `Quản lý ${students.length} em`,
      icon: Users2,
      badge: students.length,
      badgeColor: 'bg-blue-600 text-white',
      roles: ['teacher'],
    },
    {
      id: 'classroom',
      label: 'Quản lý & Sơ đồ lớp',
      subLabel: 'Điểm danh & Bàn ghế',
      icon: School,
      roles: ['teacher'],
    },
  ];

  const coreSubjectItems: NavItem[] = [
    {
      id: 'english',
      label: 'AI English World',
      subLabel: `Tiếng Anh Khối ${activeClass.grade}`,
      icon: Languages,
      badge: '6 Unit',
      badgeColor: 'bg-indigo-600 text-white',
    },
    {
      id: 'math',
      label: 'Math World',
      subLabel: `Toán Khối ${activeClass.grade}`,
      icon: Calculator,
      badge: '6 Chuyên đề',
      badgeColor: 'bg-emerald-600 text-white',
    },
    {
      id: 'vietnamese',
      label: 'Tiếng Việt World',
      subLabel: `Tiếng Việt Khối ${activeClass.grade}`,
      icon: BookOpenText,
      badge: '6 Chủ điểm',
      badgeColor: 'bg-rose-600 text-white',
    },
    {
      id: 'informatics',
      label: 'Informatics World',
      subLabel: `Tin học Khối ${activeClass.grade}`,
      icon: Laptop,
      badge: '16 Bài',
      badgeColor: 'bg-cyan-600 text-white',
    },
  ];

  const utilityItems: NavItem[] = [
    {
      id: 'games',
      label: '10 Trò chơi học tập',
      subLabel: 'Game Hub & Tạo từ file',
      icon: Gamepad2,
      badge: '10 Game',
      badgeColor: 'bg-purple-600 text-white',
    },
    {
      id: 'aibuddy',
      label: 'Chatbot AI Buddy',
      subLabel: 'Trợ lý học sinh thân thiện',
      icon: Bot,
      badge: 'Song ngữ',
      badgeColor: 'bg-emerald-500 text-slate-950 font-bold',
    },
    {
      id: 'assistant',
      label: 'Trợ lý AI Giáo viên',
      subLabel: `${teacherProfile.title} ${teacherProfile.name}`,
      icon: Sparkles,
      badge: 'AI GV',
      badgeColor: 'bg-purple-400 text-slate-950 font-bold',
      roles: ['teacher'],
    },
    {
      id: 'assignments',
      label: 'Giao bài tập & Đánh giá',
      subLabel: 'Phân hóa 3 nhóm năng lực',
      icon: ClipboardCheck,
      badge: 'Phân hóa TT27',
      badgeColor: 'bg-indigo-600 text-white font-bold',
    },
    {
      id: 'materials',
      label: 'Kho học liệu số',
      subLabel: 'PPTX, DOCX, Video, PDF',
      icon: FolderOpen,
    },
    {
      id: 'parents',
      label: 'Kết nối Phụ huynh',
      subLabel: 'Sổ liên lạc & Tin nhắn',
      icon: HeartHandshake,
      badge: notifications.length,
      badgeColor: 'bg-amber-500 text-slate-950',
    },
    {
      id: 'reports',
      label: 'Đánh giá & Báo cáo TT 27',
      subLabel: 'Chuẩn Thông tư 27/2020',
      icon: BarChart3,
      badge: 'TT 27',
      badgeColor: 'bg-emerald-600 text-white font-bold',
      roles: ['teacher'],
    },
  ];

  const filterByRole = (items: NavItem[]) => {
    return items.filter((item) => {
      if (!item.roles) return true;
      return item.roles.includes(currentUser.role);
    });
  };

  // Additional elementary & custom subjects
  const additionalSubjects = subjects.filter((s) => s.enabled && !s.isCore);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Fixed Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-72 bg-[#0B1428] text-white flex flex-col z-50 transition-transform duration-300 ease-in-out border-r border-slate-800 shadow-2xl ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo Section */}
        <div className="p-4 border-b border-slate-800/80 bg-gradient-to-b from-[#0F1E3D] to-[#0B1428]">
          <div className="flex items-center gap-3">
            {/* Logo Emblem */}
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6738FF] to-[#9B20F5] p-0.5 shadow-lg shadow-purple-500/30 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#0B1428]/90 rounded-[14px] flex items-center justify-center relative overflow-hidden">
                <BookOpen className="w-6 h-6 text-purple-400 absolute opacity-70" />
                <Sparkles className="w-4 h-4 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 absolute bottom-1 right-1" />
                <div className="w-2 h-2 rounded-full bg-emerald-400 absolute top-1.5 left-1.5 animate-ping" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-wider text-white">
                  AI CLASS
                </span>
                <button
                  onClick={() => setClassModalOpen(true)}
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-600/40 text-purple-300 border border-purple-400/40 hover:bg-purple-600 hover:text-white transition-colors"
                  title="Bấm để đổi lớp"
                >
                  Lớp {activeClass.name}
                </button>
              </div>
              <p className="text-[11px] font-medium text-slate-400 truncate">
                {activeClass.schoolName || teacherProfile.school}
              </p>
            </div>
          </div>

          {/* Quick Class & Teacher Ribbon */}
          <div className="mt-3 px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[10px] text-slate-300 flex items-center justify-between gap-1">
            <button
              onClick={() => setTeacherModalOpen(true)}
              className="text-amber-300 font-semibold hover:underline truncate flex items-center gap-1"
              title="Đổi tên giáo viên"
            >
              <Edit3 className="w-2.5 h-2.5 shrink-0" />
              <span className="truncate">GV: {teacherProfile.name}</span>
            </button>
            <button
              onClick={() => setClassModalOpen(true)}
              className="text-purple-300 hover:underline shrink-0 font-medium"
              title="Đổi lớp học"
            >
              [Đổi lớp: {activeClass.name}]
            </button>
          </div>
        </div>

        {/* Navigation Items Scroll Area */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {/* Group 1: Classroom Management */}
          <div>
            <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Quản lý Lớp {activeClass.name}</span>
              <span className="text-[9px] text-slate-500 font-normal">Khối {activeClass.grade}</span>
            </div>
            <div className="space-y-1">
              {filterByRole(coreManagementItems).map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveView(item.id);
                      onCloseMobile();
                    }}
                    className={`w-full group flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all duration-150 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#5538F5] to-[#7648F9] text-white shadow-lg shadow-purple-600/25 font-semibold translate-x-1'
                        : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-800/80 text-slate-400 group-hover:text-purple-300 group-hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-medium truncate">{item.label}</div>
                        {item.subLabel && (
                          <div
                            className={`text-[10px] truncate ${
                              isActive ? 'text-purple-200' : 'text-slate-500'
                            }`}
                          >
                            {item.subLabel}
                          </div>
                        )}
                      </div>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ml-2 ${
                          item.badgeColor || 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group 2: Core Subjects */}
          <div>
            <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Môn học cốt lõi</span>
              <span className="text-[9px] text-indigo-400">4 Môn</span>
            </div>
            <div className="space-y-1">
              {filterByRole(coreSubjectItems).map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveView(item.id);
                      onCloseMobile();
                    }}
                    className={`w-full group flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all duration-150 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#5538F5] to-[#7648F9] text-white shadow-lg shadow-purple-600/25 font-semibold translate-x-1'
                        : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-800/80 text-slate-400 group-hover:text-purple-300 group-hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-medium truncate">{item.label}</div>
                        {item.subLabel && (
                          <div
                            className={`text-[10px] truncate ${
                              isActive ? 'text-purple-200' : 'text-slate-500'
                            }`}
                          >
                            {item.subLabel}
                          </div>
                        )}
                      </div>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ml-2 ${
                          item.badgeColor || 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group 3: Additional & Custom Subjects (Full Feature Suite) */}
          <div>
            <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Môn học mở rộng & mới</span>
              <button
                onClick={() => setSubjectModalOpen(true)}
                className="text-[10px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-0.5"
                title="Thêm môn học mới"
              >
                <PlusCircle className="w-3 h-3" />
                <span>Thêm</span>
              </button>
            </div>

            <div className="space-y-1">
              {additionalSubjects.map((subj) => {
                const IconComponent = getSubjectIcon(subj.icon);
                const isActive = activeView === 'subject-world' && activeSubjectId === subj.id;
                const lessonCount = genericLessons.filter((l) => l.subjectId === subj.id).length;

                return (
                  <button
                    key={subj.id}
                    onClick={() => {
                      setActiveSubjectId(subj.id);
                      setActiveView('subject-world');
                      onCloseMobile();
                    }}
                    className={`w-full group flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all duration-150 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#5538F5] to-[#7648F9] text-white shadow-lg shadow-purple-600/25 font-semibold translate-x-1'
                        : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-800/80 text-slate-400 group-hover:text-purple-300 group-hover:bg-slate-800'
                        }`}
                      >
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-medium truncate">{subj.name}</div>
                        <div
                          className={`text-[10px] truncate ${
                            isActive ? 'text-purple-200' : 'text-slate-500'
                          }`}
                        >
                          {subj.englishName || `Khối ${subj.grades.join(', ')}`}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ml-2 ${
                        subj.badgeColor || 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {lessonCount > 0 ? `${lessonCount} Bài` : 'Mới'}
                    </span>
                  </button>
                );
              })}

              {/* Add New Subject Action Card */}
              <button
                onClick={() => setSubjectModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-dashed border-slate-700 hover:border-purple-500/80 bg-slate-900/40 hover:bg-purple-950/20 text-slate-400 hover:text-purple-300 text-xs font-medium transition-all group mt-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
                <span>+ Thêm môn học mới</span>
              </button>
            </div>
          </div>

          {/* Group 4: Utilities & AI Tools */}
          <div>
            <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Tiện ích AI & Học liệu
            </div>
            <div className="space-y-1">
              {filterByRole(utilityItems).map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveView(item.id);
                      onCloseMobile();
                    }}
                    className={`w-full group flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all duration-150 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#5538F5] to-[#7648F9] text-white shadow-lg shadow-purple-600/25 font-semibold translate-x-1'
                        : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-800/80 text-slate-400 group-hover:text-purple-300 group-hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-medium truncate">{item.label}</div>
                        {item.subLabel && (
                          <div
                            className={`text-[10px] truncate ${
                              isActive ? 'text-purple-200' : 'text-slate-500'
                            }`}
                          >
                            {item.subLabel}
                          </div>
                        )}
                      </div>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ml-2 ${
                          item.badgeColor || 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Save Data Button in Sidebar */}
        <div className="px-3 pt-2 pb-1 bg-slate-900/60 border-t border-slate-800/80">
          <button
            onClick={() => manualSave()}
            disabled={isSaving}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600/30 to-teal-600/30 hover:from-emerald-600/50 hover:to-teal-600/50 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between transition-all shadow-inner active:scale-98"
            title="Lưu toàn bộ dữ liệu ứng dụng ngay lập tức (Ctrl + S)"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Save className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">{isSaving ? 'Đang lưu...' : 'Lưu dữ liệu (Ctrl+S)'}</span>
            </div>
            <span
              onClick={(e) => {
                e.stopPropagation();
                setSaveModalOpen(true);
              }}
              className="px-1.5 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-200 text-[10px] font-medium transition-colors"
              title="Mở bảng sao lưu"
            >
              Sao lưu
            </span>
          </button>
        </div>

        {/* Google Sheet Quick Sync Button in Sidebar */}
        <div className="px-3 py-2 border-t border-slate-800/80 bg-slate-900/40">
          <button
            onClick={() => setDbModalOpen(true)}
            className="w-full py-2 px-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-700/40 text-emerald-300 text-xs font-semibold flex items-center justify-between transition-colors shadow-inner"
            title={`Mở kết nối Google Sheets lớp ${activeClass.name}`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">Google Sheet Lớp {activeClass.name}</span>
            </div>
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                dbConfig.provider === 'googlesheets' && dbConfig.status === 'connected'
                  ? 'bg-emerald-400 animate-pulse'
                  : 'bg-amber-400'
              }`}
            />
          </button>
        </div>

        {/* User Footer Profile */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
          <div
            onClick={() => currentUser.role === 'teacher' && setTeacherModalOpen(true)}
            className={`flex items-center gap-3 px-2 py-1.5 rounded-xl ${
              currentUser.role === 'teacher' ? 'hover:bg-slate-900/80 cursor-pointer' : ''
            }`}
            title={currentUser.role === 'teacher' ? 'Bấm để đổi thông tin giáo viên' : ''}
          >
            <img
              src={currentUser.role === 'teacher' ? teacherProfile.avatar : currentUser.avatar}
              alt={currentUser.role === 'teacher' ? teacherProfile.name : currentUser.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-500/40 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-white truncate flex items-center gap-1">
                <span className="truncate">
                  {currentUser.role === 'teacher' ? (teacherProfile.fullName || teacherProfile.name) : currentUser.name}
                </span>
                {currentUser.role === 'teacher' && (
                  <Edit3 className="w-3 h-3 text-slate-400 shrink-0" />
                )}
              </div>
              <div className="text-[11px] text-purple-400 truncate">
                {currentUser.role === 'teacher' && `${teacherProfile.title} Lớp ${activeClass.name}`}
                {currentUser.role === 'student' && `Học sinh Lớp ${activeClass.name}`}
                {currentUser.role === 'parent' && 'Phụ huynh Học sinh'}
              </div>
            </div>
          </div>
          <div className="mt-2 text-[10px] text-center text-slate-500 italic">
            “Smart Classroom – Happy Students – Bilingual Future”
          </div>

          {/* Account & Password Actions Strip in Sidebar Footer */}
          <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
            <button
              onClick={() => setAuthModalOpen(true)}
              className="text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1 truncate max-w-[150px]"
              title="Nhấn để xem hoặc đổi tài khoản đăng nhập"
            >
              <KeyRound className="w-3 h-3 shrink-0" />
              <span className="truncate">
                {authSession?.username || (currentUser.role === 'teacher' ? `thhn_${activeClass.name.toLowerCase()}` : 'Học sinh')}
              </span>
            </button>

            <div className="flex items-center gap-1.5 shrink-0">
              {currentUser.role === 'teacher' && (
                <button
                  onClick={() => setChangePasswordOpen(true)}
                  className="px-1.5 py-0.5 rounded bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-500/40 text-[10px] font-medium transition-colors"
                  title="Đổi mật khẩu giáo viên"
                >
                  Đổi MK
                </button>
              )}

              <button
                onClick={() => logout()}
                className="p-1 rounded bg-slate-800 hover:bg-rose-950/80 text-slate-400 hover:text-rose-300 border border-slate-700 transition-colors"
                title="Đăng xuất"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

