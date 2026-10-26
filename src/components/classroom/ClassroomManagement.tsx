import React, { useState, useEffect } from 'react';
import {
  School,
  CalendarCheck,
  LayoutGrid,
  CheckCircle2,
  Clock,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Award,
  Plus,
  Users,
  Shuffle,
  Save,
  Check,
  ChevronRight,
  ShieldAlert,
  Heart,
  Play,
  Pause,
  RotateCcw,
  Flame,
  Trophy,
  ShieldCheck,
  Target,
  Lightbulb,
  Compass,
  MessageCircle,
  Star,
  ThumbsUp,
  Volume2,
  FolderOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Student, Assignment } from '../../types';

export const ClassroomManagement: React.FC = () => {
  const {
    students,
    assignments,
    badges,
    materials,
    markAttendance,
    markAllPresent,
    updateSeat,
    swapSeats,
    createAssignment,
    awardBadge,
    triggerCelebration,
    activeClass,
    teacherProfile
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'attendance' | 'seating' | 'tasks' | 'badges' | 'live_tools' | 'life_skills'
  >('seating');

  // Live Classroom Tools States
  // 1. Random Picker / Lucky Wheel
  const [isSpinning, setIsSpinning] = useState(false);
  const [pickedStudent, setPickedStudent] = useState<Student | null>(null);
  const [spinPurpose, setSpinPurpose] = useState<'recite' | 'lead' | 'helper'>('recite');

  // 2. Countdown Timer
  const [timerSeconds, setTimerSeconds] = useState(120); // 2 mins default
  const [initialTimer, setInitialTimer] = useState(120);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      triggerCelebration();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  // 3. Live Team Points (Dojo Style)
  const [teamPoints, setTeamPoints] = useState<{ [key: number]: number }>(() => {
    try {
      const saved = localStorage.getItem(`aiclass_team_points_${activeClass.id}`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return { 1: 15, 2: 18, 3: 16, 4: 17 };
  });

  const handleAddTeamPoint = (teamNumber: number, points: number) => {
    setTeamPoints(prev => {
      const updated = { ...prev, [teamNumber]: (prev[teamNumber] || 0) + points };
      try {
        localStorage.setItem(`aiclass_team_points_${activeClass.id}`, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    triggerCelebration();
  };

  const handleResetTeamPoints = () => {
    if (window.confirm('Đặt lại điểm thi đua tuần mới cho 4 Tổ?')) {
      const fresh = { 1: 0, 2: 0, 3: 0, 4: 0 };
      setTeamPoints(fresh);
      try {
        localStorage.setItem(`aiclass_team_points_${activeClass.id}`, JSON.stringify(fresh));
      } catch {}
    }
  };

  const handleSpinStudent = () => {
    if (students.length === 0 || isSpinning) return;
    setIsSpinning(true);
    setPickedStudent(null);

    let count = 0;
    const maxSpins = 20;
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * students.length);
      setPickedStudent(students[randomIdx]);
      count++;
      if (count >= maxSpins) {
        clearInterval(interval);
        setIsSpinning(false);
        triggerCelebration();
      }
    }, 100);
  };

  // Life skills quiz interaction state
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

  // Seating plan selection state
  const [selectedSeatStudent, setSelectedSeatStudent] = useState<Student | null>(null);
  const [savePlanMessage, setSavePlanMessage] = useState(false);

  // New task form state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    subject: 'english' as Assignment['subject'],
    description: '',
    deadline: '2026-10-25',
    assignedMode: 'all' as Assignment['assignedMode'],
    targetGroupName: '',
    targetStudentIds: [] as string[],
    criteria: 'Hoàn thành trên 80% câu hỏi và trình bày sạch đẹp'
  });

  // Badge award state
  const [selectedBadgeToAward, setSelectedBadgeToAward] = useState<string>('kind-friend');
  const [studentForBadge, setStudentForBadge] = useState<string>('');

  // Attendance stats
  const totalStudents = students.length;
  const presentCount = students.filter(s => s.attendanceStatus === 'present').length;
  const lateCount = students.filter(s => s.attendanceStatus === 'late').length;
  const excusedCount = students.filter(s => s.attendanceStatus === 'excused').length;
  const unexcusedCount = students.filter(s => s.attendanceStatus === 'unexcused').length;

  const handleSeatClick = (st: Student) => {
    if (!selectedSeatStudent) {
      setSelectedSeatStudent(st);
    } else if (selectedSeatStudent.id === st.id) {
      setSelectedSeatStudent(null);
    } else {
      // Swap seats between the two
      swapSeats(selectedSeatStudent.id, st.id);
      setSelectedSeatStudent(null);
      triggerCelebration();
    }
  };

  const handleSaveSeatingPlan = () => {
    setSavePlanMessage(true);
    triggerCelebration();
    setTimeout(() => setSavePlanMessage(false), 3000);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;

    createAssignment({
      title: taskForm.title.trim(),
      subject: taskForm.subject,
      description: taskForm.description,
      deadline: taskForm.deadline,
      assignedMode: taskForm.assignedMode,
      targetStudentIds: taskForm.targetStudentIds,
      targetGroupName: taskForm.targetGroupName,
      criteria: taskForm.criteria,
      status: 'active',
      totalAssigned: taskForm.assignedMode === 'all' ? totalStudents : taskForm.targetStudentIds.length
    });

    setIsTaskModalOpen(false);
    triggerCelebration();
  };

  const handleAwardBadgeSubmit = () => {
    if (studentForBadge && selectedBadgeToAward) {
      awardBadge(studentForBadge, selectedBadgeToAward);
      setStudentForBadge('');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Navigation Tabs */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold mb-2">
              <School className="w-3.5 h-3.5 text-purple-600" />
              <span>QUẢN LÝ LỚP HỌC THÔNG MINH – LỚP {activeClass.name} (KHỐI {activeClass.grade})</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Điểm Danh, Sơ Đồ Bàn Ghế & Khen Thưởng Tích Cực
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Xây dựng lớp học hạnh phúc, tôn trọng sự tiến bộ và gắn kết giữa giáo viên – học sinh
            </p>
          </div>

          {/* Quick tab switcher */}
          <div className="flex flex-wrap p-1 bg-slate-100 rounded-2xl border border-slate-200/80 gap-1 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('seating')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'seating'
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sơ đồ bàn ghế
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'attendance'
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Điểm danh thông minh
            </button>
            <button
              onClick={() => setActiveTab('live_tools')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'live_tools'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-purple-700 hover:bg-slate-200/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Trợ giảng giờ học</span>
            </button>
            <button
              onClick={() => setActiveTab('life_skills')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'life_skills'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-emerald-700 hover:bg-slate-200/60'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-rose-300" />
              <span>Kỹ năng sống & SEL</span>
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'tasks'
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Giao nhiệm vụ
            </button>
            <button
              onClick={() => setActiveTab('badges')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'badges'
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Khen thưởng huy hiệu
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: SƠ ĐỒ LỚP HỌC TRỰC QUAN (SEATING CHART) */}
      {activeTab === 'seating' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-purple-600" />
                <span>Sơ đồ bố trí bàn ghế Lớp {activeClass.name} (4 Tổ học tập)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Nhấp chọn 2 học sinh bất kỳ để đổi chỗ cho nhau, sau đó nhấn lưu phương án sắp xếp.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {selectedSeatStudent && (
                <div className="text-xs text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200 animate-pulse font-medium">
                  Đang chọn: <span className="font-bold">{selectedSeatStudent.fullName}</span>. Nhấp bạn khác để đổi chỗ!
                </div>
              )}
              <button
                onClick={handleSaveSeatingPlan}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors shadow-md flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Lưu phương án</span>
              </button>
            </div>
          </div>

          {savePlanMessage && (
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Đã lưu thành công phương án sắp xếp bàn ghế lớp {activeClass?.name || '3C1'} vào bộ nhớ hệ thống!</span>
            </div>
          )}

          {/* Teacher Desk & Smart Board Area */}
          <div className="max-w-xl mx-auto space-y-3">
            <div className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-white text-center text-xs font-bold tracking-wider uppercase shadow-md flex items-center justify-center gap-2">
              <span>BẢNG TỪ THÔNG MINH – BỤC GIẢNG</span>
            </div>
            <div className="w-48 mx-auto py-2 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-center text-xs font-bold shadow-xs">
              Bàn Cô {teacherProfile?.fullName || teacherProfile?.name || 'Giáo viên'} (GVCN)
            </div>
          </div>

          {/* 4 Groups of Desks Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {[1, 2, 3, 4].map((groupNum) => {
              const groupStudents = students.filter(s => (s.seatGroup || 1) === groupNum);

              return (
                <div
                  key={groupNum}
                  className="rounded-3xl p-4 bg-slate-50/80 border-2 border-slate-200/80 space-y-3 shadow-2xs"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="font-extrabold text-xs uppercase tracking-wider text-purple-700">
                      Tổ {groupNum}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">
                      {groupStudents.length} học sinh
                    </span>
                  </div>

                  <div className="space-y-2">
                    {groupStudents.map((st) => {
                      const isSelected = selectedSeatStudent?.id === st.id;

                      return (
                        <div
                          key={st.id}
                          onClick={() => handleSeatClick(st)}
                          className={`cursor-pointer p-3 rounded-2xl border transition-all duration-150 relative ${
                            isSelected
                              ? 'bg-purple-100 border-purple-500 shadow-md ring-2 ring-purple-400 scale-102'
                              : 'bg-white border-slate-200 hover:border-purple-300 hover:shadow-xs'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                              {st.stt}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-bold text-slate-900 truncate">
                                {st.fullName}
                              </div>
                              <div className="text-[10px] text-slate-500 flex items-center justify-between">
                                <span>{st.studentCode}</span>
                                <span
                                  className={`px-1.5 py-0.2 rounded font-semibold ${
                                    st.attendanceStatus === 'present'
                                      ? 'bg-emerald-100 text-emerald-700'
                                      : 'bg-amber-100 text-amber-700'
                                  }`}
                                >
                                  {st.attendanceStatus === 'present' ? 'Có mặt' : st.attendanceStatus}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: ĐIỂM DANH THÔNG MINH (SMART ATTENDANCE) */}
      {activeTab === 'attendance' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-emerald-600" />
                <span>Sổ điểm danh thông minh Lớp {activeClass?.name || '3C1'}</span>
              </h3>
              <p className="text-xs text-slate-500">
                Ghi nhận chuyên cần: Có mặt, Đi muộn, Nghỉ có phép, Nghỉ chưa rõ lý do.
              </p>
            </div>

            <button
              onClick={markAllPresent}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-md flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Đánh dấu cả lớp có mặt (1 chạm)</span>
            </button>
          </div>

          {/* Quick Stats Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-700">Có mặt</span>
              <div className="text-2xl font-extrabold text-emerald-700 mt-1">{presentCount}</div>
            </div>
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-center">
              <span className="text-[10px] uppercase font-bold text-amber-700">Đi muộn</span>
              <div className="text-2xl font-extrabold text-amber-700 mt-1">{lateCount}</div>
            </div>
            <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-center">
              <span className="text-[10px] uppercase font-bold text-blue-700">Nghỉ có phép</span>
              <div className="text-2xl font-extrabold text-blue-700 mt-1">{excusedCount}</div>
            </div>
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-center">
              <span className="text-[10px] uppercase font-bold text-rose-700">Chưa rõ lý do</span>
              <div className="text-2xl font-extrabold text-rose-700 mt-1">{unexcusedCount}</div>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3 w-14 text-center">STT</th>
                  <th className="py-3 px-3">Mã HS</th>
                  <th className="py-3 px-4">Họ và tên</th>
                  <th className="py-3 px-4 text-center">Trạng thái điểm danh hôm nay</th>
                  <th className="py-3 px-4">Ghi chú lý do / Phụ huynh nhắn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 text-center font-bold text-slate-500">{st.stt}</td>
                    <td className="py-3 px-3 font-semibold text-purple-700">{st.studentCode}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{st.fullName}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
                        <button
                          onClick={() => markAttendance(st.id, 'present')}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                            st.attendanceStatus === 'present'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-emerald-700'
                          }`}
                        >
                          Có mặt
                        </button>
                        <button
                          onClick={() => markAttendance(st.id, 'late', 'Đi muộn')}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                            st.attendanceStatus === 'late'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'text-slate-600 hover:text-amber-700'
                          }`}
                        >
                          Đi muộn
                        </button>
                        <button
                          onClick={() => markAttendance(st.id, 'excused', 'Gia đình có đơn xin phép')}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                            st.attendanceStatus === 'excused'
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-blue-700'
                          }`}
                        >
                          Có phép
                        </button>
                        <button
                          onClick={() => markAttendance(st.id, 'unexcused', 'Chưa liên hệ được phụ huynh')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                            st.attendanceStatus === 'unexcused'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-rose-700'
                          }`}
                        >
                          Không phép
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-xs">
                      {st.attendanceHistory?.[0]?.note || 'Bình thường'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: GIAO & QUẢN LÝ NHIỆM VỤ (ASSIGNMENT MANAGEMENT) */}
      {activeTab === 'tasks' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <span>Quản lý nhiệm vụ học tập – Lớp {activeClass?.name || '3C1'}</span>
              </h3>
              <p className="text-xs text-slate-500">
                Giao bài cho toàn bộ lớp học hoặc giao cá nhân hóa theo nhóm năng lực (ẩn danh sư phạm)
              </p>
            </div>

            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors shadow-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo nhiệm vụ mới</span>
            </button>
          </div>

          {/* Assignments list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments.map((assign) => (
              <div
                key={assign.id}
                className="p-5 rounded-3xl bg-slate-50 border border-slate-200 hover:border-purple-300 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      assign.subject === 'english'
                        ? 'bg-indigo-100 text-indigo-700'
                        : assign.subject === 'math'
                        ? 'bg-emerald-100 text-emerald-700'
                        : assign.subject === 'vietnamese'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-cyan-100 text-cyan-700'
                    }`}
                  >
                    {assign.subject === 'english'
                      ? 'Tiếng Anh'
                      : assign.subject === 'math'
                      ? 'Toán học'
                      : assign.subject === 'vietnamese'
                      ? 'Tiếng Việt'
                      : 'Tin học'}
                  </span>

                  <span className="text-[11px] text-slate-400 font-medium">
                    Hạn: {assign.deadline}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900">{assign.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{assign.description}</p>

                <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-[11px] text-slate-600">
                  <span className="font-semibold text-purple-700">Hình thức: </span>
                  {assign.assignedMode === 'all'
                    ? `Giao cho toàn bộ lớp ${activeClass?.name || '3C1'}`
                    : assign.assignedMode === 'group'
                    ? `Theo nhóm: ${assign.targetGroupName} (${assign.targetStudentIds.length} học sinh)`
                    : `Cá nhân hóa (${assign.targetStudentIds.length} học sinh cụ thể)`}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 text-xs">
                  <div className="font-semibold text-slate-700">
                    Đã nộp: <span className="text-purple-600 font-bold">{assign.submissionsCount}</span>/{assign.totalAssigned}
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                    Đang thực hiện
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Create Task Modal */}
          {isTaskModalOpen && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
                <h3 className="text-base font-bold text-slate-900">Tạo nhiệm vụ học tập mới</h3>

                <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
                  {/* Lấy từ Kho học liệu số */}
                  {materials.length > 0 && (
                    <div className="p-2.5 rounded-2xl bg-purple-50/80 border border-purple-200 space-y-1.5">
                      <span className="text-[11px] font-bold text-purple-900 flex items-center gap-1">
                        <FolderOpen className="w-3.5 h-3.5 text-purple-600" />
                        <span>Lấy nội dung từ Kho học liệu số:</span>
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {materials.slice(0, 4).map(mat => (
                          <button
                            key={mat.id}
                            type="button"
                            onClick={() => {
                              setTaskForm({
                                ...taskForm,
                                title: `Bài tập: ${mat.title}`,
                                subject: (mat.subject as any) || 'english',
                                description: mat.content
                                  ? `${mat.description}\n\n[Nội dung ôn tập]:\n${mat.content.slice(0, 200)}...`
                                  : mat.description,
                                criteria: 'Hoàn thành xem học liệu số, giải bài tập và nộp bài đúng hạn'
                              });
                            }}
                            className="px-2 py-1 rounded-lg bg-white hover:bg-purple-100 text-purple-800 border border-purple-300 text-[10px] font-medium transition-colors truncate max-w-[200px]"
                            title={mat.title}
                          >
                            {mat.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Tên nhiệm vụ *</label>
                    <input
                      type="text"
                      required
                      value={taskForm.title}
                      onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                      placeholder="Ví dụ: Ôn tập 6 chuyên đề Toán 3..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Môn học</label>
                      <select
                        value={taskForm.subject}
                        onChange={(e) => setTaskForm({ ...taskForm, subject: e.target.value as any })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                      >
                        <option value="english">Tiếng Anh</option>
                        <option value="math">Toán học</option>
                        <option value="vietnamese">Tiếng Việt</option>
                        <option value="informatics">Tin học</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Hạn nộp</label>
                      <input
                        type="date"
                        value={taskForm.deadline}
                        onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Đối tượng giao bài</label>
                    <select
                      value={taskForm.assignedMode}
                      onChange={(e) => setTaskForm({ ...taskForm, assignedMode: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                    >
                      <option value="all">Toàn bộ lớp {activeClass?.name || '3C1'} (Class-wide)</option>
                      <option value="group">Theo nhóm năng lực (Group)</option>
                      <option value="individual">Theo cá nhân học sinh (Individual)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Mô tả nội dung</label>
                    <textarea
                      rows={2}
                      value={taskForm.description}
                      onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                      placeholder="Mô tả cụ thể bài tập..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setIsTaskModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold shadow-md"
                    >
                      Giao nhiệm vụ
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: KHEN THƯỞNG HUY HIỆU TÍCH CỰC (POSITIVE BADGES) */}
      {activeTab === 'badges' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Hệ thống 8 Huy hiệu Khen thưởng Tích cực {activeClass?.name || '3C1'}</span>
            </h3>
            <p className="text-xs text-slate-500">
              Tập trung vào sự tiến bộ, tinh thần hợp tác và nỗ lực của từng học sinh. Tuyệt đối không dán nhãn tiêu cực.
            </p>
          </div>

          {/* Quick badge awarding box */}
          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex flex-col sm:flex-row items-center gap-3">
            <div className="text-xs font-bold text-purple-900 whitespace-nowrap">
              Trao huy hiệu danh dự:
            </div>
            <select
              value={studentForBadge}
              onChange={(e) => setStudentForBadge(e.target.value)}
              className="px-3 py-2 rounded-xl border border-purple-200 bg-white text-xs text-slate-800 w-full sm:w-64"
            >
              <option value="">Chọn học sinh được trao thưởng...</option>
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.stt}. {st.fullName} ({st.studentCode})
                </option>
              ))}
            </select>

            <select
              value={selectedBadgeToAward}
              onChange={(e) => setSelectedBadgeToAward(e.target.value)}
              className="px-3 py-2 rounded-xl border border-purple-200 bg-white text-xs text-slate-800 w-full sm:w-64"
            >
              {badges.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.englishName})
                </option>
              ))}
            </select>

            <button
              onClick={handleAwardBadgeSubmit}
              disabled={!studentForBadge}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold text-xs transition-colors shadow-md whitespace-nowrap"
            >
              Trao huy hiệu ngay!
            </button>
          </div>

          {/* 8 Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {badges.map((b) => {
              const studentsWithBadge = students.filter(s => s.badges?.includes(b.id));

              return (
                <div
                  key={b.id}
                  className="p-5 rounded-3xl bg-slate-50 border border-slate-200/90 hover:border-purple-300 transition-all space-y-3"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 text-white flex items-center justify-center shadow-md">
                    <Award className="w-6 h-6 text-amber-300" />
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{b.name}</h4>
                    <div className="text-[11px] font-semibold text-purple-600 italic">
                      {b.englishName}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">{b.description}</p>

                  <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-500">
                    <span>Đã trao cho:</span>
                    <span className="font-bold text-purple-700">{studentsWithBadge.length} bạn</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: CÔNG CỤ TRỢ GIẢNG TRỰC TIẾP (LIVE CLASSROOM TOOLS) */}
      {activeTab === 'live_tools' && (
        <div className="space-y-6 animate-in fade-in">
          {/* 1. Vòng quay may mắn / Bốc thăm ngẫu nhiên */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>Vòng Quay May Mắn – Bốc Thăm Học Sinh Ngẫu Nhiên</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tạo không khí hào hứng, công bằng và khuyến khích mọi học sinh lớp {activeClass.name} sẵn sàng tham gia
                </p>
              </div>

              {/* Spin purpose selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Mục đích:</span>
                <select
                  value={spinPurpose}
                  onChange={(e) => setSpinPurpose(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold text-slate-800"
                >
                  <option value="recite">🎯 Mời phát biểu bài học</option>
                  <option value="lead">🌟 Chọn nhóm trưởng trải nghiệm</option>
                  <option value="helper">🤝 Bạn hỗ trợ cô giáo hôm nay</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Spin Box Canvas */}
              <div className="md:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-950 text-white text-center space-y-4 shadow-xl relative overflow-hidden">
                <div className="absolute top-2 left-2 text-[10px] text-purple-300 font-mono">
                  SỐ LƯỢNG TRONG BỂ QUAY: {students.length} HỌC SINH
                </div>

                <div className="py-6">
                  {isSpinning ? (
                    <div className="space-y-2 animate-pulse">
                      <div className="text-4xl sm:text-5xl font-black text-amber-300 tracking-tight">
                        {pickedStudent ? pickedStudent.fullName : 'Đang quay...'}
                      </div>
                      <div className="text-xs text-purple-200 font-mono">
                        {pickedStudent ? `${pickedStudent.studentCode} • Tổ ${pickedStudent.seatGroup || 1}` : '...'}
                      </div>
                    </div>
                  ) : pickedStudent ? (
                    <div className="space-y-3 animate-in zoom-in-95 duration-200">
                      <div className="w-16 h-16 rounded-full bg-amber-400 text-slate-900 mx-auto flex items-center justify-center font-black text-xl shadow-lg ring-4 ring-white/20">
                        {pickedStudent.stt}
                      </div>
                      <div className="text-3xl sm:text-4xl font-black text-amber-300">
                        {pickedStudent.fullName}
                      </div>
                      <p className="text-xs text-purple-200">
                        Mã HS: <span className="font-mono font-bold">{pickedStudent.studentCode}</span> • Vị trí: Tổ {pickedStudent.seatGroup || 1} • Tiến độ: {pickedStudent.learningProgress}%
                      </p>
                      <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            handleAddTeamPoint(pickedStudent.seatGroup || 1, 1);
                            alert(`Đã cộng +1 điểm thi đua cho Tổ ${pickedStudent.seatGroup || 1} của em ${pickedStudent.fullName}!`);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-bold transition-all shadow-md flex items-center gap-1"
                        >
                          <Star className="w-3.5 h-3.5 fill-slate-900" />
                          <span>Khen thưởng (+1 điểm)</span>
                        </button>
                        <button
                          onClick={() => {
                            awardBadge(pickedStudent.id, 'daily-learner');
                            alert(`Đã trao tặng huy hiệu Chăm Chỉ cho em ${pickedStudent.fullName}!`);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all border border-white/30"
                        >
                          🏅 Trao huy hiệu
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 py-4">
                      <div className="text-2xl sm:text-3xl font-extrabold text-purple-200">
                        Sẵn Sàng Bốc Thăm Ngẫu Nhiên
                      </div>
                      <p className="text-xs text-purple-300 max-w-md mx-auto">
                        Nhấn nút quay bên dưới để hệ thống AI chọn ngẫu nhiên một bạn nhỏ trong lớp {activeClass?.name || '3C1'}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleSpinStudent}
                    disabled={isSpinning || students.length === 0}
                    className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-sm shadow-xl transition-all hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
                  >
                    <Shuffle className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
                    <span>{isSpinning ? 'Đang quay ngẫu nhiên...' : 'QUAY BỐC THĂM NGAY'}</span>
                  </button>
                </div>
              </div>

              {/* Recent Lucky Students Mini List */}
              <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>Danh sách sẵn sàng</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Lớp hiện có <strong>{students.length} học sinh</strong> được tích hợp tự động từ CSDL Google Sheet.
                </p>
                <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1">
                  {students.slice(0, 8).map((st) => (
                    <div
                      key={st.id}
                      className="p-2 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-[10px]">
                          {st.stt}
                        </span>
                        <span className="font-semibold text-slate-800">{st.fullName}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">Tổ {st.seatGroup || 1}</span>
                    </div>
                  ))}
                  {students.length > 8 && (
                    <div className="text-center text-[10px] text-slate-400 pt-1">
                      ... và {students.length - 8} học sinh khác
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Đồng hồ đếm ngược hoạt động nhóm & 3. Bảng thi đua 4 Tổ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Interactive Countdown Timer */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-600" />
                  <span>Đồng Hồ Đếm Ngược Hoạt Động Nhóm</span>
                </h3>
                <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2.5 py-0.5 rounded-full">
                  Tiết học 35 phút
                </span>
              </div>

              {/* Timer Display */}
              <div className="p-6 rounded-3xl bg-slate-900 text-white text-center space-y-3">
                <div className="text-5xl sm:text-6xl font-black font-mono tracking-wider text-amber-300">
                  {String(Math.floor(timerSeconds / 60)).padStart(2, '0')}:
                  {String(timerSeconds % 60).padStart(2, '0')}
                </div>
                <div className="text-xs text-slate-400">
                  {isTimerRunning ? '⏳ Đang đếm ngược thời gian thảo luận...' : '⏸️ Đồng hồ đang dừng'}
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-emerald-400 h-2 rounded-full transition-all duration-1000"
                    style={{
                      width: `${initialTimer > 0 ? ((initialTimer - timerSeconds) / initialTimer) * 100 : 0}%`
                    }}
                  />
                </div>

                {/* Controls */}
                <div className="pt-3 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md flex items-center gap-2 transition-transform hover:scale-105"
                  >
                    {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isTimerRunning ? 'Tạm Dừng' : 'Bắt Đầu Bấm Giờ'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsTimerRunning(false);
                      setTimerSeconds(initialTimer);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Đặt Lại</span>
                  </button>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-600">Chọn nhanh mốc thời gian:</div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: '1 phút (Nhanh)', secs: 60 },
                    { label: '2 phút (Cặp đôi)', secs: 120 },
                    { label: '3 phút (Nhóm 4)', secs: 180 },
                    { label: '5 phút (Luyện tập)', secs: 300 },
                    { label: '10 phút (Dự án)', secs: 600 }
                  ].map((preset) => (
                    <button
                      key={preset.secs}
                      onClick={() => {
                        setIsTimerRunning(false);
                        setInitialTimer(preset.secs);
                        setTimerSeconds(preset.secs);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                        initialTimer === preset.secs
                          ? 'bg-purple-100 text-purple-800 border-purple-300 font-bold'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Team Points (4 Tổ Thi Đua) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <span>Bảng Thi Đua 4 Tổ Lớp {activeClass.name}</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">Cộng điểm tức thời theo tinh thần thi đua tích cực</p>
                </div>
                <button
                  onClick={handleResetTeamPoints}
                  className="text-[11px] text-slate-400 hover:text-rose-600 transition-colors"
                  title="Đặt lại điểm tuần mới"
                >
                  Đặt lại điểm
                </button>
              </div>

              {/* 4 Teams Cards */}
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((tNum) => {
                  const points = teamPoints[tNum] || 0;
                  const teamStudents = students.filter(s => s.seatGroup === tNum);

                  return (
                    <div
                      key={tNum}
                      className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-purple-50/40 border border-slate-200 space-y-2 hover:border-purple-300 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-slate-900">Tổ {tNum}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-800 font-black text-sm border border-amber-300">
                          {points} ⭐
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {teamStudents.length} thành viên
                      </div>

                      {/* Quick +1 / +2 Buttons */}
                      <div className="pt-1 flex flex-wrap gap-1">
                        <button
                          onClick={() => handleAddTeamPoint(tNum, 1)}
                          className="px-2 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[10px] font-bold transition-colors"
                          title="Phát biểu tích cực (+1)"
                        >
                          +1 Phát biểu
                        </button>
                        <button
                          onClick={() => handleAddTeamPoint(tNum, 1)}
                          className="px-2 py-1 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 text-[10px] font-bold transition-colors"
                          title="Kỷ luật & Trật tự (+1)"
                        >
                          +1 Trật tự
                        </button>
                        <button
                          onClick={() => handleAddTeamPoint(tNum, 2)}
                          className="px-2 py-1 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-800 text-[10px] font-bold transition-colors"
                          title="Sáng tạo xuất sắc (+2)"
                        >
                          +2 Sáng tạo
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Tổ dẫn đầu hiện tại: <strong>Tổ {Object.entries(teamPoints).sort((a, b) => b[1] - a[1])[0]?.[0] || '1'}</strong> với {Math.max(...Object.values(teamPoints))} sao thi đua!
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: KỸ NĂNG SỐNG & CÔNG DÂN SỐ (LIFE SKILLS & SEL) */}
      {activeTab === 'life_skills' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Header Description */}
          <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-[#0B1428] rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-3 border border-emerald-800/60">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold border border-white/20">
              <Heart className="w-3.5 h-3.5 text-rose-300" />
              <span>CHUYÊN ĐỀ RÈN LUYỆN KỸ NĂNG SỐNG & CẢM XÚC XÃ HỘI (SEL)</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Kỹ Năng Thế Kỷ 21 & An Toàn Số Cho Học Sinh Lớp {activeClass.name}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
              Đáp ứng chuẩn đổi mới giáo dục toàn diện của Bộ GD&ĐT: phát triển phẩm chất Nhân ái, Trách nhiệm, 
              kỹ năng giao tiếp, làm việc nhóm và bảo vệ bản thân trên không gian số cùng AI.
            </p>
          </div>

          {/* 5 Core Life Skill Modules */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {[
              {
                id: 0,
                title: '1. An Toàn Số & AI',
                sub: 'Bảo mật mật khẩu, văn minh trên mạng',
                icon: ShieldCheck,
                color: 'text-indigo-600',
                badgeName: 'Công Dân Số'
              },
              {
                id: 1,
                title: '2. Lắng Nghe & Giao Tiếp',
                sub: 'Biết cảm ơn, xin lỗi và tôn trọng bạn',
                icon: MessageCircle,
                color: 'text-emerald-600',
                badgeName: 'Kind Friend'
              },
              {
                id: 2,
                title: '3. Quản Lý Cảm Xúc',
                sub: 'Bình tĩnh, tự tin vượt qua khó khăn',
                icon: Heart,
                color: 'text-rose-600',
                badgeName: 'Hiệp Sĩ Xanh'
              },
              {
                id: 3,
                title: '4. Tự Lập & An Toàn',
                sub: 'Tự phục vụ, phòng tránh tai nạn',
                icon: Lightbulb,
                color: 'text-amber-600',
                badgeName: 'Đôi Tay Khéo'
              },
              {
                id: 4,
                title: '5. Tinh Thần Đồng Đội',
                sub: 'Hợp tác, giúp bạn cùng tiến bộ',
                icon: Users,
                color: 'text-purple-600',
                badgeName: 'Quán Quân Đồng Đội'
              }
            ].map((module) => {
              const IconComp = module.icon;
              const isSelected = selectedScenarioIndex === module.id;

              return (
                <button
                  key={module.id}
                  onClick={() => {
                    setSelectedScenarioIndex(module.id);
                    setSelectedAnswer(null);
                    setIsAnswerChecked(false);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md font-bold'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300'
                  }`}
                >
                  <IconComp className={`w-6 h-6 mb-2 ${isSelected ? 'text-white' : module.color}`} />
                  <div>
                    <div className="text-xs font-bold">{module.title}</div>
                    <div className={`text-[10px] mt-0.5 line-clamp-2 ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                      {module.sub}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Scenario Drill Panel */}
          {(() => {
            const scenarios = [
              {
                title: 'Chuyên đề 1: An toàn số & Sử dụng AI thông minh',
                situation: 'Trong giờ Tin học, một bạn cùng lớp tò mò muốn biết mật khẩu đăng nhập AI CLASS của em để xem điểm và làm bài hộ. Em nên làm gì?',
                options: [
                  'Cho bạn mượn mật khẩu ngay để thể hiện tình bạn thân thiết.',
                  'Lịch sự từ chối, giải thích rằng mật khẩu cá nhân cần được giữ bí mật và sẵn sàng ngồi cạnh hướng dẫn bạn tự làm bài.',
                  'Đổi mật khẩu thành 123456 rồi đọc cho cả tổ cùng dùng chung.'
                ],
                correct: 1,
                explanation: 'Bảo mật tài khoản là bài học đầu tiên của công dân số. Giúp bạn bằng cách hướng dẫn phương pháp tự học, không làm hộ bài!',
                rewardBadge: 'kind-friend'
              },
              {
                title: 'Chuyên đề 2: Kỹ năng Lắng nghe & Giao tiếp tích cực',
                situation: 'Trong tiết thảo luận nhóm môn Tiếng Việt, bạn cùng nhóm nêu ra một ý kiến khác hẳn với suy nghĩ của em. Em nên ứng xử thế nào?',
                options: [
                  'Lắng nghe chăm chú đến khi bạn nói xong, sau đó nhẹ nhàng trình bày quan điểm của mình để cả nhóm cùng thảo luận.',
                  'Cắt lời bạn ngay lập tức và bảo ý kiến của bạn là sai.',
                  'Bỏ ra chỗ khác không thèm thảo luận cùng nhóm nữa.'
                ],
                correct: 0,
                explanation: 'Tôn trọng ý kiến của người khác và biết lắng nghe là bí quyết giúp nhóm học tập đoàn kết và đạt kết quả cao nhất.',
                rewardBadge: 'teamwork-champion'
              },
              {
                title: 'Chuyên đề 3: Nhận diện & Quản lý cảm xúc bản thân (SEL)',
                situation: 'Khi nhận bài kiểm tra Toán, em bị điểm chưa như mong muốn và cảm thấy rất buồn và muốn khóc. Cách giải quyết tích cực nhất là gì?',
                options: [
                  'Giấu bài kiểm tra đi để bố mẹ và cô giáo không biết.',
                  'Hít thở sâu 3 giây, giữ bình tĩnh, xem lại các câu bị sai và nhờ cô giáo hoặc AI Buddy giải thích lại để lần sau làm tốt hơn.',
                  'Tức giận và cho rằng bài toán quá khó không thể làm được.'
                ],
                correct: 1,
                explanation: 'Thất bại là mẹ thành công! Biết đối diện với lỗi sai và học hỏi từ đó chính là phẩm chất của người học sinh bản lĩnh.',
                rewardBadge: 'creative-thinker'
              },
              {
                title: 'Chuyên đề 4: Kỹ năng Tự phục vụ & Bảo vệ bản thân',
                situation: 'Sau khi tan học, em đợi ở cổng trường nhưng chưa thấy bố mẹ đến đón. Một người lạ mặt tự xưng là bạn của bố bảo lên xe để họ chở về nhà. Em sẽ làm gì?',
                options: [
                  'Lên xe ngay vì sợ trời tối và sợ phải đợi lâu.',
                  'Tuyệt đối không đi theo người lạ, quay trở lại phòng bảo vệ hoặc văn phòng trường nhờ các thầy cô giáo gọi điện cho bố mẹ.',
                  'Chạy một mình ra đường lớn để tự tìm đường về.'
                ],
                correct: 1,
                explanation: 'Quy tắc an toàn: Không bao giờ đi theo hoặc nhận quà của người lạ khi chưa có sự xác nhận trực tiếp từ cha mẹ!',
                rewardBadge: 'green-hero'
              },
              {
                title: 'Chuyên đề 5: Tinh thần Đồng đội & Đôi bạn cùng tiến',
                situation: `Em thấy bạn ngồi cạnh trong lớp ${activeClass?.name || '3C1'} đang loay hoay chưa hiểu cách gõ 10 ngón tay và tư thế đặt tay trên hàng phím cơ sở. Em nên làm gì?`,
                options: [
                  'Cười trêu bạn vì bạn thao tác chậm hơn mình.',
                  'Kiên nhẫn chỉ cho bạn vị trí hai phím có gờ F và J, hướng dẫn bạn đặt nhẹ nhàng 8 ngón tay và cùng bạn luyện tập.',
                  'Mặc kệ bạn vì nhiệm vụ ai người nấy làm.'
                ],
                correct: 1,
                explanation: 'Một người bạn tốt bụng (Kind Friend) luôn biết sẻ chia kiến thức và nâng bước bạn bè cùng tiến bộ!',
                rewardBadge: 'kind-friend'
              }
            ];

            const current = scenarios[selectedScenarioIndex] || scenarios[0];

            return (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                      #{selectedScenarioIndex + 1}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">{current.title}</h4>
                  </div>
                  <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-bold">
                    Tình huống thực tế
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-medium">
                  <strong>Tình huống đặt ra:</strong> {current.situation}
                </div>

                {/* Options */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-700">Em sẽ lựa chọn cách giải quyết nào?</div>
                  {current.options.map((opt, idx) => {
                    const isPicked = selectedAnswer === idx;
                    const isRight = idx === current.correct;

                    let btnClass = 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300';
                    if (isAnswerChecked) {
                      if (isRight) btnClass = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                      else if (isPicked) btnClass = 'bg-rose-50 border-rose-400 text-rose-800';
                    } else if (isPicked) {
                      btnClass = 'bg-purple-50 border-purple-400 text-purple-900 font-bold';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          if (!isAnswerChecked) setSelectedAnswer(idx);
                        }}
                        className={`w-full p-3.5 rounded-2xl border text-left text-xs transition-all flex items-start gap-2.5 ${btnClass}`}
                      >
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="leading-relaxed">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Actions and Feedback */}
                {!isAnswerChecked ? (
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => {
                        if (selectedAnswer === null) return;
                        setIsAnswerChecked(true);
                        if (selectedAnswer === current.correct) {
                          triggerCelebration();
                        }
                      }}
                      disabled={selectedAnswer === null}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all"
                    >
                      Kiểm tra câu trả lời
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 animate-in fade-in">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{selectedAnswer === current.correct ? 'Xuất sắc! Em đã lựa chọn hành động rất đúng đắn!' : 'Cần lưu ý thêm: Hãy cùng xem lời khuyên của cô giáo nhé!'}</span>
                    </div>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      {current.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
