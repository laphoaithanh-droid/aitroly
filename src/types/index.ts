export type UserRole = 'teacher' | 'student' | 'parent';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  studentId?: string; // for student or linked parent
  className: string;
  schoolName: string;
}

export type AbilityTier = 'advanced' | 'proficient' | 'remedial';

export interface Student {
  id: string;
  stt: number;
  studentCode: string; // e.g. HS301
  fullName: string;
  gender: 'Nam' | 'Nữ';
  birthDate: string;
  className: string;
  username?: string; // Tên đăng nhập học sinh
  password?: string; // Mật khẩu học sinh
  isDefaultPassword?: boolean; // True nếu đang dùng mật khẩu mặc định (123456)
  lastPasswordChangedAt?: string; // Thời điểm đổi mật khẩu gần nhất
  abilityTier?: AbilityTier; // Nhóm năng lực: Hoàn thành Tốt (advanced) / Hoàn thành (proficient) / Cần hỗ trợ (remedial)
  accountStatus: 'active' | 'pending';
  attendanceStatus: 'present' | 'excused' | 'unexcused' | 'late';
  attendanceHistory: {
    date: string;
    status: 'present' | 'excused' | 'unexcused' | 'late';
    note?: string;
  }[];
  activeTasksCount: number;
  learningProgress: number; // 0 - 100%
  skills: {
    english: number; // 0 - 100
    math: number;
    vietnamese: number;
    informatics: number;
    [subjectKey: string]: number;
  };
  supportGoal: string;
  badges: string[]; // Badge IDs
  parentName: string;
  parentPhone: string;
  seatGroup?: number; // 1 to 4
  seatIndex?: number; // seat within group
}

export interface AttendanceRecord {
  date: string;
  studentId: string;
  status: 'present' | 'excused' | 'unexcused' | 'late';
  note?: string;
  recordedAt: string;
}

export type SubjectType = 'english' | 'math' | 'vietnamese' | 'informatics' | 'general' | string;

export interface AssignmentQuestion {
  id: string;
  question: string;
  options?: string[];
  correctAnswer?: string;
  hint?: string;
  points?: number;
}

export interface AssignmentSubmission {
  id: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  status: 'submitted' | 'graded';
  score?: number; // Thang điểm 10
  answers?: Record<string, string>;
  teacherFeedback?: string;
  aiProgressEvaluation?: {
    growthScore: number; // % tiến bộ so với mức trước (+5%, +12%...)
    strengths: string[];
    improvements: string[];
    pedagogicalAdvice: string;
    evaluatedTier: AbilityTier;
  };
}

export interface Assignment {
  id: string;
  title: string;
  subject: SubjectType;
  description: string;
  deadline: string;
  assignedMode: 'all' | 'group' | 'individual' | 'ability_tiered';
  targetStudentIds: string[]; // empty if 'all'
  targetGroupName?: string; // e.g. "Nhóm Hoàn thành Tốt", "Nhóm Cần hỗ trợ"
  targetAbilityTier?: AbilityTier | 'all'; // Phân hóa theo năng lực
  difficultyLevel?: 'advanced' | 'standard' | 'basic'; // Mức độ khó
  criteria: string;
  status: 'active' | 'completed' | 'draft';
  submissionsCount: number;
  totalAssigned: number;
  createdAt: string;
  questions?: AssignmentQuestion[];
  submissions?: AssignmentSubmission[];
}

export interface StudentGrowthReport {
  studentId: string;
  studentName: string;
  studentCode: string;
  className: string;
  initialProgress: number;
  currentProgress: number;
  growthPercentage: number;
  currentTier: AbilityTier;
  previousTier: AbilityTier;
  totalAssignmentsCompleted: number;
  averageScore: number;
  skillGrowth: Record<string, { before: number; after: number; change: number }>;
  tt27Evaluation: {
    achievementLevel: 'T' | 'H' | 'C';
    comment: string;
    strengths: string[];
    weaknesses: string[];
    recommendationsForTeacher: string;
    recommendationsForParent: string;
  };
  analyzedAt: string;
}

export interface PositiveBadge {
  id: string;
  name: string;
  englishName: string;
  icon: string;
  color: string;
  description: string;
  category: 'morals' | 'learning' | 'creativity' | 'community';
}

export interface EnglishLesson {
  id: string;
  title: string;
  topic: string;
  vietnameseTitle: string;
  vocabulary: {
    word: string;
    phonetic: string;
    meaning: string;
    example: string;
    exampleVi: string;
    image: string;
  }[];
  sentencePattern: {
    pattern: string;
    meaning: string;
    examples: { en: string; vi: string }[];
  };
  conversation: {
    speaker: string;
    text: string;
    meaning: string;
  }[];
  readingText: {
    title: string;
    content: string;
    vietnameseTranslation: string;
  };
  practiceQuestions: {
    id: string;
    type: 'multiple-choice' | 'reorder' | 'match';
    question: string;
    options?: string[];
    correctAnswer: string;
    explanation: string;
  }[];
}

export interface MathLesson {
  id: string;
  title: string;
  vietnameseTitle: string;
  category: 'numbers' | 'operations' | 'geometry' | 'measurement' | 'time' | 'word-problems';
  keyTerms: { term: string; definition: string }[];
  visualModel: {
    type: 'abacus' | 'number-line' | 'place-value' | 'geometry-shape' | 'bar-model';
    description: string;
    sampleValue: any;
  };
  audioGuideText: string;
  stepGuide: string[];
  formulaBox: {
    rule: string;
    workedExamples: { problem: string; solution: string; steps: string[] }[];
  };
  realLifeStory: {
    title: string;
    scenario: string;
    question: string;
    answer: string;
  };
  readingProblem: {
    statement: string;
    givenData: string; // Bài toán cho biết gì
    questionData: string; // Bài toán hỏi gì
    solutionGuide: string;
  };
  practiceDrills: {
    id: string;
    type: 'multiple-choice' | 'match' | 'order-steps';
    question: string;
    options?: string[];
    correctAnswer: string | string[];
    hint: string;
    explanation: string;
  }[];
}

export interface VietnameseLesson {
  id: string;
  theme: string;
  title: string;
  bookSeries: 'Kết nối tri thức với cuộc sống';
  wordBank: { word: string; meaning: string; type: string }[];
  readingPassage: {
    title: string;
    author?: string;
    paragraphs: string[];
    audioSampleText: string;
    difficultWordsGlossary: { word: string; explanation: string }[];
  };
  grammarFocus: {
    topic: string; // Từ chỉ đặc điểm / Câu Ai làm gì / So sánh / Nhân hóa
    explanation: string;
    examples: string[];
  };
  writingLab: {
    prompt: string;
    stepGuides: string[];
    sampleParagraph: string;
  };
  comprehensionQuestions: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }[];
}

export interface InformaticsLesson {
  id: string;
  chapter: number;
  chapterTitle: string;
  lessonNumber: number;
  title: string;
  keyTerms: string[];
  virtualToolType: 'keyboard' | 'mouse' | 'file-tree' | 'slides' | 'algorithm';
  safetyBox: string;
  stepByStep: string[];
  realLifeContext: string;
  drills: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }[];
}

export interface EducationalGame {
  id: string;
  name: string;
  vietnameseName: string;
  type:
    | 'word-match'
    | 'magic-quiz'
    | 'listen-choose'
    | 'sentence-builder'
    | 'picture-detective'
    | 'educational-bingo'
    | 'memory-flip'
    | 'treasure-hunt'
    | 'story-maker'
    | 'team-challenge';
  subject: SubjectType;
  grade: number;
  description: string;
  rulesVi: string;
  questionsCount: number;
  sampleQuestions: {
    id: string;
    prompt: string;
    audioPrompt?: string;
    imagePrompt?: string;
    options?: string[];
    answer: string;
    hint?: string;
    pairs?: { left: string; right: string }[];
    tokens?: string[];
  }[];
}

export interface MaterialQuestion {
  id?: string;
  question: string;
  options?: string[];
  answer?: string;
  explanation?: string;
}

export interface LearningMaterial {
  id: string;
  title: string;
  type: 'pdf' | 'pptx' | 'docx' | 'video' | 'audio' | 'link' | 'quiz' | string;
  subject: SubjectType;
  grade: number;
  fileSize?: string;
  url: string;
  uploadedAt: string;
  description: string;
  author?: string;
  content?: string; // Nội dung bài giảng, tóm tắt kiến thức cốt lõi phục vụ tra cứu & chatbot AI
  keyConcepts?: string[]; // Khái niệm cốt lõi, từ khóa
  sampleQuestions?: MaterialQuestion[]; // Câu hỏi trắc nghiệm / tự luận đính kèm phục vụ làm bài tập & chatbot
  tags?: string[];
  viewCount?: number;
}

export interface ParentNotification {
  id: string;
  title: string;
  content: string;
  date: string;
  sender: string;
  isImportant: boolean;
  category: 'announcement' | 'attendance' | 'academic' | 'event';
  readBy: string[]; // parent IDs
}

export interface ParentFeedback {
  id: string;
  studentId: string;
  studentName: string;
  parentName: string;
  message: string;
  teacherReply?: string;
  sentAt: string;
  repliedAt?: string;
  status: 'new' | 'replied';
}

export interface AuthSession {
  username: string;
  role: 'teacher' | 'student';
  className: string;
  classId?: string;
  fullName: string;
  studentId?: string;
  avatar?: string;
  loggedInAt: string;
}

export interface ClassRoom {
  id: string; // e.g. 'c-3a2', 'c-3a1', 'c-4a1', 'c-5a2'
  name: string; // '3A2', '3A1', '4A1'
  grade: number; // 1, 2, 3, 4, 5
  schoolYear: string; // '2026–2027'
  schoolName: string; // 'Trường Tiểu học Hoài Nhơn'
  teacherName: string; // 'Đỗ Thị Hoà'
  teacherUsername?: string; // e.g. 'thhn_3a2', 'thhn_3c1'
  teacherPassword?: string; // Mặc định 'Thhn_12@', có thể thay đổi
  googleSheetUrl?: string;
  students: Student[];
}

export interface TeacherProfile {
  id: string;
  name: string;
  fullName?: string;
  title: string;
  school: string;
  schoolName?: string;
  className: string;
  schoolYear: string;
  slogan: string;
  avatar: string;
  phone?: string;
  email?: string;
  competitionTitle?: string;
  fullModelName?: string;
}

export interface CustomSubject {
  id: string; // 'science', 'history-geo', 'nature-society', 'ethics', 'technology', 'experiential', 'stem'
  name: string; // 'Khoa học', 'Lịch sử & Địa lý', etc.
  englishName: string; // 'Science', 'History & Geography'
  code: string; // 'KH', 'LS-ĐL'
  color: string; // Tailwind gradient: e.g. 'from-cyan-500 to-blue-600'
  badgeColor: string; // 'bg-cyan-600 text-white'
  icon: string; // Lucide icon identifier
  description: string;
  grades: number[]; // [1, 2, 3, 4, 5]
  isCore?: boolean;
  enabled: boolean;
}

export interface GenericLesson {
  id: string;
  subjectId: string; // matches CustomSubject.id or standard subject id
  grade: number; // 1, 2, 3, 4, 5
  chapter?: string;
  lessonNumber?: number;
  title: string;
  subtitle?: string;
  summary: string;
  contentParagraphs: string[];
  keyTerms: { term: string; explanation: string }[];
  practicalApplication?: string;
  audioText?: string;
  drills: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    hint: string;
    explanation: string;
  }[];
}
