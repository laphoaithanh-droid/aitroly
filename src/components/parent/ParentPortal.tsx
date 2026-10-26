import React, { useState } from 'react';
import {
  HeartHandshake,
  Bell,
  MessageSquare,
  Award,
  CheckCircle,
  Clock,
  Send,
  Sparkles,
  AlertCircle,
  Check,
  Phone,
  UserCheck,
  Users,
  Search,
  BookOpen,
  Calendar,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ParentPortal: React.FC = () => {
  const {
    currentUser,
    students,
    notifications,
    feedbacks,
    addFeedback,
    replyFeedback,
    badges,
    activeClass,
    teacherProfile,
    triggerCelebration
  } = useApp();

  type PortalTab = 'student_book' | 'directory' | 'announcements' | 'feedback';
  const [activeTab, setActiveTab] = useState<PortalTab>('student_book');

  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    currentUser.studentId || students[0]?.id || ''
  );
  const [parentMessage, setParentMessage] = useState('');
  const [replyInput, setReplyInput] = useState<Record<string, string>>({});
  const [directorySearch, setDirectorySearch] = useState('');
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const activeStudent = students.find(s => s.id === selectedStudentId) || students[0];

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentMessage.trim() || !activeStudent) return;

    addFeedback(activeStudent.id, parentMessage.trim());
    setParentMessage('');
    triggerCelebration();
  };

  const handleTeacherReply = (fbId: string) => {
    const text = replyInput[fbId];
    if (!text || !text.trim()) return;
    replyFeedback(fbId, text.trim());
    setReplyInput(prev => ({ ...prev, [fbId]: '' }));
    triggerCelebration();
  };

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  // Filter students for Directory
  const filteredStudents = students.filter(st => {
    const q = directorySearch.toLowerCase().trim();
    if (!q) return true;
    return (
      st.fullName.toLowerCase().includes(q) ||
      st.studentCode.toLowerCase().includes(q) ||
      st.parentName.toLowerCase().includes(q) ||
      st.parentPhone.includes(q)
    );
  });

  const presentCount = students.filter(s => s.attendanceStatus === 'present').length;
  const attendanceRate = students.length > 0 ? Math.round((presentCount / students.length) * 100) : 100;

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header Banner dynamically synchronized with Class and Teacher */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-blue-700/50 space-y-3 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-blue-300 text-xs font-bold border border-white/20">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>SỔ LIÊN LẠC ĐIỆN TỬ & KẾT NỐI PHỤ HUYNH - LỚP {activeClass.name}</span>
          </div>
          <div className="text-xs text-blue-200 flex items-center gap-2">
            <span className="font-semibold">{activeClass.schoolName || 'Trường Tiểu học Hoài Nhơn'}</span>
            <span>•</span>
            <span className="bg-white/10 px-2 py-0.5 rounded-md">Niên khóa 2026–2027</span>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Cầu Nối Yêu Thương Giữa {teacherProfile.title} {teacherProfile.name} & Gia Đình Học Sinh
        </h2>
        <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
          Đồng bộ toàn diện dữ liệu lớp học: hồ sơ học sinh, số liên lạc phụ huynh, chuyên cần trực tiếp, kết quả rèn luyện và trao đổi hai chiều vì sự tiến bộ của các con lớp {activeClass.name}.
        </p>

        {/* Dynamic Teacher & Class Contact Quick Bar */}
        <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs text-blue-200">
          <div className="flex items-center gap-1.5 font-medium">
            <UserCheck className="w-4 h-4 text-emerald-300" />
            <span>GVCN: <strong className="text-white">{teacherProfile.title} {teacherProfile.name}</strong></span>
          </div>
          {teacherProfile.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-300" />
              <span>Hotline GVCN: <a href={`tel:${teacherProfile.phone}`} className="text-amber-300 font-bold hover:underline">{teacherProfile.phone}</a></span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-purple-300" />
            <span>Sĩ số: <strong className="text-white">{students.length} học sinh</strong> ({presentCount} có mặt hôm nay)</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('student_book')}
          className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'student_book'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>1. Sổ Liên Lạc Điện Tử (Từng Con)</span>
        </button>

        <button
          onClick={() => setActiveTab('directory')}
          className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'directory'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>2. Danh Bạ Toàn Bộ Phụ Huynh ({students.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'announcements'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>3. Thông Báo Của GVCN ({notifications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('feedback')}
          className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'feedback'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>4. Trao Đổi Hai Chiều ({feedbacks.length})</span>
        </button>
      </div>

      {/* TAB 1: SỔ LIÊN LẠC ĐIỆN TỬ TỪNG CON */}
      {activeTab === 'student_book' && (
        <div className="space-y-5 animate-in fade-in">
          {/* Student Selector Card */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>Xem hồ sơ học sinh lớp {activeClass.name}:</span>
              </span>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold max-w-xs"
              >
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.stt}. {st.fullName} ({st.studentCode}) - PH: {st.parentName}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-slate-500 flex items-center gap-2">
              <span>GVCN: <strong className="text-purple-700 font-bold">{teacherProfile.title} {teacherProfile.name}</strong></span>
              <span>•</span>
              <span className="font-bold text-blue-700">Lớp {activeClass.name}</span>
            </div>
          </div>

          {activeStudent && (
            <>
              {/* Detailed Student & Parent Profile Banner */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={(activeStudent as any).avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${activeStudent.id}`}
                      alt={activeStudent.fullName}
                      className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 p-0.5 object-cover shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-extrabold text-slate-900">{activeStudent.fullName}</h3>
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[11px] font-bold">
                          Mã: {activeStudent.studentCode}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[11px] font-bold">
                          STT: {activeStudent.stt}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Lớp {activeClass.name} • {activeClass.schoolName || 'Trường Tiểu học Hoài Nhơn'} • Giới tính: {activeStudent.gender} • Ngày sinh: {activeStudent.birthDate}
                      </p>
                    </div>
                  </div>

                  {/* Parent Contact Card */}
                  <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-xs space-y-1.5 shrink-0 min-w-[260px]">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
                      <HeartHandshake className="w-3.5 h-3.5 text-blue-600" />
                      <span>Thông tin Phụ huynh học sinh</span>
                    </div>
                    <div className="font-bold text-slate-900">
                      Họ và tên: <span className="text-blue-900">{activeStudent.parentName}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <span className="text-slate-600 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span className="font-bold text-slate-800">{activeStudent.parentPhone}</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <a
                          href={`tel:${activeStudent.parentPhone}`}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center gap-1 transition-colors"
                        >
                          <Phone className="w-2.5 h-2.5" />
                          <span>Gọi</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => handleCopyPhone(activeStudent.parentPhone)}
                          className="px-2 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-medium text-[10px]"
                        >
                          {copiedPhone === activeStudent.parentPhone ? 'Đã chép' : 'Sao chép'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Status 3 Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Chuyên cần hôm nay
                    </span>
                    <div className="text-base font-extrabold text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <span>
                        {activeStudent.attendanceStatus === 'present'
                          ? 'Có mặt tại lớp'
                          : activeStudent.attendanceStatus === 'late'
                          ? 'Đi muộn'
                          : 'Nghỉ có phép'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">Cập nhật lúc 07:45 sáng từ điểm danh số</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Tiến độ học tập tổng thể
                    </span>
                    <div className="text-base font-extrabold text-purple-700">
                      {activeStudent.learningProgress}% hoàn thành
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-purple-600 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${activeStudent.learningProgress}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Huy hiệu tích cực đã nhận
                    </span>
                    <div className="text-base font-extrabold text-amber-600 flex items-center gap-1.5">
                      <Award className="w-5 h-5 text-amber-500" />
                      <span>{activeStudent.badges?.length || 0} huy hiệu thi đua</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Được {teacherProfile.title} {teacherProfile.name} tuyên dương</p>
                  </div>
                </div>

                {/* Subject Competency Ratings (GDPT 2018) */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                    Năng lực học tập các phân môn cốt lõi:
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200">
                      <div className="text-slate-500 font-semibold">Môn Toán</div>
                      <div className="text-base font-extrabold text-blue-900 mt-0.5">
                        {activeStudent.skills?.math ?? 85}%
                      </div>
                      <div className="text-[10px] text-blue-700 mt-1">Tính nhẩm & giải toán tốt</div>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                      <div className="text-slate-500 font-semibold">Tiếng Việt</div>
                      <div className="text-base font-extrabold text-emerald-900 mt-0.5">
                        {activeStudent.skills?.vietnamese ?? 88}%
                      </div>
                      <div className="text-[10px] text-emerald-700 mt-1">Đọc hiểu & đặt câu so sánh</div>
                    </div>

                    <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200">
                      <div className="text-slate-500 font-semibold">Tiếng Anh</div>
                      <div className="text-base font-extrabold text-purple-900 mt-0.5">
                        {activeStudent.skills?.english ?? 90}%
                      </div>
                      <div className="text-[10px] text-purple-700 mt-1">Tự tin tương tác AI Buddy</div>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                      <div className="text-slate-500 font-semibold">Tin học & Công nghệ</div>
                      <div className="text-base font-extrabold text-amber-900 mt-0.5">
                        {activeStudent.skills?.informatics ?? 86}%
                      </div>
                      <div className="text-[10px] text-amber-700 mt-1">Gõ 10 ngón phím F-J chuẩn</div>
                    </div>
                  </div>
                </div>

                {/* Homeroom Teacher Pedagogical Note */}
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs space-y-1">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Mục tiêu rèn luyện & Lời nhắn từ GVCN {teacherProfile.title} {teacherProfile.name}:</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    "{activeStudent.supportGoal || 'Tiếp tục rèn luyện tính tự giác, đọc sách 20 phút mỗi tối và chăm chỉ hoàn thành thử thách cùng lớp!'}"
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 2: DANH BẠ LIÊN LẠC TOÀN BỘ PHỤ HUYNH & HỌC SINH */}
      {activeTab === 'directory' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Summary KPI row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 font-semibold">Tổng số học sinh lớp {activeClass.name}</div>
                <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{students.length} em</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 font-semibold">Tỷ lệ chuyên cần hôm nay</div>
                <div className="text-2xl font-extrabold text-emerald-700 mt-0.5">{attendanceRate}%</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 font-semibold">Phụ huynh đã kết nối Sổ liên lạc</div>
                <div className="text-2xl font-extrabold text-purple-700 mt-0.5">100% ({students.length}/{students.length})</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
            <input
              type="text"
              value={directorySearch}
              onChange={(e) => setDirectorySearch(e.target.value)}
              placeholder="Tìm kiếm theo tên học sinh, mã HS, tên phụ huynh hoặc số điện thoại..."
              className="flex-1 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            {directorySearch && (
              <button
                onClick={() => setDirectorySearch('')}
                className="text-xs text-slate-400 hover:text-slate-600 px-2 font-bold"
              >
                Xóa
              </button>
            )}
          </div>

          {/* Directory Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Danh bạ liên lạc gia đình học sinh lớp {activeClass.name} ({filteredStudents.length} em)</span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                GVCN: {teacherProfile.title} {teacherProfile.name}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3 w-12 text-center">STT</th>
                    <th className="py-3 px-3">Mã HS</th>
                    <th className="py-3 px-4">Họ và tên học sinh</th>
                    <th className="py-3 px-4">Phụ huynh liên hệ</th>
                    <th className="py-3 px-4">Số điện thoại</th>
                    <th className="py-3 px-3 text-center">Điểm danh</th>
                    <th className="py-3 px-3 text-center">Tiến độ</th>
                    <th className="py-3 px-3 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 text-center font-bold text-slate-500">{st.stt}</td>
                      <td className="py-2.5 px-3 font-semibold text-blue-700">{st.studentCode}</td>
                      <td className="py-2.5 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span>{st.fullName}</span>
                          <span className="text-[10px] text-slate-400 font-normal">({st.gender})</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-slate-700">{st.parentName}</td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">{st.parentPhone}</span>
                          <a
                            href={`tel:${st.parentPhone}`}
                            className="p-1 rounded-md bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            title="Gọi điện"
                          >
                            <Phone className="w-3 h-3" />
                          </a>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                            st.attendanceStatus === 'present'
                              ? 'bg-emerald-100 text-emerald-800'
                              : st.attendanceStatus === 'late'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {st.attendanceStatus === 'present' ? 'Có mặt' : st.attendanceStatus === 'late' ? 'Muộn' : 'Vắng'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-purple-700">
                        {st.learningProgress}%
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedStudentId(st.id);
                            setActiveTab('student_book');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                        >
                          <span>Xem sổ</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: THÔNG BÁO TỪ GVCN */}
      {activeTab === 'announcements' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500" />
              <span>Thông báo mới nhất từ {teacherProfile.title} {teacherProfile.name} (GVCN Lớp {activeClass.name})</span>
            </h3>
            <span className="text-xs text-slate-400 font-semibold">{notifications.length} thông báo</span>
          </div>

          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2 hover:border-purple-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    {n.isImportant && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-extrabold">
                        Quan trọng
                      </span>
                    )}
                    {n.title}
                  </span>
                  <span className="text-[11px] text-slate-400">{n.date}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{n.content}</p>
                <div className="pt-2 border-t border-slate-200/70 text-[11px] text-slate-500 italic">
                  Người gửi: {teacherProfile.title} {teacherProfile.name} • {activeClass.schoolName || 'Trường Tiểu học Hoài Nhơn'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: TRAO ĐỔI HAI CHIỀU PHỤ HUYNH ↔ GIÁO VIÊN */}
      {activeTab === 'feedback' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <span>Trao đổi hai chiều: Phụ huynh ↔ {teacherProfile.title} {teacherProfile.name}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Phụ huynh có thể nhắn tin xin phép nghỉ học, trao đổi về tình hình sức khỏe hoặc hỏi về bài học của con với cô giáo chủ nhiệm.
            </p>
          </div>

          {/* Send message form */}
          <form onSubmit={handleSendFeedback} className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-2">
            <label className="block text-xs font-bold text-blue-950">
              Gửi lời nhắn cho {teacherProfile.title} {teacherProfile.name} về học sinh {activeStudent?.fullName || 'học sinh'}:
            </label>
            <textarea
              rows={3}
              value={parentMessage}
              onChange={(e) => setParentMessage(e.target.value)}
              placeholder={`Kính gửi ${teacherProfile.title} ${teacherProfile.name}, hôm nay cháu có biểu hiện...`}
              className="w-full p-3 rounded-xl border border-blue-200 text-xs text-slate-900 bg-white"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!parentMessage.trim()}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gửi lời nhắn</span>
              </button>
            </div>
          </form>

          {/* Messages thread */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Lịch sử trao đổi gần đây:
            </h4>

            {feedbacks.map((fb) => (
              <div key={fb.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                {/* Parent Message */}
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                    PH
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        {fb.parentName} (PH em {fb.studentName})
                      </span>
                      <span className="text-[10px] text-slate-400">{fb.sentAt}</span>
                    </div>
                    <p className="text-slate-700 mt-1 leading-relaxed">{fb.message}</p>
                  </div>
                </div>

                {/* Teacher Reply */}
                {fb.teacherReply ? (
                  <div className="ml-8 p-3 rounded-xl bg-purple-50 border border-purple-200 flex items-start gap-2.5 text-xs">
                    <div className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                      GV
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-purple-900">{teacherProfile.title} {teacherProfile.name} (Phản hồi)</span>
                        <span className="text-[10px] text-purple-600">{fb.repliedAt}</span>
                      </div>
                      <p className="text-purple-800 mt-0.5 leading-relaxed">{fb.teacherReply}</p>
                    </div>
                  </div>
                ) : currentUser.role === 'teacher' ? (
                  <div className="ml-8 pt-2 space-y-2">
                    <input
                      type="text"
                      value={replyInput[fb.id] || ''}
                      onChange={(e) => setReplyInput({ ...replyInput, [fb.id]: e.target.value })}
                      placeholder={`${teacherProfile.title} ${teacherProfile.name} nhập phản hồi cho phụ huynh...`}
                      className="w-full px-3 py-1.5 rounded-xl border border-purple-200 text-xs bg-white"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleTeacherReply(fb.id)}
                        className="px-3 py-1 rounded-lg bg-purple-600 text-white text-xs font-bold"
                      >
                        Gửi phản hồi
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="ml-8 text-[11px] text-amber-600 italic">
                    Đang chờ {teacherProfile.title} {teacherProfile.name} phản hồi...
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
