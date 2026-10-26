import {
  Student,
  PositiveBadge,
  Assignment,
  EnglishLesson,
  MathLesson,
  VietnameseLesson,
  InformaticsLesson,
  EducationalGame,
  LearningMaterial,
  ParentNotification,
  ParentFeedback,
} from '../types';

export const INITIAL_TEACHER = {
  name: 'Đỗ Thị Hoà',
  fullName: 'Đỗ Thị Hoà',
  title: 'Giáo viên Chủ nhiệm',
  school: 'Trường Tiểu học Hoài Nhơn',
  className: '3A2',
  schoolYear: '2026–2027',
  slogan: 'Smart Classroom – Happy Students – Bilingual Future',
  competitionTitle: 'SẢN PHẨM DỰ THI ỨNG DỤNG AI TRONG GIÁO DỤC VIỆT NAM',
  fullModelName: 'Mô hình ứng dụng trí tuệ nhân tạo – công nghệ số trong quản lý, giáo dục song ngữ và kết nối học sinh tiểu học',
  avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=256'
};

export const POSITIVE_BADGES: PositiveBadge[] = [
  {
    id: 'kind-friend',
    name: 'Bạn Tốt Bụng',
    englishName: 'Kind Friend',
    icon: 'HeartHandshake',
    color: 'from-pink-500 to-rose-500',
    description: 'Biết chia sẻ, nhường nhịn và tận tình giúp đỡ bạn bè trong lớp.',
    category: 'morals'
  },
  {
    id: 'english-star',
    name: 'Ngôi Sao Tiếng Anh',
    englishName: 'English Star',
    icon: 'Sparkles',
    color: 'from-amber-400 to-yellow-500',
    description: 'Chăm chỉ luyện phát âm, tự tin giao tiếp song ngữ Anh - Việt.',
    category: 'learning'
  },
  {
    id: 'reading-hero',
    name: 'Dũng Sĩ Đọc Sách',
    englishName: 'Reading Hero',
    icon: 'BookOpen',
    color: 'from-blue-500 to-indigo-600',
    description: 'Yêu thích đọc sách báo, đọc diễn cảm và hiểu nội dung bài học sâu sắc.',
    category: 'learning'
  },
  {
    id: 'creative-thinker',
    name: 'Tư Duy Sáng Tạo',
    englishName: 'Creative Thinker',
    icon: 'Lightbulb',
    color: 'from-purple-500 to-indigo-500',
    description: 'Có cách giải toán độc đáo, phát biểu ý tưởng mới mẻ và vẽ sơ đồ tư duy đẹp.',
    category: 'creativity'
  },
  {
    id: 'teamwork-champion',
    name: 'Quán Quân Đồng Đội',
    englishName: 'Teamwork Champion',
    icon: 'Users',
    color: 'from-teal-400 to-emerald-500',
    description: 'Biết lắng nghe, phối hợp ăn ý và cùng các bạn hoàn thành nhiệm vụ nhóm.',
    category: 'community'
  },
  {
    id: 'daily-learner',
    name: 'Chăm Chỉ Mỗi Ngày',
    englishName: 'Daily Learner',
    icon: 'Flame',
    color: 'from-orange-400 to-red-500',
    description: 'Duy trì thói quen học tập đều đặn, hoàn thành bài tập đúng hạn.',
    category: 'learning'
  },
  {
    id: 'green-hero',
    name: 'Hiệp Sĩ Xanh',
    englishName: 'Green Hero',
    icon: 'Leaf',
    color: 'from-emerald-500 to-green-600',
    description: 'Giữ gìn vệ sinh lớp học sạch đẹp, biết tiết kiệm điện nước và chăm sóc cây xanh.',
    category: 'community'
  },
  {
    id: 'helpful-hands',
    name: 'Đôi Tay Khéo Léo',
    englishName: 'Helpful Hands',
    icon: 'HandHelping',
    color: 'from-cyan-400 to-blue-500',
    description: 'Nhanh nhẹn hỗ trợ cô giáo và lớp trưởng trong các hoạt động chung của lớp.',
    category: 'morals'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 's-1',
    stt: 1,
    studentCode: 'HS3A201',
    fullName: 'Nguyễn Điền Minh Anh',
    gender: 'Nam',
    birthDate: '2018-08-16',
    className: '3A2',
    accountStatus: 'active',
    attendanceStatus: 'present',
    attendanceHistory: [
      { date: '2026-10-16', status: 'present' },
      { date: '2026-10-15', status: 'present' },
      { date: '2026-10-14', status: 'present' },
      { date: '2026-10-13', status: 'present' },
      { date: '2026-10-12', status: 'present' }
    ],
    activeTasksCount: 2,
    learningProgress: 94,
    skills: { english: 92, math: 95, vietnamese: 90, informatics: 88 },
    supportGoal: 'Phát huy năng khiếu thuyết trình tiếng Anh và dẫn dắt hoạt động nhóm',
    badges: ['english-star', 'kind-friend', 'creative-thinker'],
    parentName: 'Nguyễn Bạn',
    parentPhone: '0382 487 082',
    seatGroup: 1,
    seatIndex: 1
  },
  {
    id: 's-2',
    stt: 2,
    studentCode: 'HS3A202',
    fullName: 'Lê Thái Bảo',
    gender: 'Nam',
    birthDate: '2018-05-27',
    className: '3A2',
    accountStatus: 'active',
    attendanceStatus: 'present',
    attendanceHistory: [
      { date: '2026-10-16', status: 'present' },
      { date: '2026-10-15', status: 'present' },
      { date: '2026-10-14', status: 'late', note: 'Kẹt xe cùng bố' },
      { date: '2026-10-13', status: 'present' },
      { date: '2026-10-12', status: 'present' }
    ],
    activeTasksCount: 3,
    learningProgress: 88,
    skills: { english: 85, math: 92, vietnamese: 86, informatics: 90 },
    supportGoal: 'Rèn luyện thêm ngữ điệu khi đọc bài tiếng Anh và tính toán có lời văn',
    badges: ['creative-thinker', 'teamwork-champion'],
    parentName: 'Lê Thanh Tùng',
    parentPhone: '0978 806 191',
    seatGroup: 1,
    seatIndex: 2
  },
  {
    id: 's-3',
    stt: 3,
    studentCode: 'HS3A203',
    fullName: 'Đặng Quốc Cường',
    gender: 'Nam',
    birthDate: '2018-01-27',
    className: '3A2',
    accountStatus: 'active',
    attendanceStatus: 'present',
    attendanceHistory: [
      { date: '2026-10-16', status: 'present' },
      { date: '2026-10-15', status: 'present' },
      { date: '2026-10-14', status: 'present' },
      { date: '2026-10-13', status: 'present' },
      { date: '2026-10-12', status: 'present' }
    ],
    activeTasksCount: 1,
    learningProgress: 91,
    skills: { english: 88, math: 96, vietnamese: 89, informatics: 92 },
    supportGoal: 'Khuyến khích tham gia giải toán thông minh và phụ trách nhóm học tập',
    badges: ['creative-thinker', 'daily-learner'],
    parentName: 'Đặng Văn Dự',
    parentPhone: '0386 693 524',
    seatGroup: 1,
    seatIndex: 3
  },
  {
    id: 's-4',
    stt: 4,
    studentCode: 'HS3A204',
    fullName: 'Trương Lê Tiến Đạt',
    gender: 'Nam',
    birthDate: '2018-01-05',
    className: '3A2',
    accountStatus: 'active',
    attendanceStatus: 'late',
    attendanceHistory: [
      { date: '2026-10-16', status: 'late', note: 'Đến muộn 5 phút' },
      { date: '2026-10-15', status: 'present' },
      { date: '2026-10-14', status: 'present' },
      { date: '2026-10-13', status: 'present' },
      { date: '2026-10-12', status: 'present' }
    ],
    activeTasksCount: 4,
    learningProgress: 82,
    skills: { english: 78, math: 86, vietnamese: 80, informatics: 85 },
    supportGoal: 'Hỗ trợ kỹ năng viết câu tiếng Việt và rèn tư thế gõ phím chuẩn F và J',
    badges: ['helpful-hands'],
    parentName: 'Trương Xuân Bình',
    parentPhone: '0983 569 842',
    seatGroup: 1,
    seatIndex: 4
  },
  {
    id: 's-5',
    stt: 5,
    studentCode: 'HS3A205',
    fullName: 'Nguyễn Đặng Nhật Huy',
    gender: 'Nam',
    birthDate: '2018-06-13',
    className: '3A2',
    accountStatus: 'active',
    attendanceStatus: 'present',
    attendanceHistory: [
      { date: '2026-10-16', status: 'present' },
      { date: '2026-10-15', status: 'present' },
      { date: '2026-10-14', status: 'present' },
      { date: '2026-10-13', status: 'present' },
      { date: '2026-10-12', status: 'present' }
    ],
    activeTasksCount: 2,
    learningProgress: 89,
    skills: { english: 86, math: 90, vietnamese: 88, informatics: 91 },
    supportGoal: 'Tập trung bồi dưỡng đọc diễn cảm và tăng vốn từ vựng song ngữ',
    badges: ['teamwork-champion', 'green-hero'],
    parentName: 'Nguyễn Tân Định',
    parentPhone: '0373 930 201',
    seatGroup: 1,
    seatIndex: 5
  },
  {
    id: 's-6',
    stt: 6,
    studentCode: 'HS3A206',
    fullName: 'Trương Nguyễn Quốc Khánh',
    gender: 'Nam',
    birthDate: '2018-10-14',
    className: '3A2',
    accountStatus: 'active',
    attendanceStatus: 'excused',
    attendanceHistory: [
      { date: '2026-10-16', status: 'excused', note: 'Phụ huynh xin phép đi khám răng' },
      { date: '2026-10-15', status: 'present' },
      { date: '2026-10-14', status: 'present' },
      { date: '2026-10-13', status: 'present' },
      { date: '2026-10-12', status: 'present' }
    ],
    activeTasksCount: 3,
    learningProgress: 84,
    skills: { english: 82, math: 87, vietnamese: 82, informatics: 86 },
    supportGoal: 'Bổ sung bài tập chính tả phân biệt ch/tr và rèn luyện kỹ năng gõ phím',
    badges: ['helpful-hands'],
    parentName: 'Trương Văn Chương',
    parentPhone: '0988 114 679',
    seatGroup: 1,
    seatIndex: 6
  },
  {
    id: 's-7',
    stt: 7,
    studentCode: 'HS3A207',
    fullName: 'Dương Nguyễn Đăng Khôi',
    gender: 'Nam',
    birthDate: '2018-06-19',
    className: '3A2',
    accountStatus: 'active',
    attendanceStatus: 'present',
    attendanceHistory: [
      { date: '2026-10-16', status: 'present' },
      { date: '2026-10-15', status: 'present' },
      { date: '2026-10-14', status: 'present' },
      { date: '2026-10-13', status: 'present' },
      { date: '2026-10-12', status: 'present' }
    ],
    activeTasksCount: 2,
    learningProgress: 92,
    skills: { english: 90, math: 94, vietnamese: 91, informatics: 93 },
    supportGoal: 'Rèn luyện khả năng thuyết trình và làm việc nhóm sáng tạo',
    badges: ['creative-thinker', 'daily-learner'],
    parentName: 'Dương Thanh Tiệp',
    parentPhone: '0365 459 854',
    seatGroup: 1,
    seatIndex: 7
  },
  {
    id: 's-8',
    stt: 8,
    studentCode: 'HS3A208',
    fullName: 'Bùi Tuấn Kiệt',
    gender: 'Nam',
    birthDate: '2018-04-16',
    className: '3A2',
    accountStatus: 'active',
    attendanceStatus: 'present',
    attendanceHistory: [
      { date: '2026-10-16', status: 'present' },
      { date: '2026-10-15', status: 'present' },
      { date: '2026-10-14', status: 'present' },
      { date: '2026-10-13', status: 'present' },
      { date: '2026-10-12', status: 'present' }
    ],
    activeTasksCount: 2,
    learningProgress: 86,
    skills: { english: 84, math: 89, vietnamese: 84, informatics: 88 },
    supportGoal: 'Rèn luyện thêm tính toán có lời văn 2 bước và tính cẩn thận',
    badges: ['teamwork-champion'],
    parentName: 'Bùi Trung Tiêng',
    parentPhone: '0987 205 000',
    seatGroup: 1,
    seatIndex: 8
  },
  {
    id: 's-9',
    stt: 9,
    studentCode: 'HS3A209',
    fullName: 'Trương Nguyễn Tuấn Kiệt',
    gender: 'Nam',
    birthDate: '2018-01-15',
    className: '3A2',
    accountStatus: 'active',
    attendanceStatus: 'present',
    attendanceHistory: [
      { date: '2026-10-16', status: 'present' },
      { date: '2026-10-15', status: 'present' },
      { date: '2026-10-14', status: 'present' },
      { date: '2026-10-13', status: 'present' },
      { date: '2026-10-12', status: 'present' }
    ],
    activeTasksCount: 1,
    learningProgress: 90,
    skills: { english: 88, math: 93, vietnamese: 89, informatics: 90 },
    supportGoal: 'Bồi dưỡng viết đoạn văn mở rộng và tự tin phát biểu',
    badges: ['reading-hero', 'daily-learner'],
    parentName: 'Trương Quốc Phong',
    parentPhone: '0961 224 559',
    seatGroup: 2,
    seatIndex: 1
  },
  {
    id: 's-10',
    stt: 10,
    studentCode: 'HS3A210',
    fullName: 'Bùi An Lam',
    gender: 'Nữ',
    birthDate: '2018-01-22',
    className: '3A2',
    accountStatus: 'active',
    attendanceStatus: 'present',
    attendanceHistory: [
      { date: '2026-10-16', status: 'present' },
      { date: '2026-10-15', status: 'present' },
      { date: '2026-10-14', status: 'present' },
      { date: '2026-10-13', status: 'present' },
      { date: '2026-10-12', status: 'present' }
    ],
    activeTasksCount: 1,
    learningProgress: 95,
    skills: { english: 96, math: 93, vietnamese: 96, informatics: 92 },
    supportGoal: 'Phát huy năng khiếu đọc diễn cảm và làm cán sự gương mẫu',
    badges: ['reading-hero', 'english-star', 'kind-friend'],
    parentName: 'Bùi Tấn Tiệm',
    parentPhone: '0965 823 840',
    seatGroup: 2,
    seatIndex: 2
  },
  {
    id: 's-11',
    stt: 11,
    studentCode: 'HS3A211',
    fullName: 'Nguyễn Ngọc Tố Mi',
    gender: 'Nữ',
    birthDate: '2018-10-24',
    className: '3A2',
    accountStatus: 'active',
    attendanceStatus: 'present',
    attendanceHistory: [
      { date: '2026-10-16', status: 'present' },
      { date: '2026-10-15', status: 'present' },
      { date: '2026-10-14', status: 'present' },
      { date: '2026-10-13', status: 'present' },
      { date: '2026-10-12', status: 'present' }
    ],
    activeTasksCount: 2,
    learningProgress: 93,
    skills: { english: 94, math: 91, vietnamese: 95, informatics: 90 },
    supportGoal: 'Tích cực tham gia câu lạc bộ tiếng Anh và rèn chữ viết sạch đẹp',
    badges: ['english-star', 'green-hero'],
    parentName: 'Nguyễn Hữu Tuấn',
    parentPhone: '0326 438 910',
    seatGroup: 2,
    seatIndex: 3
  },
  {
    id: 's-12',
    stt: 12,
    studentCode: 'HS3A212',
    fullName: 'Phạm Diễm My',
    gender: 'Nữ',
    birthDate: '2018-11-08',
    className: '3A2',
    accountStatus: 'active',
    attendanceStatus: 'present',
    attendanceHistory: [
      { date: '2026-10-16', status: 'present' },
      { date: '2026-10-15', status: 'present' },
      { date: '2026-10-14', status: 'present' },
      { date: '2026-10-13', status: 'present' },
      { date: '2026-10-12', status: 'present' }
    ],
    activeTasksCount: 3,
    learningProgress: 85,
    skills: { english: 82, math: 88, vietnamese: 86, informatics: 84 },
    supportGoal: 'Rèn luyện khả năng đọc hiểu và hoàn thành bài tập đúng hạn',
    badges: ['kind-friend', 'daily-learner'],
    parentName: 'Phạm Văn Vàng',
    parentPhone: '0866 573 349',
    seatGroup: 2,
    seatIndex: 4
  },
  {
    id: 's-13',
    stt: 13,
    studentCode: 'HS3A213',
    fullName: 'Lê Trần Bảo Ngân',
    gender: 'Nữ',
    birthDate: '2018-01-12',
    className: '3A2',
    accountStatus: 'active',
    attendanceStatus: 'present',
    attendanceHistory: [
      { date: '2026-10-16', status: 'present' },
      { date: '2026-10-15', status: 'present' },
      { date: '2026-10-14', status: 'present' },
      { date: '2026-10-13', status: 'present' },
      { date: '2026-10-12', status: 'present' }
    ],
    activeTasksCount: 1,
    learningProgress: 96,
    skills: { english: 98, math: 94, vietnamese: 97, informatics: 93 },
    supportGoal: 'Bồi dưỡng học sinh năng khiếu song ngữ Anh - Việt và dẫn đầu thi đua',
    badges: ['english-star', 'reading-hero', 'creative-thinker'],
    parentName: 'Lê Quang Lộc',
    parentPhone: '0388 583 718',
    seatGroup: 2,
    seatIndex: 5
  },
  {
    id: 's-14',
    stt: 14,
    studentCode: 'HS3A214',
    fullName: 'Phan Thế Phong',
    gender: 'Nam',
    birthDate: '2018-07-29',
    className: '3A2',
    accountStatus: 'active',
    attendanceStatus: 'present',
    attendanceHistory: [
      { date: '2026-10-16', status: 'present' },
      { date: '2026-10-15', status: 'present' },
      { date: '2026-10-14', status: 'present' },
      { date: '2026-10-13', status: 'present' },
      { date: '2026-10-12', status: 'present' }
    ],
    activeTasksCount: 2,
    learningProgress: 87,
    skills: { english: 85, math: 91, vietnamese: 84, informatics: 89 },
    supportGoal: 'Rèn luyện tính kiên nhẫn khi đọc hiểu các đoạn văn bản dài',
    badges: ['creative-thinker'],
    parentName: 'Phan Đình Khải',
    parentPhone: '0395 637 899',
    seatGroup: 2,
    seatIndex: 6
  },
  {
    id: 's-15',
    stt: 15,
    studentCode: 'HS3A215',
    fullName: 'Nguyễn Thiên Phúc',
    gender: 'Nam',
    birthDate: '2018-06-17',
    className: '3A2',
    accountStatus: 'active',
    attendanceStatus: 'present',
    attendanceHistory: [
      { date: '2026-10-16', status: 'present' },
      { date: '2026-10-15', status: 'present' },
      { date: '2026-10-14', status: 'present' },
      { date: '2026-10-13', status: 'present' },
      { date: '2026-10-12', status: 'present' }
    ],
    activeTasksCount: 2,
    learningProgress: 90,
    skills: { english: 89, math: 93, vietnamese: 90, informatics: 91 },
    supportGoal: 'Phát huy năng lực giải toán nhanh và hỗ trợ các bạn trong nhóm',
    badges: ['teamwork-champion', 'daily-learner'],
    parentName: 'Nguyễn Văn Sang',
    parentPhone: '0868 910 784',
    seatGroup: 2,
    seatIndex: 7
  },
  {
    id: 's-16',
    stt: 16,
    studentCode: 'HS3A216',
    fullName: 'Bùi Duy Quý',
    gender: 'Nam',
    birthDate: '2018-10-10',
    className: '3A2',
    accountStatus: 'active',
    attendanceStatus: 'present',
    attendanceHistory: [
      { date: '2026-10-16', status: 'present' },
      { date: '2026-10-15', status: 'present' },
      { date: '2026-10-14', status: 'present' },
      { date: '2026-10-13', status: 'present' },
      { date: '2026-10-12', status: 'present' }
    ],
    activeTasksCount: 2,
    learningProgress: 88,
    skills: { english: 86, math: 90, vietnamese: 87, informatics: 90 },
    supportGoal: 'Rèn luyện khả năng quan sát và miêu tả đồ vật trong giờ tiếng Việt',
    badges: ['helpful-hands'],
    parentName: 'Bùi Văn Thân',
    parentPhone: '0363 666 437',
    seatGroup: 2,
    seatIndex: 8
  },
  {
    id: 's-17',
    stt: 17,
    studentCode: 'HS3A217',
    fullName: 'Ngô Phan Ngân Quỳnh',
    gender: 'Nữ',
    birthDate: '2018-02-03',
    className: '3A2',
    accountStatus: 'active',
    attendanceStatus: 'present',
    attendanceHistory: [
      { date: '2026-10-16', status: 'present' },
      { date: '2026-10-15', status: 'present' },
      { date: '2026-10-14', status: 'present' },
      { date: '2026-10-13', status: 'present' },
      { date: '2026-10-12', status: 'present' }
    ],
    activeTasksCount: 1,
    learningProgress: 94,
    skills: { english: 95, math: 92, vietnamese: 95, informatics: 91 },
    supportGoal: 'Tập trung bồi dưỡng năng khiếu văn học và diễn đạt câu lưu loát',
    badges: ['reading-hero', 'kind-friend'],
    parentName: 'Ngô Văn Phương',
    parentPhone: '0365 919 616',
    seatGroup: 3,
    seatIndex: 1
  },
  {
    id: 's-18',
    stt: 18,
    studentCode: 'HS3A218',
    fullName: 'Tôn Phan Ái Quỳnh',
    gender: 'Nữ',
    birthDate: '2018-06-02',
    className: '3A2',
    accountStatus: 'active',
    attendanceStatus: 'present',
    attendanceHistory: [
      { date: '2026-10-16', status: 'present' },
      { date: '2026-10-15', status: 'present' },
      { date: '2026-10-14', status: 'present' },
      { date: '2026-10-13', status: 'present' },
      { date: '2026-10-12', status: 'present' }
    ],
    activeTasksCount: 2,
    learningProgress: 89,
    skills: { english: 91, math: 86, vietnamese: 92, informatics: 87 },
    supportGoal: 'Rèn luyện thêm tính toán có nhớ và tự tin phát biểu trong giờ học',
    badges: ['green-hero', 'kind-friend'],
    parentName: 'Tôn Minh Quân',
    parentPhone: '0969 426 151',
    seatGroup: 3,
    seatIndex: 2
  },
  {
    id: 's-19',
    stt: 19,
    studentCode: 'HS3A219',
    fullName: 'Võ Phú Sang',
    gender: 'Nam',
    birthDate: '2018-02-06',
    className: '3A2',
    accountStatus: 'active',
    attendanceStatus: 'present',
    attendanceHistory: [
      { date: '2026-10-16', status: 'present' },
      { date: '2026-10-15', status: 'present' },
      { date: '2026-10-14', status: 'present' },
      { date: '2026-10-13', status: 'present' },
      { date: '2026-10-12', status: 'present' }
    ],
    activeTasksCount: 2,
    learningProgress: 85,
    skills: { english: 82, math: 89, vietnamese: 83, informatics: 88 },
    supportGoal: 'Rèn luyện khả năng phát âm tiếng Anh và kỹ năng làm việc nhóm',
    badges: ['teamwork-champion'],
    parentName: 'Võ Thanh Tuấn',
    parentPhone: '0357 654 010',
    seatGroup: 3,
    seatIndex: 3
  },
  {
    id: 's-20',
    stt: 20,
    studentCode: 'HS3A220',
    fullName: 'Lê Thanh Tài',
    gender: 'Nam',
    birthDate: '2018-01-20',
    className: '3A2',
    accountStatus: 'active',
    attendanceStatus: 'present',
    attendanceHistory: [
      { date: '2026-10-16', status: 'present' },
      { date: '2026-10-15', status: 'present' },
      { date: '2026-10-14', status: 'present' },
      { date: '2026-10-13', status: 'present' },
      { date: '2026-10-12', status: 'present' }
    ],
    activeTasksCount: 2,
    learningProgress: 86,
    skills: { english: 84, math: 90, vietnamese: 84, informatics: 89 },
    supportGoal: 'Rèn tính cẩn thận khi làm bài kiểm tra và trình bày vở sạch đẹp',
    badges: ['daily-learner'],
    parentName: 'Lê Thanh Chương',
    parentPhone: '0978 904 169',
    seatGroup: 3,
    seatIndex: 4
  },
  {
    id: 's-21',
    stt: 21,
    studentCode: 'HS3A221',
    fullName: 'Trương Văn Tây',
    gender: 'Nam',
    birthDate: '2018-11-16',
    className: '3A2',
    accountStatus: 'active',
    attendanceStatus: 'present',
    attendanceHistory: [
      { date: '2026-10-16', status: 'present' },
      { date: '2026-10-15', status: 'present' },
      { date: '2026-10-14', status: 'present' },
      { date: '2026-10-13', status: 'present' },
      { date: '2026-10-12', status: 'present' }
    ],
    activeTasksCount: 3,
    learningProgress: 83,
    skills: { english: 80, math: 87, vietnamese: 82, informatics: 86 },
    supportGoal: 'Hỗ trợ nâng cao vốn từ vựng và tự tin khi thuyết trình trước lớp',
    badges: ['helpful-hands'],
    parentName: 'Trương Văn Lý',
    parentPhone: '0368 841 220',
    seatGroup: 3,
    seatIndex: 5
  },
  {
    id: 's-22',
    stt: 22,
    studentCode: 'HS3A222',
    fullName: 'Lê Phước Thịnh',
    gender: 'Nam',
    birthDate: '2018-03-02',
    className: '3A2',
    accountStatus: 'active',
    attendanceStatus: 'present',
    attendanceHistory: [
      { date: '2026-10-16', status: 'present' },
      { date: '2026-10-15', status: 'present' },
      { date: '2026-10-14', status: 'present' },
      { date: '2026-10-13', status: 'present' },
      { date: '2026-10-12', status: 'present' }
    ],
    activeTasksCount: 1,
    learningProgress: 91,
    skills: { english: 89, math: 94, vietnamese: 89, informatics: 92 },
    supportGoal: 'Tập trung giải các bài toán nâng cao và rèn luyện kỹ năng gõ phím',
    badges: ['creative-thinker', 'daily-learner'],
    parentName: 'Lê Văn Chào',
    parentPhone: '0935 251 904',
    seatGroup: 3,
    seatIndex: 6
  },
  {
    id: 's-23',
    stt: 23,
    studentCode: 'HS3A223',
    fullName: 'Lý Trần Kim Thoa',
    gender: 'Nữ',
    birthDate: '2018-05-07',
    className: '3A2',
    accountStatus: 'active',
    attendanceStatus: 'present',
    attendanceHistory: [
      { date: '2026-10-16', status: 'present' },
      { date: '2026-10-15', status: 'present' },
      { date: '2026-10-14', status: 'present' },
      { date: '2026-10-13', status: 'present' },
      { date: '2026-10-12', status: 'present' }
    ],
    activeTasksCount: 1,
    learningProgress: 95,
    skills: { english: 96, math: 93, vietnamese: 96, informatics: 93 },
    supportGoal: 'Phát huy tinh thần gương mẫu, chăm ngoan và hỗ trợ bạn bè học tốt',
    badges: ['reading-hero', 'kind-friend', 'english-star'],
    parentName: 'Lý Văn Thủ',
    parentPhone: '0847 740 677',
    seatGroup: 3,
    seatIndex: 7
  },
  {
    id: 's-24',
    stt: 24,
    studentCode: 'HS3A224',
    fullName: 'Nguyễn Trần Khả Thy',
    gender: 'Nữ',
    birthDate: '2018-08-16',
    className: '3A2',
    accountStatus: 'active',
    attendanceStatus: 'present',
    attendanceHistory: [
      { date: '2026-10-16', status: 'present' },
      { date: '2026-10-15', status: 'present' },
      { date: '2026-10-14', status: 'present' },
      { date: '2026-10-13', status: 'present' },
      { date: '2026-10-12', status: 'present' }
    ],
    activeTasksCount: 2,
    learningProgress: 90,
    skills: { english: 92, math: 88, vietnamese: 93, informatics: 88 },
    supportGoal: 'Rèn luyện thêm tính toán có lời văn và kỹ năng kể chuyện diễn cảm',
    badges: ['kind-friend', 'green-hero'],
    parentName: 'Nguyễn Văn Hộp',
    parentPhone: '0349 483 528',
    seatGroup: 4,
    seatIndex: 1
  },
  {
    id: 's-25',
    stt: 25,
    studentCode: 'HS3A225',
    fullName: 'Lê Nhật Thảo Tiên',
    gender: 'Nữ',
    birthDate: '2018-05-30',
    className: '3A2',
    accountStatus: 'active',
    attendanceStatus: 'present',
    attendanceHistory: [
      { date: '2026-10-16', status: 'present' },
      { date: '2026-10-15', status: 'present' },
      { date: '2026-10-14', status: 'present' },
      { date: '2026-10-13', status: 'present' },
      { date: '2026-10-12', status: 'present' }
    ],
    activeTasksCount: 2,
    learningProgress: 92,
    skills: { english: 94, math: 90, vietnamese: 93, informatics: 90 },
    supportGoal: 'Bồi dưỡng kỹ năng giao tiếp tiếng Anh tự tin và sáng tạo',
    badges: ['english-star', 'creative-thinker'],
    parentName: 'Lê Bích Thụ',
    parentPhone: '0337 507 079',
    seatGroup: 4,
    seatIndex: 2
  },
  {
    id: 's-26',
    stt: 26,
    studentCode: 'HS3A226',
    fullName: 'Hồ Thiên Trúc',
    gender: 'Nữ',
    birthDate: '2018-11-01',
    className: '3A2',
    accountStatus: 'active',
    attendanceStatus: 'present',
    attendanceHistory: [
      { date: '2026-10-16', status: 'present' },
      { date: '2026-10-15', status: 'present' },
      { date: '2026-10-14', status: 'present' },
      { date: '2026-10-13', status: 'present' },
      { date: '2026-10-12', status: 'present' }
    ],
    activeTasksCount: 1,
    learningProgress: 93,
    skills: { english: 93, math: 92, vietnamese: 94, informatics: 91 },
    supportGoal: 'Khuyến khích đọc thêm sách truyện thiếu nhi và viết nhật ký học tập',
    badges: ['reading-hero', 'daily-learner'],
    parentName: 'Hồ Quang Trung',
    parentPhone: '0358 203 249',
    seatGroup: 4,
    seatIndex: 3
  },
  {
    id: 's-27',
    stt: 27,
    studentCode: 'HS3A227',
    fullName: 'Bùi Anh Tú',
    gender: 'Nam',
    birthDate: '2018-06-04',
    className: '3A2',
    accountStatus: 'active',
    attendanceStatus: 'present',
    attendanceHistory: [
      { date: '2026-10-16', status: 'present' },
      { date: '2026-10-15', status: 'present' },
      { date: '2026-10-14', status: 'present' },
      { date: '2026-10-13', status: 'present' },
      { date: '2026-10-12', status: 'present' }
    ],
    activeTasksCount: 2,
    learningProgress: 88,
    skills: { english: 86, math: 92, vietnamese: 85, informatics: 91 },
    supportGoal: 'Rèn luyện tốc độ đọc diễn cảm và trả lời câu hỏi bài học',
    badges: ['creative-thinker', 'teamwork-champion'],
    parentName: 'Bùi Ngọc Thạch',
    parentPhone: '0963 300 109',
    seatGroup: 4,
    seatIndex: 4
  },
  {
    id: 's-28',
    stt: 28,
    studentCode: 'HS3A228',
    fullName: 'Trần Bích Tuyền',
    gender: 'Nữ',
    birthDate: '2018-02-27',
    className: '3A2',
    accountStatus: 'active',
    attendanceStatus: 'present',
    attendanceHistory: [
      { date: '2026-10-16', status: 'present' },
      { date: '2026-10-15', status: 'present' },
      { date: '2026-10-14', status: 'present' },
      { date: '2026-10-13', status: 'present' },
      { date: '2026-10-12', status: 'present' }
    ],
    activeTasksCount: 2,
    learningProgress: 91,
    skills: { english: 90, math: 91, vietnamese: 93, informatics: 89 },
    supportGoal: 'Bồi dưỡng năng khiếu tiếng Việt và rèn chữ viết nắn nót',
    badges: ['kind-friend', 'daily-learner'],
    parentName: 'Trần Chi',
    parentPhone: '0345 420 473',
    seatGroup: 4,
    seatIndex: 5
  },
  {
    id: 's-29',
    stt: 29,
    studentCode: 'HS3A229',
    fullName: 'Nguyễn Hà Uyên',
    gender: 'Nữ',
    birthDate: '2018-03-02',
    className: '3A2',
    accountStatus: 'active',
    attendanceStatus: 'present',
    attendanceHistory: [
      { date: '2026-10-16', status: 'present' },
      { date: '2026-10-15', status: 'present' },
      { date: '2026-10-14', status: 'present' },
      { date: '2026-10-13', status: 'present' },
      { date: '2026-10-12', status: 'present' }
    ],
    activeTasksCount: 1,
    learningProgress: 94,
    skills: { english: 95, math: 92, vietnamese: 95, informatics: 92 },
    supportGoal: 'Phát huy năng lực thuyết trình song ngữ và làm việc nhóm',
    badges: ['english-star', 'reading-hero'],
    parentName: 'Nguyễn Văn Cần',
    parentPhone: '0377 113 206',
    seatGroup: 4,
    seatIndex: 6
  },
  {
    id: 's-30',
    stt: 30,
    studentCode: 'HS3A230',
    fullName: 'Lê Nguyễn Quốc Vương',
    gender: 'Nam',
    birthDate: '2018-11-18',
    className: '3A2',
    accountStatus: 'active',
    attendanceStatus: 'present',
    attendanceHistory: [
      { date: '2026-10-16', status: 'present' },
      { date: '2026-10-15', status: 'present' },
      { date: '2026-10-14', status: 'present' },
      { date: '2026-10-13', status: 'present' },
      { date: '2026-10-12', status: 'present' }
    ],
    activeTasksCount: 2,
    learningProgress: 89,
    skills: { english: 88, math: 93, vietnamese: 86, informatics: 92 },
    supportGoal: 'Rèn luyện khả năng tập trung và phát biểu sôi nổi trong giờ học',
    badges: ['creative-thinker', 'teamwork-champion'],
    parentName: 'Lê Thanh Toàn',
    parentPhone: '0354 637 846',
    seatGroup: 4,
    seatIndex: 7
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'assign-1',
    title: 'Thực hành Tiếng Anh: Chủ đề Friends & Giới thiệu bản thân',
    subject: 'english',
    description: 'Nghe phát âm, hoàn thành 5 câu trắc nghiệm và ghi âm giới thiệu 1 người bạn thân bằng tiếng Anh.',
    deadline: '2026-10-20',
    assignedMode: 'all',
    targetStudentIds: [],
    criteria: 'Đạt từ 80% điểm số bài tập và phát âm rõ từ vựng chủ đề Friends',
    status: 'active',
    submissionsCount: 14,
    totalAssigned: 16,
    createdAt: '2026-10-15'
  },
  {
    id: 'assign-2',
    title: 'Toán học: Luyện tập phép nhân số có ba chữ số với số có một chữ số',
    subject: 'math',
    description: 'Thực hành 6 bài tập tính nhẩm và 2 bài toán có lời văn rút về đơn vị.',
    deadline: '2026-10-21',
    assignedMode: 'all',
    targetStudentIds: [],
    criteria: 'Trình bày đủ các bước giải và đáp số chính xác',
    status: 'active',
    submissionsCount: 12,
    totalAssigned: 16,
    createdAt: '2026-10-16'
  },
  {
    id: 'assign-3',
    title: 'Nhiệm vụ phân hóa: Bồi dưỡng mở rộng đoạn văn miêu tả đồ vật',
    subject: 'vietnamese',
    description: 'Quan sát đồ dùng học tập em yêu thích, viết đoạn văn 4-5 câu có sử dụng biện pháp so sánh.',
    deadline: '2026-10-22',
    assignedMode: 'group',
    targetGroupName: 'Nhóm bồi dưỡng năng khiếu văn',
    targetStudentIds: ['s-1', 's-3', 's-9', 's-15'],
    criteria: 'Sử dụng ít nhất 1 hình ảnh so sánh sinh động và chấm phẩy đúng vị trí',
    status: 'active',
    submissionsCount: 3,
    totalAssigned: 4,
    createdAt: '2026-10-16'
  },
  {
    id: 'assign-4',
    title: 'Nhiệm vụ cá nhân hóa: Rèn luyện kỹ năng gõ phím chuẩn F và J',
    subject: 'informatics',
    description: 'Thực hành với bàn phím ảo, rèn thói quen đặt 2 ngón trỏ lên phím F và J, đạt tối thiểu 15 từ/phút.',
    deadline: '2026-10-23',
    assignedMode: 'individual',
    targetStudentIds: ['s-4', 's-6', 's-12'],
    criteria: 'Thao tác đúng 10 ngón tay và hoàn thành bài luyện gõ',
    status: 'active',
    submissionsCount: 1,
    totalAssigned: 3,
    createdAt: '2026-10-16'
  }
];

export const ENGLISH_LESSONS: EnglishLesson[] = [
  {
    id: 'eng-1',
    title: 'Unit 1: Friends (Bạn bè)',
    topic: 'Friends',
    vietnameseTitle: 'Chủ đề: Bạn bè & Làm quen',
    vocabulary: [
      {
        word: 'Friend',
        phonetic: '/frend/',
        meaning: 'Người bạn',
        example: 'This is my best friend, Nam.',
        exampleVi: 'Đây là bạn thân nhất của mình, bạn Nam.',
        image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=300'
      },
      {
        word: 'Classmate',
        phonetic: '/ˈklɑːs.meɪt/',
        meaning: 'Bạn cùng lớp',
        example: 'We are classmates in class 3C1.',
        exampleVi: 'Chúng mình là bạn cùng lớp 3C1.',
        image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=300'
      },
      {
        word: 'Play',
        phonetic: '/pleɪ/',
        meaning: 'Chơi đùa',
        example: 'We play badminton at break time.',
        exampleVi: 'Chúng mình chơi cầu lông vào giờ ra chơi.',
        image: 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&q=80&w=300'
      },
      {
        word: 'Share',
        phonetic: '/ʃeər/',
        meaning: 'Chia sẻ, nhường nhịn',
        example: 'Good friends share their toys.',
        exampleVi: 'Bạn bè tốt biết chia sẻ đồ chơi cùng nhau.',
        image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=300'
      }
    ],
    sentencePattern: {
      pattern: 'This is my friend, [Name]. He/She is [adjective].',
      meaning: 'Đây là bạn của mình, [Tên]. Bạn ấy rất [tính từ].',
      examples: [
        { en: 'This is my friend, Lan. She is kind.', vi: 'Đây là bạn của mình, Lan. Bạn ấy rất tốt bụng.' },
        { en: 'This is my friend, Minh. He is smart.', vi: 'Đây là bạn của mình, Minh. Bạn ấy rất thông minh.' }
      ]
    },
    conversation: [
      { speaker: 'Mai', text: 'Hello, Tony! Who is that?', meaning: 'Xin chào Tony! Ai đằng kia vậy?' },
      { speaker: 'Tony', text: 'Hello Mai. That is Peter. He is my new classmate in 3C1.', meaning: 'Chào Mai. Đó là Peter. Bạn ấy là bạn cùng lớp mới của mình ở 3C1.' },
      { speaker: 'Mai', text: 'Nice to meet you, Peter! Let us play together.', meaning: 'Rất vui được gặp bạn, Peter! Chúng mình cùng chơi nhé.' }
    ],
    readingText: {
      title: 'Our Happy Classroom 3C1',
      content: 'Hello, I am Bao An from Class 3C1 at Hoai Nhon Primary School. Our teacher is Ms. Do Thi Hoa. In my class, we have many good friends. We love helping each other every day. We are happy students!',
      vietnameseTranslation: 'Xin chào, mình là Bảo An học lớp 3C1 trường Tiểu học Hoài Nhơn. Cô giáo chủ nhiệm của chúng mình là cô Đỗ Thị Hoà. Trong lớp, chúng mình có rất nhiều bạn tốt. Chúng mình thích giúp đỡ lẫn nhau mỗi ngày. Chúng mình là những học sinh hạnh phúc!'
    },
    practiceQuestions: [
      {
        id: 'eq-1',
        type: 'multiple-choice',
        question: 'What is the English word for "Người bạn"?',
        options: ['Friend', 'Teacher', 'Book', 'Pencil'],
        correctAnswer: 'Friend',
        explanation: 'Friend có nghĩa là người bạn. Teacher là giáo viên, Book là sách, Pencil là bút chì.'
      },
      {
        id: 'eq-2',
        type: 'multiple-choice',
        question: 'Complete the sentence: "This is my friend, Lan. _____ is kind."',
        options: ['She', 'He', 'They', 'It'],
        correctAnswer: 'She',
        explanation: 'Lan là bạn nữ nên chúng mình dùng đại từ "She".'
      },
      {
        id: 'eq-3',
        type: 'multiple-choice',
        question: 'Who is the homeroom teacher of Class 3C1?',
        options: ['Ms. Do Thi Hoa', 'Mr. David', 'Ms. Lan', 'Mr. Peter'],
        correctAnswer: 'Ms. Do Thi Hoa',
        explanation: 'Cô giáo chủ nhiệm lớp 3C1 là cô Đỗ Thị Hoà.'
      }
    ]
  },
  {
    id: 'eng-2',
    title: 'Unit 2: My Family (Gia đình em)',
    topic: 'My family',
    vietnameseTitle: 'Chủ đề: Gia đình yêu thương',
    vocabulary: [
      {
        word: 'Father',
        phonetic: '/ˈfɑː.ðər/',
        meaning: 'Bố, ba, cha',
        example: 'My father is a doctor.',
        exampleVi: 'Bố của mình là một bác sĩ.',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300'
      },
      {
        word: 'Mother',
        phonetic: '/ˈmʌð.ər/',
        meaning: 'Mẹ, má',
        example: 'My mother is very gentle.',
        exampleVi: 'Mẹ của mình rất dịu dàng.',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300'
      },
      {
        word: 'Brother',
        phonetic: '/ˈbrʌð.ər/',
        meaning: 'Anh trai, em trai',
        example: 'I have an older brother.',
        exampleVi: 'Mình có một người anh trai.',
        image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300'
      },
      {
        word: 'Sister',
        phonetic: '/ˈsɪs.tər/',
        meaning: 'Chị gái, em gái',
        example: 'My sister is seven years old.',
        exampleVi: 'Em gái mình bảy tuổi.',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300'
      }
    ],
    sentencePattern: {
      pattern: 'Who is this? - This is my [family member].',
      meaning: 'Đây là ai? - Đây là [thành viên gia đình] của mình.',
      examples: [
        { en: 'Who is this? - This is my mother.', vi: 'Đây là ai? - Đây là mẹ của mình.' }
      ]
    },
    conversation: [
      { speaker: 'An', text: 'Look at this photo! This is my family.', meaning: 'Hãy xem bức ảnh này! Đây là gia đình của mình.' },
      { speaker: 'Khang', text: 'Who is this man?', meaning: 'Người đàn ông này là ai thế?' },
      { speaker: 'An', text: 'He is my father. He is very kind.', meaning: 'Đó là bố mình. Bố rất hiền hậu.' }
    ],
    readingText: {
      title: 'Family Love',
      content: 'There are four people in my family: my father, my mother, my little sister, and me. We have dinner together and tell funny stories. I love my family very much.',
      vietnameseTranslation: 'Có bốn người trong gia đình mình: bố mình, mẹ mình, em gái nhỏ và mình. Chúng mình ăn tối cùng nhau và kể những câu chuyện vui vẻ. Mình yêu gia đình mình rất nhiều.'
    },
    practiceQuestions: [
      {
        id: 'eq-21',
        type: 'multiple-choice',
        question: 'Which word means "Chị gái hoặc em gái"?',
        options: ['Sister', 'Brother', 'Father', 'Uncle'],
        correctAnswer: 'Sister',
        explanation: 'Sister là chị gái hoặc em gái. Brother là anh/em trai.'
      }
    ]
  },
  {
    id: 'eng-3',
    title: 'Unit 3: School Subjects (Môn học của em)',
    topic: 'School subjects',
    vietnameseTitle: 'Chủ đề: Các môn học yêu thích',
    vocabulary: [
      {
        word: 'English',
        phonetic: '/ˈɪŋ.ɡlɪʃ/',
        meaning: 'Môn Tiếng Anh',
        example: 'We learn English on Tuesday.',
        exampleVi: 'Chúng mình học Tiếng Anh vào thứ Ba.',
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=300'
      },
      {
        word: 'Math',
        phonetic: '/mæθ/',
        meaning: 'Môn Toán',
        example: 'Math helps us solve problems.',
        exampleVi: 'Toán học giúp chúng mình giải quyết vấn đề.',
        image: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&q=80&w=300'
      },
      {
        word: 'Vietnamese',
        phonetic: '/ˌvjet.nəˈmiːz/',
        meaning: 'Môn Tiếng Việt',
        example: 'We read poems in Vietnamese class.',
        exampleVi: 'Chúng mình đọc thơ trong giờ Tiếng Việt.',
        image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=300'
      },
      {
        word: 'Informatics',
        phonetic: '/ˌɪn.fəˈmæt.ɪks/',
        meaning: 'Môn Tin học',
        example: 'We practice typing in Informatics.',
        exampleVi: 'Chúng mình luyện gõ phím trong giờ Tin học.',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=300'
      }
    ],
    sentencePattern: {
      pattern: 'What subjects do you have today? - I have [Subject].',
      meaning: 'Hôm nay bạn có những môn học nào? - Mình có môn [Môn học].',
      examples: [
        { en: 'What subjects do you have today? - I have Math and English.', vi: 'Hôm nay bạn học môn gì? - Mình học Toán và Tiếng Anh.' }
      ]
    },
    conversation: [
      { speaker: 'Lan', text: 'Do you like Informatics?', meaning: 'Bạn có thích môn Tin học không?' },
      { speaker: 'Minh', text: 'Yes, I do! I love learning computer skills with AI Class.', meaning: 'Có chứ! Mình rất thích học kỹ năng máy tính cùng AI Class.' }
    ],
    readingText: {
      title: 'A School Day in 3C1',
      content: 'Every morning at Hoai Nhon Primary School is full of joy. We study Math, Vietnamese, English, and Informatics. Ms. Hoa always creates exciting games for us to learn.',
      vietnameseTranslation: 'Mỗi buổi sáng tại trường Tiểu học Hoài Nhơn đều ngập tràn niềm vui. Chúng mình học Toán, Tiếng Việt, Tiếng Anh và Tin học. Cô Hoà luôn tạo những trò chơi hào hứng để chúng mình học tập.'
    },
    practiceQuestions: [
      {
        id: 'eq-31',
        type: 'multiple-choice',
        question: 'What subject teaches us how to use computers and keyboards?',
        options: ['Informatics', 'Math', 'Art', 'Music'],
        correctAnswer: 'Informatics',
        explanation: 'Môn Tin học (Informatics) hướng dẫn các em sử dụng máy tính và bàn phím.'
      }
    ]
  },
  {
    id: 'eng-4',
    title: 'Unit 4: Places (Địa điểm)',
    topic: 'Places',
    vietnameseTitle: 'Chủ đề: Những nơi chốn quanh em',
    vocabulary: [
      {
        word: 'School',
        phonetic: '/skuːl/',
        meaning: 'Trường học',
        example: 'Hoai Nhon Primary School is large and green.',
        exampleVi: 'Trường Tiểu học Hoài Nhơn rộng lớn và nhiều cây xanh.',
        image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=300'
      },
      {
        word: 'Classroom',
        phonetic: '/ˈklɑːs.ruːm/',
        meaning: 'Phòng học, lớp học',
        example: 'Our classroom 3C1 has smart screens.',
        exampleVi: 'Phòng học 3C1 của chúng mình có màn hình thông minh.',
        image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=300'
      },
      {
        word: 'Library',
        phonetic: '/ˈlaɪ.brər.i/',
        meaning: 'Thư viện',
        example: 'We read fairy tales in the library.',
        exampleVi: 'Chúng mình đọc truyện cổ tích trong thư viện.',
        image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=300'
      },
      {
        word: 'Playground',
        phonetic: '/ˈpleɪ.ɡraʊnd/',
        meaning: 'Sân chơi, sân trường',
        example: 'Students run happily in the playground.',
        exampleVi: 'Học sinh vui vẻ chạy nhảy trên sân trường.',
        image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=300'
      }
    ],
    sentencePattern: {
      pattern: 'Where are you going? - I am going to the [Place].',
      meaning: 'Bạn đang đi đâu thế? - Mình đang đi đến [Địa điểm].',
      examples: [
        { en: 'Where are you going? - I am going to the library.', vi: 'Bạn đang đi đâu thế? - Mình đang đi đến thư viện.' }
      ]
    },
    conversation: [
      { speaker: 'Bao An', text: 'Where are you going, Mai Anh?', meaning: 'Bạn đang đi đâu thế, Mai Anh?' },
      { speaker: 'Mai Anh', text: 'I am going to the school library to borrow a science book.', meaning: 'Mình đang đến thư viện trường để mượn sách khoa học.' }
    ],
    readingText: {
      title: 'Our Beautiful School',
      content: 'Hoai Nhon Primary School has many trees and flowers. We have a spacious playground, a bright computer room, and a cozy library. We keep all places clean and green.',
      vietnameseTranslation: 'Trường Tiểu học Hoài Nhơn có rất nhiều cây xanh và hoa. Chúng mình có một sân chơi rộng rãi, một phòng máy tính sáng sủa và một thư viện ấm cúng. Chúng mình luôn giữ gìn mọi nơi sạch sẽ và xanh mát.'
    },
    practiceQuestions: [
      {
        id: 'eq-41',
        type: 'multiple-choice',
        question: 'Where can you borrow books and read quiet stories?',
        options: ['Library', 'Playground', 'Gym', 'Canteen'],
        correctAnswer: 'Library',
        explanation: 'Library (Thư viện) là nơi mượn sách và đọc truyện.'
      }
    ]
  },
  {
    id: 'eng-5',
    title: 'Unit 5: Time (Thời gian & Đồng hồ)',
    topic: 'Time',
    vietnameseTitle: 'Chủ đề: Thời gian & Giờ giấc',
    vocabulary: [
      {
        word: 'Clock',
        phonetic: '/klɒk/',
        meaning: 'Đồng hồ treo tường/để bàn',
        example: 'Look at the clock on the wall.',
        exampleVi: 'Hãy nhìn chiếc đồng hồ trên tường.',
        image: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&q=80&w=300'
      },
      {
        word: 'Morning',
        phonetic: '/ˈmɔː.nɪŋ/',
        meaning: 'Buổi sáng',
        example: 'I wake up early in the morning.',
        exampleVi: 'Mình thức dậy sớm vào buổi sáng.',
        image: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&q=80&w=300'
      },
      {
        word: 'Afternoon',
        phonetic: '/ˌɑːf.təˈnuːn/',
        meaning: 'Buổi chiều',
        example: 'We play sports in the afternoon.',
        exampleVi: 'Chúng mình chơi thể thao vào buổi chiều.',
        image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&q=80&w=300'
      },
      {
        word: 'Minute',
        phonetic: '/ˈmɪn.ɪt/',
        meaning: 'Phút',
        example: 'There are sixty minutes in an hour.',
        exampleVi: 'Có sáu mươi phút trong một giờ.',
        image: 'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&q=80&w=300'
      }
    ],
    sentencePattern: {
      pattern: 'What time is it? - It is [number] o\'clock.',
      meaning: 'Mấy giờ rồi? - Bây giờ là [số] giờ đúng.',
      examples: [
        { en: 'What time is it? - It is seven o\'clock.', vi: 'Mấy giờ rồi? - Bây giờ là bảy giờ đúng.' }
      ]
    },
    conversation: [
      { speaker: 'Student', text: 'Teacher, what time is it?', meaning: 'Thưa cô, mấy giờ rồi ạ?' },
      { speaker: 'Ms. Hoa', text: 'It is eight o\'clock. Time for our English lesson!', meaning: 'Bây giờ là tám giờ đúng. Đến giờ học Tiếng Anh của lớp mình rồi!' }
    ],
    readingText: {
      title: 'Daily Routine',
      content: 'At seven o\'clock, we arrive at school. At eight o\'clock, our lessons begin. At four o\'clock in the afternoon, we say goodbye to Ms. Hoa and our friends.',
      vietnameseTranslation: 'Lúc 7 giờ đúng, chúng mình đến trường. Lúc 8 giờ đúng, các tiết học bắt đầu. Lúc 4 giờ chiều, chúng mình chào tạm biệt cô Hoà và các bạn.'
    },
    practiceQuestions: [
      {
        id: 'eq-51',
        type: 'multiple-choice',
        question: 'How do you ask for the time in English?',
        options: ['What time is it?', 'What name is it?', 'Where are you?', 'How old are you?'],
        correctAnswer: 'What time is it?',
        explanation: '"What time is it?" là mẫu câu hỏi giờ chuẩn xác trong Tiếng Anh.'
      }
    ]
  },
  {
    id: 'eng-6',
    title: 'Unit 6: Everyday Conversations (Giao tiếp hằng ngày)',
    topic: 'Everyday conversations',
    vietnameseTitle: 'Chủ đề: Giao tiếp lễ phép & Tự tin',
    vocabulary: [
      {
        word: 'Please',
        phonetic: '/pliːz/',
        meaning: 'Xin vui lòng, làm ơn',
        example: 'Stand up, please.',
        exampleVi: 'Xin mời cả lớp đứng dậy.',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300'
      },
      {
        word: 'Thank you',
        phonetic: '/θæŋk juː/',
        meaning: 'Cảm ơn bạn/thầy cô',
        example: 'Thank you for your help!',
        exampleVi: 'Cảm ơn bạn đã giúp đỡ mình!',
        image: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&q=80&w=300'
      },
      {
        word: 'Excuse me',
        phonetic: '/ɪkˈskjuːz miː/',
        meaning: 'Xin lỗi (khi xin phép, ngắt lời)',
        example: 'Excuse me, may I come in?',
        exampleVi: 'Xin lỗi cô, em xin phép vào lớp ạ.',
        image: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&q=80&w=300'
      },
      {
        word: 'Goodbye',
        phonetic: '/ˌɡʊdˈbaɪ/',
        meaning: 'Tạm biệt',
        example: 'Goodbye, see you tomorrow!',
        exampleVi: 'Tạm biệt, hẹn gặp lại bạn ngày mai!',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=300'
      }
    ],
    sentencePattern: {
      pattern: 'May I [action], please? - Yes, you may.',
      meaning: 'Em xin phép [hành động] được không ạ? - Được, em làm đi.',
      examples: [
        { en: 'May I go out, please? - Yes, you may.', vi: 'Thưa cô, em xin phép ra ngoài ạ? - Được, em ra đi.' }
      ]
    },
    conversation: [
      { speaker: 'Nam', text: 'Excuse me, Ms. Hoa. May I ask a question?', meaning: 'Thưa cô Hoà, em xin phép hỏi một câu được không ạ?' },
      { speaker: 'Ms. Hoa', text: 'Yes, of course, Nam. What is it?', meaning: 'Được chứ Nam, câu hỏi của em là gì nào?' },
      { speaker: 'Nam', text: 'Thank you, teacher!', meaning: 'Em cảm ơn cô ạ!' }
    ],
    readingText: {
      title: 'Polite Words in Class 3C1',
      content: 'In Class 3C1, students always use polite words. We say "Please", "Thank you", and "Excuse me". Being polite makes our classroom warm and happy.',
      vietnameseTranslation: 'Ở lớp 3C1, học sinh luôn dùng những lời lẽ lịch sự. Chúng mình nói "Làm ơn", "Cảm ơn" và "Xin phép". Sự lịch sự giúp lớp học của chúng mình luôn ấm áp và hạnh phúc.'
    },
    practiceQuestions: [
      {
        id: 'eq-61',
        type: 'multiple-choice',
        question: 'What do you say when someone helps you?',
        options: ['Thank you', 'Goodbye', 'No', 'Stop'],
        correctAnswer: 'Thank you',
        explanation: 'Khi ai đó giúp đỡ mình, chúng mình luôn nói "Thank you" (Cảm ơn bạn).'
      }
    ]
  }
];

export const MATH_LESSONS: MathLesson[] = [
  {
    id: 'math-1',
    title: 'Chuyên đề 1: Các số trong phạm vi 10.000 và 100.000',
    vietnameseTitle: 'Khái niệm hàng, lớp, đọc - viết và so sánh các số có 5 chữ số',
    category: 'numbers',
    keyTerms: [
      { term: 'Hàng đơn vị, chục, trăm, nghìn, chục nghìn', definition: 'Vị trí của từng chữ số từ phải sang trái theo hệ thập phân.' },
      { term: 'Số tròn chục nghìn', definition: 'Các số có tận cùng là 4 chữ số 0 (ví dụ: 10.000, 20.000, 50.000...).' },
      { term: 'So sánh số', definition: 'Số có nhiều chữ số hơn thì lớn hơn; nếu cùng số chữ số thì so sánh từng hàng từ trái sang phải.' }
    ],
    visualModel: {
      type: 'place-value',
      description: 'Bảng giá trị theo hàng: Chục nghìn | Nghìn | Trăm | Chục | Đơn vị',
      sampleValue: { 'Chục nghìn': 3, 'Nghìn': 4, 'Trăm': 2, 'Chục': 8, 'Đơn vị': 5 }
    },
    audioGuideText: 'Số 34.285 đọc là: Ba mươi tư nghìn hai trăm tám mươi lăm. Chữ số 3 thuộc hàng chục nghìn, chữ số 4 thuộc hàng nghìn, chữ số 2 thuộc hàng trăm, chữ số 8 thuộc hàng chục, chữ số 5 thuộc hàng đơn vị.',
    stepGuide: [
      'Bước 1: Tách số thành từng lớp từ phải qua trái (lớp đơn vị gồm hàng đơn vị, chục, trăm; lớp nghìn gồm nghìn, chục nghìn).',
      'Bước 2: Đọc từ trái sang phải theo từng hàng và thêm tên hàng tương ứng.',
      'Bước 3: Chú ý các trường hợp đặc biệt: 1 đọc là "mốt" khi đứng sau hàng chục > 1; 5 đọc là "lăm" khi hàng chục > 0.'
    ],
    formulaBox: {
      rule: 'Giá trị của một số = (Chữ số hàng chục nghìn × 10.000) + (Chữ số hàng nghìn × 1.000) + (Chữ số hàng trăm × 100) + (Chữ số hàng chục × 10) + Chữ số hàng đơn vị.',
      workedExamples: [
        {
          problem: 'Viết số 52.604 thành tổng các hàng:',
          solution: '52.604 = 50.000 + 2.000 + 600 + 4',
          steps: ['Hàng chục nghìn là 5 -> 50.000', 'Hàng nghìn là 2 -> 2.000', 'Hàng trăm là 6 -> 600', 'Hàng chục là 0', 'Hàng đơn vị là 4 -> 4']
        }
      ]
    },
    realLifeStory: {
      title: 'Chuyến xe cứu trợ bão lũ',
      scenario: 'Các bạn học sinh trường Tiểu học Hoài Nhơn quyên góp được 32.500 quyển vở và 15.200 cây bút gửi tặng các bạn vùng khó khăn.',
      question: 'Hỏi số quyển vở được đọc là gì và chữ số 3 thuộc hàng nào?',
      answer: 'Số 32.500 đọc là "Ba mươi hai nghìn năm trăm". Chữ số 3 thuộc hàng chục nghìn.'
    },
    readingProblem: {
      statement: 'Một thư viện tiểu học có 18.450 cuốn truyện thiếu nhi và 12.300 cuốn sách giáo khoa. Hỏi thư viện có tất cả bao nhiêu cuốn sách?',
      givenData: 'Truyện thiếu nhi: 18.450 cuốn; Sách giáo khoa: 12.300 cuốn.',
      questionData: 'Tổng số cuốn sách thư viện có tất cả.',
      solutionGuide: 'Thực hiện phép tính cộng: 18.450 + 12.300 = 30.750 (cuốn sách).'
    },
    practiceDrills: [
      {
        id: 'md-1',
        type: 'multiple-choice',
        question: 'Số "Bốn mươi lăm nghìn sáu trăm linh tám" được viết là:',
        options: ['45.608', '45.680', '45.068', '54.608'],
        correctAnswer: '45.608',
        hint: 'Chú ý chữ số 0 ở hàng chục (linh tám).',
        explanation: 'Bốn mươi lăm nghìn (45) + sáu trăm (6) + linh tám (08) = 45.608.'
      },
      {
        id: 'md-2',
        type: 'multiple-choice',
        question: 'Trong số 76.249, chữ số 6 có giá trị là bao nhiêu?',
        options: ['6.000', '60.000', '600', '60'],
        correctAnswer: '6.000',
        hint: 'Chữ số 6 đứng ở hàng nghìn.',
        explanation: 'Chữ số 6 ở hàng nghìn có giá trị là 6 x 1.000 = 6.000.'
      }
    ]
  },
  {
    id: 'math-2',
    title: 'Chuyên đề 2: Phép tính cộng, trừ, nhân, chia trong phạm vi 100.000',
    vietnameseTitle: 'Phép tính có nhớ, nhân chia số có nhiều chữ số với số có một chữ số',
    category: 'operations',
    keyTerms: [
      { term: 'Thừa số, tích', definition: 'Thừa số x Thừa số = Tích.' },
      { term: 'Số bị chia, số chia, thương, số dư', definition: 'Số bị chia = (Thương x Số chia) + Số dư (Số dư luôn nhỏ hơn số chia).' }
    ],
    visualModel: {
      type: 'abacus',
      description: 'Mô phỏng đặt tính rồi tính cột dọc có nhớ',
      sampleValue: '2.418 x 3 = 7.254'
    },
    audioGuideText: 'Khi nhân số có bốn chữ số với số có một chữ số, ta thực hiện nhân lần lượt từ phải sang trái, từ hàng đơn vị đến hàng nghìn. Nhớ cộng phần nhớ vào kết quả của hàng liền trước.',
    stepGuide: [
      'Bước 1: Đặt tính thẳng hàng.',
      'Bước 2: Nhân từ phải sang trái (đơn vị -> chục -> trăm -> nghìn).',
      'Bước 3: Nếu kết quả có nhớ, ghi chữ số hàng đơn vị và nhớ chữ số hàng chục sang phép nhân tiếp theo.'
    ],
    formulaBox: {
      rule: 'Muốn nhân số có nhiều chữ số với số có một chữ số, ta nhân thừa số thứ hai lần lượt với từng chữ số của thừa số thứ nhất từ phải sang trái.',
      workedExamples: [
        {
          problem: 'Đặt tính rồi tính: 1.234 x 3',
          solution: '1.234 x 3 = 3.702',
          steps: ['3 x 4 = 12, viết 2 nhớ 1', '3 x 3 = 9, thêm 1 bằng 10, viết 0 nhớ 1', '3 x 2 = 6, thêm 1 bằng 7, viết 7', '3 x 1 = 3, viết 3']
        }
      ]
    },
    realLifeStory: {
      title: 'Mua dụng cụ học tập lớp 3C1',
      scenario: 'Cô Đỗ Thị Hoà mua 4 bộ bảng nhóm cho lớp 3C1, mỗi bộ có giá 25.000 đồng.',
      question: 'Hỏi cô Hoà đã mua hết tất cả bao nhiêu tiền?',
      answer: 'Số tiền cô Hoà mua là: 25.000 x 4 = 100.000 đồng.'
    },
    readingProblem: {
      statement: 'Một cửa hàng có 3 thùng sữa, mỗi thùng đựng 1.250 hộp sữa. Cửa hàng đã bán được 2.000 hộp sữa. Hỏi cửa hàng còn lại bao nhiêu hộp sữa?',
      givenData: 'Có 3 thùng, mỗi thùng 1.250 hộp. Đã bán 2.000 hộp.',
      questionData: 'Số hộp sữa còn lại trong cửa hàng.',
      solutionGuide: 'Bước 1: Tính tổng số sữa (1.250 x 3 = 3.750 hộp). Bước 2: Tính số sữa còn lại (3.750 - 2.000 = 1.750 hộp).'
    },
    practiceDrills: [
      {
        id: 'md-21',
        type: 'multiple-choice',
        question: 'Kết quả của phép tính 4.120 x 2 là:',
        options: ['8.240', '8.220', '8.140', '8.420'],
        correctAnswer: '8.240',
        hint: 'Nhân 2 với từng chữ số: 2x0=0, 2x2=4, 2x1=2, 2x4=8.',
        explanation: '4.120 x 2 = 8.240.'
      }
    ]
  },
  {
    id: 'math-3',
    title: 'Chuyên đề 3: Hình học & Đo lường (Góc vuông, Chu vi & Diện tích)',
    vietnameseTitle: 'Điểm, đoạn thẳng, góc vuông; chu vi và diện tích hình vuông, hình chữ nhật',
    category: 'geometry',
    keyTerms: [
      { term: 'Góc vuông, góc không vuông', definition: 'Dùng ê-ke để kiểm tra đỉnh và 2 cạnh góc vuông.' },
      { term: 'Chu vi hình chữ nhật', definition: 'P = (Chiều dài + Chiều rộng) x 2 (cùng đơn vị đo).' },
      { term: 'Diện tích hình chữ nhật', definition: 'S = Chiều dài x Chiều rộng (cùng đơn vị đo).' },
      { term: 'Chu vi hình vuông', definition: 'P = Cạnh x 4.' },
      { term: 'Diện tích hình vuông', definition: 'S = Cạnh x Cạnh.' }
    ],
    visualModel: {
      type: 'geometry-shape',
      description: 'Mô phỏng hình chữ nhật kích thước 6cm x 4cm',
      sampleValue: { width: 6, height: 4, perimeter: 20, area: 24 }
    },
    audioGuideText: 'Muốn tính chu vi hình chữ nhật, ta lấy chiều dài cộng với chiều rộng rồi nhân với 2, lưu ý phải cùng một đơn vị đo. Muốn tính diện tích, ta lấy chiều dài nhân với chiều rộng.',
    stepGuide: [
      'Bước 1: Kiểm tra xem chiều dài và chiều rộng đã cùng một đơn vị đo chưa (nếu chưa thì đổi về cùng đơn vị đo).',
      'Bước 2: Áp dụng đúng công thức Chu vi hoặc Diện tích.',
      'Bước 3: Ghi đúng tên đơn vị đo (đơn vị độ dài cm/m đối với chu vi, đơn vị cm² hoặc m² đối với diện tích).'
    ],
    formulaBox: {
      rule: 'Chu vi: P = (a + b) x 2 | Diện tích: S = a x b (với a là chiều dài, b là chiều rộng).',
      workedExamples: [
        {
          problem: 'Một mảnh vườn hình chữ nhật có chiều dài 8m, chiều rộng 5m. Tính chu vi và diện tích mảnh vườn đó.',
          solution: 'Chu vi = (8 + 5) x 2 = 26 (m). Diện tích = 8 x 5 = 40 (m²).',
          steps: ['Chu vi: (8 + 5) x 2 = 26 m', 'Diện tích: 8 x 5 = 40 m²']
        }
      ]
    },
    realLifeStory: {
      title: 'Lát gạch sân trường Hoài Nhơn',
      scenario: 'Bác bảo vệ muốn lát lại một khoảng sân chơi hình vuông có cạnh dài 5 mét bằng các viên gạch chống trơn.',
      question: 'Tính diện tích khoảng sân chơi cần lát gạch.',
      answer: 'Diện tích khoảng sân hình vuông là: 5 x 5 = 25 (m²).'
    },
    readingProblem: {
      statement: 'Một tấm bìa hình chữ nhật có chiều dài 12 cm, chiều rộng bằng một nửa chiều dài. Tính diện tích của tấm bìa đó.',
      givenData: 'Chiều dài: 12 cm; Chiều rộng: bằng một nửa chiều dài (12 : 2 = 6 cm).',
      questionData: 'Diện tích tấm bìa hình chữ nhật.',
      solutionGuide: 'Bước 1: Chiều rộng là 12 : 2 = 6 cm. Bước 2: Diện tích tấm bìa là 12 x 6 = 72 cm².'
    },
    practiceDrills: [
      {
        id: 'md-31',
        type: 'multiple-choice',
        question: 'Một hình vuông có cạnh dài 6 cm. Chu vi của hình vuông đó là:',
        options: ['24 cm', '36 cm²', '12 cm', '20 cm'],
        correctAnswer: '24 cm',
        hint: 'Chu vi hình vuông = Cạnh x 4.',
        explanation: 'Chu vi hình vuông là 6 x 4 = 24 cm.'
      }
    ]
  },
  {
    id: 'math-4',
    title: 'Chuyên đề 4: Đơn vị đo đại lượng (Độ dài, Khối lượng, Dung tích & Tiền Việt Nam)',
    vietnameseTitle: 'Bảng đơn vị mm, cm, dm, m, km; g, kg; ml, l và đồng tiền Việt Nam',
    category: 'measurement',
    keyTerms: [
      { term: '1 km = 1.000 m', definition: 'Đơn vị đo độ dài khoảng cách lớn.' },
      { term: '1 kg = 1.000 g', definition: 'Đơn vị đo khối lượng.' },
      { term: '1 l = 1.000 ml', definition: 'Đơn vị đo dung tích chất lỏng.' },
      { term: 'Tiền Việt Nam', definition: 'Các mệnh giá 1.000đ, 2.000đ, 5.000đ, 10.000đ, 20.000đ, 50.000đ, 100.000đ.' }
    ],
    visualModel: {
      type: 'bar-model',
      description: 'Biểu đồ chuyển đổi đơn vị đo đại lượng',
      sampleValue: '1 kg = 1.000 g'
    },
    audioGuideText: 'Một ki-lô-gam bằng một nghìn gam. Khi đổi từ đơn vị lớn sang đơn vị bé liền kề, ta nhân với hệ số thích hợp; khi cộng trừ các đại lượng, phải đưa về cùng một đơn vị đo.',
    stepGuide: [
      'Bước 1: Xác định quan hệ giữa 2 đơn vị đo.',
      'Bước 2: Chuyển đổi về cùng một đơn vị đo trước khi thực hiện phép tính.',
      'Bước 3: Viết kèm tên đơn vị đo vào kết quả cuối cùng.'
    ],
    formulaBox: {
      rule: '1m = 100cm = 1.000mm | 1kg = 1.000g | 1l = 1.000ml.',
      workedExamples: [
        {
          problem: '2 kg 500 g = ? g',
          solution: '2 kg 500 g = 2.500 g',
          steps: ['2 kg = 2.000 g', '2.000 g + 500 g = 2.500 g']
        }
      ]
    },
    realLifeStory: {
      title: 'Pha sữa hạt cho bữa xế',
      scenario: 'Mẹ bạn Bảo An pha sữa hạt với 500 ml sữa tươi và 250 ml nước ép đậu đen.',
      question: 'Hỏi mẹ đã pha được tất cả bao nhiêu mi-li-lít nước uống?',
      answer: '500 ml + 250 ml = 750 ml.'
    },
    readingProblem: {
      statement: 'Một chai nước ngọt chứa 1 lít nước ngọt. Bạn Minh rót đầy vào 4 cốc nhỏ, mỗi cốc chứa 200 ml. Hỏi trong chai còn lại bao nhiêu mi-li-lít nước ngọt?',
      givenData: '1 lít nước ngọt (= 1.000 ml). Rót 4 cốc, mỗi cốc 200 ml (4 x 200 = 800 ml).',
      questionData: 'Lượng nước ngọt còn lại trong chai.',
      solutionGuide: '1 lít = 1.000 ml. Lượng nước đã rót: 200 x 4 = 800 ml. Lượng nước còn lại: 1.000 - 800 = 200 ml.'
    },
    practiceDrills: [
      {
        id: 'md-41',
        type: 'multiple-choice',
        question: '3 lít bằng bao nhiêu mi-li-lít?',
        options: ['3.000 ml', '300 ml', '30 ml', '30.000 ml'],
        correctAnswer: '3.000 ml',
        hint: '1 lít = 1.000 ml.',
        explanation: '3 lít = 3 x 1.000 = 3.000 ml.'
      }
    ]
  },
  {
    id: 'math-5',
    title: 'Chuyên đề 5: Thời gian & Xem đồng hồ chính xác đến từng phút',
    vietnameseTitle: 'Đọc giờ chính xác, xem lịch tháng/năm, tính khoảng thời gian trôi qua',
    category: 'time',
    keyTerms: [
      { term: 'Kim ngắn, kim dài', definition: 'Kim ngắn chỉ giờ, kim dài chỉ phút.' },
      { term: '1 giờ = 60 phút', definition: 'Mỗi vạch số trên mặt đồng hồ ứng với 5 phút.' },
      { term: 'Giờ hơn, giờ kém', definition: 'Khi kim phút vượt qua số 6, ta có thể đọc theo giờ kém.' }
    ],
    visualModel: {
      type: 'place-value',
      description: 'Mô phỏng mặt đồng hồ kim chỉ 8 giờ 15 phút và 8 giờ 45 phút (9 giờ kém 15)',
      sampleValue: { hour: 8, minute: 15 }
    },
    audioGuideText: 'Kim ngắn chỉ qua số 8 một chút, kim dài chỉ đúng số 3, đồng hồ đang chỉ 8 giờ 15 phút. Nếu kim dài chỉ số 9, đồng hồ chỉ 8 giờ 45 phút hoặc 9 giờ kém 15 phút.',
    stepGuide: [
      'Bước 1: Quan sát kim ngắn để biết giờ (vừa đi qua số nào).',
      'Bước 2: Quan sát kim dài để tính số phút (lấy số mà kim dài chỉ tới nhân với 5, rồi cộng các vạch lẻ nếu có).',
      'Bước 3: Đọc giờ hơn hoặc giờ kém theo quy ước.'
    ],
    formulaBox: {
      rule: 'Khoảng thời gian trôi qua = Thời điểm kết thúc - Thời điểm bắt đầu.',
      workedExamples: [
        {
          problem: 'Tiết học Tiếng Anh lớp 3C1 bắt đầu lúc 8 giờ 10 phút và kết thúc lúc 8 giờ 45 phút. Tiết học kéo dài bao nhiêu phút?',
          solution: 'Thời gian tiết học = 8 giờ 45 phút - 8 giờ 10 phút = 35 phút.',
          steps: ['45 phút - 10 phút = 35 phút']
        }
      ]
    },
    realLifeStory: {
      title: 'Giờ ra chơi vui vẻ',
      scenario: 'Tiếng trống ra chơi vang lên lúc 9 giờ 30 phút. Các bạn học sinh 3C1 vào lớp lúc 9 giờ 50 phút.',
      question: 'Hỏi giờ ra chơi của các bạn kéo dài bao nhiêu phút?',
      answer: '9 giờ 50 phút - 9 giờ 30 phút = 20 phút.'
    },
    readingProblem: {
      statement: 'Một bộ phim hoạt hình khoa học bắt đầu chiếu lúc 19 giờ 15 phút và kéo dài trong 45 phút. Hỏi bộ phim kết thúc lúc mấy giờ?',
      givenData: 'Bắt đầu: 19 giờ 15 phút. Thời lượng: 45 phút.',
      questionData: 'Thời điểm bộ phim kết thúc.',
      solutionGuide: '19 giờ 15 phút + 45 phút = 19 giờ 60 phút = 20 giờ đúng (8 giờ tối).'
    },
    practiceDrills: [
      {
        id: 'md-51',
        type: 'multiple-choice',
        question: 'Khi kim ngắn chỉ số 7, kim dài chỉ số 6, đồng hồ chỉ mấy giờ?',
        options: ['7 giờ 30 phút (hoặc 7 giờ rưỡi)', '7 giờ 6 phút', '6 giờ 35 phút', '8 giờ kém 30 phút'],
        correctAnswer: '7 giờ 30 phút (hoặc 7 giờ rưỡi)',
        hint: 'Khi kim dài chỉ số 6, tức là 6 x 5 = 30 phút.',
        explanation: '7 giờ 30 phút còn gọi là 7 giờ rưỡi.'
      }
    ]
  },
  {
    id: 'math-6',
    title: 'Chuyên đề 6: Toán có lời văn & Giải bài toán bằng hai bước tính',
    vietnameseTitle: 'Bài toán rút về đơn vị, bài toán giải bằng 2 bước tính thực tế',
    category: 'word-problems',
    keyTerms: [
      { term: 'Bài toán rút về đơn vị', definition: 'Bước 1: Tìm giá trị của một đơn vị (thực hiện phép chia). Bước 2: Tìm giá trị của nhiều đơn vị (thực hiện phép nhân).' },
      { term: 'Bài toán 2 bước tính', definition: 'Cần tìm một đại lượng trung gian trước khi trả lời câu hỏi chính của bài toán.' }
    ],
    visualModel: {
      type: 'bar-model',
      description: 'Sơ đồ đoạn thẳng biểu diễn: 4 hộp có 24 cái bút -> 1 hộp có ? cái -> 7 hộp có ? cái',
      sampleValue: '24 : 4 = 6; 6 x 7 = 42'
    },
    audioGuideText: 'Để giải bài toán rút về đơn vị: Bước 1 ta tìm giá trị của 1 phần bằng phép chia. Bước 2 ta tìm giá trị của nhiều phần bằng phép nhân.',
    stepGuide: [
      'Bước 1: Đọc kỹ đề bài, xác định đề bài cho biết gì và hỏi gì.',
      'Bước 2: Tìm giá trị của một đơn vị (rút về đơn vị bằng phép chia).',
      'Bước 3: Tìm giá trị của số lượng đơn vị theo yêu cầu đề bài (bằng phép nhân).',
      'Bước 4: Kiểm tra lại kết quả và viết đáp số đầy đủ.'
    ],
    formulaBox: {
      rule: 'Bước 1 (Rút về đơn vị): Giá trị 1 phần = Tổng giá trị : Số phần đã cho. Bước 2: Giá trị cần tìm = Giá trị 1 phần x Số phần cần tìm.',
      workedExamples: [
        {
          problem: 'Có 35 lít mật ong chia đều vào 7 can. Hỏi 4 can như thế đựng bao nhiêu lít mật ong?',
          solution: 'Mỗi can đựng số lít mật ong là: 35 : 7 = 5 (lít). 4 can đựng số lít mật ong là: 5 x 4 = 20 (lít). Đáp số: 20 lít mật ong.',
          steps: ['Bước 1: 35 : 7 = 5 lít', 'Bước 2: 5 x 4 = 20 lít']
        }
      ]
    },
    realLifeStory: {
      title: 'Chia bánh Trung thu cho các tổ',
      scenario: 'Cô Đỗ Thị Hoà có 24 chiếc bánh Trung thu chia đều cho 4 tổ trong lớp 3C1. Tổ Một được tặng thêm 2 chiếc bánh từ bạn lớp trưởng.',
      question: 'Hỏi Tổ Một có tất cả bao nhiêu chiếc bánh?',
      answer: 'Mỗi tổ nhận được: 24 : 4 = 6 chiếc bánh. Tổ Một có tất cả: 6 + 2 = 8 chiếc bánh.'
    },
    readingProblem: {
      statement: 'Một cửa hàng có 48 kg đường đóng đều vào 8 gói. Người ta đã bán đi 5 gói đường đó. Hỏi cửa hàng đã bán đi bao nhiêu ki-lô-gam đường?',
      givenData: '48 kg đường chia đều 8 gói. Đã bán 5 gói.',
      questionData: 'Khối lượng đường cửa hàng đã bán đi.',
      solutionGuide: 'Bước 1 (Rút về đơn vị): Mỗi gói chứa 48 : 8 = 6 kg đường. Bước 2: 5 gói chứa 6 x 5 = 30 kg đường.'
    },
    practiceDrills: [
      {
        id: 'md-61',
        type: 'multiple-choice',
        question: 'Có 36 quyển vở chia đều cho 4 bạn. Hỏi 6 bạn như thế cần bao nhiêu quyển vở?',
        options: ['54 quyển', '48 quyển', '24 quyển', '60 quyển'],
        correctAnswer: '54 quyển',
        hint: 'Bước 1: Mỗi bạn nhận 36 : 4 = 9 quyển. Bước 2: 6 bạn nhận 9 x 6 = ?',
        explanation: '36 : 4 = 9 quyển/bạn. 6 bạn cần: 9 x 6 = 54 quyển vở.'
      }
    ]
  }
];

export const VIETNAMESE_LESSONS: VietnameseLesson[] = [
  {
    id: 'vn-1',
    theme: 'Những trải nghiệm thú vị (Em lớn lên từng ngày / Kỉ niệm mùa hè)',
    title: 'Bài 1: Ngày khai trường rộn rã & Kỉ niệm mùa hè',
    bookSeries: 'Kết nối tri thức với cuộc sống',
    wordBank: [
      { word: 'Bỡ ngỡ', meaning: 'Cảm giác lạ lẫm, chưa quen thuộc trước cảnh vật hoặc người mới.', type: 'Từ chỉ đặc điểm' },
      { word: 'Hân hoan', meaning: 'Vui mừng, rạng rỡ biểu lộ rõ ra nét mặt, cử chỉ.', type: 'Từ chỉ cảm xúc' },
      { word: 'Ríu rít', meaning: 'Nhiều tiếng nói cười líu lo, tíu tít hòa vào nhau như bầy chim nhỏ.', type: 'Từ tượng thanh' }
    ],
    readingPassage: {
      title: 'Mùa thu ngày khai trường',
      author: 'Nguyễn Bùi Vợi',
      paragraphs: [
        'Tiếng trống trường gióng giả báo hiệu năm học mới đã bắt đầu. Sân trường rực rỡ cờ hoa, khăn quàng đỏ thắm trên vai các bạn học sinh.',
        'Các bạn học sinh lớp 3C1 nắm tay nhau bước vào lớp học khang trang. Cô giáo Đỗ Thị Hoà tươi cười chào đón từng bạn với ánh mắt trìu mến.',
        'Mỗi ngày đến trường là một ngày vui, mở ra bao chân trời tri thức và tình bạn ấm áp.'
      ],
      audioSampleText: 'Tiếng trống trường gióng giả báo hiệu năm học mới đã bắt đầu. Sân trường rực rỡ cờ hoa, khăn quàng đỏ thắm trên vai các bạn học sinh lớp 3C1.',
      difficultWordsGlossary: [
        { word: 'Gióng giả', explanation: 'Tiếng trống vang lên dồn dập, giục giã và vang xa.' },
        { word: 'Khang trang', explanation: 'Rộng rãi, sạch đẹp và đàng hoàng.' }
      ]
    },
    grammarFocus: {
      topic: 'Từ chỉ sự vật, hoạt động, đặc điểm & Kiểu câu "Ai làm gì?"',
      explanation: 'Câu "Ai làm gì?" gồm 2 bộ phận: Bộ phận 1 trả lời cho câu hỏi "Ai (con gì, cái gì)?", bộ phận 2 trả lời cho câu hỏi "Làm gì?".',
      examples: [
        'Các bạn học sinh lớp 3C1 (Ai) / chăm chỉ đọc sách trong thư viện (làm gì).'
      ]
    },
    writingLab: {
      prompt: 'Viết đoạn văn ngắn (từ 3 đến 5 câu) kể lại một kỉ niệm đáng nhớ trong ngày đầu tiên em vào lớp Ba.',
      stepGuides: [
        'Câu 1: Giới thiệu ngày đầu tiên vào lớp 3C1 em đi cùng ai và tâm trạng thế nào?',
        'Câu 2: Quang cảnh lớp học và nụ cười của cô giáo Đỗ Thị Hoà ra sao?',
        'Câu 3: Em và các bạn đã cùng nhau làm những gì?',
        'Câu 4: Cảm nghĩ của em về lớp học hạnh phúc 3C1.'
      ],
      sampleParagraph: 'Sáng nay, mẹ đưa em đến trường trong niềm háo hức khôn tả. Bước vào lớp 3C1, em thấy bàn ghế sạch tinh tươm, cô giáo Đỗ Thị Hoà tươi cười chào đón chúng em. Em được gặp lại bạn Bảo An, Minh Khang và cùng làm quen với nhiều bạn mới. Em cảm thấy tự hào khi đã là học sinh lớp Ba chăm ngoan.'
    },
    comprehensionQuestions: [
      {
        id: 'vq-1',
        question: 'Trong bài đọc, tiếng trống trường vang lên báo hiệu điều gì?',
        options: ['Báo hiệu năm học mới đã bắt đầu', 'Báo hiệu giờ ra chơi', 'Báo hiệu giờ tan học', 'Báo hiệu trời sắp mưa'],
        correctAnswer: 'Báo hiệu năm học mới đã bắt đầu',
        explanation: 'Câu mở đầu bài đọc: "Tiếng trống trường gióng giả báo hiệu năm học mới đã bắt đầu".'
      },
      {
        id: 'vq-2',
        question: 'Từ nào dưới đây là từ chỉ hoạt động?',
        options: ['Đọc sách', 'Quyển vở', 'Xinh đẹp', 'Trường học'],
        correctAnswer: 'Đọc sách',
        explanation: '"Đọc sách" là hành động cụ thể của con người nên là từ chỉ hoạt động.'
      }
    ]
  },
  {
    id: 'vn-2',
    theme: 'Mái ấm gia đình (Gia đình yêu thương)',
    title: 'Bài 2: Tình cảm ông bà, cha mẹ & Biện pháp so sánh',
    bookSeries: 'Kết nối tri thức với cuộc sống',
    wordBank: [
      { word: 'Hiếu thảo', meaning: 'Biết vâng lời, chăm sóc và kính trọng ông bà, cha mẹ.', type: 'Từ chỉ phẩm chất' },
      { word: 'Ấm cúng', meaning: 'Tạo cảm giác thân thương, dễ chịu và gắn kết giữa các thành viên.', type: 'Từ chỉ đặc điểm' }
    ],
    readingPassage: {
      title: 'Bàn tay của mẹ',
      author: 'Nguyễn Viết Bình',
      paragraphs: [
        'Bàn tay mẹ chai sần vì sớm hôm vất vả, nhưng bàn tay ấy đã nấu cho em những bữa cơm thơm dẻo, may cho em từng chiếc áo ấm mùa đông.',
        'Mỗi tối, mẹ ngồi bên bàn học hướng dẫn em từng phép tính khó, từng dòng chữ thẳng hàng.'
      ],
      audioSampleText: 'Bàn tay mẹ chai sần vì sớm hôm vất vả, nhưng bàn tay ấy đã nấu cho em những bữa cơm thơm dẻo, may cho em từng chiếc áo ấm mùa đông.',
      difficultWordsGlossary: [
        { word: 'Chai sần', explanation: 'Da cứng lại do làm việc nhiều.' }
      ]
    },
    grammarFocus: {
      topic: 'Biện pháp tu từ So sánh (Hình ảnh so sánh, từ so sánh)',
      explanation: 'So sánh là đối chiếu sự vật này với sự vật khác có nét tương đồng để câu văn sinh động hơn. Thường có từ so sánh như: như, là, tựa như, giống như.',
      examples: [
        'Mặt trời như quả cầu lửa khổng lồ.',
        'Mẹ là ngọn gió mát lành của đời con.'
      ]
    },
    writingLab: {
      prompt: 'Viết 3-4 câu bày tỏ lòng biết ơn đối với cha mẹ hoặc ông bà.',
      stepGuides: [
        'Nêu việc làm cụ thể của người thân chăm sóc em.',
        'Sử dụng ít nhất 1 câu có hình ảnh so sánh.',
        'Lời hứa chăm ngoan của em.'
      ],
      sampleParagraph: 'Mẹ em luôn dậy sớm nấu bữa sáng nóng hổi cho cả nhà. Tình yêu thương của mẹ bao la như biển Thái Bình. Em tự hứa sẽ luôn chăm ngoan học giỏi để mẹ luôn mỉm cười.'
    },
    comprehensionQuestions: [
      {
        id: 'vq-21',
        question: 'Trong câu: "Mẹ là ngọn gió mát lành của đời con", từ so sánh là từ nào?',
        options: ['là', 'mẹ', 'ngọn gió', 'của'],
        correctAnswer: 'là',
        explanation: 'Từ "là" đóng vai trò từ so sánh nối vế 1 (Mẹ) và vế 2 (ngọn gió mát lành).'
      }
    ]
  },
  {
    id: 'vn-3',
    theme: 'Mái trường mến yêu (Thầy cô, bạn bè & Trường học)',
    title: 'Bài 3: Thầy cô kính yêu & Biện pháp nhân hóa',
    bookSeries: 'Kết nối tri thức với cuộc sống',
    wordBank: [
      { word: 'Tận tụy', meaning: 'Hết lòng vì học sinh thân yêu, không quản ngại khó khăn.', type: 'Từ chỉ phẩm chất' }
    ],
    readingPassage: {
      title: 'Cô giáo em',
      author: 'Đỗ Thị Hoà - Tư liệu lớp 3C1',
      paragraphs: [
        'Cô giáo em miệng cười rất tươi, ánh mắt dịu hiền. Cô dạy chúng em từng nét chữ nết người, khuyên bảo nhẹ nhàng mỗi khi có bạn làm việc chưa đúng.'
      ],
      audioSampleText: 'Cô giáo em miệng cười rất tươi, ánh mắt dịu hiền. Cô dạy chúng em từng nét chữ nết người.',
      difficultWordsGlossary: [
        { word: 'Nét chữ nết người', explanation: 'Rèn luyện tính cẩn thận, chỉn chu bắt đầu từ nét chữ viết.' }
      ]
    },
    grammarFocus: {
      topic: 'Biện pháp nhân hóa & Các kiểu câu',
      explanation: 'Nhân hóa là gọi hoặc tả sự vật bằng những từ ngữ vốn dùng để gọi hoặc tả người.',
      examples: [
        'Bác trống trường nằm im lìm trong những ngày hè.',
        'Chị gió cất tiếng thì thầm cùng hàng cây xanh.'
      ]
    },
    writingLab: {
      prompt: 'Viết lời chúc gửi cô giáo Đỗ Thị Hoà nhân dịp ngày Nhà giáo Việt Nam 20-11.',
      stepGuides: ['Lời chào kính trọng', 'Lời cảm ơn vì cô đã tận tình giảng dạy', 'Lời chúc sức khỏe và hạnh phúc'],
      sampleParagraph: 'Kính gửi cô giáo Đỗ Thị Hoà! Nhân ngày 20-11, em kính chúc cô luôn dồi dào sức khỏe, niềm vui và hạnh phúc. Chúng em hứa sẽ luôn là những học sinh 3C1 chăm ngoan, tiến bộ mỗi ngày!'
    },
    comprehensionQuestions: [
      {
        id: 'vq-31',
        question: 'Trong câu: "Bác trống trường vui mừng gióng giả ba hồi", sự vật nào được nhân hóa?',
        options: ['Trống trường', 'Học sinh', 'Sân trường', 'Cờ hoa'],
        correctAnswer: 'Trống trường',
        explanation: 'Trống trường được gọi bằng "Bác" và có cảm xúc "vui mừng" như con người.'
      }
    ]
  },
  {
    id: 'vn-4',
    theme: 'Cộng đồng gắn bó (Quê hương & Những người sống quanh em)',
    title: 'Bài 4: Tình làng nghĩa xóm & Người lao động quanh em',
    bookSeries: 'Kết nối tri thức với cuộc sống',
    wordBank: [{ word: 'Đoàn kết', meaning: 'Gắn bó keo sơn, cùng chung sức làm việc nghĩa.', type: 'Từ chỉ phẩm chất' }],
    readingPassage: {
      title: 'Xóm nhỏ yêu thương',
      paragraphs: ['Khu phố em ở có bác thợ may khéo léo, chú công an giữ gìn an ninh và các bác lao công giữ đường làng ngõ xóm luôn sạch bóng.'],
      audioSampleText: 'Khu phố em ở có bác thợ may khéo léo, chú công an giữ gìn an ninh và các bác lao công giữ đường làng ngõ xóm luôn sạch bóng.',
      difficultWordsGlossary: [{ word: 'Bình yên', explanation: 'Yên lành, không có sự cố lộn xộn.' }]
    },
    grammarFocus: {
      topic: 'Dấu câu: Dấu chấm, dấu phẩy, dấu hai chấm',
      explanation: 'Dấu chấm dùng ở cuối câu kể; dấu phẩy dùng để ngăn cách các bộ phận cùng chức vụ trong câu.',
      examples: ['Em yêu quý: bác bảo vệ, cô lao công và bác tổ trưởng dân phố.']
    },
    writingLab: {
      prompt: 'Viết đoạn văn ngắn kể về một bác lao động em quý mến (chú bộ đội, bác sĩ, bác nông dân...).',
      stepGuides: ['Bác đó làm nghề gì?', 'Công việc thường ngày của bác thế nào?', 'Tình cảm của em đối với bác.'],
      sampleParagraph: 'Em rất kính trọng bác lao công quét rác trên phố em. Mỗi sớm mai khi trời còn tờ mờ sương, tiếng chổi tre của bác đã lách cách vang lên đều đặn. Nhờ có bác, con đường đến trường của chúng em luôn sạch đẹp.'
    },
    comprehensionQuestions: [
      {
        id: 'vq-41',
        question: 'Dấu câu nào thường dùng để ngăn cách các từ chỉ đặc điểm hoặc sự vật cùng loại trong câu?',
        options: ['Dấu phẩy', 'Dấu chấm hỏi', 'Dấu chấm than', 'Dấu gạch ngang'],
        correctAnswer: 'Dấu phẩy',
        explanation: 'Dấu phẩy dùng để ngắt nghỉ và ngăn cách các thành phần đồng vị trong câu.'
      }
    ]
  },
  {
    id: 'vn-5',
    theme: 'Đất nước ngàn năm (Vẻ đẹp quê hương & Danh lam thắng cảnh)',
    title: 'Bài 5: Non sông gấm vóc & Niềm tự hào dân tộc',
    bookSeries: 'Kết nối tri thức với cuộc sống',
    wordBank: [{ word: 'Hùng vĩ', meaning: 'Rộng lớn, uy nghiêm và tráng lệ.', type: 'Từ chỉ đặc điểm' }],
    readingPassage: {
      title: 'Đất nước gấm hoa',
      paragraphs: ['Việt Nam hình chữ S trải dài từ Ải Nam Quan đến Mũi Cà Mau, có rừng vàng biển bạc, những cánh đồng lúa chín vàng trĩu hạt.'],
      audioSampleText: 'Việt Nam hình chữ S trải dài từ Ải Nam Quan đến Mũi Cà Mau, có rừng vàng biển bạc.',
      difficultWordsGlossary: [{ word: 'Rừng vàng biển bạc', explanation: 'Tài nguyên thiên nhiên phong phú và quý giá của quê hương.' }]
    },
    grammarFocus: {
      topic: 'Mở rộng vốn từ về Quê hương đất nước',
      explanation: 'Các từ ngữ chỉ cảnh đẹp: hùng vĩ, bao la, bát ngát, thơ mộng, tráng lệ.',
      examples: ['Cánh đồng quê em rộng bát ngát như tấm thảm lụa vàng.']
    },
    writingLab: {
      prompt: 'Viết 3 câu giới thiệu về cảnh đẹp quê hương Bình Định - Hoài Nhơn.',
      stepGuides: ['Tên cảnh đẹp', 'Đặc điểm nổi bật của cảnh', 'Niềm tự hào của em'],
      sampleParagraph: 'Quê hương Hoài Nhơn của em có những rặng dừa xanh mướt đu đưa trước gió biển. Bãi biển trong xanh, sóng vỗ rì rào ngày đêm. Em rất yêu và tự hào về mảnh đất quê hương mình.'
    },
    comprehensionQuestions: [
      {
        id: 'vq-51',
        question: 'Từ ngữ nào sau đây diễn tả cảnh đẹp rộng lớn của biển cả hoặc cánh đồng?',
        options: ['Bao la', 'Nhỏ xinh', 'Chật hẹp', 'Bé tí'],
        correctAnswer: 'Bao la',
        explanation: '"Bao la" diễn tả không gian rộng lớn mênh mông.'
      }
    ]
  },
  {
    id: 'vn-6',
    theme: 'Bầu trời tuổi thơ & Thế giới tự nhiên (Cây cối, muông thú & Môi trường sống)',
    title: 'Bài 6: Khám phá thiên nhiên & Ý thức bảo vệ môi trường',
    bookSeries: 'Kết nối tri thức với cuộc sống',
    wordBank: [{ word: 'Trong lành', meaning: 'Sạch sẽ, tươi mát, không bị ô nhiễm bụi bẩn.', type: 'Từ chỉ đặc điểm' }],
    readingPassage: {
      title: 'Khu vườn tuổi thơ',
      paragraphs: ['Khu vườn nhỏ sau nhà ríu rít tiếng chim hót. Cây ổi trĩu quả chín thơm lừng, đàn bướm rập rờn bên khóm hoa hồng nhung rực rỡ.'],
      audioSampleText: 'Khu vườn nhỏ sau nhà ríu rít tiếng chim hót. Cây ổi trĩu quả chín thơm lừng.',
      difficultWordsGlossary: [{ word: 'Rập rờn', explanation: 'Chuyển động chao đảo nhịp nhàng lên xuống.' }]
    },
    grammarFocus: {
      topic: 'Kiểu câu "Ai thế nào?" & Từ ngữ chỉ cảm xúc',
      explanation: 'Câu "Ai thế nào?" dùng để miêu tả đặc điểm, trạng thái của người, con vật, cây cối.',
      examples: ['Bầu trời mùa thu (Ai) / trong xanh vời vợi (thế nào).']
    },
    writingLab: {
      prompt: 'Viết đoạn văn ngắn khuyên các bạn giữ gìn bảo vệ cây xanh trong trường học.',
      stepGuides: ['Lợi ích của cây xanh', 'Hành động cụ thể của học sinh', 'Thông điệp xanh'],
      sampleParagraph: 'Cây xanh trong sân trường Hoài Nhơn che bóng mát cho chúng em vui chơi trong giờ giải lao. Em và các bạn lớp 3C1 luôn cùng nhau tưới nước và không bẻ cành hái lá. Chúng em quyết tâm trở thành những "Hiệp sĩ xanh" của trường.'
    },
    comprehensionQuestions: [
      {
        id: 'vq-61',
        question: 'Câu nào sau đây thuộc kiểu câu "Ai thế nào?"',
        options: ['Hoa hồng nhung rất thơm và rực rỡ.', 'Các bạn học sinh đang tưới cây.', 'Bác bảo vệ đánh trống trường.', 'Bảo An hát một bài tiếng Anh.'],
        correctAnswer: 'Hoa hồng nhung rất thơm và rực rỡ.',
        explanation: 'Bộ phận "rất thơm và rực rỡ" chỉ đặc điểm, trả lời cho câu hỏi "thế nào?".'
      }
    ]
  }
];

export const INFORMATICS_LESSONS: InformaticsLesson[] = [
  {
    id: 'info-1',
    chapter: 1,
    chapterTitle: 'Chủ đề 1: Máy tính và em',
    lessonNumber: 1,
    title: 'Bài 1: Thông tin và quyết định',
    keyTerms: ['Thông tin', 'Thu nhận', 'Xử lý', 'Quyết định'],
    virtualToolType: 'algorithm',
    safetyBox: 'Em cần quan sát kĩ thông tin xung quanh (tiếng trống trường, đèn giao thông) trước khi đưa ra quyết định an toàn.',
    stepByStep: [
      'Bước 1: Giác quan thu nhận thông tin (mắt thấy, tai nghe).',
      'Bước 2: Bộ não xử lý thông tin đã thu nhận.',
      'Bước 3: Đưa ra hành động hoặc quyết định phù hợp.'
    ],
    realLifeContext: 'Khi nhìn thấy đèn tín hiệu giao thông chuyển sang màu đỏ, em quyết định dừng xe lại trước vạch quy định.',
    drills: [
      {
        id: 'iq-1',
        question: 'Khi nghe tiếng chuông báo thức reng reng vào buổi sáng, thông tin em nhận được là gì?',
        options: ['Đã đến giờ thức dậy để đi học', 'Đến giờ ăn trưa', 'Đến giờ ngủ', 'Trời đang mưa'],
        correctAnswer: 'Đã đến giờ thức dậy để đi học',
        explanation: 'Tiếng chuông là thông tin giúp em đưa ra quyết định thức dậy đúng giờ.'
      }
    ]
  },
  {
    id: 'info-2',
    chapter: 1,
    chapterTitle: 'Chủ đề 1: Máy tính và em',
    lessonNumber: 2,
    title: 'Bài 2: Khám phá máy tính (Các bộ phận chính)',
    keyTerms: ['Thân máy', 'Màn hình', 'Bàn phím', 'Chuột máy tính'],
    virtualToolType: 'keyboard',
    safetyBox: 'Không sờ vào dây điện phía sau thân máy tính. Báo ngay cho thầy cô nếu thấy mùi khét hoặc dây hở điện.',
    stepByStep: [
      'Thân máy: Chứa bộ xử lý là bộ não của máy tính.',
      'Màn hình: Hiển thị kết quả làm việc và hình ảnh.',
      'Bàn phím: Dùng để nhập chữ cái, con số và kí hiệu.',
      'Chuột máy tính: Giúp điều khiển con trỏ nhanh chóng trên màn hình.'
    ],
    realLifeContext: 'Trong phòng Tin học trường Hoài Nhơn, mỗi bạn được phân công một bộ máy tính để bàn để thực hành.',
    drills: [
      {
        id: 'iq-2',
        question: 'Bộ phận nào được coi là "bộ não" xử lý mọi hoạt động của máy tính?',
        options: ['Thân máy (CPU)', 'Màn hình', 'Bàn phím', 'Chuột'],
        correctAnswer: 'Thân máy (CPU)',
        explanation: 'Thân máy chứa bộ xử lý trung tâm (CPU), điều khiển và xử lý thông tin.'
      }
    ]
  },
  {
    id: 'info-3',
    chapter: 1,
    chapterTitle: 'Chủ đề 1: Máy tính và em',
    lessonNumber: 3,
    title: 'Bài 3: Quy tắc an toàn khi sử dụng máy tính',
    keyTerms: ['Tư thế ngồi chuẩn', 'Khoảng cách an toàn', 'Bảo vệ mắt', 'An toàn điện'],
    virtualToolType: 'keyboard',
    safetyBox: 'Ngồi thẳng lưng, mắt cách màn hình từ 50cm đến 70cm, sau 30 phút nên nhìn ra xa 20 giây để mắt thư giãn.',
    stepByStep: [
      'Bước 1: Lưng thẳng, hai bàn chân đặt phẳng trên sàn nhà.',
      'Bước 2: Mắt nhìn ngang hoặc hơi thấp hơn mép trên màn hình.',
      'Bước 3: Tay gõ phím thả lỏng tự nhiên ở độ cao ngang khuỷu tay.'
    ],
    realLifeContext: 'Bạn An nhắc bạn Khang không cúi sát mặt vào màn hình để tránh bị cận thị.',
    drills: [
      {
        id: 'iq-3',
        question: 'Khoảng cách an toàn thích hợp từ mắt đến màn hình máy tính là:',
        options: ['50 cm đến 70 cm (khoảng một sải tay)', '10 cm đến 20 cm', '2 mét đến 3 mét', 'Càng sát càng tốt'],
        correctAnswer: '50 cm đến 70 cm (khoảng một sải tay)',
        explanation: 'Khoảng cách từ 50-70cm giúp mắt không bị mỏi và hạn chế tác hại của ánh sáng xanh.'
      }
    ]
  },
  {
    id: 'info-4',
    chapter: 1,
    chapterTitle: 'Chủ đề 1: Máy tính và em',
    lessonNumber: 4,
    title: 'Bài 4: Sử dụng chuột máy tính',
    keyTerms: ['Nút trái', 'Nút phải', 'Con lăn', 'Nháy chuột', 'Nháy đúp', 'Kéo thả'],
    virtualToolType: 'mouse',
    safetyBox: 'Cầm chuột nhẹ nhàng bằng tay phải, ngón trỏ đặt lên nút trái, ngón giữa đặt lên nút phải.',
    stepByStep: [
      '1. Di chuyển chuột: Cầm và trượt chuột trên mặt phẳng.',
      '2. Nháy chuột (Left Click): Bấm nút trái một lần rồi thả ra.',
      '3. Nháy đúp (Double Click): Bấm nhanh nút trái hai lần liên tiếp.',
      '4. Kéo thả chuột (Drag & Drop): Nhấn giữ nút trái, di chuyển đến vị trí mới rồi thả tay.'
    ],
    realLifeContext: 'Thực hành nháy đúp vào biểu tượng Google Chrome trên màn hình nền để mở trình duyệt web.',
    drills: [
      {
        id: 'iq-4',
        question: 'Để mở một phần mềm hoặc thư mục trên màn hình máy tính, ta thực hiện thao tác nào?',
        options: ['Nháy đúp chuột trái', 'Nháy chuột phải một lần', 'Lăn con lăn chuột', 'Cầm chuột lắc mạnh'],
        correctAnswer: 'Nháy đúp chuột trái',
        explanation: 'Nháy đúp chuột trái (bấm nhanh 2 lần nút trái) dùng để mở tệp hoặc phần mềm.'
      }
    ]
  },
  {
    id: 'info-5',
    chapter: 1,
    chapterTitle: 'Chủ đề 1: Máy tính và em',
    lessonNumber: 5,
    title: 'Bài 5: Sử dụng bàn phím máy tính (Gõ 10 ngón tay)',
    keyTerms: ['Hàng phím cơ sở', 'Phím chuẩn F và J', 'Phím Space', 'Phím Enter'],
    virtualToolType: 'keyboard',
    safetyBox: 'Hai ngón tay trỏ luôn đặt trên 2 phím có gờ chuẩn là F và J. Đây là vị trí xuất phát của 10 ngón tay.',
    stepByStep: [
      'Hàng phím cơ sở gồm: A, S, D, F, G, H, J, K, L, ;',
      'Ngón trỏ trái đặt lên phím F, ngón trỏ phải đặt lên phím J.',
      'Hai ngón tay cái điều khiển phím cách (Space bar).'
    ],
    realLifeContext: 'Luyện tập gõ nhanh tên mình trên bàn phím ảo AI Class.',
    drills: [
      {
        id: 'iq-5',
        question: 'Hai phím có gờ nổi chuẩn để định vị hai ngón tay trỏ trên hàng phím cơ sở là phím nào?',
        options: ['Phím F và phím J', 'Phím A và phím L', 'Phím Space và phím Enter', 'Phím G và phím H'],
        correctAnswer: 'Phím F và phím J',
        explanation: 'Phím F và J có gờ nhỏ nổi lên giúp ngón tay nhận biết vị trí mà không cần nhìn bàn phím.'
      }
    ]
  },
  {
    id: 'info-8',
    chapter: 3,
    chapterTitle: 'Chủ đề 3: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin',
    lessonNumber: 8,
    title: 'Bài 8 & 9: Sơ đồ hình cây & Quản lý tệp, thư mục',
    keyTerms: ['Thư mục gốc', 'Thư mục con', 'Tệp tin', 'Đổi tên', 'Xóa'],
    virtualToolType: 'file-tree',
    safetyBox: 'Chỉ xóa tệp trong thư mục của chính mình. Tuyệt đối không xóa tệp trong ổ đĩa hệ thống (ổ C) của nhà trường.',
    stepByStep: [
      'Bước 1: Mở thư mục LOP_3C1.',
      'Bước 2: Nháy chuột phải chọn New -> Folder để tạo thư mục mới.',
      'Bước 3: Đặt tên thư mục theo cú pháp: HoTen_HocTap (Ví dụ: BaoAn_TapVe).'
    ],
    realLifeContext: 'Tạo cây thư mục lưu trữ bài học: ThuMucMe -> Toan, TiengViet, TiengAnh, TinHoc.',
    drills: [
      {
        id: 'iq-8',
        question: 'Biểu tượng của Thư mục (Folder) trong hệ điều hành Windows thường có hình gì và màu gì?',
        options: ['Hình chiếc kẹp giấy màu vàng', 'Hình quả táo màu đỏ', 'Hình bánh xe màu xanh', 'Hình cây bút chì'],
        correctAnswer: 'Hình chiếc kẹp giấy màu vàng',
        explanation: 'Thư mục thường được biểu diễn bằng hình chiếc cặp hồ sơ/kẹp tài liệu màu vàng.'
      }
    ]
  }
];

export const EDUCATIONAL_GAMES: EducationalGame[] = [
  {
    id: 'game-1',
    name: 'Word Match',
    vietnameseName: 'Ghép từ thần tốc',
    type: 'word-match',
    subject: 'english',
    grade: 3,
    description: 'Nối từ tiếng Anh với hình ảnh hoặc nghĩa tiếng Việt tương ứng thật nhanh và chuẩn xác.',
    rulesVi: 'Học sinh nhấp chọn 1 từ ở cột trái và 1 nghĩa tương ứng ở cột phải. Nếu đúng, cặp từ sẽ sáng xanh và ghi điểm!',
    questionsCount: 4,
    sampleQuestions: [
      {
        id: 'wm-1',
        prompt: 'Nối các từ tiếng Anh chủ đề Bạn bè với nghĩa tiếng Việt thích hợp:',
        answer: 'Friend-Người bạn, Classmate-Bạn cùng lớp, Teacher-Giáo viên, School-Trường học',
        pairs: [
          { left: 'Friend', right: 'Người bạn' },
          { left: 'Classmate', right: 'Bạn cùng lớp' },
          { left: 'Teacher', right: 'Cô giáo/Thầy giáo' },
          { left: 'Playground', right: 'Sân trường' }
        ]
      }
    ]
  },
  {
    id: 'game-2',
    name: 'Magic Quiz',
    vietnameseName: 'Vòng quay kiến thức',
    type: 'magic-quiz',
    subject: 'math',
    grade: 3,
    description: 'Quay vòng quay may mắn để chọn điểm số thưởng và trả lời câu hỏi trắc nghiệm đếm ngược 15 giây.',
    rulesVi: 'Bấm nút "Quay thưởng" để nhận điểm cơ hội (100 - 500 điểm). Trả lời đúng trong 15 giây sẽ nhận trọn vẹn số điểm!',
    questionsCount: 5,
    sampleQuestions: [
      {
        id: 'mq-1',
        prompt: 'Trong phép tính 3.000 x 3, kết quả bằng bao nhiêu?',
        options: ['9.000', '6.000', '900', '3.300'],
        answer: '9.000',
        hint: 'Lấy 3 nghìn nhân 3 bằng 9 nghìn.'
      },
      {
        id: 'mq-2',
        prompt: 'Một hình vuông có cạnh dài 5cm. Diện tích hình vuông đó là:',
        options: ['25 cm²', '20 cm', '25 cm', '10 cm²'],
        answer: '25 cm²',
        hint: 'Diện tích hình vuông = Cạnh x Cạnh.'
      },
      {
        id: 'mq-3',
        prompt: 'Trong các số: 34.500, 35.400, 34.050, số lớn nhất là:',
        options: ['35.400', '34.500', '34.050', 'Bằng nhau'],
        answer: '35.400',
        hint: 'So sánh chữ số hàng nghìn: 5 > 4.'
      }
    ]
  },
  {
    id: 'game-3',
    name: 'Listen and Choose',
    vietnameseName: 'Nghe và chọn chuẩn xác',
    type: 'listen-choose',
    subject: 'english',
    grade: 3,
    description: 'Nghe giọng đọc AI phát âm từ vựng tiếng Anh và chọn hình ảnh hoặc từ viết đúng.',
    rulesVi: 'Bấm biểu tượng loa để nghe phát âm, sau đó nhấp chọn 1 trong 4 đáp án đúng.',
    questionsCount: 4,
    sampleQuestions: [
      {
        id: 'lc-1',
        prompt: 'Nghe phát âm từ sau và chọn từ đúng:',
        audioPrompt: 'Father',
        options: ['Father', 'Mother', 'Brother', 'Sister'],
        answer: 'Father',
        hint: 'Từ có nghĩa là Bố/Ba.'
      },
      {
        id: 'lc-2',
        prompt: 'Nghe câu giao tiếp sau và chọn nghĩa đúng:',
        audioPrompt: 'May I come in?',
        options: ['Em xin phép vào lớp ạ', 'Em xin phép ra ngoài', 'Xin chào bạn', 'Cảm ơn cô'],
        answer: 'Em xin phép vào lớp ạ',
        hint: '"come in" nghĩa là đi vào trong.'
      }
    ]
  },
  {
    id: 'game-4',
    name: 'Sentence Builder',
    vietnameseName: 'Xây dựng câu hoàn chỉnh',
    type: 'sentence-builder',
    subject: 'vietnamese',
    grade: 3,
    description: 'Kéo thả các mảnh ghép từ ngữ xáo trộn để tạo thành một câu văn mạch lạc, đúng ngữ pháp.',
    rulesVi: 'Nhấp hoặc kéo các từ vào ô trả lời theo đúng thứ tự logic của câu văn.',
    questionsCount: 3,
    sampleQuestions: [
      {
        id: 'sb-1',
        prompt: 'Sắp xếp các từ sau thành câu hoàn chỉnh:',
        tokens: ['Học sinh', 'lớp 3C1', 'chăm chỉ', 'học tập', 'mỗi ngày.'],
        answer: 'Học sinh lớp 3C1 chăm chỉ học tập mỗi ngày.'
      },
      {
        id: 'sb-2',
        prompt: 'Sắp xếp câu có hình ảnh so sánh:',
        tokens: ['Mặt trời', 'như', 'quả cầu lửa', 'đỏ rực.'],
        answer: 'Mặt trời như quả cầu lửa đỏ rực.'
      }
    ]
  },
  {
    id: 'game-5',
    name: 'Picture Detective',
    vietnameseName: 'Thám tử hình ảnh',
    type: 'picture-detective',
    subject: 'informatics',
    grade: 3,
    description: 'Quan sát bức tranh phòng máy tính thông minh và phát hiện các chi tiết an toàn hoặc bộ phận máy tính.',
    rulesVi: 'Nhìn tranh và bấm chọn đáp án mô tả đúng nhất chi tiết được khoanh vùng.',
    questionsCount: 3,
    sampleQuestions: [
      {
        id: 'pd-1',
        prompt: 'Trong bức tranh phòng máy, bạn học sinh đang ngồi như thế nào là đúng tư thế?',
        options: ['Ngồi thẳng lưng, mắt cách màn hình 50-70cm', 'Cúi sát mắt vào màn hình', 'Nằm ra bàn gõ phím', 'Ngồi vắt chân lên ghế'],
        answer: 'Ngồi thẳng lưng, mắt cách màn hình 50-70cm'
      }
    ]
  },
  {
    id: 'game-6',
    name: 'Educational Bingo',
    vietnameseName: 'Bingo trí tuệ 3x3',
    type: 'educational-bingo',
    subject: 'general',
    grade: 3,
    description: 'Lưới ô chữ 3x3 với các câu hỏi đa môn. Trả lời đúng để mở ô, tạo thành 1 hàng ngang/dọc/chéo để BINGO!',
    rulesVi: 'Chọn ô bất kỳ trên bảng 3x3. Mỗi câu trả lời đúng sẽ biến ô đó thành Ngôi Sao Xanh. Đạt 3 ô thẳng hàng sẽ chiến thắng!',
    questionsCount: 9,
    sampleQuestions: [
      { id: 'b-1', prompt: '6 x 7 = ?', options: ['42', '36', '48', '40'], answer: '42' },
      { id: 'b-2', prompt: 'Từ trái nghĩa với "Chăm chỉ" là:', options: ['Lười biếng', 'Cần cù', 'Ngoan ngoãn', 'Thông minh'], answer: 'Lười biếng' },
      { id: 'b-3', prompt: 'Tên cô giáo chủ nhiệm lớp 3C1 là:', options: ['Cô Đỗ Thị Hoà', 'Cô Lan', 'Cô Mai', 'Cô Hằng'], answer: 'Cô Đỗ Thị Hoà' }
    ]
  },
  {
    id: 'game-7',
    name: 'Memory Flip',
    vietnameseName: 'Lật thẻ ghi nhớ',
    type: 'memory-flip',
    subject: 'english',
    grade: 3,
    description: 'Lật tìm các cặp thẻ tương đồng (từ tiếng Anh - hình ảnh hoặc từ tiếng Anh - tiếng Việt).',
    rulesVi: 'Nhấp lật 2 thẻ mỗi lượt. Nếu 2 thẻ khớp nhau, chúng sẽ được giữ mở. Cố gắng hoàn thành với số lượt lật ít nhất!',
    questionsCount: 8,
    sampleQuestions: [
      {
        id: 'mf-1',
        prompt: 'Cặp thẻ từ vựng gia đình',
        answer: 'Father, Mother, Sister, Brother',
        pairs: [
          { left: 'Father', right: 'Bố' },
          { left: 'Mother', right: 'Mẹ' },
          { left: 'Brother', right: 'Anh/Em trai' },
          { left: 'Sister', right: 'Chị/Em gái' }
        ]
      }
    ]
  },
  {
    id: 'game-8',
    name: 'Treasure Hunt',
    vietnameseName: 'Săn kho báu vượt chướng ngại vật',
    type: 'treasure-hunt',
    subject: 'math',
    grade: 3,
    description: 'Vượt qua 4 trạm câu hỏi Toán học trên bản đồ đảo phiêu lưu để mở khóa rương kho báu hoàng gia.',
    rulesVi: 'Mỗi câu trả lời đúng sẽ đưa nhân vật tiến lên 1 bước trên bản đồ. Vượt qua 4 trạm để mở rương chứa huy hiệu!',
    questionsCount: 4,
    sampleQuestions: [
      { id: 'th-1', prompt: 'Trạm 1: Tìm x biết x : 4 = 1.200', options: ['4.800', '300', '1.600', '4.000'], answer: '4.800', hint: 'x = 1.200 x 4.' },
      { id: 'th-2', prompt: 'Trạm 2: Đổi 4 m 5 dm = ? dm', options: ['45 dm', '405 dm', '54 dm', '450 dm'], answer: '45 dm', hint: '4m = 40dm; 40 + 5 = 45.' },
      { id: 'th-3', prompt: 'Trạm 3: 8 can mật ong có 40 lít. 5 can như thế có bao nhiêu lít?', options: ['25 lít', '30 lít', '20 lít', '35 lít'], answer: '25 lít', hint: '40 : 8 = 5; 5 x 5 = 25.' }
    ]
  },
  {
    id: 'game-9',
    name: 'Story Maker',
    vietnameseName: 'Nhà sáng tạo truyện tương tác',
    type: 'story-maker',
    subject: 'vietnamese',
    grade: 3,
    description: 'Chọn các tình huống ứng xử văn minh và chi tiết tiếp theo để hoàn thiện một câu chuyện học đường ý nghĩa.',
    rulesVi: 'Đọc đoạn mở đầu câu chuyện và đưa ra lựa chọn hành động tốt đẹp nhất cho nhân vật chính.',
    questionsCount: 3,
    sampleQuestions: [
      {
        id: 'sm-1',
        prompt: 'Giờ ra chơi, bạn Bảo An vô tình làm rơi hộp bút chì màu xuống sàn. Nếu em là bạn Minh bên cạnh, em sẽ:',
        options: ['Cúi xuống nhặt giúp bạn và mỉm cười thân thiện', 'Đứng nhìn rồi bỏ đi chơi chỗ khác', 'Cười to trêu chọc bạn', 'Đá hộp bút sang chỗ khác'],
        answer: 'Cúi xuống nhặt giúp bạn và mỉm cười thân thiện'
      }
    ]
  },
  {
    id: 'game-10',
    name: 'Team Challenge',
    vietnameseName: 'Đấu trường đồng đội 3C1',
    type: 'team-challenge',
    subject: 'general',
    grade: 3,
    description: 'Chế độ chia 4 Tổ thi đua tiếp sức trả lời nhanh câu hỏi kiến thức liên môn trên màn hình lớp học.',
    rulesVi: 'Tổ 1, Tổ 2, Tổ 3, Tổ 4 thi đua trả lời câu hỏi tính giờ. Đội nào đúng nhiều câu nhất sẽ giành cúp Vàng!',
    questionsCount: 6,
    sampleQuestions: [
      { id: 'tc-1', prompt: 'Phím nào dùng để xuống dòng khi soạn thảo văn bản?', options: ['Phím Enter', 'Phím Space', 'Phím Shift', 'Phím Caps Lock'], answer: 'Phím Enter' },
      { id: 'tc-2', prompt: 'Trong câu: "Mẹ là vầng trăng của đời con", hình ảnh so sánh là gì?', options: ['Vầng trăng', 'Ngôi sao', 'Mặt trời', 'Cây thông'], answer: 'Vầng trăng' },
      { id: 'tc-3', prompt: '24 chia 3 bằng mấy?', options: ['8', '7', '9', '6'], answer: '8' }
    ]
  }
];

export const DIGITAL_MATERIALS: LearningMaterial[] = [
  {
    id: 'mat-1',
    title: 'Bài giảng điện tử tương tác: Tiếng Anh 3 - Unit 1: Friends & Greetings',
    type: 'pptx',
    subject: 'english',
    grade: 3,
    fileSize: '12.4 MB',
    url: 'https://example.com/materials/english3-unit1.pptx',
    uploadedAt: '2026-10-10',
    author: 'Cô Đỗ Thị Hoà - Trường Tiểu học Hoài Nhơn',
    description: 'File PowerPoint bài giảng sinh động tích hợp âm thanh mẫu, minigame đoán từ vựng và mẫu câu giao tiếp Tiếng Anh Tiểu học.',
    content: 'Chủ điểm bài học: Chào hỏi và giới thiệu bạn bè.\n- Mẫu câu chính: "Hello, I am...", "How are you? - I am fine, thank you.", "This is my friend, Lan."\n- Từ vựng: friend, classmate, teacher, school, hello, goodbye.\n- Quy tắc phát âm: Âm /f/ trong friend, /h/ trong hello.',
    keyConcepts: ['Greetings', 'Introducing friends', 'Phonics /f/ and /h/'],
    tags: ['Tiếng Anh 3', 'Unit 1', 'Giao tiếp song ngữ'],
    sampleQuestions: [
      {
        question: 'Khi muốn giới thiệu người bạn tên Nam với mọi người, em nói thế nào?',
        options: ['This is my friend, Nam.', 'I am fine, thank you.', 'Goodbye Nam.', 'What is your name?'],
        answer: 'This is my friend, Nam.',
        explanation: 'Cấu trúc "This is my friend, [Tên]" dùng để giới thiệu bạn bè bằng Tiếng Anh.'
      },
      {
        question: 'Câu trả lời phù hợp nhất cho lời hỏi "How are you today?" là gì?',
        options: ['I am fine, thank you.', 'I am eight years old.', 'My name is Peter.', 'Nice to meet you.'],
        answer: 'I am fine, thank you.',
        explanation: '"I am fine, thank you" là cách đáp lại lịch sự khi được hỏi thăm sức khỏe.'
      }
    ],
    viewCount: 142
  },
  {
    id: 'mat-2',
    title: 'Phiếu bài tập rèn kỹ năng: Toán 3 - Phép nhân chia trong phạm vi 100.000 & Giải toán 2 bước',
    type: 'docx',
    subject: 'math',
    grade: 3,
    fileSize: '1.8 MB',
    url: 'https://example.com/materials/toan3-on-tap-nhan-chia.docx',
    uploadedAt: '2026-10-14',
    author: 'Cô Đỗ Thị Hoà - Trường Tiểu học Hoài Nhơn',
    description: 'Phiếu ôn tập chuẩn cấu trúc giải toán 2 bước tính toán, có kèm barem đáp án chi tiết và hướng dẫn tự học tại nhà.',
    content: 'Trọng tâm kiến thức Toán 3:\n1. Phép nhân số có 4-5 chữ số với số có một chữ số.\n2. Phép chia có dư và chia hết trong phạm vi 100.000.\n3. Bài toán giải bằng hai bước tính: Bước 1 tìm đại lượng thành phần (gấp lên hoặc giảm đi số lần), Bước 2 tính tổng hoặc hiệu.',
    keyConcepts: ['Nhân chia số lớn', 'Toán 2 bước tính', 'Tìm một trong các phần bằng nhau'],
    tags: ['Toán 3', 'Phép tính', 'Ôn tập tuần'],
    sampleQuestions: [
      {
        question: 'Một đội công nhân ngày thứ nhất sửa được 1.250m đường. Ngày thứ hai sửa được gấp đôi ngày thứ nhất. Hỏi cả hai ngày đội đó sửa được bao nhiêu mét đường?',
        options: ['3.750 m', '2.500 m', '3.500 m', '2.750 m'],
        answer: '3.750 m',
        explanation: 'Bước 1: Ngày thứ hai sửa được 1.250 x 2 = 2.500m. Bước 2: Cả hai ngày sửa được 1.250 + 2.500 = 3.750m.'
      },
      {
        question: 'Kết quả của phép chia 48.000 : 6 là bao nhiêu?',
        options: ['8.000', '800', '7.000', '9.000'],
        answer: '8.000',
        explanation: 'Ta nhẩm: 48 nghìn chia 6 bằng 8 nghìn, viết là 8.000.'
      }
    ],
    viewCount: 198
  },
  {
    id: 'mat-3',
    title: 'Sổ tay chuyên đề: Biện pháp tu từ So sánh & Nhân hóa - Tiếng Việt 3 Kết nối tri thức',
    type: 'pdf',
    subject: 'vietnamese',
    grade: 3,
    fileSize: '4.5 MB',
    url: 'https://example.com/materials/tiengviet3-so-sanh-nhan-hoa.pdf',
    uploadedAt: '2026-10-12',
    author: 'Cô Đỗ Thị Hoà - Trường Tiểu học Hoài Nhơn',
    description: 'Sơ đồ tư duy trực quan phân biệt hình ảnh so sánh (từ so sánh: như, là, tựa...) và 3 cách nhân hóa đồ vật, con vật, cây cối.',
    content: 'Chuyên đề Tiếng Việt lớp 3:\n- So sánh: Đối chiếu sự vật A với sự vật B có nét tương đồng qua từ so sánh ("như", "là", "tựa", "tựa như"). Ví dụ: "Mặt trời như quả cầu lửa khổng lồ".\n- Nhân hóa: Gọi hoặc tả sự vật bằng những từ ngữ vốn dùng để gọi hoặc tả người.\n  + Cách 1: Gọi sự vật bằng từ ngữ xưng hô với người (chú chim, chị gió, bác mặt trời).\n  + Cách 2: Tả sự vật bằng từ ngữ chỉ hoạt động, đặc điểm của người.\n  + Cách 3: Trò chuyện với sự vật như với người.',
    keyConcepts: ['So sánh nghệ thuật', 'Nhân hóa 3 cách', 'Luyện từ và câu'],
    tags: ['Tiếng Việt 3', 'Kết nối tri thức', 'Biện pháp nghệ thuật'],
    sampleQuestions: [
      {
        question: 'Trong câu "Trăng tròn như quả bóng lơ lửng giữa trời", từ ngữ nào là từ chỉ sự so sánh?',
        options: ['như', 'quả bóng', 'lơ lửng', 'tròn'],
        answer: 'như',
        explanation: 'Từ "như" dùng để nối sự vật được so sánh (Trăng) với sự vật so sánh (quả bóng).'
      },
      {
        question: 'Câu thơ nào sau đây sử dụng biện pháp nghệ thuật nhân hóa?',
        options: ['Chị gió tung tăng bay qua cánh đồng', 'Mặt hồ phẳng lặng như gương', 'Bầu trời hôm nay rất trong xanh', 'Cây bàng lá đỏ rực rỡ'],
        answer: 'Chị gió tung tăng bay qua cánh đồng',
        explanation: 'Gió được gọi bằng "Chị" và được gán hành động "tung tăng" như con người.'
      }
    ],
    viewCount: 165
  },
  {
    id: 'mat-4',
    title: 'Video hướng dẫn thao tác chuẩn: Tư thế ngồi gõ 10 ngón & Hai phím xuất phát F và J',
    type: 'video',
    subject: 'informatics',
    grade: 3,
    fileSize: '35.0 MB',
    url: 'https://example.com/materials/tinhoc3-phim-f-j.mp4',
    uploadedAt: '2026-10-08',
    author: 'Cô Đỗ Thị Hoà - Trường Tiểu học Hoài Nhơn',
    description: 'Video mô phỏng 3D trực quan cách đặt các ngón tay lên hàng phím cơ sở và tư thế bảo vệ cột sống, thị lực khi học máy tính.',
    content: 'Nội dung cốt lõi Tin học 3:\n1. Hai phím F và J trên hàng phím cơ sở có gờ nổi để đặt ngón trỏ tay trái (phím F) và ngón trỏ tay phải (phím J).\n2. Tay trái đặt trên các phím A, S, D, F; tay phải đặt trên các phím J, K, L, ;.\n3. Ngón cái của cả hai tay đặt nhẹ lên phím cách (Space bar).\n4. Giữ lưng thẳng, mắt cách màn hình 50-70cm.',
    keyConcepts: ['Hàng phím cơ sở', 'Phím F và J có gờ', 'Tư thế công thái học'],
    tags: ['Tin học 3', 'Gõ 10 ngón', 'Thực hành'],
    sampleQuestions: [
      {
        question: 'Tại sao trên bàn phím máy tính, hai phím F và J lại có gờ nổi nhỏ?',
        options: [
          'Để giúp người gõ định vị ngón trỏ của hai bàn tay mà không cần nhìn',
          'Để phân biệt chữ in hoa và chữ thường',
          'Để làm bàn phím chắc chắn hơn',
          'Để phát ra âm thanh khi bấm phím'
        ],
        answer: 'Để giúp người gõ định vị ngón trỏ của hai bàn tay mà không cần nhìn',
        explanation: 'Gờ nổi trên phím F (tay trái) và phím J (tay phải) là mốc xuất phát chuẩn cho phương pháp gõ 10 ngón tay.'
      }
    ],
    viewCount: 220
  },
  {
    id: 'mat-5',
    title: 'Bài giảng khám phá: Khoa học 3 - Thực vật và động vật quanh em',
    type: 'pdf',
    subject: 'science',
    grade: 3,
    fileSize: '6.2 MB',
    url: 'https://example.com/materials/khoahoc3-cay-coi.pdf',
    uploadedAt: '2026-10-18',
    author: 'Tổ Chuyên môn Khối 3 - Trường Tiểu học Hoài Nhơn',
    description: 'Tài liệu khoa học sinh động với hình ảnh thực tế về cấu tạo của cây xanh (rễ, thân, lá, hoa, quả) và môi trường sống của động vật.',
    content: 'Kiến thức cốt lõi:\n- Cây xanh thường gồm các bộ phận: Rễ (hút nước và chất khoáng), Thân (vận chuyển nước lên lá), Lá (quang hợp tổng hợp chất dinh dưỡng), Hoa và Quả (chức năng sinh sản).\n- Ý nghĩa: Cung cấp khí oxy, thức ăn và bóng mát cho môi trường sống.',
    keyConcepts: ['Bộ phận của cây', 'Chức năng rễ, thân, lá', 'Bảo vệ thiên nhiên'],
    tags: ['Khoa học 3', 'Thế giới tự nhiên', 'STEM'],
    sampleQuestions: [
      {
        question: 'Bộ phận nào của cây xanh có nhiệm vụ hút nước và chất dinh dưỡng từ lòng đất?',
        options: ['Rễ cây', 'Thân cây', 'Lá cây', 'Hoa cây'],
        answer: 'Rễ cây',
        explanation: 'Rễ cây cắm sâu vào lòng đất để hút nước và các chất khoáng nuôi toàn bộ cây.'
      }
    ],
    viewCount: 95
  }
];

export const PARENT_NOTIFICATIONS: ParentNotification[] = [
  {
    id: 'pn-1',
    title: 'Kế hoạch học tập tuần 8 & Hoạt động rèn luyện song ngữ lớp 3C1',
    content: 'Kính gửi Quý phụ huynh, tuần này lớp 3C1 sẽ hoàn thành chủ đề Tiếng Anh "Friends" và thực hành phép nhân số có 4 chữ số. Kính nhờ phụ huynh nhắc nhở các con dành 20 phút mỗi tối tương tác với AI Class.',
    date: '2026-10-15',
    sender: 'Cô Đỗ Thị Hoà (GVCN 3C1)',
    isImportant: true,
    category: 'announcement',
    readBy: ['s-1', 's-2', 's-3', 's-5']
  },
  {
    id: 'pn-2',
    title: 'Vinh danh tuần: 18 học sinh nhận huy hiệu "English Star" và "Kind Friend"',
    content: 'Chúc mừng các con lớp 3C1 đã nỗ lực vượt bậc trong tuần vừa qua. Cô Hoà đã trao tặng huy hiệu danh dự trên hệ sinh thái số AI Class.',
    date: '2026-10-14',
    sender: 'Cô Đỗ Thị Hoà (GVCN 3C1)',
    isImportant: false,
    category: 'event',
    readBy: ['s-1', 's-2', 's-3', 's-4', 's-5', 's-6']
  }
];

export const PARENT_FEEDBACKS: ParentFeedback[] = [
  {
    id: 'fb-1',
    studentId: 's-1',
    studentName: 'Nguyễn Bảo An',
    parentName: 'Nguyễn Văn Hùng',
    message: 'Chào cô Hoà, cháu An rất hào hứng với góc học Tiếng Anh AI và các trò chơi ghép từ. Cảm ơn cô đã xây dựng ứng dụng rất bổ ích cho các con!',
    teacherReply: 'Dạ cảm ơn anh Hùng! Bảo An rất chăm chỉ và có tinh thần tự giác cao. Cô sẽ tiếp tục mở thêm các thử thách mới cho con ạ.',
    sentAt: '2026-10-15 19:30',
    repliedAt: '2026-10-15 20:15',
    status: 'replied'
  },
  {
    id: 'fb-2',
    studentId: 's-4',
    studentName: 'Phạm Gia Huy',
    parentName: 'Phạm Quốc Bảo',
    message: 'Thưa cô, sáng nay bố cháu bận đột xuất nên cháu đến lớp muộn 10 phút, gia đình xin lỗi cô giáo và sẽ khắc phục vào ngày mai ạ.',
    teacherReply: 'Dạ không sao anh Bảo ạ, cô đã nắm được thông tin và ghi nhận điểm danh cho cháu rồi ạ!',
    sentAt: '2026-10-16 07:45',
    repliedAt: '2026-10-16 08:00',
    status: 'replied'
  }
];
