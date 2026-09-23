/**
 * Generator helper strictly compliant with the User's Lesson Plan Template (CV 2345):
 * 
 * KHUNG KẾ HOẠCH BÀI DẠY
 * Thứ ….., ngày ..... tháng ..... năm ....
 * Tên môn học/ Hoạt động giáo dục: CÔNG NGHỆ 4
 * TÊN BÀI: ..............................................................
 * 
 * I. YÊU CẦU CẦN ĐẠT
 * 1. Năng lực đặc thù:
 * 2. Năng lực chung:
 * 3. Phẩm chất:
 * 
 * II. ĐỒ DÙNG DẠY HỌC
 * - Chỉ ghi dụng cụ đặc thù phục vụ cho tiết dạy.
 *   Không ghi những ĐDDH hay dụng cụ sử dụng thường ngày như: thước, bảng, phấn, SGK, SGV, tài liệu, PPT...
 * 
 * III. CÁC HOẠT ĐỘNG DẠY HỌC CHỦ YẾU
 * Chia thành 2 cột: cột hoạt động của giáo viên và cột hoạt động của học sinh.
 * 1. Mở đầu (Khởi động): Thiết kế hoạt động vui chơi, có lồng nội dung bài cũ vào, giúp HS nhớ lại kiến thức đã học.
 * 2. Hình thành kiến thức mới (Khám phá)
 * 3. Luyện tập, thực hành
 * 4. Vận dụng, trải nghiệm (nếu có)
 * Mỗi hoạt động làm rõ 4 thao tác:
 *   a) Chuyển giao nhiệm vụ học tập;
 *   b) Tổ chức cho học sinh thực hiện nhiệm vụ học tập;
 *   c) Tổ chức cho học sinh trình bày kết quả và thảo luận;
 *   d) Nhận xét, đánh giá thực hiện nhiệm vụ học tập.
 * 5. Hoạt động nối tiếp: Dặn dò. Nhận xét tiết học.
 * 
 * *Quy tắc sư phạm cốt lõi*:
 * HĐ của GV có câu hỏi thì HĐ của HS PHẢI có câu trả lời cụ thể.
 * Tuyệt đối không ghi chung chung "HS trả lời".
 * KHBD soạn chi tiết để khi giáo viên nghỉ, người khác cầm lên có thể dạy ngay được!
 * 
 * IV. ĐIỀU CHỈNH SAU BÀI DẠY (nếu có)
 */

import { getPeriodByNumber } from '../data/curriculum';
import {
  LessonPlanCV2345,
  LessonPlanActivityStep,
  TeacherProfile,
} from '../types/lessonPlan';

const DEFAULT_PROFILE: TeacherProfile = {
  schoolName: 'Trường Tiểu học ................................................',
  className: 'Lớp 4...',
  teacherName: 'Giáo viên: ................................................',
};

const STORAGE_KEY_PROFILE = 'congnghe4_cv2345_teacher_profile';

export function getStoredTeacherProfile(): TeacherProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        schoolName: parsed.schoolName || DEFAULT_PROFILE.schoolName,
        className: parsed.className || DEFAULT_PROFILE.className,
        teacherName: parsed.teacherName || DEFAULT_PROFILE.teacherName,
      };
    }
  } catch (err) {
    console.warn('Could not read teacher profile from localStorage', err);
  }
  return DEFAULT_PROFILE;
}

export function saveTeacherProfile(profile: TeacherProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.warn('Could not save teacher profile to localStorage', err);
  }
}

export function getFormattedDateHeader(): string {
  const daysOfWeek = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
  const now = new Date();
  const dayOfWeekName = daysOfWeek[now.getDay()];
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${dayOfWeekName}, ngày ${day} tháng ${month} năm ${year}`;
}

/**
 * Lấy dụng cụ ĐẶC THÙ phục vụ cho từng tiết dạy (KHÔNG ghi thước, bảng, phấn, SGK, SGV, PPT)
 */
function getSpecificEquipment(periodNumber: number, isMechanicsPart: boolean): { teacher: string[]; student: string[] } {
  // Phần 2: Thủ công kĩ thuật (Tiết 21 - 35)
  if (isMechanicsPart) {
    if (periodNumber >= 21 && periodNumber <= 23) {
      return {
        teacher: [
          'Hộp bộ lắp ghép mô hình kĩ thuật lớp 4 hoàn chỉnh (khay chi tiết, cờ-lê, tua-vít, khay đựng ốc vít).',
          'Mô hình mối ghép cố định và mối ghép chuyển động mẫu đã lắp sẵn.',
        ],
        student: [
          'Hộp bộ lắp ghép mô hình kĩ thuật lớp 4 (đầy đủ các tấm, thanh thẳng, thanh chữ U, bánh xe, đai ốc, vít, cờ-lê, tua-vít).',
          'Khay/nắp hộp để đựng ốc vít tránh rơi vãi.',
        ],
      };
    }
    if (periodNumber >= 24 && periodNumber <= 28) {
      return {
        teacher: [
          'Mô hình bập bênh hoàn chỉnh đã lắp ráp mẫu, hoạt động bập bênh êm ái.',
          'Các cụm chi tiết lắp sẵn: thanh đòn, giá đỡ bập bênh, ghế ngồi để hướng dẫn học sinh.',
        ],
        student: [
          'Hộp bộ lắp ghép kĩ thuật lớp 4 (chọn sẵn các thanh thẳng 11 lỗ, thanh chữ U, ốc vít dài/ngắn, cờ-lê, tua-vít).',
        ],
      };
    }
    if (periodNumber >= 29 && periodNumber <= 34) {
      return {
        teacher: [
          'Mô hình rô-bốt hoàn chỉnh đã lắp ráp mẫu (chân, thân, đầu, tay quay linh hoạt).',
          'Các cụm bộ phận rời của rô-bốt để thao tác thị phạm từng bước.',
        ],
        student: [
          'Hộp bộ lắp ghép kĩ thuật lớp 4 (tấm lớn, tấm nhỏ, thanh chữ U, thanh chữ L, bánh đai, trục quay, ốc vít, tua-vít, cờ-lê).',
        ],
      };
    }
    return {
      teacher: ['Các mô hình kĩ thuật mẫu (bập bênh, rô-bốt, xe nôi) để đánh giá sản phẩm học sinh.'],
      student: ['Bộ mô hình kĩ thuật đã hoàn thành để trưng bày và tham gia triển lãm sản phẩm.'],
    };
  }

  // Phần 1: Nông nghiệp & Cây cảnh (Tiết 1 - 20)
  if (periodNumber >= 1 && periodNumber <= 3) {
    return {
      teacher: [
        'Chậu cây hoa/cây cảnh thật để bàn (cây lưỡi hổ, chậu hoa hồng nhỏ hoặc chậu sen đá mini).',
        'Ảnh chụp cỡ lớn các khu vực cảnh quan: trường học, công viên, phòng khách.',
      ],
      student: [
        'Ảnh chụp hoặc tranh vẽ chậu hoa, cây cảnh tại nhà em (nếu có chuẩn bị trước).',
      ],
    };
  }

  if (periodNumber >= 4 && periodNumber <= 6) {
    return {
      teacher: [
        'Mẫu vật chậu hoa thật (hoa cúc, hoa hồng, hoa đồng tiền) và chậu cây cảnh thật (cây kim tiền, vạn niên thanh, xương rồng).',
        'Bộ thẻ tên các bộ phận của cây hoa và cây cảnh.',
      ],
      student: [
        'Một cành hoa tươi hoặc chậu cây nhỏ mang từ nhà (theo nhóm phân công).',
      ],
    };
  }

  if (periodNumber >= 7 && periodNumber <= 9) {
    return {
      teacher: [
        'Mẫu thật các loại chậu: chậu nhựa có lỗ thoát nước, chậu gốm sứ, chậu tự chế từ chai nhựa tái chế.',
        'Mẫu thật các loại giá thể: đất phù sa, xơ dừa, mùn cưa, trấu hun, sỏi nhẹ.',
        'Bộ dụng cụ trồng cây mini: xẻng nhỏ cầm tay, bình xịt nước mini, găng tay làm vườn.',
      ],
      student: [
        'Chai nhựa đã qua sử dụng đã cắt thành chậu (do nhóm tự làm).',
        'Găng tay vải hoặc găng tay cao su làm vườn nhỏ.',
      ],
    };
  }

  if (periodNumber >= 10 && periodNumber <= 15) {
    return {
      teacher: [
        'Chậu trồng cây có lỗ thoát nước và đĩa lót đáy.',
        'Giá thể trồng cây đã phối trộn sẵn (đất dinh dưỡng + xơ dừa/trấu hun).',
        'Hạt giống hoa/cây giống hoa con (cây dạ yến thảo hoặc hoa mười giờ).',
        'Bình tưới nước có vòi hoa sen mini, găng tay làm vườn, thìa xúc đất nhỏ.',
      ],
      student: [
        'Chậu trồng cây mini của nhóm, găng tay làm vườn, khăn lau tay.',
        'Cây giống hoặc hạt giống hoa đã ngâm ủ (theo nhóm).',
      ],
    };
  }

  // Tiết 16 - 20: Chăm sóc hoa cây cảnh
  return {
    teacher: [
      'Chậu hoa cây cảnh thật cần chăm sóc (có lá vàng, cỏ dại, đất khô).',
      'Bình xịt tưới nước mini, kéo cắt tỉa cành cây chuyên dụng, cào xới đất nhỏ cầm tay.',
    ],
    student: [
      'Bình tưới nước mini hoặc chai xịt nước tái chế của nhóm.',
      'Khăn mềm lau bụi trên lá cây cảnh, găng tay làm vườn.',
    ],
  };
}

/**
 * Tạo nội dung Khởi động có lồng kiến thức bài cũ (giúp HS nhớ lại kiến thức đã học)
 */
function buildWarmUpContent(
  periodNumber: number,
  title: string,
  lessonTitle: string,
  prevPeriodInfo?: { title: string; coreTakeaway: string }
): { teacher: string; student: string } {
  const prevTopic = prevPeriodInfo?.title || 'tiết học trước';
  const prevKnowledge = prevPeriodInfo?.coreTakeaway || 'những kiến thức cơ bản đã được tìm hiểu';

  let gameName = 'Trò chơi "Hộp quà bí mật"';
  let reviewQuestion = `Ở tiết học trước (${prevTopic}), em hãy nhắc lại: ${prevKnowledge}?`;
  let reviewAnswer = `Học sinh trả lời: Nêu đúng nội dung cốt lõi của ${prevTopic} (như đã học ở tiết trước).`;
  let leadInQuestion = `Quan sát xung quanh trường lớp và bức tranh khởi động, em thấy ${title} có ý nghĩa gì đối với cuộc sống?`;
  let leadInAnswer = `Học sinh trả lời: Cây hoa giúp làm đẹp, không khí trong lành, tạo cảm giác vui tươi, thư thái khi đến lớp.`;

  if (periodNumber === 1) {
    gameName = 'Trò chơi "Bắt bướm hái hoa"';
    reviewQuestion = 'Em hãy kể tên 3 loài hoa hoặc cây cảnh quen thuộc em thường thấy ở sân trường hoặc ở nhà?';
    reviewAnswer = 'Học sinh trả lời: "Thưa thầy/cô, đó là hoa phượng vĩ đỏ rực ở sân trường, hoa hồng thơm ngát ở ban công và chậu cây lưỡi hổ trong phòng khách ạ!"';
    leadInQuestion = 'Những loài hoa và cây cảnh đó mang lại cho em cảm giác như thế nào khi ngắm nhìn?';
    leadInAnswer = 'Học sinh trả lời: "Dạ thưa thầy/cô, em cảm thấy cảnh quan trường lớp rất đẹp, không khí mát mẻ, dễ chịu và vui tươi ạ!"';
  } else if (periodNumber === 2) {
    gameName = 'Trò chơi "Ô cửa bí mật" - Lồng ghép ôn bài cũ Tiết 1';
    reviewQuestion = 'Câu hỏi 1 (Ôn bài cũ Tiết 1): Tiết trước chúng ta đã học hoa, cây cảnh dùng để trang trí ở những khu vực nào?';
    reviewAnswer = 'Học sinh trả lời: "Thưa thầy/cô, hoa và cây cảnh được dùng để trang trí ở trường học, nhà ở, công viên, đường phố và văn phòng làm việc ạ!"';
    leadInQuestion = 'Câu hỏi 2 (Dẫn dắt bài mới): Ngoài việc làm đẹp cảnh quan, hoa và cây cảnh còn có tác dụng thần kì nào đối với bầu không khí chúng ta hít thở hàng ngày?';
    leadInAnswer = 'Học sinh trả lời: "Dạ thưa thầy/cô, cây xanh và hoa còn hút khí độc, bụi bẩn và làm sạch bầu không khí trong lành hơn ạ!"';
  } else if (periodNumber === 3) {
    gameName = 'Trò chơi "Ai nhanh - Ai đúng" - Lồng ghép ôn bài cũ Tiết 2';
    reviewQuestion = 'Câu hỏi 1 (Ôn bài cũ Tiết 2): Kể tên 3 loài cây cảnh có khả năng hấp thụ khí độc, làm sạch không khí mà em đã học?';
    reviewAnswer = 'Học sinh trả lời: "Thưa thầy/cô, đó là cây lưỡi hổ, cây nha đam, cây lan ý (hoặc cây vạn niên thanh, kim tiền) ạ!"';
    leadInQuestion = 'Câu hỏi 2 (Dẫn dắt bài mới): Khi hoa nở đẹp và cây xanh tốt, con người có thể đem bán hoặc thu hái hoa để làm gì?';
    leadInAnswer = 'Học sinh trả lời: "Dạ thưa thầy/cô, đem bán hoa tươi để có thu nhập, phát triển kinh tế cho gia đình và xã hội ạ!"';
  } else if (periodNumber === 21) {
    gameName = 'Trò chơi "Nhà kĩ sư tương lai"';
    reviewQuestion = 'Em hãy quan sát xung quanh và kể tên một số đồ dùng, đồ chơi được lắp ghép từ nhiều chi tiết khác nhau?';
    reviewAnswer = 'Học sinh trả lời: "Thưa thầy/cô, đó là chiếc quạt máy, xe đạp, rô-bốt đồ chơi, xích đu trong công viên ạ!"';
    leadInQuestion = 'Để tự tay lắp ghép được những mô hình kĩ thuật đó, chúng mình cần làm quen với bộ đồ dùng nào từ hôm nay?';
    leadInAnswer = 'Học sinh trả lời: "Dạ thưa thầy/cô, chúng mình cần làm quen và sử dụng thành thạo Bộ lắp ghép mô hình kĩ thuật lớp 4 ạ!"';
  } else if (periodNumber >= 22) {
    gameName = `Trò chơi "Giải cứu mô hình" - Ôn bài cũ Tiết ${periodNumber - 1}`;
    reviewQuestion = `Câu hỏi 1 (Ôn bài cũ Tiết ${periodNumber - 1}): Hãy gọi tên 2 dụng cụ chính dùng để tháo lắp ốc vít trong bộ mô hình kĩ thuật và cách cầm đúng?`;
    reviewAnswer = 'Học sinh trả lời: "Thưa thầy/cô, đó là cờ-lê (dùng để giữ đai ốc) và tua-vít (dùng để vặn xoay vít) ạ!"';
    leadInQuestion = `Câu hỏi 2 (Dẫn dắt bài mới): Hôm nay chúng mình sẽ cùng bước vào giai đoạn nào để hoàn thành sản phẩm "${title}"?`;
    leadInAnswer = `Học sinh trả lời: "Dạ thưa thầy/cô, hôm nay chúng em sẽ tiến hành tìm hiểu quy trình và thực hành lắp ghép hoàn thiện mô hình ạ!"`;
  }

  const teacher = `a) Chuyển giao nhiệm vụ học tập:
- Giáo viên ổn định nền nếp lớp học, tạo không khí hào hứng.
- Tổ chức ${gameName}.
- Nêu câu hỏi 1 (Lồng nội dung ôn bài cũ): "${reviewQuestion}"
- Nêu câu hỏi 2 (Kết nối vào bài học mới): "${leadInQuestion}"

b) Tổ chức cho học sinh thực hiện nhiệm vụ học tập:
- Cho học sinh quan sát màn hình/vật mẫu thật, suy nghĩ cá nhân trong 1 phút.
- Hướng dẫn học sinh giơ tay xung phong giành quyền trả lời.

c) Tổ chức cho học sinh trình bày kết quả và thảo luận:
- Mời 1 học sinh trả lời câu hỏi 1.
- Mời 1 học sinh khác nhận xét, bổ sung câu trả lời của bạn.
- Mời 1 học sinh trả lời câu hỏi 2 dẫn dắt vào bài mới.

d) Nhận xét, đánh giá thực hiện nhiệm vụ học tập:
- Giáo viên nhận xét, khen ngợi học sinh đã ghi nhớ rất tốt kiến thức bài cũ và có câu trả lời mở đầu thông minh.
- Dẫn dắt vào bài học mới: "${title}". Ghi bảng tên bài.`;

  const student = `a) Tiếp nhận nhiệm vụ học tập:
- Cả lớp chú ý lắng nghe luật chơi của ${gameName}.
- Đọc và tiếp nhận 2 câu hỏi từ giáo viên.

b) Thực hiện nhiệm vụ học tập:
- Suy nghĩ độc lập, nhớ lại kiến thức đã học ở tiết trước.
- Quan sát mẫu vật và hào hứng giơ tay xung phong trả lời.

c) Báo cáo kết quả và thảo luận:
- Trả lời cụ thể câu 1:
  "${reviewAnswer}"
- Học sinh khác nhận xét: "Em đồng ý với câu trả lời của bạn, bạn đã trả lời rất chính xác và đầy đủ ạ!"
- Trả lời cụ thể câu 2:
  "${leadInAnswer}"

d) Tiếp thu đánh giá và vào bài:
- Lắng nghe lời khen và nhận xét của thầy/cô giáo.
- Đồng thanh nhắc lại tên bài học mới: "${title}", sẵn sàng sách vở và dụng cụ học tập.`;

  return { teacher, student };
}

/**
 * Tạo Kế hoạch bài dạy chuẩn khung quy định của Giáo viên
 */
export function generateStrictCV2345LessonPlan(
  periodNumber: number,
  customProfile?: TeacherProfile
): LessonPlanCV2345 | null {
  const periodData = getPeriodByNumber(periodNumber);
  if (!periodData) return null;

  const { period, lesson, part } = periodData;
  const profile = customProfile || getStoredTeacherProfile();
  const isMechanicsPart = part.partNumber === 2;

  // Lấy thông tin tiết trước (nếu có) để phục vụ khởi động lồng bài cũ
  let prevPeriodInfo: { title: string; coreTakeaway: string } | undefined;
  if (periodNumber > 1) {
    const prevData = getPeriodByNumber(periodNumber - 1);
    if (prevData) {
      prevPeriodInfo = {
        title: prevData.period.title,
        coreTakeaway: prevData.period.objectives[0] || 'kiến thức cốt lõi của tiết trước',
      };
    }
  }

  // Đồ dùng dạy học ĐẶC THÙ (KHÔNG chứa thước, bảng, phấn, SGK, SGV, PPT)
  const equipment = getSpecificEquipment(periodNumber, isMechanicsPart);

  // 1. Objectives (Yêu cầu cần đạt)
  const obj1 = period.objectives[0] || 'Nhận biết và nêu được các kiến thức trọng tâm của bài học.';
  const obj2 = period.objectives[1] || 'Trình bày và thao tác đúng các quy trình kĩ thuật đã học.';
  const obj3 = period.objectives[2] || 'Vận dụng được kiến thức vào đời sống hàng ngày tại gia đình và nhà trường.';

  const specializedCompetencies = [
    `Năng lực nhận thức công nghệ: ${obj1}`,
    `Năng lực giao tiếp công nghệ: Trình bày, trao đổi rõ ràng bằng ngôn ngữ công nghệ về: ${obj2}`,
    `Năng lực sử dụng công nghệ & Thực hành: Thao tác đúng quy trình, sử dụng đúng dụng cụ: ${obj3}`,
  ];

  const generalCompetencies = [
    'Năng lực tự chủ và tự học: Tự giác chuẩn bị dụng cụ học tập đặc thù, chủ động quan sát mẫu vật và độc lập suy nghĩ hoàn thành nhiệm vụ.',
    'Năng lực giao tiếp và hợp tác: Tích cực trao đổi, chia sẻ ý kiến với bạn trong nhóm đôi và nhóm 4; biết phối hợp nhịp nhàng để tạo ra sản phẩm chung.',
    'Năng lực giải quyết vấn đề và sáng tạo: Biết xử lý các tình huống thực tiễn phát sinh, đề xuất giải pháp trang trí/lắp ghép đẹp mắt và chắc chắn.',
  ];

  const qualities = [
    'Chăm chỉ: Tích cực học tập, tỉ mỉ thao tác kĩ thuật, giữ gìn vệ sinh và kiên trì hoàn thành bài học.',
    isMechanicsPart
      ? 'Trách nhiệm: Cẩn thận bảo quản từng chi tiết ốc vít, tuân thủ an toàn lao động, sắp xếp đồ dùng đúng ngăn sau khi học.'
      : 'Trách nhiệm: Có ý thức bảo vệ cây xanh, chăm sóc hoa chậu quanh lớp học và gia đình; sử dụng tiết kiệm nước.',
    'Trung thực: Thật thà, khách quan trong việc tự đánh giá và nhận xét sản phẩm của bản thân và bạn học.',
  ];

  // 2. Xây dựng 5 Hoạt động chuẩn 4 thao tác a, b, c, d với câu hỏi GV có câu trả lời HS cụ thể
  // HOẠT ĐỘNG 1: Khởi động (3 – 5 phút)
  const warmUpContent = buildWarmUpContent(periodNumber, period.title, lesson.title, prevPeriodInfo);
  const act1: LessonPlanActivityStep = {
    id: 'act-1-khoi-dong',
    name: '1. Mở đầu (Khởi động)',
    time: '3 – 5 phút',
    teacherActivities: warmUpContent.teacher,
    studentActivities: warmUpContent.student,
  };

  // HOẠT ĐỘNG 2: Khám phá (Hình thành kiến thức mới) (12 – 15 phút)
  const explore1 = period.explore[0];
  const exploreTask = explore1?.task || 'Quan sát mẫu vật/hình ảnh và nêu đặc điểm kĩ thuật.';
  const q1 = explore1?.promptQuestions?.[0] || 'Em hãy quan sát và cho biết đặc điểm nổi bật nhất của đối tượng này là gì?';
  const q2 = explore1?.promptQuestions?.[1] || 'Đối tượng này có công dụng hoặc vai trò gì trong thực tế?';
  const a1 = explore1?.answer || 'Học sinh nêu đúng tên gọi, đặc điểm cấu tạo và màu sắc như quan sát được.';
  const coreRule = explore1?.keyTakeaway || obj1;

  const act2Teacher = `a) Chuyển giao nhiệm vụ học tập:
- Hướng dẫn học sinh quan sát mẫu vật thật (hoặc tranh ảnh phóng to) và thực hiện nhiệm vụ:
  "${exploreTask}"
- Đặt câu hỏi tìm tòi 1: "${q1}"
- Đặt câu hỏi tìm tòi 2: "${q2}"
- Yêu cầu học sinh làm việc theo nhóm đôi (2 bạn cùng bàn) trong 3 phút để thảo luận và thống nhất câu trả lời.

b) Tổ chức cho học sinh thực hiện nhiệm vụ học tập:
- Học sinh quan sát kĩ mẫu vật thật trên bàn giáo viên và hình ảnh minh họa.
- Giáo viên đi vòng quanh các bàn, quan sát, hướng dẫn các cặp còn lúng túng, gợi ý các chi tiết/đặc điểm quan trọng.

c) Tổ chức cho học sinh trình bày kết quả và thảo luận:
- Mời đại diện 2 cặp học sinh đứng dậy báo cáo câu trả lời trước lớp.
- Mời các cặp học sinh khác lắng nghe, nhận xét, bổ sung ý kiến còn thiếu.

d) Nhận xét, đánh giá thực hiện nhiệm vụ học tập:
- Giáo viên nhận xét tinh thần thảo luận nhóm đôi và độ chính xác của các câu trả lời.
- Chuẩn xác hóa kiến thức (chốt nội dung cốt lõi):
  "📌 Ghi nhớ: ${coreRule}"
- Yêu cầu 1 – 2 học sinh nhắc lại to, rõ ràng nội dung chốt kiến thức.`;

  const act2Student = `a) Tiếp nhận nhiệm vụ học tập:
- Chú ý quan sát mẫu vật thật và lắng nghe nhiệm vụ cùng 2 câu hỏi định hướng của giáo viên.

b) Thực hiện nhiệm vụ học tập:
- Quan sát kĩ các chi tiết, màu sắc, hình dạng của mẫu vật.
- Trao đổi sôi nổi với bạn cùng bàn, cùng ghi nhanh ý kiến ra nháp.

c) Báo cáo kết quả và thảo luận:
- Đại diện nhóm 1 trả lời câu hỏi 1:
  "Thưa thầy/cô, câu trả lời của nhóm em là: ${a1}"
- Đại diện nhóm 2 trả lời câu hỏi 2:
  "Thưa thầy/cô, công dụng/vai trò của đối tượng này là ${coreRule}"
- Các nhóm khác nhận xét: "Nhóm em nhất trí với ý kiến của nhóm bạn, nhóm em xin bổ sung thêm một chi tiết nhỏ là cần thao tác cẩn thận để đảm bảo an toàn ạ!"

d) Tiếp thu đánh giá và chốt kiến thức:
- Lắng nghe giáo viên chuẩn xác hóa kiến thức.
- 2 học sinh đứng dậy đọc to, rõ ràng nội dung chốt: "${coreRule}".
- Cả lớp ghi nhớ nội dung trọng tâm vào vở.`;

  const act2: LessonPlanActivityStep = {
    id: 'act-2-kham-pha',
    name: '2. Hình thành kiến thức mới (Khám phá)',
    time: '12 – 15 phút',
    teacherActivities: act2Teacher,
    studentActivities: act2Student,
  };

  // HOẠT ĐỘNG 3: Luyện tập, thực hành (10 – 12 phút)
  const practiceItem = period.practice?.[0];
  const practiceQuestion = practiceItem?.question || 'Em hãy thực hiện thao tác nhận biết, lựa chọn chi tiết và thực hành theo đúng quy trình kĩ thuật.';
  const practiceExplanation = practiceItem?.explanation || 'Thực hiện đúng trình tự các bước, thao tác dứt khoát, chính xác và an toàn.';

  const act3Teacher = `a) Chuyển giao nhiệm vụ học tập:
- Nêu rõ bài tập luyện tập / nhiệm vụ thực hành:
  "${practiceQuestion}"
- Giáo viên thao tác mẫu (hoặc chiếu hình ảnh hướng dẫn từng bước quy trình).
- Yêu cầu học sinh thực hành theo nhóm 4 (hoặc cá nhân) trong thời gian 6 phút.
- Nhắc nhở quy tắc an toàn và vệ sinh sau khi thao tác.

b) Tổ chức cho học sinh thực hiện nhiệm vụ học tập:
- Học sinh mở hộp đồ dùng đặc thù / chuẩn bị dụng cụ trên bàn.
- Giáo viên bao quát toàn lớp, trực tiếp đến từng nhóm cầm tay chỉ việc, uốn nắn các thao tác chưa chuẩn (cách cầm cờ-lê/tua-vít hoặc cách cầm xẻng xúc đất, cách ấn chặt gốc cây).

c) Tổ chức cho học sinh trình bày kết quả và thảo luận:
- Mời 2 nhóm mang sản phẩm/kết quả thực hành lên bàn trưng bày phía trước lớp.
- Đặt câu hỏi phỏng vấn: "Em hãy nêu các bước em vừa thực hiện và giải thích vì sao em làm như vậy?"
- Cho các nhóm khác quan sát, nhận xét chéo về độ chắc chắn, tính thẩm mĩ và mức độ an toàn của sản phẩm bạn làm.

d) Nhận xét, đánh giá thực hiện nhiệm vụ học tập:
- Giáo viên nhận xét chi tiết từng sản phẩm: chỉ ra những điểm làm tốt (mối ghép khít, cây trồng thẳng đứng, đất nén vừa phải) và những lỗi cần khắc phục.
- Đánh giá, tuyên dương nhóm thực hành nhanh, chính xác và giữ gìn vệ sinh tốt nhất.`;

  const act3Student = `a) Tiếp nhận nhiệm vụ học tập:
- Quan sát kĩ thao tác mẫu của giáo viên, ghi nhớ trình tự các bước thực hiện.
- Nhận dụng cụ đặc thù từ nhóm trưởng.

b) Thực hiện nhiệm vụ học tập:
- Từng thành viên trong nhóm phân công nhiệm vụ cụ thể (chọn chi tiết, giữ chi tiết, vặn siết ốc hoặc xúc đất, đặt cây).
- Tiến hành thực hành đúng quy trình:
  "${practiceExplanation}"
- Giữ trật tự, tập trung và cẩn thận, không để rơi ốc vít hoặc vương vãi đất ra sàn.

c) Báo cáo kết quả và thảo luận:
- Đại diện nhóm mang sản phẩm lên trưng bày và trả lời câu hỏi:
  "Thưa thầy/cô, nhóm em đã thực hiện đúng theo 3 bước: Bước 1 là chọn đúng dụng cụ; Bước 2 là lắp ghép/gieo trồng đúng vị trí; Bước 3 là kiểm tra độ chắc chắn. Sản phẩm của nhóm em đứng vững, các mối nối/chậu cây rất chắc chắn và đẹp mắt ạ!"
- Các nhóm khác đối chiếu sản phẩm của mình, nhận xét bạn: "Sản phẩm của nhóm bạn làm rất đẹp, ốc vít được siết vừa tay không bị lỏng lẻo ạ!"

d) Tiếp thu đánh giá:
- Lắng nghe thầy/cô nhận xét, rút kinh nghiệm những điểm thao tác còn chưa thật khéo léo.
- Thu dọn dụng cụ gọn gàng sau khi thực hành xong.`;

  const act3: LessonPlanActivityStep = {
    id: 'act-3-luyen-tap',
    name: '3. Luyện tập, thực hành',
    time: '10 – 12 phút',
    teacherActivities: act3Teacher,
    studentActivities: act3Student,
  };

  // HOẠT ĐỘNG 4: Vận dụng, trải nghiệm (nếu có) (3 – 4 phút)
  const applySituation = period.apply?.[0]?.situation || 'Áp dụng kiến thức bài học vào thực tế không gian sống tại gia đình.';
  const applyPrompt = period.apply?.[0]?.prompt || 'Em sẽ vận dụng việc này ở nhà như thế nào?';
  const applySample = period.apply?.[0]?.sampleResponse || 'Em sẽ cùng bố mẹ thực hiện công việc này tại nhà vào dịp cuối tuần.';

  const act4Teacher = `a) Chuyển giao nhiệm vụ học tập:
- Đặt ra tình huống thực tế đời sống:
  "${applySituation}"
- Nêu câu hỏi vận dụng:
  "${applyPrompt}"
- Cho học sinh liên hệ thực tế gia đình và suy nghĩ trong 1 phút.

b) Tổ chức cho học sinh thực hiện nhiệm vụ học tập:
- Học sinh suy nghĩ cá nhân, liên hệ với thói quen, nếp sống ở nhà của gia đình mình.
- Giáo viên quan sát, khích lệ các em mạnh dạn nêu ý tưởng sáng tạo.

c) Tổ chức cho học sinh trình bày kết quả và thảo luận:
- Mời 2 học sinh xung phong chia sẻ ý tưởng vận dụng của mình trước lớp.
- Mời cả lớp lắng nghe và nhận xét ý tưởng của bạn.

d) Nhận xét, đánh giá thực hiện nhiệm vụ học tập:
- Giáo viên nhận xét, khen ngợi những ý tưởng thiết thực, thể hiện tinh thần trách nhiệm và tình yêu lao động.
- Khích lệ cả lớp về nhà chủ động cùng người thân thực hiện.`;

  const act4Student = `a) Tiếp nhận nhiệm vụ học tập:
- Lắng nghe tình huống thực tế và câu hỏi vận dụng của giáo viên.

b) Thực hiện nhiệm vụ học tập:
- Nhớ lại các đồ dùng, góc học tập hoặc cây hoa cảnh ở nhà mình.
- Chuẩn bị câu trả lời cụ thể, tự tin.

c) Báo cáo kết quả và thảo luận:
- Học sinh 1 trả lời cụ thể:
  "Thưa thầy/cô, về nhà hôm nay em sẽ: ${applySample}"
- Học sinh 2 bổ sung:
  "Thưa thầy/cô, em cũng sẽ hướng dẫn em nhỏ cùng làm để góc học tập luôn sạch đẹp và bảo quản tốt đồ dùng ạ!"

d) Tiếp thu đánh giá:
- Lắng nghe lời khen và động viên của giáo viên, có ý thức thực hiện ngay khi về nhà.`;

  const act4: LessonPlanActivityStep = {
    id: 'act-4-van-dung',
    name: '4. Vận dụng, trải nghiệm (nếu có)',
    time: '3 – 4 phút',
    teacherActivities: act4Teacher,
    studentActivities: act4Student,
  };

  // HOẠT ĐỘNG 5: Hoạt động nối tiếp: Dặn dò. Nhận xét tiết học (2 – 3 phút)
  const act5Teacher = `a) Chuyển giao nhiệm vụ nối tiếp:
- Hướng dẫn học sinh chốt lại thông điệp ghi nhớ quan trọng nhất của bài học hôm nay.
- Nêu các việc cần làm ở nhà và chuẩn bị cho tiết sau:
  + Về nhà chia sẻ kiến thức bài học hôm nay với bố mẹ, người thân.
  + Chuẩn bị dụng cụ đặc thù cho tiết học tiếp theo (mang đúng dụng cụ đã dặn).

b) Tổ chức học sinh thực hiện:
- Yêu cầu cả lớp đọc đồng thanh phần ghi nhớ.
- Giáo viên tổng kết, nhận xét tinh thần, thái độ học tập và mức độ hoàn thành nhiệm vụ của cá nhân và các nhóm trong tiết học.

c) Tuyên dương và nhắc nhở:
- Tuyên dương các nhóm, cá nhân học tập sôi nổi, tích cực giơ tay phát biểu và hoàn thành sản phẩm đẹp.
- Nhắc nhở những bạn còn mất tập trung hoặc thao tác còn chậm cần cố gắng hơn.

d) Kết thúc tiết học:
- Cho học sinh kiểm tra lại bàn học, sắp xếp hộp dụng cụ ngăn nắp và cho vào ngăn bàn/tủ lớp.`;

  const act5Student = `a) Tiếp nhận nhiệm vụ nối tiếp:
- Lắng nghe giáo viên dặn dò các nhiệm vụ về nhà và yêu cầu chuẩn bị cho tiết học sau.
- Ghi nhanh lời dặn vào sổ tay hoặc vở ghi bài.

b) Thực hiện:
- Đọc to, đồng thanh nội dung ghi nhớ của bài học.
- Tiếp thu những lời nhận xét, góp ý của thầy/cô giáo để tiết sau học tốt hơn.

c) Kiểm tra vệ sinh và kết thúc:
- Kiểm tra lại bàn học, đảm bảo không để rơi ốc vít hay vương vãi rác ra lớp học.
- Xếp hộp đồ dùng kĩ thuật đúng ngăn quy định, để ngay ngắn trên bàn.
- Đứng dậy lễ phép chào thầy/cô khi hết giờ học.`;

  const act5: LessonPlanActivityStep = {
    id: 'act-5-noi-tiep',
    name: '5. Hoạt động nối tiếp: Dặn dò. Nhận xét tiết học',
    time: '2 – 3 phút',
    teacherActivities: act5Teacher,
    studentActivities: act5Student,
  };

  // 3. Post-Lesson Notes (Điều chỉnh sau bài dạy)
  const postLessonNotes = {
    adjustments: 'Tiết dạy diễn ra đúng tiến độ, thời lượng các hoạt động được đảm bảo; đồ dùng đặc thù chuẩn bị đầy đủ giúp học sinh tiếp thu bài trực quan và hào hứng.',
    studentProgress: 'Học sinh nắm vững kiến thức cốt lõi, trả lời câu hỏi tự tin, thực hành thao tác an toàn và đúng quy trình.',
    supportPlan: 'Tiếp tục theo sát và hỗ trợ thêm đối với 1 – 2 học sinh thao tác còn chậm trong các tiết thực hành sau.',
  };

  // 4. Signatures (Chữ ký duyệt)
  const signatures = {
    departmentHead: 'TỔ TRƯỞNG CHUYÊN MÔN\n(Ký và ghi rõ họ tên)',
    teacher: profile.teacherName || 'GIÁO VIÊN GIẢNG DẠY\n(Ký và ghi rõ họ tên)',
  };

  const periodIndexInLesson = lesson.periods.findIndex((p) => p.periodNumber === periodNumber) + 1 || 1;

  return {
    periodNumber,
    lessonId: lesson.id,
    schoolName: profile.schoolName,
    className: profile.className,
    teacherName: profile.teacherName,
    teachingDate: getFormattedDateHeader(),
    subject: 'CÔNG NGHỆ 4 (Bộ sách Kết nối tri thức với cuộc sống)',
    lessonTitle: `BÀI ${lesson.number}: ${lesson.title.toUpperCase()}`,
    periodTitle: period.title,
    totalPeriods: lesson.totalPeriods,
    periodIndexInLesson,
    duration: '1 tiết (35 phút)',
    sgkPage: lesson.sgkPage ? `Trang ${lesson.sgkPage}` : 'SGK Công nghệ 4',
    objectives: {
      specializedCompetencies,
      generalCompetencies,
      qualities,
    },
    equipment,
    activities: [act1, act2, act3, act4, act5],
    postLessonNotes,
    signatures,
    isCustomized: false,
    lastSavedAt: Date.now(),
  };
}
