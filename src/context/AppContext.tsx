import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Student,
  Assignment,
  PositiveBadge,
  LearningMaterial,
  EducationalGame,
  ParentNotification,
  ParentFeedback,
  UserProfile,
  UserRole,
  ClassRoom,
  TeacherProfile,
  CustomSubject,
  GenericLesson,
  AuthSession,
  AbilityTier,
  StudentGrowthReport,
  AssignmentQuestion,
  AssignmentSubmission
} from '../types';
import {
  INITIAL_TEACHER,
  INITIAL_STUDENTS,
  INITIAL_ASSIGNMENTS,
  POSITIVE_BADGES,
  DIGITAL_MATERIALS,
  EDUCATIONAL_GAMES,
  PARENT_NOTIFICATIONS,
  PARENT_FEEDBACKS
} from '../data/initialData';
import {
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  INITIAL_GENERIC_LESSONS
} from '../data/classAndSubjectData';
import { databaseService, DatabaseConfig, ClassroomSyncPayload } from '../services/databaseService';

export type NavView =
  | 'dashboard'
  | 'competition'
  | 'students'
  | 'classroom'
  | 'assignments'
  | 'english'
  | 'math'
  | 'vietnamese'
  | 'informatics'
  | 'games'
  | 'aibuddy'
  | 'assistant'
  | 'materials'
  | 'parents'
  | 'reports'
  | 'subject-world';

interface AppContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  switchRole: (role: UserRole, studentId?: string) => void;
  activeView: NavView;
  setActiveView: (view: NavView) => void;
  teacherInfo: TeacherProfile;
  students: Student[];
  assignments: Assignment[];
  badges: PositiveBadge[];
  materials: LearningMaterial[];
  notifications: ParentNotification[];
  feedbacks: ParentFeedback[];
  aiLiveStatus: { hasKey: boolean; model: string; mode: string };

  // Multi-Class Management
  classes: ClassRoom[];
  activeClassId: string;
  activeClass: ClassRoom;
  setActiveClassId: (id: string) => void;
  addClass: (newClass: Omit<ClassRoom, 'id'>) => void;
  updateClass: (id: string, updates: Partial<ClassRoom>) => void;
  deleteClass: (id: string) => void;
  isClassModalOpen: boolean;
  setClassModalOpen: (open: boolean) => void;

  // Teacher Profile
  teacherProfile: TeacherProfile;
  updateTeacherProfile: (updates: Partial<TeacherProfile>) => void;
  isTeacherModalOpen: boolean;
  setTeacherModalOpen: (open: boolean) => void;

  // Teacher & Class SSOT Reactive Getters & Setters
  teacherName: string;
  className: string;
  setTeacherName: (name: string) => void;
  setClassName: (name: string) => void;

  // Dynamic Subjects & Lessons
  subjects: CustomSubject[];
  activeSubjectId: string;
  setActiveSubjectId: (id: string) => void;
  addSubject: (newSubject: Omit<CustomSubject, 'id'>) => void;
  updateSubject: (id: string, updates: Partial<CustomSubject>) => void;
  deleteSubject: (id: string) => void;
  isSubjectModalOpen: boolean;
  setSubjectModalOpen: (open: boolean) => void;

  genericLessons: GenericLesson[];
  addGenericLesson: (lesson: GenericLesson) => void;
  updateGenericLesson: (id: string, updates: Partial<GenericLesson>) => void;
  deleteGenericLesson: (id: string) => void;
  isLessonEditorOpen: boolean;
  setLessonEditorOpen: (open: boolean) => void;
  editingLesson: GenericLesson | null;
  setEditingLesson: (lesson: GenericLesson | null) => void;

  selectedGrade: number;
  setSelectedGrade: (grade: number) => void;

  // Student actions
  addStudent: (student: Omit<Student, 'id' | 'stt' | 'studentCode'>) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  changeStudentStt: (studentId: string, newStt: number) => void;
  bulkImportStudents: (imported: Partial<Student>[]) => void;
  autoGenerateStudentAccounts: (classId?: string) => { generatedCount: number; message: string };
  changeStudentPassword: (studentId: string, newPassword: string, oldPassword?: string, bypassOld?: boolean) => { success: boolean; message: string };
  targetStudentForPasswordChange: Student | null;
  setTargetStudentForPasswordChange: (student: Student | null) => void;
  updateStudentAbilityTier: (studentId: string, tier: AbilityTier) => void;

  // Classroom actions
  markAttendance: (studentId: string, status: Student['attendanceStatus'], note?: string) => void;
  markAllPresent: () => void;
  awardBadge: (studentId: string, badgeId: string) => void;
  updateSeat: (studentId: string, seatGroup: number, seatIndex: number) => void;
  swapSeats: (studentId1: string, studentId2: string) => void;

  // Assignment & Differentiated Progress Evaluation actions
  createAssignment: (assignment: Omit<Assignment, 'id' | 'submissionsCount' | 'createdAt'>) => void;
  submitAssignmentDemo: (assignmentId: string, studentId: string) => void;
  deleteAssignment: (id: string) => void;
  autoAssignDifferentiatedTasks: (
    subject: string,
    topic: string,
    deadline?: string
  ) => { success: boolean; createdAssignments: Assignment[]; message: string };
  submitAssignmentWithEvaluation: (
    assignmentId: string,
    studentId: string,
    answers?: Record<string, string>,
    score?: number,
    teacherFeedback?: string
  ) => { success: boolean; message: string };
  generateStudentProgressReport: (studentId: string) => StudentGrowthReport;

  // Material actions
  addMaterial: (material: Omit<LearningMaterial, 'id' | 'uploadedAt'>) => void;
  updateMaterial: (id: string, updates: Partial<LearningMaterial>) => void;
  deleteMaterial: (id: string) => void;
  bulkImportMaterials: (importedMaterials: (Omit<LearningMaterial, 'id' | 'uploadedAt'> & { id?: string; uploadedAt?: string })[]) => void;
  createAssignmentFromMaterial: (material: LearningMaterial, deadline?: string, criteria?: string) => Assignment;

  // Games
  games: EducationalGame[];
  setGames: React.Dispatch<React.SetStateAction<EducationalGame[]>>;
  addGame: (game: EducationalGame) => void;
  deleteGame: (id: string) => void;

  // Parent communication
  addNotification: (title: string, content: string, isImportant?: boolean) => void;
  addFeedback: (studentId: string, message: string) => void;
  replyFeedback: (id: string, replyText: string) => void;

  // Celebration
  triggerCelebration: () => void;

  // Online Database & Cloud Sync
  dbConfig: DatabaseConfig;
  isDbModalOpen: boolean;
  setDbModalOpen: (open: boolean) => void;
  isApiKeyModalOpen: boolean;
  setApiKeyModalOpen: (open: boolean) => void;
  isSyncing: boolean;
  syncStatusMessage: string;
  updateDbConfig: (newConfig: Partial<DatabaseConfig>) => void;
  syncToCloud: () => Promise<{ success: boolean; message: string }>;
  syncFromCloud: () => Promise<{ success: boolean; message: string }>;
  syncFromGoogleSheet: (overrideUrl?: string) => Promise<{ success: boolean; message: string; count?: number }>;
  testDbConnection: (config?: DatabaseConfig) => Promise<{ success: boolean; latencyMs: number; message: string }>;
  resetToInitialData: () => void;
  importDatabase: (payload: ClassroomSyncPayload) => void;
  exportDatabaseBackup: () => void;

  // Cloud Database & Multi-Device Real-Time Sync
  isCloudLoading: boolean;
  cloudSyncState: 'synced' | 'syncing' | 'offline' | 'saved';
  cloudRevision: number;
  lastCloudSyncTime: string;
  forceCloudPull: () => Promise<{ success: boolean; message: string }>;
  forceCloudPush: () => Promise<{ success: boolean; message: string }>;

  // Save & Backup features
  manualSave: () => Promise<{ success: boolean; message: string; timestamp: string }>;
  lastSavedAt: string | null;
  isSaving: boolean;
  isSaveModalOpen: boolean;
  setSaveModalOpen: (open: boolean) => void;
  saveToastMessage: string | null;
  setSaveToastMessage: (msg: string | null) => void;
  exportFullBackup: () => void;
  importFullBackup: (file: File) => Promise<{ success: boolean; message: string }>;

  // Authentication & Credentials
  authSession: AuthSession | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => { success: boolean; message: string; role?: 'teacher' | 'student' };
  logout: () => void;
  changeTeacherPassword: (classIdOrName: string, oldPass: string, newPass: string) => { success: boolean; message: string };
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  isChangePasswordOpen: boolean;
  setChangePasswordOpen: (open: boolean) => void;
  getTeacherPassword: (classIdOrName: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CLASSES: 'aiclass_classes_v2',
  ACTIVE_CLASS_ID: 'aiclass_active_class_id_v2',
  TEACHER_PROFILE: 'aiclass_teacher_profile_v2',
  SUBJECTS: 'aiclass_subjects_v2',
  GENERIC_LESSONS: 'aiclass_generic_lessons_v2',
  STUDENTS: 'aiclass_students_v1',
  ASSIGNMENTS: 'aiclass_assignments_v1',
  NOTIFICATIONS: 'aiclass_notifications_v1',
  FEEDBACKS: 'aiclass_feedbacks_v1',
  MATERIALS: 'aiclass_materials_v1',
  GAMES: 'aiclass_games_v1',
  AUTH_SESSION: 'aiclass_auth_session_v2',
  TEACHER_PASSWORDS: 'aiclass_teacher_passwords_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Teacher Profile State (Họ và tên giáo viên, chức danh, trường, ảnh đại diện)
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEACHER_PROFILE);
      if (saved) {
        const parsed: TeacherProfile = JSON.parse(saved);
        return {
          ...parsed,
          school: 'Trường Tiểu học Hoài Nhơn'
        };
      }
    } catch {}
    return { id: 'teacher-1', ...INITIAL_TEACHER, school: 'Trường Tiểu học Hoài Nhơn' };
  });

  const [isTeacherModalOpen, setTeacherModalOpen] = useState(false);

  // 2. Multi-Class State (Quản lý nhiều lớp, chuyển đổi lớp - Chuẩn hóa trường Tiểu học Hoài Nhơn)
  const [classes, setClasses] = useState<ClassRoom[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLASSES);
      if (saved) {
        const parsed: ClassRoom[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(c => ({
            ...c,
            schoolName: 'Trường Tiểu học Hoài Nhơn'
          }));
        }
      }
    } catch {}
    return INITIAL_CLASSES.map(c => ({
      ...c,
      schoolName: 'Trường Tiểu học Hoài Nhơn'
    }));
  });

  const [activeClassId, setActiveClassIdState] = useState<string>(() => {
    try {
      const savedClassId = localStorage.getItem(STORAGE_KEYS.ACTIVE_CLASS_ID);
      if (savedClassId) return savedClassId;
      const savedSession = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed.classId) return parsed.classId;
      }
    } catch {}
    return INITIAL_CLASSES[0]?.id || 'c-3c1';
  });

  const [isClassModalOpen, setClassModalOpen] = useState(false);

  // Active class instance
  const activeClass = classes.find(c => c.id === activeClassId) || classes[0] || INITIAL_CLASSES[0];

  // 3. Dynamic Subjects & Lessons
  const [subjects, setSubjects] = useState<CustomSubject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_SUBJECTS;
  });

  const [activeSubjectId, setActiveSubjectId] = useState<string>('science');
  const [isSubjectModalOpen, setSubjectModalOpen] = useState(false);

  const [genericLessons, setGenericLessons] = useState<GenericLesson[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GENERIC_LESSONS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_GENERIC_LESSONS;
  });

  const [isLessonEditorOpen, setLessonEditorOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<GenericLesson | null>(null);

  // Active Grade Level (Khối 1, 2, 3, 4, 5)
  const [selectedGrade, setSelectedGrade] = useState<number>(() => activeClass?.grade || 3);

  // Current User (Session restored from authSession if present)
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const savedSessionStr = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
      if (savedSessionStr) {
        const sess: AuthSession = JSON.parse(savedSessionStr);
        if (sess.role === 'student' && sess.studentId) {
          return {
            id: sess.studentId,
            name: sess.fullName,
            role: 'student',
            studentId: sess.studentId,
            avatar: sess.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256',
            className: sess.className || activeClass?.name || '3C1',
            schoolName: 'Trường Tiểu học Hoài Nhơn'
          };
        }
        if (sess.role === 'teacher') {
          return {
            id: 'teacher-1',
            name: sess.fullName || teacherProfile.name,
            role: 'teacher',
            avatar: sess.avatar || teacherProfile.avatar,
            className: sess.className || activeClass?.name || '3C1',
            schoolName: 'Trường Tiểu học Hoài Nhơn'
          };
        }
      }
    } catch {}

    return {
      id: teacherProfile.id,
      name: teacherProfile.name,
      role: 'teacher',
      avatar: teacherProfile.avatar,
      className: activeClass?.name || '3C1',
      schoolName: 'Trường Tiểu học Hoài Nhơn'
    };
  });

  const [activeView, setActiveView] = useState<NavView>('dashboard');
  const [badges] = useState<PositiveBadge[]>(POSITIVE_BADGES);

  // 4. Educational Games (Hệ thống trò chơi học tập tự lưu)
  const [games, setGames] = useState<EducationalGame[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GAMES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return EDUCATIONAL_GAMES;
  });

  // 5. Students list for currently active class
  const [students, setStudents] = useState<Student[]>(() => {
    if (activeClass?.students && Array.isArray(activeClass.students) && activeClass.students.length > 0) {
      return activeClass.students;
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_STUDENTS;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
      return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
    } catch {
      return INITIAL_ASSIGNMENTS;
    }
  });

  const [materials, setMaterials] = useState<LearningMaterial[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MATERIALS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((p: any) => p.id));
          const missingDefaults = DIGITAL_MATERIALS.filter(m => !existingIds.has(m.id));
          const enriched = parsed.map((item: any) => {
            const def = DIGITAL_MATERIALS.find(d => d.id === item.id);
            if (def && (!item.content || !item.sampleQuestions)) {
              return { ...def, ...item, content: item.content || def.content, sampleQuestions: item.sampleQuestions || def.sampleQuestions };
            }
            return item;
          });
          return [...enriched, ...missingDefaults];
        }
      }
    } catch {}
    return DIGITAL_MATERIALS;
  });

  const [notifications, setNotifications] = useState<ParentNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : PARENT_NOTIFICATIONS;
    } catch {
      return PARENT_NOTIFICATIONS;
    }
  });

  const [feedbacks, setFeedbacks] = useState<ParentFeedback[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FEEDBACKS);
      return saved ? JSON.parse(saved) : PARENT_FEEDBACKS;
    } catch {
      return PARENT_FEEDBACKS;
    }
  });

  const [aiLiveStatus, setAiLiveStatus] = useState({
    hasKey: false,
    model: 'gemini-2.5-flash',
    mode: 'pedagogical_demo'
  });

  // Online Database & Cloud Sync States
  const [dbConfig, setDbConfig] = useState<DatabaseConfig>(() => databaseService.getConfig());
  const [isDbModalOpen, setDbModalOpen] = useState(false);
  const [isApiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMessage, setSyncStatusMessage] = useState('');

  // Cross-device Cloud Database Real-time Sync States
  const [isCloudLoading, setIsCloudLoading] = useState(true);
  const [cloudSyncState, setCloudSyncState] = useState<'synced' | 'syncing' | 'offline' | 'saved'>('synced');
  const [cloudRevision, setCloudRevision] = useState<number>(1);
  const [lastCloudSyncTime, setLastCloudSyncTime] = useState<string>('');

  const isInitialHydratedRef = React.useRef(false);
  const isRemotePullingRef = React.useRef(false);
  const localRevisionRef = React.useRef(1);
  const autoSyncTimerRef = React.useRef<any>(null);

  // Save & Backup States
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(() => {
    try {
      return localStorage.getItem('aiclass_last_saved_at') || null;
    } catch {
      return null;
    }
  });
  const [isSaveModalOpen, setSaveModalOpen] = useState(false);
  const [saveToastMessage, setSaveToastMessage] = useState<string | null>(null);

  // Auto-dismiss save toast
  useEffect(() => {
    if (!saveToastMessage) return;
    const timer = setTimeout(() => {
      setSaveToastMessage(null);
    }, 3800);
    return () => clearTimeout(timer);
  }, [saveToastMessage]);

  // 5. Authentication & Credentials State
  const [teacherPasswords, setTeacherPasswords] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEACHER_PASSWORDS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [authSession, setAuthSession] = useState<AuthSession | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      username: 'thhn_3c1',
      role: 'teacher',
      className: '3C1',
      fullName: 'Đỗ Thị Hoà',
      loggedInAt: new Date().toISOString()
    };
  });

  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isChangePasswordOpen, setChangePasswordOpen] = useState(false);
  const [targetStudentForPasswordChange, setTargetStudentForPasswordChange] = useState<Student | null>(null);

  // Save persistent data
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
    } catch (e) {
      console.warn('LocalStorage classes error:', e);
    }
  }, [classes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_CLASS_ID, activeClassId);
    } catch (e) {
      console.warn('LocalStorage activeClassId error:', e);
    }
  }, [activeClassId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TEACHER_PROFILE, JSON.stringify(teacherProfile));
    } catch (e) {
      console.warn('LocalStorage teacherProfile error:', e);
    }
  }, [teacherProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
    } catch (e) {
      console.warn('LocalStorage subjects error:', e);
    }
  }, [subjects]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GENERIC_LESSONS, JSON.stringify(genericLessons));
    } catch (e) {
      console.warn('LocalStorage genericLessons error:', e);
    }
  }, [genericLessons]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    } catch (e) {
      console.warn('LocalStorage students error:', e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
    } catch (e) {
      console.warn('LocalStorage assignments error:', e);
    }
  }, [assignments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.warn('LocalStorage notifications error:', e);
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(feedbacks));
    } catch (e) {
      console.warn('LocalStorage feedbacks error:', e);
    }
  }, [feedbacks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(materials));
    } catch (e) {
      console.warn('LocalStorage materials error:', e);
    }
  }, [materials]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(games));
    } catch (e) {
      console.warn('LocalStorage games error:', e);
    }
  }, [games]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TEACHER_PASSWORDS, JSON.stringify(teacherPasswords));
    } catch (e) {
      console.warn('LocalStorage teacherPasswords error:', e);
    }
  }, [teacherPasswords]);

  useEffect(() => {
    try {
      if (authSession) {
        localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(authSession));
      }
    } catch (e) {
      console.warn('LocalStorage authSession error:', e);
    }
  }, [authSession]);

  // Keep active class student list in sync when students change
  useEffect(() => {
    setClasses(prev => prev.map(c => (c.id === activeClassId ? { ...c, students } : c)));
  }, [students, activeClassId]);

  // Auto-Save Immediately on App Exit, Window Unload or Backgrounding
  const saveAllAppState = () => {
    try {
      localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_CLASS_ID, activeClassId);
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
      localStorage.setItem(STORAGE_KEYS.TEACHER_PROFILE, JSON.stringify(teacherProfile));
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
      localStorage.setItem(STORAGE_KEYS.GENERIC_LESSONS, JSON.stringify(genericLessons));
      localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
      localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(materials));
      localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(games));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
      localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(feedbacks));
      if (authSession) {
        localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(authSession));
      }
      localStorage.setItem(STORAGE_KEYS.TEACHER_PASSWORDS, JSON.stringify(teacherPasswords));

      // Attempt background beacon sync to server if running with express
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        const payload = {
          classId: activeClass.name,
          className: `Lớp ${activeClass.name} - ${teacherProfile.school}`,
          version: '1.0',
          lastUpdated: new Date().toISOString(),
          students,
          assignments,
          notifications,
          feedbacks,
          materials,
          classes,
          subjects,
          genericLessons,
          games
        };
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        navigator.sendBeacon('/api/db/sync', blob);
      }
    } catch (err) {
      console.warn('[AutoSave] Error saving state:', err);
    }
  };

  useEffect(() => {
    const handleExit = () => {
      saveAllAppState();
    };

    window.addEventListener('beforeunload', handleExit);
    window.addEventListener('pagehide', handleExit);
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        saveAllAppState();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('beforeunload', handleExit);
      window.removeEventListener('pagehide', handleExit);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [
    classes,
    activeClassId,
    students,
    teacherProfile,
    subjects,
    genericLessons,
    assignments,
    materials,
    games,
    notifications,
    feedbacks,
    authSession,
    teacherPasswords
  ]);

  // Manual Save Triggered by User (Button or Ctrl+S)
  const manualSave = async (): Promise<{ success: boolean; message: string; timestamp: string }> => {
    setIsSaving(true);
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    try {
      saveAllAppState();
      localStorage.setItem('aiclass_last_saved_at', timeFormatted);
      setLastSavedAt(timeFormatted);

      // Async push to server file if reachable
      try {
        const payload = {
          classId: activeClass.name,
          className: `Lớp ${activeClass.name} - ${teacherProfile.school}`,
          version: '2.0',
          lastUpdated: new Date().toISOString(),
          activeClassId,
          classes,
          students,
          assignments,
          notifications,
          feedbacks,
          materials,
          subjects,
          genericLessons,
          games
        };
        await fetch('/api/db/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch(() => {});
      } catch {}

      setIsSaving(false);
      setSaveToastMessage(`Đã lưu toàn bộ dữ liệu ứng dụng thành công! (${timeFormatted})`);
      triggerCelebration();

      return {
        success: true,
        message: `Đã lưu toàn bộ dữ liệu thành công lúc ${timeFormatted}!`,
        timestamp: timeFormatted
      };
    } catch (err: any) {
      setIsSaving(false);
      const errMsg = `Lỗi lưu dữ liệu: ${err?.message || 'Không xác định'}`;
      setSaveToastMessage(errMsg);
      return {
        success: false,
        message: errMsg,
        timestamp: timeFormatted
      };
    }
  };

  // Keyboard shortcut Ctrl + S / Cmd + S to save anywhere
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        manualSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    classes,
    activeClassId,
    students,
    teacherProfile,
    subjects,
    genericLessons,
    assignments,
    materials,
    games,
    notifications,
    feedbacks,
    authSession,
    teacherPasswords
  ]);

  // Check online database connection on startup
  useEffect(() => {
    databaseService.testConnection(dbConfig).then(res => {
      if (res.success) {
        setDbConfig(prev => {
          const updated = { ...prev, status: 'connected' as const, errorMessage: undefined };
          databaseService.saveConfig(updated);
          return updated;
        });
      } else {
        setDbConfig(prev => {
          const updated = { ...prev, status: 'disconnected' as const };
          databaseService.saveConfig(updated);
          return updated;
        });
      }
    }).catch(() => {
      setDbConfig(prev => ({ ...prev, status: 'disconnected' as const }));
    });
  }, []);

  // Check AI live status on mount
  useEffect(() => {
    fetch('/api/ai/status')
      .then((res) => res.json())
      .then((data) => {
        if (data) setAiLiveStatus(data);
      })
      .catch(() => {});
  }, []);

  // ==================== MULTI-CLASS SWITCHING & MUTATIONS ====================
  const setActiveClassId = (targetId: string) => {
    const target = classes.find(c => c.id === targetId);
    if (!target) return;

    setActiveClassIdState(targetId);
    setStudents(target.students || []);
    setSelectedGrade(target.grade);

    // Sync teacher profile with target class teacher
    const effectiveTeacher = target.teacherName || teacherProfile.name;
    const updatedTeacherProfile: TeacherProfile = {
      ...teacherProfile,
      name: effectiveTeacher,
      school: 'Trường Tiểu học Hoài Nhơn',
      className: target.name
    };
    setTeacherProfile(updatedTeacherProfile);

    // Update session user
    setCurrentUser(prev => ({
      ...prev,
      name: prev.role === 'teacher' ? effectiveTeacher : prev.name,
      className: target.name,
      schoolName: 'Trường Tiểu học Hoài Nhơn'
    }));

    // Update authSession if logged in
    setAuthSession(prev => {
      if (!prev) return null;
      const updated: AuthSession = {
        ...prev,
        className: target.name,
        classId: target.id,
        fullName: prev.role === 'teacher' ? effectiveTeacher : prev.fullName,
        username: prev.role === 'teacher' ? `thhn_${target.name.toLowerCase().replace(/[^a-z0-9]/g, '')}` : prev.username
      };
      try {
        localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Save activeClassId and teacherProfile immediately to localStorage for subsequent logins/sessions
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_CLASS_ID, targetId);
      localStorage.setItem(STORAGE_KEYS.TEACHER_PROFILE, JSON.stringify(updatedTeacherProfile));
    } catch {}

    // If target class has a googleSheetUrl, update dbConfig
    if (target.googleSheetUrl) {
      setDbConfig(prev => {
        const updated = { ...prev, googleSheetUrl: target.googleSheetUrl || '' };
        databaseService.saveConfig(updated);
        return updated;
      });
    }

    triggerCelebration();
  };

  const addClass = (newClassData: Omit<ClassRoom, 'id'>) => {
    const newId = `c-${Date.now()}`;
    const newClassRoom: ClassRoom = {
      ...newClassData,
      id: newId,
      schoolName: 'Trường Tiểu học Hoài Nhơn'
    };

    setClasses(prev => {
      const updated = [...prev, newClassRoom];
      try {
        localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setActiveClassId(newId);
  };

  const updateClass = (id: string, updates: Partial<ClassRoom>) => {
    setClasses(prev => {
      const updated = prev.map(c => (c.id === id ? { ...c, ...updates, schoolName: 'Trường Tiểu học Hoài Nhơn' } : c));
      try {
        localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    if (id === activeClassId) {
      if (updates.grade) setSelectedGrade(updates.grade);
      if (updates.name) {
        const newClassName = updates.name;
        // 1. Cascade to teacherProfile
        setTeacherProfile(prev => {
          const up = { ...prev, className: newClassName, school: 'Trường Tiểu học Hoài Nhơn' };
          try {
            localStorage.setItem(STORAGE_KEYS.TEACHER_PROFILE, JSON.stringify(up));
          } catch {}
          return up;
        });

        // 2. Cascade to currentUser
        setCurrentUser(prev => ({
          ...prev,
          className: newClassName,
          schoolName: 'Trường Tiểu học Hoài Nhơn'
        }));

        // 3. Cascade to authSession
        setAuthSession(prev => {
          if (!prev) return null;
          const up: AuthSession = {
            ...prev,
            className: newClassName,
            username: prev.role === 'teacher' ? `thhn_${newClassName.toLowerCase().replace(/[^a-z0-9]/g, '')}` : prev.username
          };
          try {
            localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(up));
          } catch {}
          return up;
        });

        // 4. Cascade to students list (Single Source of Truth across current active students)
        setStudents(prev => {
          const updated = prev.map(s => ({ ...s, className: newClassName }));
          try {
            localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updated));
          } catch {}
          return updated;
        });

        // Also update classes array students for this class
        setClasses(prev => {
          const updated = prev.map(c => {
            if (c.id === id) {
              return {
                ...c,
                ...updates,
                students: (c.students || []).map(s => ({ ...s, className: newClassName })),
                schoolName: 'Trường Tiểu học Hoài Nhơn'
              };
            }
            return c;
          });
          try {
            localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(updated));
          } catch {}
          return updated;
        });

        // 5. Cascade to notifications sender / content
        setNotifications(prev => {
          const updated = prev.map(n => {
            let sender = n.sender;
            if (sender && (sender.includes('Lớp ') || sender.includes('GVCN'))) {
              sender = sender.replace(/Lớp\s+[^\s)]+/, `Lớp ${newClassName}`);
            }
            return sender !== n.sender ? { ...n, sender } : n;
          });
          try {
            localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
          } catch {}
          return updated;
        });
      }

      if (updates.teacherName) {
        const newTeacherName = updates.teacherName;
        // 1. Cascade to teacherProfile
        setTeacherProfile(prev => {
          const up = { ...prev, name: newTeacherName, fullName: newTeacherName, school: 'Trường Tiểu học Hoài Nhơn' };
          try {
            localStorage.setItem(STORAGE_KEYS.TEACHER_PROFILE, JSON.stringify(up));
          } catch {}
          return up;
        });

        // 2. Cascade to currentUser
        setCurrentUser(prev => prev.role === 'teacher' ? { ...prev, name: newTeacherName } : prev);

        // 3. Cascade to authSession
        setAuthSession(prev => {
          if (!prev || prev.role !== 'teacher') return prev;
          const up: AuthSession = {
            ...prev,
            fullName: newTeacherName
          };
          try {
            localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(up));
          } catch {}
          return up;
        });

        // 4. Cascade to notifications sender
        setNotifications(prev => {
          const updated = prev.map(n => {
            let sender = n.sender;
            if (sender && sender.includes('GVCN')) {
              sender = `GVCN ${newTeacherName} (Lớp ${updates.name || activeClass?.name || '3C1'})`;
            }
            return sender !== n.sender ? { ...n, sender } : n;
          });
          try {
            localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
          } catch {}
          return updated;
        });

        // 5. Cascade to materials author
        setMaterials(prev => {
          const updated = prev.map(m => (m.author && m.author.includes('Cô') ? { ...m, author: `Cô ${newTeacherName} - TH Hoài Nhơn` } : m));
          try {
            localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(updated));
          } catch {}
          return updated;
        });
      }
    }
  };

  const deleteClass = (id: string) => {
    if (classes.length <= 1) {
      alert('Hệ thống cần duy trì ít nhất 1 lớp học.');
      return;
    }
    const remaining = classes.filter(c => c.id !== id);
    setClasses(remaining);
    try {
      localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(remaining));
    } catch {}
    if (id === activeClassId && remaining.length > 0) {
      setActiveClassId(remaining[0].id);
    }
  };

  // ==================== TEACHER PROFILE MUTATIONS ====================
  const updateTeacherProfile = (updates: Partial<TeacherProfile>) => {
    const newName = updates.name || updates.fullName;
    let updatedProfile: TeacherProfile;
    setTeacherProfile(prev => {
      updatedProfile = {
        ...prev,
        ...updates,
        name: newName || prev.name,
        fullName: newName || prev.fullName || prev.name,
        school: 'Trường Tiểu học Hoài Nhơn'
      };
      try {
        localStorage.setItem(STORAGE_KEYS.TEACHER_PROFILE, JSON.stringify(updatedProfile));
      } catch {}
      return updatedProfile;
    });

    // Also sync the teacher's name into the currently active class
    if (newName) {
      setClasses(prev => {
        const updatedClasses = prev.map(c =>
          c.id === activeClassId ? { ...c, teacherName: newName } : c
        );
        try {
          localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(updatedClasses));
        } catch {}
        return updatedClasses;
      });

      // Sync with currentUser when in teacher role
      setCurrentUser(prev => {
        if (prev.role === 'teacher') {
          return {
            ...prev,
            name: newName,
            avatar: updates.avatar || prev.avatar,
            schoolName: 'Trường Tiểu học Hoài Nhơn'
          };
        }
        return prev;
      });

      // Sync with authSession
      setAuthSession(prev => {
        if (!prev || prev.role !== 'teacher') return prev;
        const updated: AuthSession = {
          ...prev,
          fullName: newName,
          avatar: updates.avatar || prev.avatar
        };
        try {
          localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(updated));
        } catch {}
        return updated;
      });

      // Sync with notifications
      setNotifications(prev => {
        const updated = prev.map(n => {
          let sender = n.sender;
          if (sender && sender.includes('GVCN')) {
            sender = `GVCN ${newName} (Lớp ${activeClass?.name || '3C1'})`;
          }
          return sender !== n.sender ? { ...n, sender } : n;
        });
        try {
          localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
        } catch {}
        return updated;
      });

      // Sync with materials
      setMaterials(prev => {
        const updated = prev.map(m => (m.author && m.author.includes('Cô') ? { ...m, author: `Cô ${newName} - TH Hoài Nhơn` } : m));
        try {
          localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(updated));
        } catch {}
        return updated;
      });
    }
  };

  // ==================== DYNAMIC SUBJECTS & LESSONS ====================
  const addSubject = (newSubjectData: Omit<CustomSubject, 'id'>) => {
    const newId = `sub-${Date.now()}`;
    const createdSubject: CustomSubject = {
      ...newSubjectData,
      id: newId
    };
    setSubjects(prev => [...prev, createdSubject]);

    // Create an initial starter lesson for this new subject
    const starterLesson: GenericLesson = {
      id: `lesson-${newId}-${selectedGrade}-1`,
      subjectId: newId,
      grade: selectedGrade,
      chapter: 'Chủ đề 1',
      lessonNumber: 1,
      title: `Bài 1: Khám phá môn ${newSubjectData.name}`,
      subtitle: `Bài học mở đầu môn học ${newSubjectData.name} - Khối ${selectedGrade}`,
      summary: `Chào mừng các em đến với môn học ${newSubjectData.name}. Trong bài học này, chúng ta cùng làm quen với các khái niệm cơ bản và ý nghĩa của môn học trong đời sống.`,
      contentParagraphs: [
        `1. Giới thiệu môn học: ${newSubjectData.description || `Môn ${newSubjectData.name} giúp học sinh phát triển năng lực tư duy, sáng tạo và thực hành trong học tập.`}`,
        `2. Nhiệm vụ học tập: Học sinh cần chăm chỉ lắng nghe, tích cực tham gia thảo luận nhóm và vận dụng kiến thức đã học vào thực tiễn hàng ngày.`,
        `3. Đánh giá và rèn luyện: Hoàn thành bài tập trắc nghiệm và tham gia các hoạt động để nhận huy hiệu thi đua xuất sắc.`
      ],
      keyTerms: [
        { term: newSubjectData.name, explanation: 'Môn học mới trong chương trình giáo dục tiểu học.' },
        { term: 'Thực hành', explanation: 'Vận dụng kiến thức bài học vào đời sống xung quanh.' }
      ],
      practicalApplication: `Học sinh có thể quan sát và liên hệ các kiến thức của môn ${newSubjectData.name} ngay tại trường lớp và gia đình.`,
      audioText: `Chào các bạn nhỏ! Hôm nay chúng ta cùng bắt đầu bài học đầu tiên của môn ${newSubjectData.name}. Chúc các em có một buổi học vui vẻ và bổ ích!`,
      drills: [
        {
          id: `drill-${newId}-1`,
          question: `Môn học ${newSubjectData.name} có mã viết tắt là gì?`,
          options: [newSubjectData.code, 'TOÁN', 'TV', 'TA'],
          correctAnswer: newSubjectData.code,
          hint: `Hãy nhìn vào mã môn viết tắt của môn học ${newSubjectData.name}.`,
          explanation: `Mã viết tắt của môn ${newSubjectData.name} là ${newSubjectData.code}.`
        },
        {
          id: `drill-${newId}-2`,
          question: `Để học tốt môn ${newSubjectData.name}, em cần có thái độ học tập như thế nào?`,
          options: [
            'Chăm chú nghe giảng, chủ động phát biểu và hoàn thành bài tập',
            'Không tập trung và mất trật tự trong giờ học',
            'Chỉ học qua loa khi có kiểm tra',
            'Không ghi chép bài đầy đủ'
          ],
          correctAnswer: 'Chăm chú nghe giảng, chủ động phát biểu và hoàn thành bài tập',
          hint: 'Thái độ học tập tích cực giúp em tiếp thu kiến thức tốt nhất.',
          explanation: 'Chăm chỉ, tích cực và chủ động là bí quyết giúp em học giỏi toàn diện mọi môn học.'
        }
      ]
    };

    setGenericLessons(prev => [...prev, starterLesson]);
    setActiveSubjectId(newId);
  };

  const updateSubject = (id: string, updates: Partial<CustomSubject>) => {
    setSubjects(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteSubject = (id: string) => {
    const target = subjects.find(s => s.id === id);
    if (target?.isCore) {
      alert('Không thể xóa 4 môn học nòng cốt (Tiếng Anh, Toán, Tiếng Việt, Tin học).');
      return;
    }
    setSubjects(prev => prev.filter(s => s.id !== id));
    setGenericLessons(prev => prev.filter(l => l.subjectId !== id));
    if (activeSubjectId === id) {
      setActiveSubjectId('english');
    }
  };

  const addGenericLesson = (lesson: GenericLesson) => {
    setGenericLessons(prev => [...prev, lesson]);
  };

  const updateGenericLesson = (id: string, updates: Partial<GenericLesson>) => {
    setGenericLessons(prev => prev.map(l => (l.id === id ? { ...l, ...updates } : l)));
  };

  const deleteGenericLesson = (id: string) => {
    setGenericLessons(prev => prev.filter(l => l.id !== id));
  };

  // ==================== AUTHENTICATION & CREDENTIALS ====================
  const getTeacherPassword = (classIdOrName: string): string => {
    const key = (classIdOrName || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (teacherPasswords[key]) return teacherPasswords[key];
    if (teacherPasswords[classIdOrName]) return teacherPasswords[classIdOrName];
    const cl = classes.find(
      c => c.id === classIdOrName || c.name.toLowerCase().replace(/[^a-z0-9]/g, '') === key
    );
    if (cl?.teacherPassword) return cl.teacherPassword;
    return 'Thhn_12@';
  };

  const changeTeacherPassword = (
    classIdOrName: string,
    oldPass: string,
    newPass: string
  ): { success: boolean; message: string } => {
    const currentPass = getTeacherPassword(classIdOrName);
    if (oldPass !== currentPass) {
      return { success: false, message: 'Mật khẩu hiện tại không chính xác!' };
    }
    if (!newPass || newPass.trim().length < 6) {
      return { success: false, message: 'Mật khẩu mới phải có ít nhất 6 ký tự!' };
    }
    const key = (classIdOrName || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanNewPass = newPass.trim();
    const updated = {
      ...teacherPasswords,
      [key]: cleanNewPass,
      [classIdOrName]: cleanNewPass
    };
    setTeacherPasswords(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.TEACHER_PASSWORDS, JSON.stringify(updated));
    } catch {}

    setClasses(prev =>
      prev.map(c => {
        if (c.id === classIdOrName || c.name.toLowerCase().replace(/[^a-z0-9]/g, '') === key) {
          return { ...c, teacherPassword: cleanNewPass };
        }
        return c;
      })
    );

    triggerCelebration();
    return { success: true, message: 'Đổi mật khẩu giáo viên thành công!' };
  };

  const login = (
    usernameInput: string,
    passwordInput: string
  ): { success: boolean; message: string; role?: 'teacher' | 'student' } => {
    const cleanUser = (usernameInput || '').trim().toLowerCase();
    const cleanPass = (passwordInput || '').trim();

    if (!cleanUser || !cleanPass) {
      return { success: false, message: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.' };
    }

    // 1. Kiểm tra tài khoản Giáo viên (Định dạng: thhn_#malop#, ví dụ: thhn_3c1, thhn_3a2)
    if (cleanUser.startsWith('thhn_') || cleanUser === 'thhn' || cleanUser.startsWith('gv_')) {
      const classSuffix = cleanUser.replace('thhn_', '').replace('gv_', '').replace(/[^a-z0-9]/g, '');

      // Tìm lớp học tương ứng
      let targetClass = classes.find(
        c =>
          c.name.toLowerCase().replace(/[^a-z0-9]/g, '') === classSuffix ||
          c.id.toLowerCase().replace(/[^a-z0-9]/g, '') === classSuffix
      );

      if (!targetClass) {
        targetClass = activeClass || classes[0];
      }

      const expectedPassword = getTeacherPassword(targetClass ? targetClass.id : 'default');

      if (cleanPass === expectedPassword) {
        const teacherDisplayName = targetClass?.teacherName || teacherProfile.name;

        if (targetClass && targetClass.id !== activeClassId) {
          setActiveClassId(targetClass.id);
        } else {
          // Sync teacher and class information immediately
          const updatedProfile: TeacherProfile = {
            ...teacherProfile,
            name: teacherDisplayName,
            school: 'Trường Tiểu học Hoài Nhơn',
            className: targetClass ? targetClass.name : teacherProfile.className
          };
          setTeacherProfile(updatedProfile);

          setCurrentUser({
            id: 'teacher-1',
            name: teacherDisplayName,
            role: 'teacher',
            avatar: teacherProfile.avatar,
            className: targetClass ? targetClass.name : teacherProfile.className,
            schoolName: 'Trường Tiểu học Hoài Nhơn'
          });

          const newSession: AuthSession = {
            username: `thhn_${targetClass ? targetClass.name.toLowerCase().replace(/[^a-z0-9]/g, '') : '3c1'}`,
            role: 'teacher',
            className: targetClass ? targetClass.name : teacherProfile.className,
            classId: targetClass?.id,
            fullName: teacherDisplayName,
            avatar: teacherProfile.avatar,
            loggedInAt: new Date().toISOString()
          };

          setAuthSession(newSession);
          try {
            localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(newSession));
            localStorage.setItem(STORAGE_KEYS.ACTIVE_CLASS_ID, targetClass?.id || activeClassId);
            localStorage.setItem(STORAGE_KEYS.TEACHER_PROFILE, JSON.stringify(updatedProfile));
          } catch {}
        }

        triggerCelebration();
        return {
          success: true,
          message: `Đăng nhập thành công! Chào mừng ${teacherProfile.title} ${teacherDisplayName} (Lớp ${targetClass ? targetClass.name : '3C1'}).`,
          role: 'teacher'
        };
      } else {
        return {
          success: false,
          message: 'Mật khẩu giáo viên không chính xác. Mật khẩu mặc định là Thhn_12@ (hoặc mật khẩu mới nếu đã thay đổi).'
        };
      }
    }

    // 2. Kiểm tra tài khoản Học sinh (nạp từ Google Sheet)
    const otherClassStudents = classes
      .filter(c => c.id !== activeClassId)
      .flatMap(c => c.students || []);
    const candidateStudents = [...students, ...otherClassStudents];

    const foundStudent = candidateStudents.find(s => {
      const u = (s.username || '').toLowerCase().trim();
      const code = (s.studentCode || '').toLowerCase().trim();
      const sid = (s.id || '').toLowerCase().trim();
      const stdUsername = `hs${(s.className || '').toLowerCase().replace(/[^a-z0-9]/g, '')}${s.stt < 10 ? '0' + s.stt : s.stt}`;
      const stdUsernameUnder = `hs_${(s.className || '').toLowerCase().replace(/[^a-z0-9]/g, '')}_${s.stt}`;

      return (
        cleanUser === u ||
        cleanUser === code ||
        cleanUser === sid ||
        cleanUser === stdUsername ||
        cleanUser === stdUsernameUnder
      );
    });

    if (foundStudent) {
      const expectedStudentPass = (foundStudent.password || '').trim() || '123456';

      if (cleanPass === expectedStudentPass) {
        const studentClass = classes.find(c =>
          c.name.toLowerCase() === (foundStudent.className || '').toLowerCase() ||
          (c.students || []).some(st => st.id === foundStudent.id)
        );
        if (studentClass && studentClass.id !== activeClassId) {
          setActiveClassId(studentClass.id);
        }

        switchRole('student', foundStudent.id);

        const newSession: AuthSession = {
          username: foundStudent.username || foundStudent.studentCode.toLowerCase(),
          role: 'student',
          className: foundStudent.className,
          classId: studentClass?.id,
          fullName: foundStudent.fullName,
          studentId: foundStudent.id,
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${foundStudent.studentCode}`,
          loggedInAt: new Date().toISOString()
        };

        setAuthSession(newSession);
        try {
          localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(newSession));
        } catch {}

        triggerCelebration();
        return {
          success: true,
          message: `Đăng nhập thành công! Chào mừng em ${foundStudent.fullName} (Lớp ${foundStudent.className}).`,
          role: 'student'
        };
      } else {
        return {
          success: false,
          message: 'Mật khẩu học sinh không chính xác. Mật khẩu được nạp từ Google Sheet liên kết.'
        };
      }
    }

    return {
      success: false,
      message: 'Tên đăng nhập không tồn tại!\n• Giáo viên: thhn_#malop# (Ví dụ: thhn_3c1, thhn_3a2) - MK: Thhn_12@\n• Học sinh: Sử dụng tài khoản từ danh sách Google Sheet.'
    };
  };

  const logout = () => {
    setAuthSession(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    } catch {}
    setAuthModalOpen(true);
  };

  // ==================== DATABASE HELPERS ====================
  const updateDbConfig = (newConfig: Partial<DatabaseConfig>) => {
    setDbConfig(prev => {
      const updated = { ...prev, ...newConfig };
      databaseService.saveConfig(updated);
      return updated;
    });
  };

  const testDbConnection = async (customConfig?: DatabaseConfig) => {
    const target = customConfig || dbConfig;
    const res = await databaseService.testConnection(target);
    if (res.success) {
      updateDbConfig({ status: 'connected', errorMessage: undefined });
    } else {
      updateDbConfig({ status: 'error', errorMessage: res.message });
    }
    return res;
  };

  // ==================== CLOUD DATABASE CORE ENGINE ====================
  const applyCloudPayload = (payload: ClassroomSyncPayload) => {
    isRemotePullingRef.current = true;
    try {
      if (Array.isArray(payload.classes) && payload.classes.length > 0) {
        const enrichedClasses = payload.classes.map(c => ({
          ...c,
          schoolName: 'Trường Tiểu học Hoài Nhơn'
        }));
        setClasses(enrichedClasses);
        try { localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(enrichedClasses)); } catch {}
      }

      if (payload.activeClassId) {
        setActiveClassIdState(payload.activeClassId);
        try { localStorage.setItem(STORAGE_KEYS.ACTIVE_CLASS_ID, payload.activeClassId); } catch {}
      }

      if (payload.teacherProfile) {
        const enrichedTeacher: TeacherProfile = {
          ...payload.teacherProfile,
          school: 'Trường Tiểu học Hoài Nhơn'
        };
        setTeacherProfile(enrichedTeacher);
        try { localStorage.setItem(STORAGE_KEYS.TEACHER_PROFILE, JSON.stringify(enrichedTeacher)); } catch {}
      }

      if (Array.isArray(payload.students) && payload.students.length > 0) {
        setStudents(payload.students);
        try { localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(payload.students)); } catch {}
      }

      if (Array.isArray(payload.assignments)) {
        setAssignments(payload.assignments);
        try { localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(payload.assignments)); } catch {}
      }

      if (Array.isArray(payload.notifications)) {
        setNotifications(payload.notifications);
        try { localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(payload.notifications)); } catch {}
      }

      if (Array.isArray(payload.feedbacks)) {
        setFeedbacks(payload.feedbacks);
        try { localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(payload.feedbacks)); } catch {}
      }

      if (Array.isArray(payload.materials) && payload.materials.length > 0) {
        setMaterials(payload.materials);
        try { localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(payload.materials)); } catch {}
      }

      if (Array.isArray(payload.subjects) && payload.subjects.length > 0) {
        setSubjects(payload.subjects);
        try { localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(payload.subjects)); } catch {}
      }

      if (Array.isArray(payload.genericLessons) && payload.genericLessons.length > 0) {
        setGenericLessons(payload.genericLessons);
        try { localStorage.setItem(STORAGE_KEYS.GENERIC_LESSONS, JSON.stringify(payload.genericLessons)); } catch {}
      }

      if (Array.isArray(payload.games) && payload.games.length > 0) {
        setGames(payload.games);
        try { localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(payload.games)); } catch {}
      }

      if (payload.teacherPasswords && typeof payload.teacherPasswords === 'object') {
        setTeacherPasswords(payload.teacherPasswords);
        try { localStorage.setItem(STORAGE_KEYS.TEACHER_PASSWORDS, JSON.stringify(payload.teacherPasswords)); } catch {}
      }

      if (payload.revision) {
        const rev = Number(payload.revision) || 1;
        setCloudRevision(rev);
        localRevisionRef.current = rev;
      }

      if (payload.lastUpdated) {
        const d = new Date(payload.lastUpdated);
        const formatted = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastCloudSyncTime(formatted);
      }
    } finally {
      setTimeout(() => {
        isRemotePullingRef.current = false;
      }, 600);
    }
  };

  const forceCloudPull = async (): Promise<{ success: boolean; message: string }> => {
    try {
      setCloudSyncState('syncing');
      const res = await databaseService.pullData(dbConfig);
      if (res.success && res.data) {
        applyCloudPayload(res.data);
        setCloudSyncState('synced');
        return { success: true, message: res.message };
      }
      setCloudSyncState('offline');
      return { success: false, message: res.message || 'Không thể kéo dữ liệu từ CSDL Đám mây' };
    } catch (e: any) {
      setCloudSyncState('offline');
      return { success: false, message: e.message || 'Lỗi mạng khi kéo dữ liệu từ đám mây' };
    }
  };

  const forceCloudPush = async (): Promise<{ success: boolean; message: string }> => {
    try {
      setCloudSyncState('syncing');
      const payload: ClassroomSyncPayload = {
        classId: activeClass.name,
        className: `Lớp ${activeClass.name} - ${teacherProfile.school}`,
        version: '2.0',
        lastUpdated: new Date().toISOString(),
        activeClassId,
        classes,
        teacherProfile,
        students,
        assignments,
        notifications,
        feedbacks,
        materials,
        subjects,
        genericLessons,
        games,
        teacherPasswords
      };
      const res = await databaseService.pushData(payload, dbConfig);
      if (res.success) {
        setCloudSyncState('synced');
        const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastCloudSyncTime(now);
        return { success: true, message: res.message };
      }
      setCloudSyncState('offline');
      return { success: false, message: res.message };
    } catch (e: any) {
      setCloudSyncState('offline');
      return { success: false, message: e.message || 'Lỗi mạng khi đẩy dữ liệu lên đám mây' };
    }
  };

  // 1. Initial Cloud Database Hydration on Mount (Every browser, PC, phone pulls latest cloud data)
  useEffect(() => {
    let isCancelled = false;
    (async () => {
      try {
        const res = await databaseService.pullData(dbConfig);
        if (!isCancelled && res.success && res.data) {
          applyCloudPayload(res.data);
          setCloudSyncState('synced');
          console.log('✅ [CloudDB] Tự động nạp dữ liệu mới nhất từ CSDL Đám mây (v' + (res.data.revision || 1) + ')');
        } else if (!isCancelled) {
          console.log('ℹ️ [CloudDB] Dùng dữ liệu bộ nhớ cục bộ sẵn có');
          setCloudSyncState('synced');
        }
      } catch (err) {
        console.warn('⚠️ [CloudDB] Lỗi kết nối đám mây ban đầu, tiếp tục với cache máy:', err);
        if (!isCancelled) setCloudSyncState('offline');
      } finally {
        if (!isCancelled) {
          setIsCloudLoading(false);
          isInitialHydratedRef.current = true;
        }
      }
    })();
    return () => {
      isCancelled = true;
    };
  }, []);

  // 2. Debounced Auto-Sync to Cloud Database on any state change
  useEffect(() => {
    if (!isInitialHydratedRef.current || isRemotePullingRef.current) {
      return;
    }

    if (autoSyncTimerRef.current) {
      clearTimeout(autoSyncTimerRef.current);
    }

    autoSyncTimerRef.current = setTimeout(async () => {
      try {
        setCloudSyncState('syncing');
        const payload: ClassroomSyncPayload = {
          classId: activeClass.name,
          className: `Lớp ${activeClass.name} - ${teacherProfile.school}`,
          version: '2.0',
          lastUpdated: new Date().toISOString(),
          activeClassId,
          classes,
          teacherProfile,
          students,
          assignments,
          notifications,
          feedbacks,
          materials,
          subjects,
          genericLessons,
          games,
          teacherPasswords
        };
        const res = await databaseService.pushData(payload, dbConfig);
        if (res.success) {
          setCloudSyncState('synced');
          const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          setLastCloudSyncTime(now);
          if (res.recordCounts) {
            setDbConfig(prev => ({
              ...prev,
              lastSyncedAt: new Date().toISOString(),
              status: 'connected',
              errorMessage: undefined
            }));
          }
        } else {
          setCloudSyncState('offline');
        }
      } catch (e) {
        console.warn('[CloudDB] Tự động đồng bộ lỗi:', e);
        setCloudSyncState('offline');
      }
    }, 1200);

    return () => {
      if (autoSyncTimerRef.current) {
        clearTimeout(autoSyncTimerRef.current);
      }
    };
  }, [
    classes,
    activeClassId,
    students,
    teacherProfile,
    subjects,
    genericLessons,
    assignments,
    materials,
    games,
    notifications,
    feedbacks,
    teacherPasswords
  ]);

  // 3. Multi-Device Real-Time Sync: Detect changes made on other computers/phones
  useEffect(() => {
    const checkForCloudUpdates = async () => {
      if (isCloudLoading || isRemotePullingRef.current) return;
      try {
        const ver = await databaseService.checkLatestVersion(dbConfig);
        if (ver.hasUpdate && ver.cloudRevision > localRevisionRef.current) {
          console.log(`☁️ [CloudDB] Phát hiện phiên bản mới từ thiết bị khác (v${ver.cloudRevision} > v${localRevisionRef.current}). Đang nạp...`);
          const res = await databaseService.pullData(dbConfig);
          if (res.success && res.data) {
            applyCloudPayload(res.data);
            setSaveToastMessage(`☁️ Đã tự động cập nhật dữ liệu mới nhất từ máy chủ (Phiên bản v${res.data.revision || ver.cloudRevision})!`);
          }
        }
      } catch (e) {
        // Silent fail for polling
      }
    };

    const handleFocusOrVisible = () => {
      if (document.visibilityState === 'visible') {
        checkForCloudUpdates();
      }
    };

    window.addEventListener('focus', handleFocusOrVisible);
    document.addEventListener('visibilitychange', handleFocusOrVisible);

    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        checkForCloudUpdates();
      }
    }, 10000);

    return () => {
      window.removeEventListener('focus', handleFocusOrVisible);
      document.removeEventListener('visibilitychange', handleFocusOrVisible);
      clearInterval(intervalId);
    };
  }, [isCloudLoading, dbConfig]);

  // Khi người dùng mở Modal Đăng nhập, đồng bộ nhẹ dữ liệu để bảo đảm thông tin tài khoản mới nhất
  useEffect(() => {
    if (isAuthModalOpen) {
      databaseService.checkLatestVersion(dbConfig).then(ver => {
        if (ver.hasUpdate && ver.cloudRevision > localRevisionRef.current) {
          databaseService.pullData(dbConfig).then(res => {
            if (res.success && res.data) applyCloudPayload(res.data);
          }).catch(() => {});
        }
      }).catch(() => {});
    }
  }, [isAuthModalOpen]);

  const syncToCloud = async () => {
    setIsSyncing(true);
    setSyncStatusMessage('Đang đồng bộ dữ liệu lên cơ sở dữ liệu đám mây...');
    const payload: ClassroomSyncPayload = {
      classId: activeClass.name,
      className: `Lớp ${activeClass.name} - ${teacherProfile.school}`,
      version: '2.0',
      lastUpdated: new Date().toISOString(),
      activeClassId,
      classes,
      teacherProfile,
      students,
      assignments,
      notifications,
      feedbacks,
      materials,
      subjects,
      genericLessons,
      games,
      teacherPasswords
    };

    const result = await databaseService.pushData(payload, dbConfig);
    setIsSyncing(false);
    if (result.success) {
      const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setSyncStatusMessage(`Đồng bộ thành công lúc ${now}`);
      updateDbConfig({ status: 'connected', lastSyncedAt: new Date().toISOString(), errorMessage: undefined });
      triggerCelebration();
      return { success: true, message: result.message };
    } else {
      setSyncStatusMessage(result.message);
      updateDbConfig({ status: 'error', errorMessage: result.message });
      return { success: false, message: result.message };
    }
  };

  const syncFromCloud = async () => {
    setIsSyncing(true);
    setSyncStatusMessage('Đang tải dữ liệu từ máy chủ đám mây...');
    const result = await databaseService.pullData(dbConfig);
    setIsSyncing(false);
    if (result.success && result.data) {
      applyCloudPayload(result.data);
      const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setSyncStatusMessage(`Tải dữ liệu thành công lúc ${now}`);
      updateDbConfig({ status: 'connected', lastSyncedAt: new Date().toISOString(), errorMessage: undefined });
      triggerCelebration();
      return { success: true, message: result.message };
    } else {
      setSyncStatusMessage(result.message);
      return { success: false, message: result.message };
    }
  };

  const syncFromGoogleSheet = async (overrideUrl?: string) => {
    setIsSyncing(true);
    setSyncStatusMessage(`Đang kết nối tới Google Sheets danh sách lớp ${activeClass.name}...`);
    const targetUrl = overrideUrl || activeClass.googleSheetUrl || dbConfig.googleSheetUrl;
    const configToUse: DatabaseConfig = {
      ...dbConfig,
      provider: 'googlesheets',
      googleSheetUrl: targetUrl
    };

    const res = await databaseService.fetchGoogleSheetStudents(configToUse);
    setIsSyncing(false);
    if (res.success && res.students.length > 0) {
      setStudents(res.students);
      // Save this url to the active class
      updateClass(activeClassId, { googleSheetUrl: targetUrl, students: res.students });

      const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setSyncStatusMessage(`Đã đồng bộ ${res.students.length} học sinh từ Google Sheet lúc ${now}`);
      updateDbConfig({
        provider: 'googlesheets',
        status: 'connected',
        lastSyncedAt: new Date().toISOString(),
        googleSheetUrl: targetUrl,
        errorMessage: undefined
      });
      triggerCelebration();
      return { success: true, message: res.message, count: res.students.length };
    } else {
      setSyncStatusMessage(res.message);
      updateDbConfig({ status: 'error', errorMessage: res.message });
      return { success: false, message: res.message };
    }
  };

  const resetToInitialData = () => {
    setClasses(INITIAL_CLASSES);
    setActiveClassId(INITIAL_CLASSES[0].id);
    setTeacherProfile({ id: 'teacher-1', ...INITIAL_TEACHER });
    setSubjects(INITIAL_SUBJECTS);
    setGenericLessons(INITIAL_GENERIC_LESSONS);
    setStudents(INITIAL_STUDENTS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setNotifications(PARENT_NOTIFICATIONS);
    setFeedbacks(PARENT_FEEDBACKS);
    setMaterials(DIGITAL_MATERIALS);
    setGames(EDUCATIONAL_GAMES);
    triggerCelebration();
  };

  const importDatabase = (payload: ClassroomSyncPayload) => {
    if (payload.students) setStudents(payload.students);
    if (payload.assignments) setAssignments(payload.assignments);
    if (payload.notifications) setNotifications(payload.notifications);
    if (payload.feedbacks) setFeedbacks(payload.feedbacks);
    if (payload.materials) setMaterials(payload.materials);
  };

  const exportDatabaseBackup = () => {
    const payload: ClassroomSyncPayload = {
      classId: activeClass.name,
      className: `Lớp ${activeClass.name} - ${teacherProfile.school}`,
      version: '1.0',
      lastUpdated: new Date().toISOString(),
      students,
      assignments,
      notifications,
      feedbacks,
      materials
    };
    databaseService.exportBackupJson(payload);
  };

  const exportFullBackup = () => {
    const fullPayload = {
      app: 'AI CLASSROOM',
      school: teacherProfile.school,
      teacher: teacherProfile.name,
      exportedAt: new Date().toISOString(),
      version: '2.0',
      activeClassId,
      classes,
      teacherProfile,
      subjects,
      genericLessons,
      games,
      materials,
      assignments,
      students,
      notifications,
      feedbacks
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    const dateStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    downloadAnchor.setAttribute('download', `saoluu-aiclass-3c1-${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    triggerCelebration();
    setSaveToastMessage(`Đã xuất tệp sao lưu hệ thống: saoluu-aiclass-3c1-${dateStr}.json`);
  };

  const importFullBackup = async (file: File): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content);

          if (parsed.classes && Array.isArray(parsed.classes)) {
            setClasses(parsed.classes);
            localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(parsed.classes));
          }
          if (parsed.activeClassId) {
            setActiveClassIdState(parsed.activeClassId);
            localStorage.setItem(STORAGE_KEYS.ACTIVE_CLASS_ID, parsed.activeClassId);
          }
          if (parsed.teacherProfile) {
            setTeacherProfile(parsed.teacherProfile);
            localStorage.setItem(STORAGE_KEYS.TEACHER_PROFILE, JSON.stringify(parsed.teacherProfile));
          }
          if (parsed.subjects && Array.isArray(parsed.subjects)) {
            setSubjects(parsed.subjects);
            localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(parsed.subjects));
          }
          if (parsed.genericLessons && Array.isArray(parsed.genericLessons)) {
            setGenericLessons(parsed.genericLessons);
            localStorage.setItem(STORAGE_KEYS.GENERIC_LESSONS, JSON.stringify(parsed.genericLessons));
          }
          if (parsed.games && Array.isArray(parsed.games)) {
            setGames(parsed.games);
            localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(parsed.games));
          }
          if (parsed.materials && Array.isArray(parsed.materials)) {
            setMaterials(parsed.materials);
            localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(parsed.materials));
          }
          if (parsed.assignments && Array.isArray(parsed.assignments)) {
            setAssignments(parsed.assignments);
            localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(parsed.assignments));
          }
          if (parsed.students && Array.isArray(parsed.students)) {
            setStudents(parsed.students);
            localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(parsed.students));
          }
          if (parsed.notifications && Array.isArray(parsed.notifications)) {
            setNotifications(parsed.notifications);
            localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(parsed.notifications));
          }
          if (parsed.feedbacks && Array.isArray(parsed.feedbacks)) {
            setFeedbacks(parsed.feedbacks);
            localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(parsed.feedbacks));
          }

          triggerCelebration();
          setSaveToastMessage('Khôi phục dữ liệu từ tệp sao lưu thành công!');
          resolve({ success: true, message: 'Khôi phục dữ liệu từ tệp sao lưu thành công!' });
        } catch (err: any) {
          resolve({ success: false, message: `Lỗi đọc file: ${err?.message || 'Định dạng JSON không hợp lệ'}` });
        }
      };
      reader.onerror = () => {
        resolve({ success: false, message: 'Không thể đọc tệp sao lưu này!' });
      };
      reader.readAsText(file);
    });
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#5538F5', '#6738FF', '#9B20F5', '#10B981', '#F59E0B'],
      });
    } catch {}
  };

  const switchRole = (role: UserRole, studentId?: string) => {
    if (role === 'teacher') {
      const teacherDisplayName = activeClass?.teacherName || teacherProfile.name;
      setCurrentUser({
        id: teacherProfile.id,
        name: teacherDisplayName,
        role: 'teacher',
        avatar: teacherProfile.avatar,
        className: activeClass.name,
        schoolName: 'Trường Tiểu học Hoài Nhơn'
      });
      const newSession: AuthSession = {
        username: `thhn_${activeClass.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        role: 'teacher',
        className: activeClass.name,
        classId: activeClass.id,
        fullName: teacherDisplayName,
        avatar: teacherProfile.avatar,
        loggedInAt: new Date().toISOString()
      };
      setAuthSession(newSession);
      try {
        localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(newSession));
        localStorage.setItem(STORAGE_KEYS.ACTIVE_CLASS_ID, activeClass.id);
      } catch {}
    } else if (role === 'student') {
      const targetStudent = students.find(s => s.id === (studentId || 's-1')) || students[0];
      setCurrentUser({
        id: targetStudent ? targetStudent.id : 's-1',
        name: targetStudent ? targetStudent.fullName : 'Học sinh',
        role: 'student',
        studentId: targetStudent?.id,
        avatar: targetStudent?.gender === 'Nữ'
          ? 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256'
          : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256',
        className: activeClass.name,
        schoolName: 'Trường Tiểu học Hoài Nhơn'
      });
      if (targetStudent) {
        const newSession: AuthSession = {
          username: targetStudent.username || targetStudent.studentCode.toLowerCase(),
          role: 'student',
          className: activeClass.name,
          classId: activeClass.id,
          fullName: targetStudent.fullName,
          studentId: targetStudent.id,
          avatar: targetStudent.gender === 'Nữ'
            ? 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256'
            : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256',
          loggedInAt: new Date().toISOString()
        };
        setAuthSession(newSession);
        try {
          localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(newSession));
          localStorage.setItem(STORAGE_KEYS.ACTIVE_CLASS_ID, activeClass.id);
        } catch {}
      }
    } else if (role === 'parent') {
      const targetStudent = students.find(s => s.id === (studentId || 's-1')) || students[0];
      setCurrentUser({
        id: `parent-${targetStudent?.id || 's-1'}`,
        name: targetStudent ? `${targetStudent.parentName} (PH em ${targetStudent.fullName})` : 'Phụ huynh học sinh',
        role: 'parent',
        studentId: targetStudent?.id,
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
        className: activeClass.name,
        schoolName: 'Trường Tiểu học Hoài Nhơn'
      });
    }
  };

  // ==================== STUDENT ACTIONS ====================
  const addStudent = (studentData: Omit<Student, 'id' | 'stt' | 'studentCode'>) => {
    setStudents(prev => {
      const newStt = prev.length + 1;
      const cleanClassName = activeClass.name.replace(/\s+/g, '');
      const newCode = `HS${cleanClassName}${newStt < 10 ? '0' + newStt : newStt}`;
      const newStudent: Student = {
        ...studentData,
        id: `s-${activeClass.id}-${Date.now()}`,
        stt: newStt,
        studentCode: newCode,
        className: activeClass.name,
        seatGroup: ((newStt - 1) % 4) + 1,
        seatIndex: Math.floor((newStt - 1) / 4) + 1
      };
      return [...prev, newStudent];
    });
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => {
      const filtered = prev.filter(s => s.id !== id);
      return filtered.map((s, index) => ({
        ...s,
        stt: index + 1
      }));
    });
  };

  const changeStudentStt = (studentId: string, newStt: number) => {
    setStudents(prev => {
      const target = prev.find(s => s.id === studentId);
      if (!target) return prev;
      const otherStudents = prev.filter(s => s.id !== studentId);
      const safeIndex = Math.max(0, Math.min(newStt - 1, otherStudents.length));
      otherStudents.splice(safeIndex, 0, target);
      return otherStudents.map((s, i) => ({ ...s, stt: i + 1 }));
    });
  };

  const autoGenerateStudentAccounts = (targetClassId?: string): { generatedCount: number; message: string } => {
    const classIdToUse = targetClassId || activeClassId;
    const targetClass = classes.find(c => c.id === classIdToUse) || activeClass;
    const classCode = (targetClass.name || '3c1').toLowerCase().replace(/[^a-z0-9]/g, '');

    let genCount = 0;
    const sourceList = targetClass.students && targetClass.students.length > 0 ? targetClass.students : students;

    const updatedStudents: Student[] = sourceList.map((st, idx) => {
      const stt = st.stt || (idx + 1);
      const generatedUser = `hs${classCode}${stt < 10 ? '0' + stt : stt}`;
      const defaultPass = '123456';
      const tier: AbilityTier = st.abilityTier || (st.learningProgress >= 88 ? 'advanced' : st.learningProgress >= 70 ? 'proficient' : 'remedial');
      
      genCount++;
      return {
        ...st,
        stt,
        username: st.username || generatedUser,
        password: st.password || defaultPass,
        isDefaultPassword: st.password ? (st.isDefaultPassword !== false) : true,
        abilityTier: tier,
        className: targetClass.name
      };
    });

    setStudents(updatedStudents);
    setClasses(prev => prev.map(c => (c.id === classIdToUse ? { ...c, students: updatedStudents } : c)));

    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updatedStudents));
      localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes.map(c => (c.id === classIdToUse ? { ...c, students: updatedStudents } : c))));
    } catch {}

    triggerCelebration();
    setSaveToastMessage(`🎉 Đã tự động tạo tài khoản & mật khẩu mặc định (123456) cho ${genCount} học sinh lớp ${targetClass.name}!`);

    return {
      generatedCount: genCount,
      message: `Đã cấp tài khoản & mật khẩu mặc định (123456) thành công cho ${genCount} học sinh lớp ${targetClass.name}!`
    };
  };

  const changeStudentPassword = (
    studentId: string,
    newPassword: string,
    oldPassword?: string,
    bypassOld: boolean = false
  ): { success: boolean; message: string } => {
    const cleanNew = (newPassword || '').trim();
    if (!cleanNew || cleanNew.length < 6) {
      return { success: false, message: 'Mật khẩu mới phải có tối thiểu 6 ký tự!' };
    }

    const st = students.find(s => s.id === studentId);
    if (!st) {
      return { success: false, message: 'Không tìm thấy học sinh trong danh sách!' };
    }

    // Nếu không bypass thì kiểm tra mật khẩu cũ
    if (!bypassOld) {
      const currentExpected = st.password || '123456';
      if ((oldPassword || '').trim() !== currentExpected) {
        return { success: false, message: 'Mật khẩu cũ không chính xác!' };
      }
    }

    const updatedStudents = students.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          password: cleanNew,
          isDefaultPassword: false,
          lastPasswordChangedAt: new Date().toISOString()
        };
      }
      return s;
    });

    setStudents(updatedStudents);
    setClasses(prev => prev.map(c => (c.id === activeClassId ? { ...c, students: updatedStudents } : c)));

    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updatedStudents));
    } catch {}

    triggerCelebration();
    setSaveToastMessage(`🔐 Đã đổi mật khẩu cho học sinh ${st.fullName} thành công!`);

    return {
      success: true,
      message: `Đổi mật khẩu cho học sinh ${st.fullName} thành công!`
    };
  };

  const updateStudentAbilityTier = (studentId: string, tier: AbilityTier) => {
    const updatedStudents = students.map(s => {
      if (s.id === studentId) {
        return { ...s, abilityTier: tier };
      }
      return s;
    });
    setStudents(updatedStudents);
    setClasses(prev => prev.map(c => (c.id === activeClassId ? { ...c, students: updatedStudents } : c)));
  };

  const bulkImportStudents = (imported: Partial<Student>[]) => {
    setStudents(prev => {
      let currentStt = prev.length;
      const cleanClassName = activeClass.name.replace(/\s+/g, '');
      const newStudents: Student[] = imported.map((imp) => {
        currentStt++;
        const code = `HS${cleanClassName}${currentStt < 10 ? '0' + currentStt : currentStt}`;
        return {
          id: `s-imp-${Date.now()}-${currentStt}`,
          stt: currentStt,
          studentCode: imp.studentCode || code,
          fullName: imp.fullName || 'Học sinh mới',
          gender: imp.gender || 'Nam',
          birthDate: imp.birthDate || '2018-01-01',
          className: activeClass.name,
          accountStatus: 'active',
          attendanceStatus: 'present',
          attendanceHistory: [{ date: '2026-10-16', status: 'present' }],
          activeTasksCount: 2,
          learningProgress: imp.learningProgress || 80,
          skills: imp.skills || { english: 80, math: 80, vietnamese: 80, informatics: 80 },
          supportGoal: imp.supportGoal || 'Rèn luyện các kỹ năng học tập tích cực',
          badges: imp.badges || ['daily-learner'],
          parentName: imp.parentName || 'Phụ huynh học sinh',
          parentPhone: imp.parentPhone || '0900 000 000',
          seatGroup: ((currentStt - 1) % 4) + 1,
          seatIndex: Math.floor((currentStt - 1) / 4) + 1
        };
      });
      return [...prev, ...newStudents];
    });
  };

  const markAttendance = (studentId: string, status: Student['attendanceStatus'], note?: string) => {
    const today = new Date().toISOString().split('T')[0];
    setStudents(prev =>
      prev.map(s => {
        if (s.id !== studentId) return s;
        const newHistory = [{ date: today, status, note }, ...(s.attendanceHistory || []).filter(h => h.date !== today)];
        return {
          ...s,
          attendanceStatus: status,
          attendanceHistory: newHistory
        };
      })
    );
  };

  const markAllPresent = () => {
    const today = new Date().toISOString().split('T')[0];
    setStudents(prev =>
      prev.map(s => ({
        ...s,
        attendanceStatus: 'present',
        attendanceHistory: [{ date: today, status: 'present' }, ...(s.attendanceHistory || []).filter(h => h.date !== today)]
      }))
    );
    triggerCelebration();
  };

  const awardBadge = (studentId: string, badgeId: string) => {
    setStudents(prev =>
      prev.map(s => {
        if (s.id !== studentId) return s;
        const existing = s.badges || [];
        if (existing.includes(badgeId)) return s;
        return {
          ...s,
          badges: [...existing, badgeId]
        };
      })
    );
    triggerCelebration();
  };

  const updateSeat = (studentId: string, seatGroup: number, seatIndex: number) => {
    setStudents(prev =>
      prev.map(s => (s.id === studentId ? { ...s, seatGroup, seatIndex } : s))
    );
  };

  const swapSeats = (studentId1: string, studentId2: string) => {
    setStudents(prev => {
      const s1 = prev.find(s => s.id === studentId1);
      const s2 = prev.find(s => s.id === studentId2);
      if (!s1 || !s2) return prev;
      return prev.map(s => {
        if (s.id === studentId1) {
          return { ...s, seatGroup: s2.seatGroup, seatIndex: s2.seatIndex };
        }
        if (s.id === studentId2) {
          return { ...s, seatGroup: s1.seatGroup, seatIndex: s1.seatIndex };
        }
        return s;
      });
    });
  };

  // ==================== ASSIGNMENT ACTIONS ====================
  const createAssignment = (assignmentData: Omit<Assignment, 'id' | 'submissionsCount' | 'createdAt'>) => {
    const newAssignment: Assignment = {
      ...assignmentData,
      id: `assign-${Date.now()}`,
      submissionsCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAssignments(prev => [newAssignment, ...prev]);
  };

  const submitAssignmentDemo = (assignmentId: string, studentId: string) => {
    setAssignments(prev =>
      prev.map(a => {
        if (a.id !== assignmentId) return a;
        return {
          ...a,
          submissionsCount: Math.min(a.totalAssigned, a.submissionsCount + 1)
        };
      })
    );
    triggerCelebration();
  };

  const deleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  const autoAssignDifferentiatedTasks = (
    subject: string,
    topic: string,
    deadline?: string
  ): { success: boolean; createdAssignments: Assignment[]; message: string } => {
    const defaultDeadline = deadline || new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().split('T')[0];
    const subClean = subject || 'Toán học';
    const topicClean = topic || 'Ôn tập và vận dụng kiến thức bài học';

    // Group students by tier
    const advancedStudents = students.filter(s => (s.abilityTier || (s.learningProgress >= 88 ? 'advanced' : s.learningProgress >= 70 ? 'proficient' : 'remedial')) === 'advanced');
    const proficientStudents = students.filter(s => (s.abilityTier || (s.learningProgress >= 88 ? 'advanced' : s.learningProgress >= 70 ? 'proficient' : 'remedial')) === 'proficient');
    const remedialStudents = students.filter(s => (s.abilityTier || (s.learningProgress >= 88 ? 'advanced' : s.learningProgress >= 70 ? 'proficient' : 'remedial')) === 'remedial');

    const timestamp = Date.now();

    // 1. Đề dành cho Nhóm Hoàn thành Tốt (Nâng cao & Vận dụng cao)
    const taskAdvanced: Assignment = {
      id: `asg-adv-${timestamp}`,
      title: `[NÂNG CAO] ${subClean}: ${topicClean}`,
      subject: subClean,
      description: `Phiếu bài tập mở rộng, phát triển tư duy sáng tạo và giải quyết vấn đề nâng cao dành cho học sinh có năng lực vượt trội.`,
      deadline: defaultDeadline,
      assignedMode: 'ability_tiered',
      targetAbilityTier: 'advanced',
      difficultyLevel: 'advanced',
      targetGroupName: 'Nhóm Hoàn thành Tốt (Nâng cao)',
      targetStudentIds: advancedStudents.map(s => s.id),
      totalAssigned: advancedStudents.length || 1,
      submissionsCount: 0,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      criteria: 'Phát hiện nhanh bản chất, giải toán 2-3 bước hoặc trình bày bài sáng tạo, chính xác 100%.',
      questions: [
        {
          id: `q-adv-1`,
          question: `Phân tích và tìm cách giải nhanh nhất cho bài toán vận dụng mở rộng liên quan đến ${topicClean}.`,
          hint: 'Áp dụng tính chất kết hợp và quy luật đại lượng trung gian.',
          points: 5
        },
        {
          id: `q-adv-2`,
          question: `Tự đặt một bài toán thực tế tương tự và trình bày lời giải chi tiết theo các bước.`,
          hint: 'Liên hệ các sự việc gần gũi trong đời sống lớp học hoặc quê hương Hoài Nhơn.',
          points: 5
        }
      ],
      submissions: []
    };

    // 2. Đề dành cho Nhóm Hoàn thành (Chuẩn kiến thức & Vận dụng vừa sức)
    const taskProficient: Assignment = {
      id: `asg-pro-${timestamp}`,
      title: `[ĐẠT CHUẨN] ${subClean}: ${topicClean}`,
      subject: subClean,
      description: `Phiếu bài tập chuẩn kiến thức kỹ năng cốt lõi theo chương trình GDPT 2018, giúp học sinh rèn luyện kỹ năng vững vàng.`,
      deadline: defaultDeadline,
      assignedMode: 'ability_tiered',
      targetAbilityTier: 'proficient',
      difficultyLevel: 'standard',
      targetGroupName: 'Nhóm Hoàn thành (Đạt chuẩn)',
      targetStudentIds: proficientStudents.map(s => s.id),
      totalAssigned: proficientStudents.length || 1,
      submissionsCount: 0,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      criteria: 'Nắm vững quy tắc, hoàn thành đúng các bài tập tính toán và thực hành cơ bản.',
      questions: [
        {
          id: `q-pro-1`,
          question: `Áp dụng quy tắc trọng tâm để thực hiện bài tập thực hành số 1 về ${topicClean}.`,
          hint: 'Đọc kỹ yêu cầu đề bài và kiểm tra các phép tính trong ngoặc.',
          points: 5
        },
        {
          id: `q-pro-2`,
          question: `Giải bài toán có lời văn 2 bước tính theo mẫu đã học trên lớp.`,
          hint: 'Bước 1 tìm đại lượng thứ nhất, bước 2 tính tổng hoặc hiệu.',
          points: 5
        }
      ],
      submissions: []
    };

    // 3. Đề dành cho Nhóm Cần hỗ trợ (Phụ đạo cơ bản, trực quan có gợi ý AI Buddy)
    const taskRemedial: Assignment = {
      id: `asg-rem-${timestamp}`,
      title: `[HỖ TRỢ] ${subClean}: ${topicClean}`,
      subject: subClean,
      description: `Phiếu bài tập củng cố nền tảng, chia nhỏ từng bước có gợi ý trực quan từ AI Buddy và học liệu số, giúp học sinh tự tin tiến bộ.`,
      deadline: defaultDeadline,
      assignedMode: 'ability_tiered',
      targetAbilityTier: 'remedial',
      difficultyLevel: 'basic',
      targetGroupName: 'Nhóm Cần hỗ trợ (Phụ đạo cơ bản)',
      targetStudentIds: remedialStudents.map(s => s.id),
      totalAssigned: remedialStudents.length || 1,
      submissionsCount: 0,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      criteria: 'Nắm được khái niệm cơ bản, làm quen với từng thao tác theo hướng dẫn.',
      questions: [
        {
          id: `q-rem-1`,
          question: `Nhìn hình ảnh minh họa và điền số/từ thích hợp vào chỗ trống về ${topicClean}.`,
          hint: 'Bấm nút "Hỏi AI Buddy" để xem giải thích hình ảnh từng bước.',
          points: 5
        },
        {
          id: `q-rem-2`,
          question: `Thực hiện phép tính đơn giản nhất theo mẫu cô giáo đã hướng dẫn.`,
          hint: 'Làm chậm rãi và đếm kỹ số lượng que tính hoặc hình vẽ.',
          points: 5
        }
      ],
      submissions: []
    };

    const newAssignments = [taskAdvanced, taskProficient, taskRemedial];
    setAssignments(prev => [...newAssignments, ...prev]);

    try {
      localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify([...newAssignments, ...assignments]));
    } catch {}

    triggerCelebration();
    setSaveToastMessage(`🎯 Đã giao tự động 3 đề bài phân hóa (${advancedStudents.length} HS Nâng cao, ${proficientStudents.length} HS Đạt chuẩn, ${remedialStudents.length} HS Cần hỗ trợ)!`);

    return {
      success: true,
      createdAssignments: newAssignments,
      message: `Đã giao 3 phiếu bài tập phân hóa thành công cho cả lớp!`
    };
  };

  const submitAssignmentWithEvaluation = (
    assignmentId: string,
    studentId: string,
    answers?: Record<string, string>,
    scoreInput?: number,
    teacherFeedbackInput?: string
  ): { success: boolean; message: string } => {
    const student = students.find(s => s.id === studentId);
    if (!student) return { success: false, message: 'Không tìm thấy học sinh!' };

    const targetAsg = assignments.find(a => a.id === assignmentId);
    if (!targetAsg) return { success: false, message: 'Không tìm thấy bài tập!' };

    const calculatedScore = scoreInput !== undefined 
      ? scoreInput 
      : (targetAsg.difficultyLevel === 'advanced' ? 9.5 : targetAsg.difficultyLevel === 'standard' ? 8.5 : 8.0);

    const oldProgress = student.learningProgress || 75;
    const growth = calculatedScore >= 9 ? 6 : calculatedScore >= 7.5 ? 4 : 2;
    const newProgress = Math.min(100, oldProgress + growth);

    let newTier: AbilityTier = student.abilityTier || 'proficient';
    if (newProgress >= 88) newTier = 'advanced';
    else if (newProgress >= 70) newTier = 'proficient';
    else newTier = 'remedial';

    const submission: AssignmentSubmission = {
      id: `sub-${Date.now()}`,
      studentId: student.id,
      studentName: student.fullName,
      submittedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN'),
      status: 'graded',
      score: calculatedScore,
      answers: answers || { q1: 'Đã hoàn thành câu hỏi', q2: 'Đã trả lời đầy đủ' },
      teacherFeedback: teacherFeedbackInput || (calculatedScore >= 9 ? 'Em làm bài rất xuất sắc, trình bày khoa học!' : 'Em nắm bài tốt, tiếp tục phát huy nhé!'),
      aiProgressEvaluation: {
        growthScore: growth,
        strengths: [
          `Nắm vững kỹ năng cốt lõi môn ${targetAsg.subject}`,
          'Hoàn thành đầy đủ các yêu cầu bài tập',
          'Có ý thức tự giác làm bài đúng hạn'
        ],
        improvements: [
          calculatedScore < 9 ? 'Cần rèn thêm sự cẩn thận khi tính toán/viết câu' : 'Thử thách thêm các bài toán mở rộng'
        ],
        pedagogicalAdvice: `Khen ngợi nỗ lực của em ${student.fullName}. Điểm số tiến bộ +${growth}% so với tuần trước.`,
        evaluatedTier: newTier
      }
    };

    const updatedAssignments = assignments.map(a => {
      if (a.id === assignmentId) {
        const existingSubs = (a.submissions || []).filter(sub => sub.studentId !== studentId);
        return {
          ...a,
          submissionsCount: existingSubs.length + 1,
          submissions: [submission, ...existingSubs]
        };
      }
      return a;
    });
    setAssignments(updatedAssignments);

    const updatedStudents = students.map(s => {
      if (s.id === studentId) {
        const subKey = (targetAsg.subject || '').toLowerCase().includes('toán') ? 'math'
          : (targetAsg.subject || '').toLowerCase().includes('tiếng anh') ? 'english'
          : (targetAsg.subject || '').toLowerCase().includes('tiếng việt') ? 'vietnamese'
          : (targetAsg.subject || '').toLowerCase().includes('tin') ? 'informatics' : 'math';

        const updatedSkills = {
          ...s.skills,
          [subKey]: Math.min(100, (s.skills[subKey] || 80) + growth)
        };

        return {
          ...s,
          learningProgress: newProgress,
          abilityTier: newTier,
          skills: updatedSkills,
          badges: calculatedScore >= 9 && !s.badges.includes('math-whiz') ? [...s.badges, 'math-whiz'] : s.badges
        };
      }
      return s;
    });
    setStudents(updatedStudents);
    setClasses(prev => prev.map(c => (c.id === activeClassId ? { ...c, students: updatedStudents } : c)));

    try {
      localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(updatedAssignments));
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updatedStudents));
    } catch {}

    triggerCelebration();
    setSaveToastMessage(`⭐ Đã ghi nhận bài nộp của ${student.fullName}: ${calculatedScore} điểm (Tiến bộ +${growth}%)!`);

    return {
      success: true,
      message: `Đã chấm và phân tích tiến bộ của em ${student.fullName} thành công!`
    };
  };

  const generateStudentProgressReport = (studentId: string): StudentGrowthReport => {
    const st = students.find(s => s.id === studentId) || students[0];
    const stAssignments = assignments.filter(a => (a.submissions || []).some(sub => sub.studentId === st.id));
    const allSubs = stAssignments.flatMap(a => (a.submissions || []).filter(sub => sub.studentId === st.id));

    const avgScore = allSubs.length > 0 
      ? Number((allSubs.reduce((acc, sub) => acc + (sub.score || 8), 0) / allSubs.length).toFixed(1))
      : 8.5;

    const initialProg = Math.max(50, (st.learningProgress || 80) - 12);
    const currentProg = st.learningProgress || 85;
    const growthPercent = currentProg - initialProg;

    const tier: AbilityTier = st.abilityTier || (currentProg >= 88 ? 'advanced' : currentProg >= 70 ? 'proficient' : 'remedial');
    const prevTier: AbilityTier = initialProg >= 88 ? 'advanced' : initialProg >= 70 ? 'proficient' : 'remedial';

    return {
      studentId: st.id,
      studentName: st.fullName,
      studentCode: st.studentCode,
      className: st.className,
      initialProgress: initialProg,
      currentProgress: currentProg,
      growthPercentage: growthPercent,
      currentTier: tier,
      previousTier: prevTier,
      totalAssignmentsCompleted: allSubs.length || 3,
      averageScore: avgScore,
      skillGrowth: {
        'Toán học': { before: Math.max(50, (st.skills?.math || 85) - 10), after: st.skills?.math || 85, change: 10 },
        'Tiếng Việt': { before: Math.max(50, (st.skills?.vietnamese || 85) - 8), after: st.skills?.vietnamese || 85, change: 8 },
        'Tiếng Anh': { before: Math.max(50, (st.skills?.english || 85) - 12), after: st.skills?.english || 85, change: 12 },
        'Tin học': { before: Math.max(50, (st.skills?.informatics || 85) - 6), after: st.skills?.informatics || 85, change: 6 }
      },
      tt27Evaluation: {
        achievementLevel: tier === 'advanced' ? 'T' : tier === 'proficient' ? 'H' : 'C',
        comment: tier === 'advanced'
          ? `Em ${st.fullName} hoàn thành xuất sắc các nội dung học tập, tư duy nhạy bén và có tiến bộ vượt bậc!`
          : tier === 'proficient'
          ? `Em ${st.fullName} hoàn thành tốt các bài tập phân hóa, có ý thức tự giác và tiến bộ đều các môn.`
          : `Em ${st.fullName} đã có nhiều cố gắng, nắm được kiến thức cơ bản nhờ bài tập trợ giúp từng bước.`,
        strengths: [
          'Thái độ học tập tích cực, chăm chỉ hoàn thành bài tập phân hóa',
          'Tích cực tương tác với Kho học liệu số và AI Buddy',
          'Biết lắng nghe và tiếp thu hướng dẫn của cô giáo'
        ],
        weaknesses: [
          tier === 'remedial' ? 'Cần củng cố thêm kỹ năng tính nhẩm và đọc hiểu' : 'Cần rèn luyện thêm tính cẩn thận khi làm bài nâng cao'
        ],
        recommendationsForTeacher: 'Tiếp tục giao phiếu bài tập phân hóa phù hợp với năng lực hiện tại, khen ngợi từng bước tiến nhỏ.',
        recommendationsForParent: `Gia đình tiếp tục động viên em ${st.fullName}, dành 15-20 phút mỗi tối cùng em xem lại bài trên ứng dụng.`
      },
      analyzedAt: new Date().toLocaleDateString('vi-VN')
    };
  };

  // ==================== MATERIAL ACTIONS ====================
  const addMaterial = (materialData: Omit<LearningMaterial, 'id' | 'uploadedAt'>) => {
    const newMaterial: LearningMaterial = {
      ...materialData,
      id: `mat-${Date.now()}`,
      uploadedAt: new Date().toISOString().split('T')[0],
      author: materialData.author || teacherProfile.name,
      viewCount: 1
    };
    setMaterials(prev => {
      const updated = [newMaterial, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    triggerCelebration();
  };

  const updateMaterial = (id: string, updates: Partial<LearningMaterial>) => {
    setMaterials(prev => {
      const updated = prev.map(m => (m.id === id ? { ...m, ...updates } : m));
      try {
        localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteMaterial = (id: string) => {
    setMaterials(prev => {
      const updated = prev.filter(m => m.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const bulkImportMaterials = (
    importedMaterials: (Omit<LearningMaterial, 'id' | 'uploadedAt'> & { id?: string; uploadedAt?: string })[]
  ) => {
    const today = new Date().toISOString().split('T')[0];
    const newItems: LearningMaterial[] = importedMaterials.map((imp, idx) => ({
      ...imp,
      id: imp.id || `mat-imp-${Date.now()}-${idx}`,
      uploadedAt: imp.uploadedAt || today,
      author: imp.author || teacherProfile.name,
      grade: imp.grade || activeClass.grade || 3,
      url: imp.url || '#',
      viewCount: imp.viewCount || 0
    }));

    setMaterials(prev => {
      const updated = [...newItems, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    triggerCelebration();
  };

  const createAssignmentFromMaterial = (
    material: LearningMaterial,
    deadline?: string,
    criteria?: string
  ): Assignment => {
    const today = new Date();
    const defaultDeadline =
      deadline || new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const newAssignment: Assignment = {
      id: `assign-${Date.now()}`,
      title: `Bài tập rèn luyện: ${material.title}`,
      subject: material.subject,
      description: `Bài tập thực hành được trích xuất từ Kho học liệu số: "${material.title}".\n${
        material.content ? 'Nội dung cốt lõi: ' + material.content.slice(0, 250) + '...' : material.description
      }`,
      deadline: defaultDeadline,
      assignedMode: 'all',
      targetStudentIds: [],
      criteria: criteria || 'Hoàn thành nghiên cứu học liệu, trả lời các câu hỏi kiểm tra và vận dụng liên hệ.',
      status: 'active',
      submissionsCount: 0,
      totalAssigned: students.length,
      createdAt: today.toISOString().split('T')[0]
    };

    setAssignments(prev => {
      const updated = [newAssignment, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    triggerCelebration();
    return newAssignment;
  };

  // ==================== GAME ACTIONS ====================
  const addGame = (newGame: EducationalGame) => {
    setGames(prev => [newGame, ...prev]);
    triggerCelebration();
  };

  const deleteGame = (id: string) => {
    setGames(prev => prev.filter(g => g.id !== id));
  };

  // ==================== PARENT ACTIONS ====================
  const addNotification = (title: string, content: string, isImportant = false) => {
    const newNotif: ParentNotification = {
      id: `notif-${Date.now()}`,
      title,
      content,
      date: new Date().toISOString().split('T')[0],
      sender: teacherProfile.name,
      isImportant,
      category: isImportant ? 'announcement' : 'academic',
      readBy: []
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const addFeedback = (studentId: string, message: string) => {
    const student = students.find(s => s.id === studentId);
    const newFeedback: ParentFeedback = {
      id: `fb-${Date.now()}`,
      studentId,
      studentName: student ? student.fullName : 'Học sinh',
      parentName: student ? student.parentName : 'Phụ huynh',
      message,
      sentAt: new Date().toISOString(),
      status: 'new'
    };
    setFeedbacks(prev => [newFeedback, ...prev]);
  };

  const replyFeedback = (id: string, replyText: string) => {
    setFeedbacks(prev =>
      prev.map(f => {
        if (f.id !== id) return f;
        return {
          ...f,
          teacherReply: replyText,
          repliedAt: new Date().toISOString(),
          status: 'replied'
        };
      })
    );
  };

  // SSOT Reactive Getters & Setters for Teacher Name and Class Name
  const teacherName = teacherProfile.fullName || teacherProfile.name;
  const className = activeClass?.name || teacherProfile.className || '3C1';

  const setTeacherName = (name: string) => {
    updateTeacherProfile({ name, fullName: name });
  };

  const setClassName = (name: string) => {
    updateClass(activeClassId, { name });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        activeView,
        setActiveView,
        teacherInfo: teacherProfile,
        students,
        assignments,
        badges,
        materials,
        notifications,
        feedbacks,
        aiLiveStatus,

        // Multi-Class
        classes,
        activeClassId,
        activeClass,
        setActiveClassId,
        addClass,
        updateClass,
        deleteClass,
        isClassModalOpen,
        setClassModalOpen,

        // Teacher Profile
        teacherProfile,
        updateTeacherProfile,
        isTeacherModalOpen,
        setTeacherModalOpen,

        // SSOT Reactive Getters & Setters
        teacherName,
        className,
        setTeacherName,
        setClassName,

        // Dynamic Subjects & Lessons
        subjects,
        activeSubjectId,
        setActiveSubjectId,
        addSubject,
        updateSubject,
        deleteSubject,
        isSubjectModalOpen,
        setSubjectModalOpen,

        genericLessons,
        addGenericLesson,
        updateGenericLesson,
        deleteGenericLesson,
        isLessonEditorOpen,
        setLessonEditorOpen,
        editingLesson,
        setEditingLesson,

        selectedGrade,
        setSelectedGrade,

        // Student & Classroom actions
        addStudent,
        updateStudent,
        deleteStudent,
        changeStudentStt,
        bulkImportStudents,
        autoGenerateStudentAccounts,
        changeStudentPassword,
        targetStudentForPasswordChange,
        setTargetStudentForPasswordChange,
        updateStudentAbilityTier,
        markAttendance,
        markAllPresent,
        awardBadge,
        updateSeat,
        swapSeats,
        createAssignment,
        submitAssignmentDemo,
        deleteAssignment,
        autoAssignDifferentiatedTasks,
        submitAssignmentWithEvaluation,
        generateStudentProgressReport,
        addMaterial,
        updateMaterial,
        deleteMaterial,
        bulkImportMaterials,
        createAssignmentFromMaterial,
        games,
        setGames,
        addGame,
        deleteGame,
        addNotification,
        addFeedback,
        replyFeedback,
        triggerCelebration,
        dbConfig,
        isDbModalOpen,
        setDbModalOpen,
        isApiKeyModalOpen,
        setApiKeyModalOpen,
        isSyncing,
        syncStatusMessage,
        updateDbConfig,
        syncToCloud,
        syncFromCloud,
        syncFromGoogleSheet,
        testDbConnection,
        resetToInitialData,
        importDatabase,
        exportDatabaseBackup,

        // Cloud Database & Multi-Device Real-Time Sync
        isCloudLoading,
        cloudSyncState,
        cloudRevision,
        lastCloudSyncTime,
        forceCloudPull,
        forceCloudPush,

        // Save & Backup features
        manualSave,
        lastSavedAt,
        isSaving,
        isSaveModalOpen,
        setSaveModalOpen,
        saveToastMessage,
        setSaveToastMessage,
        exportFullBackup,
        importFullBackup,

        // Authentication & Credentials
        authSession,
        isAuthenticated: !!authSession,
        login,
        logout,
        changeTeacherPassword,
        isAuthModalOpen,
        setAuthModalOpen,
        isChangePasswordOpen,
        setChangePasswordOpen,
        getTeacherPassword
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
