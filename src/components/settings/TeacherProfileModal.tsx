import React, { useState, useEffect } from 'react';
import {
  X,
  UserCheck,
  Check,
  Sparkles,
  School,
  Phone,
  Mail,
  GraduationCap,
  Image as ImageIcon
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TeacherProfileModal: React.FC = () => {
  const {
    teacherProfile,
    updateTeacherProfile,
    isTeacherModalOpen,
    setTeacherModalOpen,
    triggerCelebration,
    classes,
    activeClass
  } = useApp();

  const [name, setName] = useState(teacherProfile?.fullName || teacherProfile?.name || 'Giáo viên');
  const [title, setTitle] = useState(teacherProfile?.title || 'Giáo viên Chủ nhiệm');
  const [school, setSchool] = useState(teacherProfile?.school || 'Trường Tiểu học Hoài Nhơn');
  const [slogan, setSlogan] = useState(teacherProfile?.slogan || 'Smart Classroom – Happy Students – Bilingual Future');
  const [phone, setPhone] = useState(teacherProfile?.phone || '0912 345 678');
  const [email, setEmail] = useState(teacherProfile?.email || 'dothihoa@giaoduc.edu.vn');
  const [avatar, setAvatar] = useState(teacherProfile?.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=256');

  // Synchronize local modal state with teacherProfile whenever modal is opened
  useEffect(() => {
    if (isTeacherModalOpen && teacherProfile) {
      setName(teacherProfile.fullName || teacherProfile.name || 'Giáo viên');
      setTitle(teacherProfile.title || 'Giáo viên Chủ nhiệm');
      setSchool(teacherProfile.school || 'Trường Tiểu học Hoài Nhơn');
      setSlogan(teacherProfile.slogan || 'Smart Classroom – Happy Students – Bilingual Future');
      setPhone(teacherProfile.phone || '0912 345 678');
      setEmail(teacherProfile.email || 'dothihoa@giaoduc.edu.vn');
      setAvatar(teacherProfile.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=256');
    }
  }, [isTeacherModalOpen, teacherProfile]);

  if (!isTeacherModalOpen) return null;

  const AVATAR_PRESETS = [
    { label: 'Cô giáo 1', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=256' },
    { label: 'Cô giáo 2', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256' },
    { label: 'Cô giáo 3', url: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&q=80&w=256' },
    { label: 'Thầy giáo 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256' },
    { label: 'Thầy giáo 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256' },
    { label: 'Thầy giáo 3', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    updateTeacherProfile({
      name: name.trim(),
      fullName: name.trim(),
      title: title.trim(),
      school: school.trim(),
      slogan: slogan.trim(),
      phone: phone.trim(),
      email: email.trim(),
      avatar
    });

    triggerCelebration();
    setTeacherModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-700 to-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">Hồ sơ Giáo viên & Thiết lập</h3>
              <p className="text-xs text-purple-100">
                Thay đổi tên giáo viên, chức danh, trường học và hình ảnh đại diện
              </p>
            </div>
          </div>
          <button
            onClick={() => setTeacherModalOpen(false)}
            className="p-1.5 rounded-xl hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {/* Avatar Preview & Selection */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-purple-50/70 border border-purple-100">
            <img
              src={avatar}
              alt="Avatar preview"
              className="w-18 h-18 rounded-2xl object-cover border-2 border-purple-500 shadow-sm shrink-0"
            />
            <div className="space-y-2 flex-1">
              <label className="block text-xs font-bold text-slate-700">
                Ảnh đại diện giáo viên (Chọn mẫu hoặc dán link ảnh):
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {AVATAR_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatar(p.url)}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                      avatar === p.url ? 'border-purple-600 ring-2 ring-purple-400 scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={p.url} alt={p.label} className="w-9 h-9 object-cover" />
                  </button>
                ))}
              </div>
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-600 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tên giáo viên */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Họ và tên giáo viên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Họ và tên giáo viên..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500 text-sm font-semibold text-slate-900"
              />
              {/* Gợi ý chọn nhanh giáo viên */}
              <div className="mt-1.5 flex flex-wrap gap-1 items-center">
                <span className="text-[10px] text-slate-500 font-medium">Chọn nhanh:</span>
                {Array.from(new Set(classes.map(c => c.teacherName).filter(Boolean))).map((tName) => (
                  <button
                    key={tName}
                    type="button"
                    onClick={() => setName(tName)}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border transition-all ${
                      name === tName
                        ? 'bg-purple-100 border-purple-400 text-purple-800 ring-1 ring-purple-300'
                        : 'bg-slate-50 hover:bg-purple-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    {tName}
                  </button>
                ))}
              </div>
            </div>

            {/* Chức danh */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Chức danh / Chức vụ
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Giáo viên Chủ nhiệm..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500 text-sm text-slate-900"
              />
            </div>

            {/* Số điện thoại */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Số điện thoại liên hệ
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0912 345 678"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500 text-sm text-slate-900"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Địa chỉ Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="giao-vien@edu.vn"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500 text-sm text-slate-900"
              />
            </div>
          </div>

          {/* Trường học */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Trường học đang công tác
            </label>
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="Trường Tiểu học..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500 text-sm text-slate-900"
            />
          </div>

          {/* Châm ngôn sư phạm / Slogan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Châm ngôn lớp học / Slogan
            </label>
            <input
              type="text"
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
              placeholder="Smart Classroom – Happy Students..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500 text-sm text-slate-900"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setTeacherModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Lưu thông tin giáo viên</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
