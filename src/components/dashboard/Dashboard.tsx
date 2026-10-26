import React from 'react';
import {
  Sparkles,
  Users,
  UserCheck,
  CheckCircle2,
  Clock,
  Languages,
  Award,
  TrendingUp,
  Compass,
  Calculator,
  BookOpenText,
  Laptop,
  Gamepad2,
  Bot,
  ArrowRight,
  Bell,
  Heart,
  ChevronRight,
  ShieldCheck,
  Flame,
  CalendarCheck,
  School,
  Edit3,
  BookOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Dashboard: React.FC = () => {
  const {
    currentUser,
    teacherInfo,
    teacherProfile,
    activeClass,
    setClassModalOpen,
    setTeacherModalOpen,
    setSubjectModalOpen,
    subjects,
    setActiveSubjectId,
    students,
    assignments,
    badges,
    notifications,
    setActiveView,
    markAttendance,
    markAllPresent,
    triggerCelebration
  } = useApp();

  // Compute live statistics from stored data
  const totalStudents = students.length;
  const presentCount = students.filter(s => s.attendanceStatus === 'present').length;
  const lateCount = students.filter(s => s.attendanceStatus === 'late').length;
  const excusedCount = students.filter(s => s.attendanceStatus === 'excused').length;
  const activeAssignments = assignments.filter(a => a.status === 'active').length;
  const totalBadgesAwarded = students.reduce((acc, s) => acc + (s.badges?.length || 0), 0);
  const avgProgress = totalStudents > 0
    ? Math.round(students.reduce((acc, s) => acc + s.learningProgress, 0) / totalStudents)
    : 0;

  // Student specific data
  const currentStudentData = currentUser.role === 'student' || currentUser.role === 'parent'
    ? students.find(s => s.id === currentUser.studentId) || students[0]
    : null;

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Hero Competition Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B1428] via-[#1E1B4B] to-[#5538F5] text-white p-6 sm:p-8 shadow-xl border border-indigo-900/50">
        {/* Decorative background glow circles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-72 h-72 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Competition Badge Ribbon */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-400/20 to-purple-400/20 border border-amber-300/40 text-amber-200 text-xs font-bold tracking-wide mb-4 shadow-xs backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span>SẢN PHẨM DỰ THI ỨNG DỤNG AI TRONG GIÁO DỤC VIỆT NAM</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="text-xs uppercase tracking-widest text-indigo-300 font-semibold">
                AI CLASS – SMART HOMEROOM ECOSYSTEM
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {activeClass.schoolName || teacherProfile.school} – AI CLASS <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-200 to-amber-200">
                  TRỢ LÝ LỚP HỌC THÔNG MINH
                </span>
              </h2>

              <div className="flex flex-wrap items-center gap-2 text-xs text-indigo-200 font-medium">
                <button
                  onClick={() => setTeacherModalOpen(true)}
                  className="bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg border border-white/20 text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Nhấn để đổi tên giáo viên, trường học, ảnh đại diện"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-300" />
                  <span>GV: {teacherProfile.name}</span>
                </button>
                <span className="text-white/40">•</span>
                <button
                  onClick={() => setClassModalOpen(true)}
                  className="bg-purple-600/40 hover:bg-purple-600/60 px-2.5 py-1 rounded-lg border border-purple-400/40 text-purple-200 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Nhấn để chuyển sang lớp khác hoặc thêm lớp mới"
                >
                  <School className="w-3.5 h-3.5 text-purple-300" />
                  <span>Lớp: {activeClass.name} (Khối {activeClass.grade})</span>
                </button>
                <span className="text-white/40">•</span>
                <span className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/15 text-indigo-200">
                  Năm học: {activeClass.schoolYear}
                </span>
              </div>

              <p className="text-sm sm:text-base text-indigo-100 font-medium italic">
                {teacherProfile.slogan || '“Quản lý lớp học thông minh – Cá nhân hóa học tập – Kết nối yêu thương.”'}
              </p>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                Một nền tảng ứng dụng AI và công nghệ số nhằm hỗ trợ giáo viên chủ nhiệm quản lý lớp học hiệu quả,
                phát triển năng lực học sinh, nâng cao chất lượng giáo dục và xây dựng môi trường học tập tích cực.
              </p>

              {/* 5+1 Main Quick Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-2.5">
                <button
                  onClick={() => setActiveView('classroom')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs sm:text-sm transition-all shadow-md hover:scale-102"
                >
                  <Compass className="w-4 h-4 text-purple-600" />
                  <span>Khám phá lớp học</span>
                </button>

                <button
                  onClick={() => setActiveView('english')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5538F5] hover:bg-[#6738FF] text-white font-bold text-xs sm:text-sm transition-all shadow-md hover:scale-102 border border-purple-400/30"
                >
                  <Languages className="w-4 h-4 text-amber-300" />
                  <span>Bắt đầu học Tiếng Anh</span>
                </button>

                <button
                  onClick={() => setActiveView('math')}
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm transition-all backdrop-blur-xs border border-white/20"
                >
                  <Calculator className="w-4 h-4 text-emerald-400" />
                  <span>Bắt đầu học Toán</span>
                </button>

                <button
                  onClick={() => setActiveView('vietnamese')}
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm transition-all backdrop-blur-xs border border-white/20"
                >
                  <BookOpenText className="w-4 h-4 text-rose-400" />
                  <span>Bắt đầu học Tiếng Việt</span>
                </button>

                <button
                  onClick={() => setActiveView('informatics')}
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm transition-all backdrop-blur-xs border border-white/20"
                >
                  <Laptop className="w-4 h-4 text-cyan-400" />
                  <span>Bắt đầu học Tin Học</span>
                </button>

                <button
                  onClick={() => setSubjectModalOpen(true)}
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md hover:scale-102"
                  title="Thêm môn học mới hoặc mở rộng các môn Khoa học, Lịch sử, Đạo đức..."
                >
                  <BookOpen className="w-4 h-4 text-slate-950" />
                  <span>Thêm & Quản lý Môn học</span>
                </button>
              </div>
            </div>

            {/* Quick Mascot & Motto Card on Right */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center space-y-3">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/40 p-1">
                  <div className="w-full h-full rounded-full bg-[#0B1428] flex items-center justify-center">
                    <Bot className="w-10 h-10 text-purple-300 animate-bounce" style={{ animationDuration: '2.5s' }} />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 p-1 rounded-full text-[10px] font-bold shadow">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <h3 className="font-bold text-white text-sm uppercase">AI BUDDY & CÔ {teacherProfile.fullName || teacherProfile.name}</h3>
                <p className="text-xs text-indigo-200 mt-0.5">
                  Đồng hành cùng học sinh lớp {activeClass?.name || '3C1'} mỗi ngày
                </p>
              </div>

              <div className="flex gap-2 w-full pt-1">
                <button
                  onClick={() => setActiveView('aibuddy')}
                  className="flex-1 py-2 px-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Trò chuyện AI</span>
                </button>
                <button
                  onClick={() => setActiveView('games')}
                  className="flex-1 py-2 px-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow"
                >
                  <Gamepad2 className="w-3.5 h-3.5" />
                  <span>10 Trò chơi</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Real-time Live Metric Cards (Calculated directly from stored data) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {/* Card 1: Tổng số học sinh */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Sĩ số {activeClass?.name || '3C1'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {totalStudents} <span className="text-xs font-normal text-slate-500">học sinh</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
            <span>100% hồ sơ số hóa</span>
          </div>
        </div>

        {/* Card 2: Có mặt hôm nay */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Điểm danh
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 tracking-tight">
            {presentCount}
            <span className="text-sm font-normal text-slate-400">/{totalStudents}</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1 truncate">
            {excusedCount > 0 ? `${excusedCount} phép` : 'Chuyên cần tốt'}
            {lateCount > 0 && ` • ${lateCount} muộn`}
          </div>
        </div>

        {/* Card 3: Nhiệm vụ đang thực hiện */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Nhiệm vụ
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {activeAssignments} <span className="text-xs font-normal text-slate-500">đang mở</span>
          </div>
          <div className="text-[11px] text-purple-600 font-medium mt-1">
            Phân hóa cả lớp & cá nhân
          </div>
        </div>

        {/* Card 4: Hoạt động Tiếng Anh */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Tiếng Anh 3
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Languages className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-indigo-600 tracking-tight">
            6 <span className="text-xs font-normal text-slate-500">Chủ đề</span>
          </div>
          <div className="text-[11px] text-indigo-600 font-medium mt-1">
            Song ngữ kèm AI Audio
          </div>
        </div>

        {/* Card 5: Huy hiệu đã trao */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Huy hiệu trao
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-purple-600 tracking-tight">
            {totalBadgesAwarded} <span className="text-xs font-normal text-slate-500">huy hiệu</span>
          </div>
          <div className="text-[11px] text-amber-600 font-medium mt-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Khen thưởng tích cực</span>
          </div>
        </div>

        {/* Card 6: Tiến độ học tập trung bình */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Tiến độ chung
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {avgProgress}%
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-indigo-600 h-1.5 rounded-full"
              style={{ width: `${avgProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* AI Pedagogical Innovation Hub */}
      {currentUser.role === 'teacher' && (
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl border border-purple-700/50 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-white/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>HỆ THỐNG TRỢ LÝ AI ĐỔI MỚI GIÁO DỤC TOÀN DIỆN</span>
              </div>
              <h3 className="text-xl font-extrabold text-white mt-1">
                Ứng Dụng AI Trong Quản Lý & Giảng Dạy Lớp {activeClass.name}
              </h3>
              <p className="text-xs text-purple-200">
                Chuẩn hóa theo Công văn 2345/BGDĐT, Thông tư 27/2020/TT-BGDĐT và Kỹ năng thế kỷ 21
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveView('assistant')}
                className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <span>Mở Trợ lý AI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
            <button
              onClick={() => setActiveView('assistant')}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-left transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-500/40 text-purple-200 flex items-center justify-center font-bold mb-1.5 group-hover:scale-110 transition-transform">
                📋
              </div>
              <div className="text-xs font-bold text-white">Giáo án CV 2345</div>
              <div className="text-[10px] text-purple-300">Tiến trình 4 bước</div>
            </button>

            <button
              onClick={() => setActiveView('assistant')}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-left transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/40 text-emerald-200 flex items-center justify-center font-bold mb-1.5 group-hover:scale-110 transition-transform">
                📝
              </div>
              <div className="text-xs font-bold text-white">Nhận xét TT 27</div>
              <div className="text-[10px] text-emerald-300">Học bạ & cả lớp</div>
            </button>

            <button
              onClick={() => setActiveView('reports')}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-left transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-500/40 text-blue-200 flex items-center justify-center font-bold mb-1.5 group-hover:scale-110 transition-transform">
                📊
              </div>
              <div className="text-xs font-bold text-white">Bảng Tổng Hợp TT 27</div>
              <div className="text-[10px] text-blue-300">T/H/C & Xuất Excel</div>
            </button>

            <button
              onClick={() => setActiveView('assistant')}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-left transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-500/40 text-amber-200 flex items-center justify-center font-bold mb-1.5 group-hover:scale-110 transition-transform">
                🎯
              </div>
              <div className="text-xs font-bold text-white">Đề thi 3 mức độ</div>
              <div className="text-[10px] text-amber-300">Kèm ma trận điểm</div>
            </button>

            <button
              onClick={() => setActiveView('classroom')}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-left transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-pink-500/40 text-pink-200 flex items-center justify-center font-bold mb-1.5 group-hover:scale-110 transition-transform">
                🎲
              </div>
              <div className="text-xs font-bold text-white">Vòng quay gọi tên</div>
              <div className="text-[10px] text-pink-300">Bốc thăm may mắn</div>
            </button>

            <button
              onClick={() => setActiveView('classroom')}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-left transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-500/40 text-indigo-200 flex items-center justify-center font-bold mb-1.5 group-hover:scale-110 transition-transform">
                ⏱️
              </div>
              <div className="text-xs font-bold text-white">Đồng hồ nhóm</div>
              <div className="text-[10px] text-indigo-300">Đếm ngược thi đua</div>
            </button>

            <button
              onClick={() => setActiveView('classroom')}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-left transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-teal-500/40 text-teal-200 flex items-center justify-center font-bold mb-1.5 group-hover:scale-110 transition-transform">
                💖
              </div>
              <div className="text-xs font-bold text-white">Kỹ năng sống & SEL</div>
              <div className="text-[10px] text-teal-300">Công dân số 4.0</div>
            </button>
          </div>
        </div>
      )}

      {/* 3. Role-specific Dashboard Sections */}
      {currentUser.role === 'teacher' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Quick Smart Attendance & Classroom Management Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CalendarCheck className="w-5 h-5 text-purple-600" />
                  <span>Điểm danh thông minh hôm nay – Lớp {activeClass.name}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Thực hiện điểm danh nhanh hoặc xem chi tiết chuyên cần
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={markAllPresent}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs transition-colors border border-emerald-200 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Cả lớp có mặt</span>
                </button>
                <button
                  onClick={() => setActiveView('classroom')}
                  className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-xs transition-colors border border-purple-200"
                >
                  Sơ đồ lớp
                </button>
              </div>
            </div>

            {/* Quick list of students with attendance toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
              {students.slice(0, 10).map((st) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 hover:bg-slate-100/80 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                      {st.stt}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-900 truncate">
                        {st.fullName}
                      </div>
                      <div className="text-[10px] text-slate-500">{st.studentCode}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => markAttendance(st.id, 'present')}
                      title="Có mặt"
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                        st.attendanceStatus === 'present'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 text-slate-600 hover:bg-emerald-100'
                      }`}
                    >
                      Có mặt
                    </button>
                    <button
                      onClick={() => markAttendance(st.id, 'late')}
                      title="Đi muộn"
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                        st.attendanceStatus === 'late'
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-200 text-slate-600 hover:bg-amber-100'
                      }`}
                    >
                      Muộn
                    </button>
                    <button
                      onClick={() => markAttendance(st.id, 'excused')}
                      title="Nghỉ có phép"
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                        st.attendanceStatus === 'excused'
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-200 text-slate-600 hover:bg-rose-100'
                      }`}
                    >
                      Phép
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Đang hiển thị 10/{totalStudents} học sinh</span>
              <button
                onClick={() => setActiveView('classroom')}
                className="text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1"
              >
                <span>Xem toàn bộ sơ đồ & lịch sử</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Differentiated Care & Teaching Assistant Quick Card */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>Mục tiêu hỗ trợ cá nhân hóa</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Đồng hành cùng học sinh theo năng lực thực tế
                </p>
              </div>
              <button
                onClick={() => setActiveView('assistant')}
                className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold hover:bg-purple-100 transition-colors"
              >
                Trợ lý AI
              </button>
            </div>

            <div className="space-y-2.5">
              {students.slice(0, 4).map((st) => (
                <div
                  key={st.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">{st.fullName}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                      Tiến độ: {st.learningProgress}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    🎯 {st.supportGoal}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => setActiveView('students')}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors text-center"
              >
                Xem chi tiết tất cả hồ sơ học sinh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* If current role is Student: Personalized Student View */}
      {currentUser.role === 'student' && currentStudentData && (
        <div className="bg-gradient-to-r from-emerald-500/10 via-purple-500/10 to-blue-500/10 rounded-3xl p-6 border border-purple-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
                <Flame className="w-3.5 h-3.5 text-emerald-600" />
                <span>GÓC HỌC TẬP CỦA EM – LỚP {activeClass?.name || '3C1'}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Xin chào {currentStudentData.fullName}! Chúc em một ngày học tập thật vui! 🌟
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Mục tiêu của em: <span className="font-semibold text-purple-700">{currentStudentData.supportGoal}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-slate-500">Tiến độ tích lũy</div>
                <div className="text-2xl font-extrabold text-purple-700">
                  {currentStudentData.learningProgress}%
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex flex-col items-center justify-center font-bold shadow-md">
                <Award className="w-6 h-6 text-amber-300" />
                <span className="text-[10px]">{currentStudentData.badges.length} huy hiệu</span>
              </div>
            </div>
          </div>

          {/* Student Badges Showcase */}
          <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-4 border border-purple-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Huy hiệu danh dự cô {teacherProfile.fullName || teacherProfile.name} đã trao cho em</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {currentStudentData.badges.map((bId) => {
                const b = badges.find(badge => badge.id === bId);
                if (!b) return null;
                return (
                  <div
                    key={b.id}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 shadow-2xs"
                  >
                    <span className="text-xs font-bold text-purple-900">{b.name}</span>
                    <span className="text-[10px] font-semibold text-purple-600 italic">({b.englishName})</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* If current role is Parent: Dedicated Family View */}
      {currentUser.role === 'parent' && currentStudentData && (
        <div className="bg-blue-50/70 rounded-3xl p-6 border border-blue-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                SỔ LIÊN LẠC ĐIỆN TỬ {activeClass?.name || '3C1'}
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Kính chào Phụ huynh em {currentStudentData.fullName}
              </h3>
              <p className="text-xs text-slate-600">
                Theo dõi quá trình học tập, rèn luyện và kết nối cùng cô giáo {teacherProfile.fullName || teacherProfile.name}
              </p>
            </div>
            <button
              onClick={() => setActiveView('parents')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-xs"
            >
              Gửi tin nhắn cho cô giáo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white p-3.5 rounded-2xl border border-blue-100">
              <div className="text-xs text-slate-500">Chuyên cần hôm nay</div>
              <div className="text-base font-bold text-emerald-600 mt-1">
                {currentStudentData.attendanceStatus === 'present' ? '✓ Có mặt tại lớp đúng giờ' : currentStudentData.attendanceStatus}
              </div>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-blue-100">
              <div className="text-xs text-slate-500">Nhiệm vụ tuần này</div>
              <div className="text-base font-bold text-purple-700 mt-1">
                {currentStudentData.activeTasksCount} nhiệm vụ đang thực hiện
              </div>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-blue-100">
              <div className="text-xs text-slate-500">Huy hiệu con đã nhận</div>
              <div className="text-base font-bold text-amber-600 mt-1">
                {currentStudentData.badges.length} huy hiệu tích cực
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Four Core Learning Worlds Navigation Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span>Bốn Thế giới học tập thông minh Lớp 3</span>
            </h3>
            <p className="text-xs text-slate-500">
              Chương trình song ngữ & chuẩn bộ sách Kết nối tri thức với cuộc sống
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* World 1: English */}
          <div
            onClick={() => setActiveView('english')}
            className="group cursor-pointer rounded-3xl bg-white p-5 border border-slate-200/90 hover:border-indigo-400 shadow-xs hover:shadow-xl transition-all duration-200 relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Languages className="w-6 h-6" />
            </div>
            <div className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
              AI English World
            </div>
            <h4 className="text-base font-bold text-slate-900 mt-0.5 group-hover:text-indigo-600 transition-colors">
              Tiếng Anh Lớp 3 Song Ngữ
            </h4>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              6 Chủ đề (Friends, Family, Subjects, Places, Time, Conversations) với phát âm chuẩn AI và hội thoại sinh động.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-600 font-semibold">
              <span>Khám phá bài học</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* World 2: Math */}
          <div
            onClick={() => setActiveView('math')}
            className="group cursor-pointer rounded-3xl bg-white p-5 border border-slate-200/90 hover:border-emerald-400 shadow-xs hover:shadow-xl transition-all duration-200 relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Calculator className="w-6 h-6" />
            </div>
            <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
              AI Math World
            </div>
            <h4 className="text-base font-bold text-slate-900 mt-0.5 group-hover:text-emerald-600 transition-colors">
              Toán Lớp 3 Trực Quan
            </h4>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              6 Chuyên đề cốt lõi: Số 100.000, 4 Phép tính, Góc vuông & Hình học, Đơn vị đo, Đồng hồ, Toán rút về đơn vị.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-600 font-semibold">
              <span>Rèn luyện tư duy</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* World 3: Vietnamese */}
          <div
            onClick={() => setActiveView('vietnamese')}
            className="group cursor-pointer rounded-3xl bg-white p-5 border border-slate-200/90 hover:border-rose-400 shadow-xs hover:shadow-xl transition-all duration-200 relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold mb-4 group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <BookOpenText className="w-6 h-6" />
            </div>
            <div className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">
              Tiếng Việt World
            </div>
            <h4 className="text-base font-bold text-slate-900 mt-0.5 group-hover:text-rose-600 transition-colors">
              Kết Nối Tri Thức 3
            </h4>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              Đọc hiểu, biện pháp so sánh, nhân hóa, viết đoạn văn ngắn và giao nhiệm vụ phân hóa sư phạm.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-rose-600 font-semibold">
              <span>Đọc hiểu & Viết văn</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* World 4: Informatics */}
          <div
            onClick={() => setActiveView('informatics')}
            className="group cursor-pointer rounded-3xl bg-white p-5 border border-slate-200/90 hover:border-cyan-400 shadow-xs hover:shadow-xl transition-all duration-200 relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold mb-4 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
              <Laptop className="w-6 h-6" />
            </div>
            <div className="text-[11px] font-bold text-cyan-600 uppercase tracking-wider">
              Informatics World
            </div>
            <h4 className="text-base font-bold text-slate-900 mt-0.5 group-hover:text-cyan-600 transition-colors">
              Tin Học 3 & Kỹ Năng Số
            </h4>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              6 Chủ đề & 16 Bài học: Bàn phím ảo 3D nhận diện phím F/J, chuột ảo, cây thư mục và đạo đức số an toàn.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-cyan-600 font-semibold">
              <span>Thực hành kỹ năng số</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
