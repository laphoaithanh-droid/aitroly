import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  User,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ChangePasswordModal: React.FC = () => {
  const {
    isChangePasswordOpen,
    setChangePasswordOpen,
    activeClass,
    changeTeacherPassword,
    teacherProfile,
    targetStudentForPasswordChange,
    setTargetStudentForPasswordChange,
    authSession,
    changeStudentPassword
  } = useApp();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Determine mode
  const isTargetingStudent = Boolean(targetStudentForPasswordChange);
  const isStudentSelf = authSession?.role === 'student' && !isTargetingStudent;
  const isTeacherSelf = !isTargetingStudent && !isStudentSelf;

  useEffect(() => {
    if (isChangePasswordOpen) {
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [isChangePasswordOpen, targetStudentForPasswordChange]);

  if (!isChangePasswordOpen) return null;

  const handleClose = () => {
    setChangePasswordOpen(false);
    setTargetStudentForPasswordChange(null);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleQuickResetDefault = () => {
    if (!targetStudentForPasswordChange) return;
    setIsLoading(true);
    setTimeout(() => {
      const res = changeStudentPassword(targetStudentForPasswordChange.id, '123456', undefined, true);
      setIsLoading(false);
      if (res.success) {
        setSuccessMessage('Đã khôi phục mật khẩu mặc định: 123456 thành công!');
        setTimeout(() => {
          handleClose();
        }, 1200);
      } else {
        setErrorMessage(res.message);
      }
    }, 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (newPassword !== confirmPassword) {
      setErrorMessage('Mật khẩu mới và xác nhận mật khẩu không trùng khớp!');
      return;
    }

    if (newPassword.length < 4) {
      setErrorMessage('Mật khẩu mới phải có ít nhất 4 ký tự!');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      let res: { success: boolean; message: string };

      if (isTargetingStudent && targetStudentForPasswordChange) {
        // Teacher changing/resetting student password (no old pass required)
        res = changeStudentPassword(targetStudentForPasswordChange.id, newPassword, undefined, true);
      } else if (isStudentSelf && authSession) {
        // Student self-changing password (old pass verified)
        const targetId = authSession.studentId || authSession.username;
        res = changeStudentPassword(targetId, newPassword, oldPassword, false);
      } else {
        // Teacher self-changing password
        res = changeTeacherPassword(activeClass.id, oldPassword, newPassword);
      }

      setIsLoading(false);

      if (res.success) {
        setSuccessMessage(res.message);
        setTimeout(() => {
          handleClose();
        }, 1200);
      } else {
        setErrorMessage(res.message);
      }
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col">
        {/* Header Ribbon */}
        <div className={`p-5 text-white relative ${
          isTargetingStudent
            ? 'bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900'
            : isStudentSelf
            ? 'bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900'
            : 'bg-gradient-to-r from-purple-800 via-indigo-700 to-purple-900'
        }`}>
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-amber-200 text-[11px] font-bold border border-white/20">
              <Sparkles className="w-3 h-3 text-amber-300" />
              {isTargetingStudent
                ? 'ĐỔI MẬT KHẨU HỌC SINH'
                : isStudentSelf
                ? 'HỌC SINH TỰ ĐỔI MẬT KHẨU'
                : 'TÀI KHOẢN GIÁO VIÊN'}
            </span>
            <span className="text-white/60 text-xs">|</span>
            <span className="text-white/90 text-xs font-semibold">
              Lớp {activeClass.name}
            </span>
          </div>

          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <span>
              {isTargetingStudent
                ? `Cấp/Đổi mật khẩu: ${targetStudentForPasswordChange?.fullName}`
                : isStudentSelf
                ? 'Đổi mật khẩu đăng nhập'
                : 'Đổi Mật Khẩu Giáo Viên'}
            </span>
          </h2>

          <p className="text-xs text-white/80 mt-1">
            {isTargetingStudent ? (
              <>
                Tài khoản HS: <code className="bg-white/10 px-1.5 py-0.5 rounded font-mono font-bold text-amber-300">{targetStudentForPasswordChange?.username || targetStudentForPasswordChange?.studentCode}</code>
                {' '}(Mã: {targetStudentForPasswordChange?.studentCode})
              </>
            ) : isStudentSelf ? (
              <>
                Học sinh: <strong className="text-amber-300">{authSession?.fullName}</strong> (Tài khoản: {authSession?.username})
              </>
            ) : (
              <>
                Tài khoản: <code className="bg-white/10 px-1.5 py-0.5 rounded font-mono font-bold text-amber-300">thhn_{activeClass.name.toLowerCase()}</code> ({teacherProfile.name})
              </>
            )}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {isTargetingStudent ? (
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <p>Giáo viên có quyền đặt mật khẩu mới cho học sinh hoặc khôi phục về mặc định <strong className="font-mono text-emerald-800">123456</strong>.</p>
                  <p className="mt-1 text-slate-500">Mật khẩu hiện tại của em: <strong className="font-mono text-slate-800 bg-white px-1.5 py-0.5 rounded border border-slate-200">{targetStudentForPasswordChange?.password || '123456'}</strong></p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleQuickResetDefault}
                className="shrink-0 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 shadow-sm transition-colors"
                title="Đặt nhanh về mật khẩu mặc định 123456"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Về 123456
              </button>
            </div>
          ) : isStudentSelf ? (
            <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 text-xs text-blue-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Để bảo vệ thông tin học tập, em vui lòng nhập mật khẩu hiện tại và mật khẩu mới (tối thiểu 4 ký tự).
              </p>
            </div>
          ) : (
            <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Mật khẩu mặc định ban đầu là <strong className="font-mono text-purple-800">Thhn_12@</strong>. Thầy/cô có thể đổi mật khẩu mới để tăng cường bảo mật cho lớp học.
              </p>
            </div>
          )}

          {/* Current Password - Only required for self-changing */}
          {!isTargetingStudent && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mật khẩu hiện tại
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showOldPassword ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder={isStudentSelf ? 'Nhập mật khẩu hiện tại (mặc định 123456)' : 'Nhập mật khẩu hiện tại (mặc định Thhn_12@)'}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* New Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mật khẩu mới
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={isTargetingStudent ? 'Nhập mật khẩu mới cho học sinh (VD: 654321)' : 'Nhập mật khẩu mới'}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Xác nhận mật khẩu mới
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <div>{errorMessage}</div>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <div className="font-semibold">{successMessage}</div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 ${
                isTargetingStudent
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
                  : isStudentSelf
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'
                  : 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/30'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>{isLoading ? 'Đang lưu...' : 'Lưu Mật Khẩu'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
