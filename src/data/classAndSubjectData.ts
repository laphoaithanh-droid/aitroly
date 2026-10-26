import { ClassRoom, CustomSubject, GenericLesson, Student } from '../types';
import { INITIAL_STUDENTS } from './initialData';

// Danh sách lớp học mẫu ban đầu (Hỗ trợ chuyển đổi nhiều lớp & tạo lớp mới)
export const INITIAL_CLASSES: ClassRoom[] = [
  {
    id: 'c-3c1',
    name: '3C1',
    grade: 3,
    schoolYear: '2026–2027',
    schoolName: 'Trường Tiểu học Hoài Nhơn',
    teacherName: 'Đỗ Thị Hoà',
    teacherUsername: 'thhn_3c1',
    teacherPassword: 'Thhn_12@',
    googleSheetUrl: 'https://docs.google.com/spreadsheets/d/1j52y0zzHNHRKmuvOjmactixKnpGQrwa7/edit?gid=671636391#gid=671636391',
    students: INITIAL_STUDENTS.map(s => ({
      ...s,
      className: '3C1',
      username: s.username || `hs3c1${s.stt < 10 ? '0' + s.stt : s.stt}`,
      password: s.password || '123456'
    }))
  },
  {
    id: 'c-3a2',
    name: '3A2',
    grade: 3,
    schoolYear: '2026–2027',
    schoolName: 'Trường Tiểu học Hoài Nhơn',
    teacherName: 'Đỗ Thị Hoà',
    teacherUsername: 'thhn_3a2',
    teacherPassword: 'Thhn_12@',
    googleSheetUrl: 'https://docs.google.com/spreadsheets/d/1j52y0zzHNHRKmuvOjmactixKnpGQrwa7/edit?gid=671636391#gid=671636391',
    students: INITIAL_STUDENTS.map(s => ({
      ...s,
      className: '3A2',
      username: s.username || `hs3a2${s.stt < 10 ? '0' + s.stt : s.stt}`,
      password: s.password || '123456'
    }))
  },
  {
    id: 'c-3a1',
    name: '3A1',
    grade: 3,
    schoolYear: '2026–2027',
    schoolName: 'Trường Tiểu học Hoài Nhơn',
    teacherName: 'Đỗ Thị Hoà',
    googleSheetUrl: '',
    students: [
      {
        id: 's-3a1-1',
        stt: 1,
        studentCode: 'HS3A101',
        fullName: 'Nguyễn Văn An',
        gender: 'Nam',
        birthDate: '2018-04-12',
        className: '3A1',
        accountStatus: 'active',
        attendanceStatus: 'present',
        attendanceHistory: [{ date: '2026-10-16', status: 'present' }],
        activeTasksCount: 2,
        learningProgress: 92,
        skills: { english: 90, math: 95, vietnamese: 88, informatics: 92, science: 88, 'history-geo': 85 },
        supportGoal: 'Phát huy tư duy giải toán thông minh và tự tin phát biểu',
        badges: ['creative-thinker', 'daily-learner'],
        parentName: 'Nguyễn Văn Bình',
        parentPhone: '0912 111 222',
        seatGroup: 1,
        seatIndex: 1
      },
      {
        id: 's-3a1-2',
        stt: 2,
        studentCode: 'HS3A102',
        fullName: 'Trần Thị Mai',
        gender: 'Nữ',
        birthDate: '2018-07-25',
        className: '3A1',
        accountStatus: 'active',
        attendanceStatus: 'present',
        attendanceHistory: [{ date: '2026-10-16', status: 'present' }],
        activeTasksCount: 1,
        learningProgress: 96,
        skills: { english: 98, math: 92, vietnamese: 96, informatics: 90, science: 94, 'history-geo': 92 },
        supportGoal: 'Bồi dưỡng năng khiếu tiếng Anh và dẫn dắt câu lạc bộ đọc sách',
        badges: ['english-star', 'reading-hero'],
        parentName: 'Trần Văn Cường',
        parentPhone: '0983 222 333',
        seatGroup: 1,
        seatIndex: 2
      },
      {
        id: 's-3a1-3',
        stt: 3,
        studentCode: 'HS3A103',
        fullName: 'Lê Hoàng Long',
        gender: 'Nam',
        birthDate: '2018-09-15',
        className: '3A1',
        accountStatus: 'active',
        attendanceStatus: 'present',
        attendanceHistory: [{ date: '2026-10-16', status: 'present' }],
        activeTasksCount: 3,
        learningProgress: 85,
        skills: { english: 82, math: 89, vietnamese: 84, informatics: 86, science: 85, 'history-geo': 80 },
        supportGoal: 'Rèn luyện khả năng đọc diễn cảm và tính toán có lời văn',
        badges: ['teamwork-champion'],
        parentName: 'Lê Văn Dũng',
        parentPhone: '0977 333 444',
        seatGroup: 1,
        seatIndex: 3
      },
      {
        id: 's-3a1-4',
        stt: 4,
        studentCode: 'HS3A104',
        fullName: 'Phạm Ngọc Trâm',
        gender: 'Nữ',
        birthDate: '2018-02-18',
        className: '3A1',
        accountStatus: 'active',
        attendanceStatus: 'present',
        attendanceHistory: [{ date: '2026-10-16', status: 'present' }],
        activeTasksCount: 2,
        learningProgress: 94,
        skills: { english: 95, math: 91, vietnamese: 95, informatics: 91, science: 92, 'history-geo': 90 },
        supportGoal: 'Tập trung bồi dưỡng năng khiếu văn học và viết chính tả sạch đẹp',
        badges: ['kind-friend', 'reading-hero'],
        parentName: 'Phạm Văn Giang',
        parentPhone: '0905 444 555',
        seatGroup: 1,
        seatIndex: 4
      }
    ]
  },
  {
    id: 'c-4a1',
    name: '4A1',
    grade: 4,
    schoolYear: '2026–2027',
    schoolName: 'Trường Tiểu học Hoài Nhơn',
    teacherName: 'Đỗ Thị Hoà',
    googleSheetUrl: '',
    students: [
      {
        id: 's-4a1-1',
        stt: 1,
        studentCode: 'HS4A101',
        fullName: 'Bùi Đức Anh',
        gender: 'Nam',
        birthDate: '2017-03-10',
        className: '4A1',
        accountStatus: 'active',
        attendanceStatus: 'present',
        attendanceHistory: [{ date: '2026-10-16', status: 'present' }],
        activeTasksCount: 2,
        learningProgress: 95,
        skills: { english: 94, math: 98, vietnamese: 92, informatics: 96, science: 95, 'history-geo': 92 },
        supportGoal: 'Khuyến khích tham gia câu lạc bộ STEM khoa học và giải toán nâng cao',
        badges: ['creative-thinker', 'daily-learner'],
        parentName: 'Bùi Văn Hạnh',
        parentPhone: '0918 555 666',
        seatGroup: 1,
        seatIndex: 1
      },
      {
        id: 's-4a1-2',
        stt: 2,
        studentCode: 'HS4A102',
        fullName: 'Hoàng Kim Chi',
        gender: 'Nữ',
        birthDate: '2017-06-22',
        className: '4A1',
        accountStatus: 'active',
        attendanceStatus: 'present',
        attendanceHistory: [{ date: '2026-10-16', status: 'present' }],
        activeTasksCount: 1,
        learningProgress: 97,
        skills: { english: 99, math: 94, vietnamese: 98, informatics: 95, science: 96, 'history-geo': 97 },
        supportGoal: 'Phát huy năng khiếu thuyết trình song ngữ và chỉ huy chi đội',
        badges: ['english-star', 'reading-hero', 'kind-friend'],
        parentName: 'Hoàng Văn Khang',
        parentPhone: '0934 666 777',
        seatGroup: 1,
        seatIndex: 2
      },
      {
        id: 's-4a1-3',
        stt: 3,
        studentCode: 'HS4A103',
        fullName: 'Đoàn Quang Minh',
        gender: 'Nam',
        birthDate: '2017-10-05',
        className: '4A1',
        accountStatus: 'active',
        attendanceStatus: 'present',
        attendanceHistory: [{ date: '2026-10-16', status: 'present' }],
        activeTasksCount: 3,
        learningProgress: 86,
        skills: { english: 84, math: 90, vietnamese: 82, informatics: 92, science: 88, 'history-geo': 85 },
        supportGoal: 'Rèn luyện khả năng đọc hiểu bản đồ địa lý và tóm tắt sự kiện lịch sử',
        badges: ['teamwork-champion'],
        parentName: 'Đoàn Văn Lộc',
        parentPhone: '0988 777 888',
        seatGroup: 1,
        seatIndex: 3
      }
    ]
  },
  {
    id: 'c-5a2',
    name: '5A2',
    grade: 5,
    schoolYear: '2026–2027',
    schoolName: 'Trường Tiểu học Hoài Nhơn',
    teacherName: 'Đỗ Thị Hoà',
    googleSheetUrl: '',
    students: [
      {
        id: 's-5a2-1',
        stt: 1,
        studentCode: 'HS5A201',
        fullName: 'Vũ Minh Tuấn',
        gender: 'Nam',
        birthDate: '2016-01-14',
        className: '5A2',
        accountStatus: 'active',
        attendanceStatus: 'present',
        attendanceHistory: [{ date: '2026-10-16', status: 'present' }],
        activeTasksCount: 2,
        learningProgress: 98,
        skills: { english: 96, math: 99, vietnamese: 95, informatics: 98, science: 98, 'history-geo': 96 },
        supportGoal: 'Bồi dưỡng học sinh giỏi toàn diện, sẵn sàng chuyển cấp lên THCS',
        badges: ['creative-thinker', 'english-star', 'daily-learner'],
        parentName: 'Vũ Văn Nam',
        parentPhone: '0909 888 999',
        seatGroup: 1,
        seatIndex: 1
      },
      {
        id: 's-5a2-2',
        stt: 2,
        studentCode: 'HS5A202',
        fullName: 'Lâm Thảo Nhi',
        gender: 'Nữ',
        birthDate: '2016-05-30',
        className: '5A2',
        accountStatus: 'active',
        attendanceStatus: 'present',
        attendanceHistory: [{ date: '2026-10-16', status: 'present' }],
        activeTasksCount: 1,
        learningProgress: 97,
        skills: { english: 98, math: 95, vietnamese: 99, informatics: 94, science: 97, 'history-geo': 98 },
        supportGoal: 'Rèn luyện kỹ năng viết bài văn miêu tả sâu sắc và tranh biện lịch sử',
        badges: ['reading-hero', 'kind-friend'],
        parentName: 'Lâm Văn Phúc',
        parentPhone: '0976 999 000',
        seatGroup: 1,
        seatIndex: 2
      }
    ]
  }
];

// Danh mục tất cả các môn học (Bao gồm môn nòng cốt và môn mới cấu hình đầy đủ tính năng)
export const INITIAL_SUBJECTS: CustomSubject[] = [
  {
    id: 'english',
    name: 'Tiếng Anh',
    englishName: 'English World',
    code: 'TA',
    color: 'from-indigo-500 to-blue-600',
    badgeColor: 'bg-indigo-600 text-white',
    icon: 'Languages',
    description: 'Chương trình tiếng Anh tiểu học song ngữ, luyện phát âm chuẩn AI và giao tiếp tự tin.',
    grades: [1, 2, 3, 4, 5],
    isCore: true,
    enabled: true
  },
  {
    id: 'math',
    name: 'Toán học',
    englishName: 'Math World',
    code: 'TOÁN',
    color: 'from-emerald-500 to-teal-600',
    badgeColor: 'bg-emerald-600 text-white',
    icon: 'Calculator',
    description: 'Toán tư duy trực quan, rèn luyện kỹ năng tính toán, giải toán có lời văn và hình học.',
    grades: [1, 2, 3, 4, 5],
    isCore: true,
    enabled: true
  },
  {
    id: 'vietnamese',
    name: 'Tiếng Việt',
    englishName: 'Vietnamese World',
    code: 'TV',
    color: 'from-amber-500 to-rose-600',
    badgeColor: 'bg-amber-600 text-white',
    icon: 'BookOpenText',
    description: 'Bộ sách Kết nối tri thức, rèn đọc diễn cảm, mở rộng vốn từ, ngữ pháp và viết đoạn văn.',
    grades: [1, 2, 3, 4, 5],
    isCore: true,
    enabled: true
  },
  {
    id: 'informatics',
    name: 'Tin học',
    englishName: 'Informatics World',
    code: 'TIN',
    color: 'from-violet-500 to-purple-700',
    badgeColor: 'bg-violet-600 text-white',
    icon: 'Laptop',
    description: 'Mô phỏng bàn phím 10 ngón, thao tác chuột, cây thư mục và an toàn trên không gian số.',
    grades: [3, 4, 5],
    isCore: true,
    enabled: true
  },
  {
    id: 'science',
    name: 'Khoa học',
    englishName: 'Science World',
    code: 'KH',
    color: 'from-cyan-500 to-blue-600',
    badgeColor: 'bg-cyan-600 text-white',
    icon: 'FlaskConical',
    description: 'Khám phá thế giới tự nhiên, năng lượng, sinh vật, con người và sức khỏe (Khối 4 & 5).',
    grades: [4, 5],
    isCore: false,
    enabled: true
  },
  {
    id: 'history-geo',
    name: 'Lịch sử & Địa lý',
    englishName: 'History & Geography',
    code: 'LS-ĐL',
    color: 'from-amber-600 to-orange-700',
    badgeColor: 'bg-orange-700 text-white',
    icon: 'Compass',
    description: 'Tìm hiểu cội nguồn dân tộc, danh nhân lịch sử và cảnh quan các vùng miền đất nước Việt Nam.',
    grades: [4, 5],
    isCore: false,
    enabled: true
  },
  {
    id: 'nature-society',
    name: 'Tự nhiên & Xã hội',
    englishName: 'Nature & Society',
    code: 'TN-XH',
    color: 'from-emerald-600 to-green-700',
    badgeColor: 'bg-green-700 text-white',
    icon: 'Trees',
    description: 'Tìm hiểu gia đình, nhà trường, cộng đồng địa phương, thực vật, động vật và môi trường sống (Khối 1, 2, 3).',
    grades: [1, 2, 3],
    isCore: false,
    enabled: true
  },
  {
    id: 'ethics',
    name: 'Đạo đức & Kỹ năng',
    englishName: 'Ethics & Life Skills',
    code: 'ĐĐ',
    color: 'from-pink-500 to-rose-600',
    badgeColor: 'bg-pink-600 text-white',
    icon: 'HeartHandshake',
    description: 'Hình thành nhân cách, lòng biết ơn, tôn trọng sự khác biệt, kỹ năng tự bảo vệ và hợp tác.',
    grades: [1, 2, 3, 4, 5],
    isCore: false,
    enabled: true
  },
  {
    id: 'technology',
    name: 'Công nghệ & STEM',
    englishName: 'Technology & STEM',
    code: 'CN',
    color: 'from-teal-500 to-emerald-700',
    badgeColor: 'bg-teal-600 text-white',
    icon: 'Cpu',
    description: 'Công nghệ đời sống, an toàn điện, mô hình kỹ thuật thủ công và sáng tạo khoa học vui.',
    grades: [3, 4, 5],
    isCore: false,
    enabled: true
  },
  {
    id: 'experiential',
    name: 'Hoạt động trải nghiệm',
    englishName: 'Experiential Activities',
    code: 'HĐTN',
    color: 'from-yellow-500 to-amber-600',
    badgeColor: 'bg-yellow-600 text-white',
    icon: 'Sparkles',
    description: 'Sinh hoạt dưới cờ, sinh hoạt lớp, rèn luyện nền nếp và các dự án vì cộng đồng trường học.',
    grades: [1, 2, 3, 4, 5],
    isCore: false,
    enabled: true
  }
];

// Nội dung bài học đầy đủ cho các môn học mới (theo chuẩn Chương trình GDPT 2018)
export const INITIAL_GENERIC_LESSONS: GenericLesson[] = [
  // ==================== KHOA HỌC (SCIENCE) ====================
  {
    id: 'sci-4-1',
    subjectId: 'science',
    grade: 4,
    chapter: 'Chủ đề 1: Chất',
    lessonNumber: 1,
    title: 'Nước và sự chuyển thể của nước trong tự nhiên',
    subtitle: 'Khám phá 3 thể của nước: rắn, lỏng, khí và vòng tuần hoàn',
    summary: 'Nước tồn tại ở ba thể: thể lỏng (nước sinh hoạt, mưa), thể rắn (nước đá, băng), thể khí (hơi nước). Nhờ hiện tượng bay hơi và ngưng tụ, nước tuần hoàn liên tục trong tự nhiên tạo thành mưa.',
    contentParagraphs: [
      '1. Ba thể của nước: Ở nhiệt độ thường, nước tồn tại ở thể lỏng, không màu, không mùi, không vị. Khi được làm lạnh dưới 0°C, nước đông đặc thành thể rắn (nước đá). Khi đun sôi lên 100°C hoặc để ngoài trời nắng, nước bay hơi thành thể khí (hơi nước).',
      '2. Sự chuyển thể: Quá trình chuyển từ thể lỏng sang thể khí gọi là bay hơi; ngược lại, hơi nước gặp lạnh chuyển thành các giọt nước li ti gọi là ngưng tụ. Quá trình nước đá chuyển thành nước lỏng gọi là nóng chảy; nước lỏng chuyển thành nước đá gọi là đông đặc.',
      '3. Vòng tuần hoàn của nước trong tự nhiên: Nước ở ao, hồ, sông, biển được ánh sáng mặt trời sưởi ấm, bay hơi lên cao. Gặp không khí lạnh, hơi nước ngưng tụ thành những đám mây. Khi các giọt nước trong mây đủ nặng, chúng rơi xuống thành mưa, tiếp tục bổ sung nguồn nước cho mặt đất.'
    ],
    keyTerms: [
      { term: 'Bay hơi', explanation: 'Hiện tượng chất lỏng chuyển sang thể khí (hơi).' },
      { term: 'Ngưng tụ', explanation: 'Hiện tượng hơi nước gặp lạnh chuyển thành thể lỏng.' },
      { term: 'Đông đặc', explanation: 'Hiện tượng chất lỏng chuyển thành chất rắn ở nhiệt độ thấp.' },
      { term: 'Nóng chảy', explanation: 'Hiện tượng chất rắn chuyển thành chất lỏng khi được cấp nhiệt.' }
    ],
    practicalApplication: 'Ứng dụng trong đời sống: Phơi khô quần áo nhờ sự bay hơi; làm đá uống nước giải khát nhờ sự đông đặc; chưng cất nước cất y tế nhờ bay hơi và ngưng tụ.',
    audioText: 'Chào các em học sinh! Hôm nay chúng ta cùng tìm hiểu bài học Nước và sự chuyển thể của nước trong tự nhiên. Nước tồn tại ở ba thể: rắn, lỏng và khí. Hãy cùng lắng nghe và trả lời các câu hỏi luyện tập nhé!',
    drills: [
      {
        id: 'sci-q1',
        question: 'Hiện tượng nước từ ao hồ bay lên cao tạo thành mây được gọi là gì?',
        options: ['Sự đông đặc', 'Sự bay hơi', 'Sự nóng chảy', 'Sự hòa tan'],
        correctAnswer: 'Sự bay hơi',
        hint: 'Nước hấp thụ nhiệt từ ánh nắng mặt trời và chuyển từ thể lỏng sang thể khí.',
        explanation: 'Dưới tác dụng của nhiệt độ mặt trời, nước trên bề mặt ao hồ chuyển thành thể khí (hơi nước) và bay lên cao, gọi là sự bay hơi.'
      },
      {
        id: 'sci-q2',
        question: 'Nước đá bắt đầu chuyển thành nước lỏng (nóng chảy) ở nhiệt độ nào?',
        options: ['Trên 0°C', 'Dưới -10°C', 'Ở 100°C', 'Ở 50°C'],
        correctAnswer: 'Trên 0°C',
        hint: 'Nhiệt độ phòng bình thường làm tan chảy các viên đá viên lấy từ tủ lạnh ra.',
        explanation: 'Ở nhiệt độ trên 0°C, nước đá hấp thụ nhiệt lượng từ môi trường xung quanh và nóng chảy thành nước lỏng.'
      },
      {
        id: 'sci-q3',
        question: 'Tại sao khi ta cầm một ly nước đá, bên ngoài thành ly lại xuất hiện các giọt nước li ti?',
        options: [
          'Vì nước trong ly thấm qua thành ly ra ngoài',
          'Vì hơi nước trong không khí gặp thành ly lạnh nên ngưng tụ',
          'Vì ly nước bị nứt nhỏ',
          'Vì đá viên bay hơi ra ngoài'
        ],
        correctAnswer: 'Vì hơi nước trong không khí gặp thành ly lạnh nên ngưng tụ',
        hint: 'Thành ly lạnh làm cho hơi nước xung quanh chuyển thành dạng nước lỏng bám vào bề mặt.',
        explanation: 'Thành ly đá có nhiệt độ thấp, khi hơi nước vô hình có sẵn trong không khí tiếp xúc với bề mặt lạnh này sẽ bị ngưng tụ thành các giọt nước lỏng.'
      },
      {
        id: 'sci-q4',
        question: 'Hành động nào dưới đây thể hiện việc tiết kiệm và bảo vệ nguồn nước sạch?',
        options: [
          'Mở vòi nước liên tục khi đang chà xát xà phòng vào tay',
          'Khóa vòi nước ngay sau khi sử dụng và báo sửa nếu vòi bị rò rỉ',
          'Vứt túi nilon và rác thải trực tiếp xuống bờ kênh, bờ sông',
          'Dùng nước sạch để xịt rửa sân chơi mỗi ngày'
        ],
        correctAnswer: 'Khóa vòi nước ngay sau khi sử dụng và báo sửa nếu vòi bị rò rỉ',
        hint: 'Tiết kiệm nước bắt đầu từ những thói quen cẩn thận hàng ngày.',
        explanation: 'Khóa chặt vòi nước khi không dùng và sửa chữa vòi rò rỉ giúp ngăn lãng phí hàng nghìn lít nước sạch mỗi tháng.'
      }
    ]
  },
  {
    id: 'sci-4-2',
    subjectId: 'science',
    grade: 4,
    chapter: 'Chủ đề 2: Năng lượng',
    lessonNumber: 2,
    title: 'Ánh sáng và vai trò của ánh sáng đối với sự sống',
    subtitle: 'Nguồn sáng, vật được chiếu sáng và vai trò của ánh sáng mặt trời',
    summary: 'Mặt trời là nguồn sáng và nguồn nhiệt chủ yếu cho Trái Đất. Nhờ có ánh sáng, thực vật mới quang hợp, tạo ra khí ô-xi và chất dinh dưỡng nuôi sống con người và động vật.',
    contentParagraphs: [
      '1. Nguồn sáng và vật được chiếu sáng: Những vật tự phát ra ánh sáng gọi là vật phát sáng (Mặt trời, ngọn nến đang cháy, bóng đèn đang bật, con đom đóm). Mặt trăng không tự phát sáng mà là vật phản chiếu ánh sáng từ Mặt trời.',
      '2. Ánh sáng truyền theo đường thẳng: Trong môi trường trong suốt và đồng tính (như không khí), ánh sáng truyền đi theo đường thẳng. Khi ánh sáng bị một vật cản lại, phía sau vật đó sẽ hình thành bóng tối.',
      '3. Vai trò với con người và thực vật: Cây xanh cần ánh sáng mặt trời để quang hợp, tổng hợp chất diệp lục. Con người cần ánh sáng để nhìn rõ vạn vật, học tập, làm việc và tổng hợp vitamin D giúp xương chắc khỏe.'
    ],
    keyTerms: [
      { term: 'Vật phát sáng', explanation: 'Vật thể có khả năng tự phát ra ánh sáng.' },
      { term: 'Quang hợp', explanation: 'Quá trình cây xanh dùng năng lượng ánh sáng để tạo ra chất hữu cơ và khí ô-xi.' },
      { term: 'Bóng tối', explanation: 'Vùng phía sau vật cản không nhận được ánh sáng từ nguồn sáng chiếu tới.' }
    ],
    practicalApplication: 'Trong phòng học, bàn ghế cần được xếp để ánh sáng chiếu từ phía bên trái tới (đối với người thuận tay phải) nhằm tránh bóng của tay che khuất chữ viết.',
    audioText: 'Ánh sáng đóng vai trò vô cùng kỳ diệu đối với hành tinh chúng ta. Không có ánh sáng mặt trời, Trái Đất sẽ chìm trong giá lạnh và sự sống không thể tồn tại. Hãy cùng khám phá bài học nhé!',
    drills: [
      {
        id: 'sci-q5',
        question: 'Vật nào sau đây là vật tự phát sáng?',
        options: ['Mặt trăng', 'Tấm gương soi', 'Mặt trời', 'Bàn ghế học sinh'],
        correctAnswer: 'Mặt trời',
        hint: 'Vật này tỏa ra cả ánh sáng và nhiệt lượng sưởi ấm toàn bộ Trái Đất.',
        explanation: 'Mặt trời là một ngôi sao tự phát ra ánh sáng rực rỡ và nhiệt lượng khổng lồ.'
      },
      {
        id: 'sci-q6',
        question: 'Ánh sáng truyền đi trong không khí theo đường nào?',
        options: ['Đường cong zíc zắc', 'Đường thẳng', 'Đường lượn sóng', 'Đường xoắn ốc'],
        correctAnswer: 'Đường thẳng',
        hint: 'Hãy nhớ lại thí nghiệm nhìn qua khe thẳng của 3 tấm bìa đục lỗ.',
        explanation: 'Trong không khí đồng tính, ánh sáng truyền đi theo đường thẳng.'
      }
    ]
  },
  {
    id: 'sci-5-1',
    subjectId: 'science',
    grade: 5,
    chapter: 'Chủ đề 3: Sinh vật và Môi trường',
    lessonNumber: 1,
    title: 'Sự sinh sản và phát triển của thực vật có hoa',
    subtitle: 'Cấu tạo hoa, thụ phấn, thụ tinh và quá trình hình thành hạt giống',
    summary: 'Hoa là cơ quan sinh sản của thực vật có hoa. Hoa gồm có cuống hoa, đài hoa, cánh hoa, nhị hoa (cơ quan sinh dục đực) và nhụy hoa (cơ quan sinh dục cái). Sau khi thụ phấn và thụ tinh, noãn phát triển thành hạt, bầu nhụy phát triển thành quả.',
    contentParagraphs: [
      '1. Cấu tạo cơ quan sinh sản của hoa: Nhị hoa gồm có chỉ nhị và bao phấn chứa các hạt phấn. Nhụy hoa gồm có đầu nhụy, vòi nhụy và bầu nhụy chứa noãn.',
      '2. Quá trình thụ phấn: Là hiện tượng hạt phấn từ nhị rơi vào đầu nhụy. Thụ phấn có thể nhờ gió (ngô, cỏ, lúa) hoặc nhờ côn trùng như ong, bướm (hoa bưởi, hoa hồng, hoa hướng dương).',
      '3. Thụ tinh và tạo hạt: Sau khi thụ tinh, hạt phấn kết hợp với noãn. Noãn phát triển thành hạt chứa phôi sinh mệnh mới, bầu nhụy lớn lên thành quả bao bọc bảo vệ hạt.'
    ],
    keyTerms: [
      { term: 'Nhị hoa', explanation: 'Bộ phận sinh dục đực của hoa, sinh ra hạt phấn.' },
      { term: 'Nhụy hoa', explanation: 'Bộ phận sinh dục cái của hoa, chứa noãn.' },
      { term: 'Thụ phấn', explanation: 'Quá trình hạt phấn tiếp xúc và bám dính vào đầu nhụy.' }
    ],
    practicalApplication: 'Nông dân nuôi ong trong vườn cây ăn quả để ong giúp hoa thụ phấn tốt hơn, vừa tăng năng suất cây trồng vừa thu hoạch mật ong ngọt lành.',
    audioText: 'Hoa không chỉ đẹp và thơm mà còn giữ nhiệm vụ duy trì nòi giống cho muôn loài cây cỏ. Hãy cùng tìm hiểu cấu tạo nhị và nhụy của hoa nhé!',
    drills: [
      {
        id: 'sci-5-q1',
        question: 'Cơ quan sinh dục đực của hoa được gọi là gì?',
        options: ['Nhụy hoa', 'Nhị hoa', 'Đài hoa', 'Cánh hoa'],
        correctAnswer: 'Nhị hoa',
        hint: 'Bộ phận này mang bao phấn chứa vô số hạt phấn màu vàng.',
        explanation: 'Nhị hoa là cơ quan sinh dục đực mang bao phấn; còn nhụy hoa là cơ quan sinh dục cái mang noãn.'
      },
      {
        id: 'sci-5-q2',
        question: 'Loài hoa nào dưới đây thường thụ phấn chủ yếu nhờ côn trùng (ong, bướm)?',
        options: ['Hoa ngô (bắp)', 'Hoa cỏ dại', 'Hoa bưởi thơm ngát', 'Hoa lúa nước'],
        correctAnswer: 'Hoa bưởi thơm ngát',
        hint: 'Hoa có màu sắc đẹp, hương thơm quyến rũ và mật ngọt thu hút ong bướm.',
        explanation: 'Hoa bưởi có cánh trắng muốt, hương thơm ngát và mật ngọt nên thu hút ong bướm đến hút mật và vô tình mang hạt phấn đi thụ phấn.'
      }
    ]
  },

  // ==================== LỊCH SỬ VÀ ĐỊA LÝ (HISTORY & GEOGRAPHY) ====================
  {
    id: 'his-4-1',
    subjectId: 'history-geo',
    grade: 4,
    chapter: 'Chủ đề: Đất nước và Con người Việt Nam',
    lessonNumber: 1,
    title: 'Đền Hùng và Lễ giỗ Tổ Hùng Vương',
    subtitle: 'Cội nguồn thiêng liêng của dân tộc Việt Nam tại Đền Hùng - Phú Thọ',
    summary: 'Khu di tích lịch sử Đền Hùng nằm trên núi Nghĩa Lĩnh, tỉnh Phú Thọ, là nơi thờ phụng các vua Hùng đã có công dựng nước Văn Lang - nhà nước đầu tiên của dân tộc ta. Hằng năm, ngày mùng 10 tháng 3 âm lịch là ngày Giỗ Tổ Hùng Vương.',
    contentParagraphs: [
      '1. Nhà nước Văn Lang và các vua Hùng: Theo truyền thuyết và thư tịch lịch sử, các vua Hùng đã lập nên nhà nước Văn Lang đóng đô ở Phong Châu (nay thuộc Phú Thọ). Nhân dân ta thời kỳ này biết trồng lúa nước, dệt vải, đúc trống đồng Đông Sơn và đoàn kết bảo vệ xóm làng.',
      '2. Khu di tích Đền Hùng: Gồm có Đền Hạ, Đền Trung, Đền Thượng và Lăng Hùng Vương trên đỉnh núi Nghĩa Lĩnh uy nghiêm giữa bạt ngàn rừng cọ đồi chè Phú Thọ.',
      '3. Ý nghĩa ngày Giỗ Tổ: Câu ca dao muôn đời in sâu trong tâm khảm người Việt: "Dù ai đi ngược về xuôi / Nhớ ngày Giỗ Tổ mùng mười tháng ba". Tín ngưỡng thờ cúng Hùng Vương đã được UNESCO công nhận là Di sản văn hóa phi vật thể đại diện của nhân loại.'
    ],
    keyTerms: [
      { term: 'Văn Lang', explanation: 'Tên nhà nước đầu tiên trong lịch sử dân tộc Việt Nam.' },
      { term: 'Núi Nghĩa Lĩnh', explanation: 'Ngọn núi thiêng tại Phú Thọ nơi xây dựng quần thể Đền Hùng.' },
      { term: 'Trống đồng Đông Sơn', explanation: 'Biểu tượng đỉnh cao của nền văn hóa đồng thau rực rỡ thời Hùng Vương.' }
    ],
    practicalApplication: 'Lời Bác Hồ căn dặn tại Đền Hùng ngày 19/9/1954: "Các vua Hùng đã có công dựng nước, Bác cháu ta phải cùng nhau giữ lấy nước."',
    audioText: 'Dù ai đi ngược về xuôi, nhớ ngày Giỗ Tổ mùng mười tháng ba. Đền Hùng là nơi cội nguồn linh thiêng của triệu triệu người con đất Việt.',
    drills: [
      {
        id: 'his-q1',
        question: 'Lễ hội Đền Hùng được tổ chức quốc lễ vào ngày nào hàng năm?',
        options: ['Mùng 1 tháng 1 âm lịch', 'Mùng 10 tháng 3 âm lịch', 'Ngày 2 tháng 9', 'Rằm tháng 8 âm lịch'],
        correctAnswer: 'Mùng 10 tháng 3 âm lịch',
        hint: 'Câu ca dao: Dù ai đi ngược về xuôi / Nhớ ngày Giỗ Tổ...',
        explanation: 'Ngày mùng 10 tháng 3 âm lịch hàng năm là ngày Giỗ Tổ Hùng Vương, ngày hội non sông hướng về cội nguồn dân tộc.'
      },
      {
        id: 'his-q2',
        question: 'Khu di tích lịch sử Đền Hùng thuộc tỉnh nào của nước ta hiện nay?',
        options: ['Tỉnh Hà Tĩnh', 'Tỉnh Phú Thọ', 'Tỉnh Quảng Nam', 'Tỉnh Nghệ An'],
        correctAnswer: 'Tỉnh Phú Thọ',
        hint: 'Mảnh đất trung du với rừng cọ, đồi chè bát ngát.',
        explanation: 'Quần thể Đền Hùng tọa lạc trên núi Nghĩa Lĩnh, thành phố Việt Trì, tỉnh Phú Thọ.'
      }
    ]
  },
  {
    id: 'his-5-1',
    subjectId: 'history-geo',
    grade: 5,
    chapter: 'Chủ đề: Lịch sử hào hùng',
    lessonNumber: 1,
    title: 'Chiến thắng lịch sử Điện Biên Phủ năm 1954',
    subtitle: 'Lừng lẫy năm châu, chấn động địa cầu',
    summary: 'Chiến dịch Điện Biên Phủ diễn ra trong 56 ngày đêm "khoét núi, ngủ hầm, mưa dầm, cơm vắt", dưới sự chỉ huy của Đại tướng Võ Nguyên Giáp. Ngày 7/5/1954, lá cờ Quyết chiến Quyết thắng tung bay trên nóc hầm Đờ Cát-xtơ-ri, kết thúc thắng lợi cuộc kháng chiến chống thực dân Pháp.',
    contentParagraphs: [
      '1. Bối cảnh lịch sử: Thực dân Pháp xây dựng tập đoàn cứ điểm Điện Biên Phủ với 49 cứ điểm kiên cố, tự coi là "pháo đài bất khả xâm phạm".',
      '2. Ý chí quật cường của quân dân ta: Bộ đội và dân công hỏa tuyến ngày đêm xẻ núi làm đường, kéo những cẩu đại bác nặng hàng tấn qua đèo dốc hiểm trở; hàng vạn chiếc xe đạp thồ vượt đèo Pha Đin tiếp tế lương thực cho mặt trận.',
      '3. Toàn thắng ngày 7 tháng 5: Đúng 17 giờ 30 phút ngày 7/5/1954, tướng Đờ Cát cùng toàn bộ bộ chỉ huy tập đoàn cứ điểm đầu hàng. Chiến thắng Điện Biên Phủ đi vào lịch sử nhân loại như biểu tượng sáng chói của ý chí độc lập tự do.'
    ],
    keyTerms: [
      { term: 'Tập đoàn cứ điểm', explanation: 'Hệ thống công sự, chiến hào và cứ điểm quân sự liên hoàn được phòng thủ kiên cố.' },
      { term: 'Đại tướng Võ Nguyên Giáp', explanation: 'Tổng tư lệnh chỉ huy chiến dịch Điện Biên Phủ toàn thắng.' },
      { term: 'Xe đạp thồ', explanation: 'Phương tiện vận tải thô sơ nhưng lập nên kỳ tích vận chuyển hàng nghìn tấn lương thực ra tiền tuyến.' }
    ],
    practicalApplication: 'Tinh thần Điện Biên Phủ nhắc nhở các thế hệ học sinh hôm nay không ngừng nỗ lực học tập, vượt qua thử thách để xây dựng đất nước ngày càng giàu đẹp.',
    audioText: '56 ngày đêm khoét núi, ngủ hầm, mưa dầm, cơm vắt, máu trộn bùn non. Chiến thắng Điện Biên Phủ mãi mãi là khúc tráng ca bất diệt của non sông Việt Nam.',
    drills: [
      {
        id: 'his-5-q1',
        question: 'Chiến thắng lịch sử Điện Biên Phủ toàn thắng vào ngày tháng năm nào?',
        options: ['30 tháng 4 năm 1975', '7 tháng 5 năm 1954', '2 tháng 9 năm 1945', '19 tháng 8 năm 1945'],
        correctAnswer: '7 tháng 5 năm 1954',
        hint: 'Lá cờ Quyết chiến Quyết thắng tung bay trên nóc hầm tướng Đờ Cát vào chiều ngày...',
        explanation: 'Chiều ngày 7/5/1954, quân đội ta toàn thắng tại Điện Biên Phủ sau 56 ngày đêm chiến đấu anh dũng.'
      },
      {
        id: 'his-5-q2',
        question: 'Ai là Tổng tư lệnh trực tiếp chỉ huy Chiến dịch lịch sử Điện Biên Phủ?',
        options: ['Đại tướng Võ Nguyên Giáp', 'Đại tướng Văn Tiến Dũng', 'Anh hùng Phan Đình Giót', 'Anh hùng Bế Văn Đàn'],
        correctAnswer: 'Đại tướng Võ Nguyên Giáp',
        hint: 'Vị tướng huyền thoại của Quân đội nhân dân Việt Nam, người đưa ra quyết định chuyển phương châm đánh từ "đánh nhanh thắng nhanh" sang "đánh chắc tiến chắc".',
        explanation: 'Đại tướng Võ Nguyên Giáp là Chỉ huy trưởng kiêm Bí thư Đảng ủy mặt trận Điện Biên Phủ.'
      }
    ]
  },

  // ==================== TỰ NHIÊN VÀ XÃ HỘI (NATURE & SOCIETY) ====================
  {
    id: 'nat-3-1',
    subjectId: 'nature-society',
    grade: 3,
    chapter: 'Chủ đề: Cơ thể người và Sức khỏe',
    lessonNumber: 1,
    title: 'Cơ quan tiêu hóa và chế độ dinh dưỡng lành mạnh',
    subtitle: 'Đường đi của thức ăn và thói quen ăn uống khoa học cho học sinh',
    summary: 'Cơ quan tiêu hóa gồm có: miệng, thực quản, dạ dày, ruột non, ruột già và hậu môn. Ngoài ra còn có tuyến nước bọt, gan, túi mật và tụy hỗ trợ tiết dịch tiêu hóa. Để cơ quan tiêu hóa khỏe mạnh, chúng ta cần ăn chín uống sôi, nhai kỹ và ăn uống đúng bữa.',
    contentParagraphs: [
      '1. Các bộ phận của đường tiêu hóa: Thức ăn được đưa vào miệng, răng nghiền nhỏ, tuyến nước bọt làm ẩm. Tiếp đó thức ăn qua thực quản xuống dạ dày để nhào trộn và tiêu hóa một phần. Xuống đến ruột non, chất dinh dưỡng được hấp thụ vào máu nuôi cơ thể. Chất cặn bã chuyển xuống ruột già và thải ra ngoài qua hậu môn.',
      '2. Chế độ dinh dưỡng 4 nhóm chất: Để phát triển khỏe mạnh, bữa ăn hàng ngày cần đủ 4 nhóm chất: chất bột đường (cơm, khoai), chất đạm (thịt, cá, trứng, đậu), chất béo (dầu ăn, mỡ), vi-ta-min và khoáng chất (rau củ, trái cây tươi).',
      '3. Thói quen bảo vệ đường tiêu hóa: Không nên vừa ăn vừa xem điện thoại hoặc chạy nhảy; cần ăn chậm nhai kỹ; uống đủ 1,5 - 2 lít nước sạch mỗi ngày; hạn chế đồ chiên rán nhiều dầu mỡ và đồ ngọt có ga.'
    ],
    keyTerms: [
      { term: 'Dạ dày', explanation: 'Túi cơ co bóp nhào trộn và tiêu hóa thức ăn bằng dịch vị.' },
      { term: 'Ruột non', explanation: 'Nơi diễn ra quá trình hấp thụ phần lớn chất dinh dưỡng nuôi cơ thể.' },
      { term: 'Nhai kỹ no lâu', explanation: 'Lời khuyên dân gian đúng khoa học, giúp giảm gánh nặng cho dạ dày.' }
    ],
    practicalApplication: 'Tập thói quen rửa tay bằng xà phòng trước khi ăn và sau khi đi vệ sinh để bảo vệ đường tiêu hóa khỏi vi khuẩn gây bệnh.',
    audioText: 'Chào các bạn nhỏ lớp 3! Cơ thể chúng ta giống như một cỗ máy kỳ diệu. Hãy cùng tìm hiểu xem đồ ăn sau khi vào miệng sẽ đi qua những cơ quan nào nhé!',
    drills: [
      {
        id: 'nat-q1',
        question: 'Cơ quan nào trong hệ tiêu hóa chịu trách nhiệm chính trong việc hấp thụ chất dinh dưỡng vào máu?',
        options: ['Dạ dày', 'Ruột non', 'Thực quản', 'Ruột già'],
        correctAnswer: 'Ruột non',
        hint: 'Đoạn ruột dài gấp nhiều lần chiều cao của em, có hàng triệu lông nhung hấp thụ dinh dưỡng.',
        explanation: 'Ruột non là nơi diễn ra quá trình tiêu hóa hoàn toàn thức ăn và hấp thụ phần lớn chất dinh dưỡng cần thiết vào máu nuôi cơ thể.'
      },
      {
        id: 'nat-q2',
        question: 'Thói quen ăn uống nào dưới đây là khoa học và giúp bảo vệ dạ dày?',
        options: [
          'Vừa ăn cơm vừa chạy nhảy chơi đùa',
          'Bỏ bữa sáng và uống nhiều nước ngọt có ga',
          'Ăn đúng giờ, ăn chậm nhai kỹ và ăn chín uống sôi',
          'Ăn thật nhiều đồ ăn vặt cay nóng trước bữa ăn'
        ],
        correctAnswer: 'Ăn đúng giờ, ăn chậm nhai kỹ và ăn chín uống sôi',
        hint: 'Thói quen lành mạnh bảo vệ sức khỏe hệ tiêu hóa.',
        explanation: 'Ăn chậm, nhai kỹ giúp tuyến nước bọt tiết dịch tiêu hóa đều đặn và dạ dày không bị quá tải.'
      }
    ]
  },

  // ==================== ĐẠO ĐỨC & KỸ NĂNG (ETHICS & LIFE SKILLS) ====================
  {
    id: 'eth-3-1',
    subjectId: 'ethics',
    grade: 3,
    chapter: 'Chủ đề: Yêu thương và Tôn trọng',
    lessonNumber: 1,
    title: 'Tôn trọng sự khác biệt của bạn bè trong lớp',
    subtitle: 'Xây dựng lớp học hạnh phúc, đoàn kết và thân ái',
    summary: 'Mỗi bạn trong lớp đều có ngoại hình, giọng nói, sở thích, tính cách và hoàn cảnh gia đình khác nhau. Tôn trọng sự khác biệt là biết lắng nghe, không chê bai, không trêu chọc và luôn sẵn lòng giúp đỡ nhau cùng tiến bộ.',
    contentParagraphs: [
      '1. Ai cũng là một bông hoa độc đáo: Có bạn hát hay, có bạn vẽ đẹp, có bạn giỏi toán, có bạn đá bóng giỏi. Có bạn nói giọng miền Bắc, có bạn nói giọng miền Trung ấm áp, có bạn nói giọng miền Nam dịu ngọt. Sự khác biệt ấy làm cho lớp học chúng ta phong phú và rực rỡ như một vườn hoa.',
      '2. Những việc nên làm: Lắng nghe ý kiến của bạn khi thảo luận nhóm; khen ngợi ưu điểm của bạn; chào đón bạn mới chuyển trường; chia sẻ đồ dùng học tập khi bạn gặp khó khăn.',
      '3. Những việc không nên làm: Đặt biệt danh xấu xí cho bạn; cô lập bạn hoặc rủ người khác không chơi cùng bạn; chê bai màu da, trang phục hay hoàn cảnh gia đình của bạn.'
    ],
    keyTerms: [
      { term: 'Tôn trọng', explanation: 'Thái độ quý trọng, cư xử hòa nhã, đúng mực và không xúc phạm người khác.' },
      { term: 'Đồng cảm', explanation: 'Khả năng đặt mình vào vị trí của bạn để thấu hiểu cảm xúc của bạn.' },
      { term: 'Lớp học hạnh phúc', explanation: 'Nơi mỗi học sinh đều cảm thấy an toàn, được yêu thương và được tôn trọng.' }
    ],
    practicalApplication: 'Mỗi sáng bước vào lớp, hãy nở một nụ cười thật tươi và nói lời chào thân thiện với các bạn xung quanh.',
    audioText: 'Lớp học của chúng mình là một gia đình ấm áp. Hãy luôn nhớ rằng: sự khác biệt của bạn chính là nét độc đáo đáng quý.',
    drills: [
      {
        id: 'eth-q1',
        question: 'Khi thấy một bạn trong lớp nói giọng địa phương khác với đa số các bạn, em nên làm gì?',
        options: [
          'Nhại lại giọng của bạn để trêu chọc làm cả lớp cười',
          'Lắng nghe chăm chú, thân thiện trò chuyện và tôn trọng giọng nói của bạn',
          'Tránh xa và khuyên các bạn khác không nên chơi cùng',
          'Chỉ trích bạn trước mặt cả lớp'
        ],
        correctAnswer: 'Lắng nghe chăm chú, thân thiện trò chuyện và tôn trọng giọng nói của bạn',
        hint: 'Tôn trọng giọng nói vùng miền là biểu hiện của người học sinh văn minh.',
        explanation: 'Mỗi vùng miền trên đất nước ta đều có âm sắc giọng nói riêng đáng tự hào. Tôn trọng bạn là lắng nghe và đón nhận một cách ấm áp.'
      },
      {
        id: 'eth-q2',
        question: 'Hành động nào dưới đây thể hiện tinh thần xây dựng Lớp học Hạnh phúc?',
        options: [
          'Chia bè phái và nói xấu bạn sau lưng',
          'Chủ động bắt chuyện và rủ bạn mới cùng tham gia trò chơi giờ ra chơi',
          'Giấu bài tập không cho bạn cùng nhóm tham khảo',
          'Chê bai khi bạn phát biểu câu trả lời chưa chính xác'
        ],
        correctAnswer: 'Chủ động bắt chuyện và rủ bạn mới cùng tham gia trò chơi giờ ra chơi',
        hint: 'Một cử chỉ chào đón ấm áp sẽ giúp bạn mới hòa nhập nhanh chóng.',
        explanation: 'Sự chia sẻ, mở lòng và chủ động kết bạn giúp xây dựng tình bạn gắn bó và môi trường học tập tràn ngập niềm vui.'
      }
    ]
  },

  // ==================== CÔNG NGHỆ & STEM (TECHNOLOGY) ====================
  {
    id: 'tech-3-1',
    subjectId: 'technology',
    grade: 3,
    chapter: 'Chủ đề: Công nghệ và Đời sống',
    lessonNumber: 1,
    title: 'Sử dụng đèn học và đồ dùng điện gia đình an toàn',
    subtitle: 'Quy tắc an toàn điện và bảo vệ đôi mắt khi ngồi học',
    summary: 'Đèn học là đồ dùng thiết yếu giúp cung cấp đủ ánh sáng khi học bài. Khi sử dụng đèn học và các thiết bị điện, học sinh cần đặt ở vị trí vững chắc, không dùng tay ướt cắm phích điện và luôn tắt công tắc khi rời khỏi bàn học.',
    contentParagraphs: [
      '1. Tác dụng của đèn bàn học: Cung cấp ánh sáng trực tiếp, chống cận thị và mỏi mắt khi đọc sách, viết bài vào buổi tối.',
      '2. Vị trí đặt đèn đúng chuẩn: Đặt đèn phía bên tay không thuận (đặt bên trái nếu viết tay phải) để tay không che khuất bóng đèn. Điều chỉnh cần đèn chúc xuống dưới, tránh ánh sáng chiếu thẳng vào mắt gây lóa.',
      '3. Quy tắc an toàn điện vàng: Tuyệt đối không cắm hoặc rút phích điện khi tay ướt; không kéo dây điện để giật phích cắm ra khỏi ổ; khi thấy dây điện bị hở hoặc có mùi khét, phải lập tức báo người lớn.'
    ],
    keyTerms: [
      { term: 'Đèn LED học đường', explanation: 'Loại đèn tiết kiệm điện, ánh sáng liên tục không nhấp nháy, chống cận thị hiệu quả.' },
      { term: 'Phích cắm điện', explanation: 'Bộ phận dẫn điện cắm vào ổ cắm, cần cầm chắc phần vỏ nhựa cách điện.' },
      { term: 'Dẫn điện & Cách điện', explanation: 'Nước và kim loại dẫn điện; nhựa và cao su là chất cách điện an toàn.' }
    ],
    practicalApplication: 'Trước khi đi ngủ hoặc ra khỏi phòng, hãy nhớ kiểm tra và tắt công tắc đèn bàn học để tiết kiệm điện và phòng chống cháy nổ.',
    audioText: 'Điện mang lại ánh sáng và tiện nghi nhưng cũng tiềm ẩn nguy hiểm nếu không cẩn thận. Hãy ghi nhớ quy tắc an toàn điện nhé các em!',
    drills: [
      {
        id: 'tech-q1',
        question: 'Tại sao tuyệt đối không được dùng tay ướt để cắm hoặc rút phích cắm điện?',
        options: [
          'Vì nước làm phích cắm bị ướt và mau hỏng',
          'Vì nước dẫn điện rất tốt, dễ gây giật điện nguy hiểm đến tính mạng',
          'Vì tay ướt sẽ làm trơn trượt khó cầm',
          'Vì làm bẩn ổ cắm điện'
        ],
        correctAnswer: 'Vì nước dẫn điện rất tốt, dễ gây giật điện nguy hiểm đến tính mạng',
        hint: 'Nước thường chứa khoáng chất dẫn điện cực mạnh.',
        explanation: 'Nước là chất dẫn điện rất tốt, nếu tay ướt chạm vào phích cắm có rò rỉ điện, dòng điện sẽ truyền qua nước vào cơ thể gây giật điện cực kỳ nguy hiểm.'
      },
      {
        id: 'tech-q2',
        question: 'Khi ngồi học bài, em nên điều chỉnh ánh sáng đèn bàn như thế nào là đúng khoa học?',
        options: [
          'Chiếu đèn thẳng trực tiếp vào mắt để nhìn thật rõ',
          'Tắt hết đèn phòng, chỉ bật một chiếc đèn bàn học duy nhất',
          'Đặt đèn cao ngang tầm trán, ánh sáng chiếu nghiêng xuống trang sách từ phía bên trái (nếu thuận tay phải)',
          'Đặt đèn ngay trước mặt sát tầm mắt'
        ],
        correctAnswer: 'Đặt đèn cao ngang tầm trán, ánh sáng chiếu nghiêng xuống trang sách từ phía bên trái (nếu thuận tay phải)',
        hint: 'Tránh lóa mắt và không để bóng của tay che chữ.',
        explanation: 'Ánh sáng chiếu nghiêng từ phía đối diện tay cầm bút giúp trang sách sáng đều, không bị sấp bóng và không gây lóa mắt học sinh.'
      }
    ]
  }
];
