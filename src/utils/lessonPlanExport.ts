/**
 * Export and Utility functions for CV 2345 Lesson Plans
 * Formatted exactly according to the standard layout:
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
 * 1. Mở đầu (Khởi động)
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
 * *Quy tắc*: HĐ của GV có câu hỏi thì HĐ của HS phải có câu trả lời cụ thể, không ghi chung chung!
 * 
 * IV. ĐIỀU CHỈNH SAU BÀI DẠY (nếu có)
 */

import { LessonPlanCV2345 } from '../types/lessonPlan';

function sanitizeFilename(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 50);
}

function formatTextToHtml(text: string): string {
  if (!text) return '';
  return text
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return '<br/>';
      if (trimmed.startsWith('* ') || trimmed.startsWith('+ ') || trimmed.startsWith('- ')) {
        const bulletContent = trimmed.substring(2);
        return `<p style="margin-left: 12pt; text-indent: -12pt; margin-bottom: 2pt;">• ${bulletContent}</p>`;
      }
      if (trimmed.startsWith('a) ') || trimmed.startsWith('b) ') || trimmed.startsWith('c) ') || trimmed.startsWith('d) ')) {
        return `<p style="margin-bottom: 2pt; font-weight: bold; color: #0f172a;">${trimmed}</p>`;
      }
      return `<p style="margin-bottom: 2pt;">${trimmed}</p>`;
    })
    .join('');
}

/**
 * Generate full Word-compatible HTML document (.doc) strictly matching user template
 */
export function generateWordHtml(plan: LessonPlanCV2345): string {
  const activitiesRows = plan.activities
    .map((act) => {
      return `
        <tr>
          <td colspan="2" style="background-color: #f2f2f2; font-weight: bold; border: 1.0pt solid #000000; padding: 6pt 8pt; font-size: 13pt;">
            ${act.name.toUpperCase()} (${act.time})
          </td>
        </tr>
        <tr>
          <th style="width: 50%; text-align: center; font-weight: bold; border: 1.0pt solid #000000; padding: 6pt 8pt; background-color: #f8fafc;">
            HOẠT ĐỘNG CỦA GIÁO VIÊN
          </th>
          <th style="width: 50%; text-align: center; font-weight: bold; border: 1.0pt solid #000000; padding: 6pt 8pt; background-color: #f8fafc;">
            HOẠT ĐỘNG CỦA HỌC SINH
          </th>
        </tr>
        <tr>
          <td style="width: 50%; border: 1.0pt solid #000000; padding: 6pt 8pt; vertical-align: top; text-align: justify;">
            ${formatTextToHtml(act.teacherActivities)}
          </td>
          <td style="width: 50%; border: 1.0pt solid #000000; padding: 6pt 8pt; vertical-align: top; text-align: justify;">
            ${formatTextToHtml(act.studentActivities)}
          </td>
        </tr>
      `;
    })
    .join('');

  return `
<html xmlns:o='urn:schemas-microsoft-com:office:office'
      xmlns:w='urn:schemas-microsoft-com:office:word'
      xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>Kế hoạch bài dạy - Tiết ${plan.periodNumber}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page Section1 {
      size: 210mm 297mm;
      margin: 20mm 20mm 20mm 20mm;
      mso-page-orientation: portrait;
      mso-header-margin: 36.0pt;
      mso-footer-margin: 36.0pt;
    }
    div.Section1 {
      page: Section1;
      font-family: 'Times New Roman', Times, serif;
      font-size: 13pt;
      line-height: 1.35;
      color: #000000;
    }
    p {
      margin: 0;
      padding: 0;
      margin-bottom: 4pt;
      text-align: justify;
      line-height: 1.35;
      font-family: 'Times New Roman', Times, serif;
      font-size: 13pt;
    }
    h1 {
      font-size: 14pt;
      font-weight: bold;
      text-align: center;
      margin-top: 6pt;
      margin-bottom: 4pt;
      text-transform: uppercase;
      font-family: 'Times New Roman', Times, serif;
    }
    h2 {
      font-size: 13pt;
      font-weight: bold;
      text-align: center;
      margin-top: 0pt;
      margin-bottom: 12pt;
      font-family: 'Times New Roman', Times, serif;
    }
    h3 {
      font-size: 13pt;
      font-weight: bold;
      margin-top: 10pt;
      margin-bottom: 4pt;
      text-transform: uppercase;
      font-family: 'Times New Roman', Times, serif;
    }
    h4 {
      font-size: 13pt;
      font-weight: bold;
      margin-top: 6pt;
      margin-bottom: 3pt;
      font-family: 'Times New Roman', Times, serif;
    }
    table.doc-table {
      border-collapse: collapse;
      width: 100%;
      margin-top: 6pt;
      margin-bottom: 12pt;
      font-family: 'Times New Roman', Times, serif;
      font-size: 13pt;
    }
    table.doc-table th, table.doc-table td {
      border: 1.0pt solid #000000;
      padding: 6pt 8pt;
      vertical-align: top;
    }
    table.header-table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 8pt;
      font-family: 'Times New Roman', Times, serif;
      font-size: 13pt;
    }
    table.header-table td {
      border: none;
      padding: 2pt 4pt;
      vertical-align: top;
    }
    table.signature-table {
      border-collapse: collapse;
      width: 100%;
      margin-top: 16pt;
      font-family: 'Times New Roman', Times, serif;
      font-size: 13pt;
    }
    table.signature-table td {
      border: none;
      padding: 4pt;
      vertical-align: top;
      text-align: center;
    }
    ul {
      margin-top: 2pt;
      margin-bottom: 4pt;
      padding-left: 20pt;
    }
    li {
      margin-bottom: 3pt;
      text-align: justify;
      line-height: 1.35;
    }
  </style>
</head>
<body>
<div class="Section1">

  <!-- Header Administrative Table -->
  <table class="header-table">
    <tr>
      <td style="width: 55%; text-align: left;">
        <b>${plan.schoolName}</b><br/>
        <b>Lớp: ${plan.className}</b>
      </td>
      <td style="width: 45%; text-align: right;">
        <b>${plan.teacherName}</b><br/>
        <i>${plan.teachingDate.startsWith('Thứ') ? plan.teachingDate : `Thứ ….., ${plan.teachingDate}`}</i>
      </td>
    </tr>
  </table>

  <!-- Main Lesson Plan Header -->
  <h1>KHUNG KẾ HOẠCH BÀI DẠY</h1>
  <p style="text-align: center; font-style: italic; margin-bottom: 2pt;">
    ${plan.teachingDate.startsWith('Thứ') ? plan.teachingDate : `Thứ ….., ${plan.teachingDate}`}
  </p>
  <p style="text-align: center; font-weight: bold; margin-bottom: 2pt;">
    Tên môn học/ Hoạt động giáo dục: ${plan.subject}
  </p>
  <h2>
    TÊN BÀI: ${plan.lessonTitle}<br/>
    <span style="font-size: 13pt; font-weight: normal;">
      ${plan.periodTitle} (${plan.totalPeriods} tiết - Dạy tiết ${plan.periodIndexInLesson}) • Thời lượng: ${plan.duration} • ${plan.sgkPage}
    </span>
  </h2>

  <!-- I. YÊU CẦU CẦN ĐẠT -->
  <h3>I. YÊU CẦU CẦN ĐẠT</h3>
  
  <h4>1. Năng lực đặc thù:</h4>
  <ul>
    ${plan.objectives.specializedCompetencies.map((c) => `<li>${c}</li>`).join('')}
  </ul>

  <h4>2. Năng lực chung:</h4>
  <ul>
    ${plan.objectives.generalCompetencies.map((c) => `<li>${c}</li>`).join('')}
  </ul>

  <h4>3. Phẩm chất:</h4>
  <ul>
    ${plan.objectives.qualities.map((c) => `<li>${c}</li>`).join('')}
  </ul>

  <!-- II. ĐỒ DÙNG DẠY HỌC -->
  <h3>II. ĐỒ DÙNG DẠY HỌC</h3>
  <p style="font-style: italic; color: #475569; font-size: 12pt; margin-bottom: 3pt;">
    (Chỉ ghi dụng cụ đặc thù phục vụ cho tiết dạy. Không ghi những ĐDDH hay dụng cụ sử dụng thường ngày như: thước, bảng, phấn, SGK, SGV, tài liệu, PPT...)
  </p>
  <p><b>1. Dụng cụ đặc thù của Giáo viên:</b></p>
  <ul>
    ${plan.equipment.teacher.map((eq) => `<li>${eq}</li>`).join('')}
  </ul>

  <p><b>2. Dụng cụ đặc thù của Học sinh:</b></p>
  <ul>
    ${plan.equipment.student.map((eq) => `<li>${eq}</li>`).join('')}
  </ul>

  <!-- III. CÁC HOẠT ĐỘNG DẠY HỌC CHỦ YẾU -->
  <h3>III. CÁC HOẠT ĐỘNG DẠY HỌC CHỦ YẾU</h3>
  <p style="font-style: italic; color: #475569; font-size: 12pt; margin-bottom: 4pt;">
    (Chia thành 2 cột: Cột Hoạt động của giáo viên và Cột Hoạt động của học sinh. Mỗi hoạt động làm rõ 4 thao tác a, b, c, d; câu hỏi của GV có câu trả lời của HS cụ thể)
  </p>
  
  <table class="doc-table">
    ${activitiesRows}
  </table>

  <!-- IV. ĐIỀU CHỈNH SAU BÀI DẠY -->
  <h3>IV. ĐIỀU CHỈNH SAU BÀI DẠY (nếu có)</h3>
  <p><b>1. Nội dung / Phương pháp cần bổ sung, điều chỉnh:</b></p>
  <p style="padding-left: 14pt;">${plan.postLessonNotes.adjustments || '................................................................................................................................'}</p>

  <p><b>2. Mức độ tiếp thu bài học của học sinh:</b></p>
  <p style="padding-left: 14pt;">${plan.postLessonNotes.studentProgress || '................................................................................................................................'}</p>

  <p><b>3. Biện pháp hỗ trợ học sinh gặp khó khăn:</b></p>
  <p style="padding-left: 14pt;">${plan.postLessonNotes.supportPlan || '................................................................................................................................'}</p>

  <!-- Signatures -->
  <table class="signature-table">
    <tr>
      <td style="width: 50%;">
        <b>TỔ TRƯỞNG CHUYÊN MÔN</b><br/>
        <i>(Ký và ghi rõ họ tên)</i>
        <br/><br/><br/><br/>
        ...................................................
      </td>
      <td style="width: 50%;">
        <i>Ngày ...... tháng ...... năm 20....</i><br/>
        <b>GIÁO VIÊN GIẢNG DẠY</b><br/>
        <i>(Ký và ghi rõ họ tên)</i>
        <br/><br/><br/><br/>
        ${plan.teacherName ? plan.teacherName.replace(/^Giáo viên:\s*/i, '') : '...................................................'}
      </td>
    </tr>
  </table>

</div>
</body>
</html>
  `.trim();
}

/**
 * Trigger download of Microsoft Word file (.doc)
 */
export function exportLessonPlanToWord(plan: LessonPlanCV2345): void {
  const htmlContent = generateWordHtml(plan);
  
  // Use UTF-8 Byte Order Mark (BOM) to ensure Vietnamese characters render perfectly in Word
  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword;charset=utf-8',
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  
  const safeTitle = sanitizeFilename(plan.periodTitle);
  anchor.download = `GiaoAn_CongNghe4_Tiet_${plan.periodNumber}_${safeTitle}.doc`;
  
  document.body.appendChild(anchor);
  anchor.click();
  
  setTimeout(() => {
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Format plan as clean, structured plain text strictly matching user template
 */
export function formatLessonPlanToPlainText(plan: LessonPlanCV2345): string {
  const lines: string[] = [
    `KHUNG KẾ HOẠCH BÀI DẠY`,
    `${plan.teachingDate.startsWith('Thứ') ? plan.teachingDate : `Thứ ….., ${plan.teachingDate}`}`,
    `Tên môn học/ Hoạt động giáo dục: ${plan.subject}`,
    `TÊN BÀI: ${plan.lessonTitle}`,
    `Tiết dạy: ${plan.periodTitle} (${plan.totalPeriods} tiết - Dạy tiết ${plan.periodIndexInLesson})`,
    `Thời lượng: ${plan.duration} | ${plan.sgkPage}`,
    `Trường: ${plan.schoolName} | Lớp: ${plan.className} | GV: ${plan.teacherName}`,
    ``,
    `I. YÊU CẦU CẦN ĐẠT`,
    `1. Năng lực đặc thù:`,
    ...plan.objectives.specializedCompetencies.map((c) => `  - ${c}`),
    `2. Năng lực chung:`,
    ...plan.objectives.generalCompetencies.map((c) => `  - ${c}`),
    `3. Phẩm chất:`,
    ...plan.objectives.qualities.map((c) => `  - ${c}`),
    ``,
    `II. ĐỒ DÙNG DẠY HỌC`,
    `- Chỉ ghi dụng cụ đặc thù phục vụ cho tiết dạy. Không ghi những ĐDDH hay dụng cụ sử dụng thường ngày như: thước, bảng, phấn, SGK, SGV, tài liệu, PPT...`,
    `1. Giáo viên:`,
    ...plan.equipment.teacher.map((e) => `  + ${e}`),
    `2. Học sinh:`,
    ...plan.equipment.student.map((e) => `  + ${e}`),
    ``,
    `III. CÁC HOẠT ĐỘNG DẠY HỌC CHỦ YẾU`,
    `(Chia thành 2 cột: Hoạt động của giáo viên và Hoạt động của học sinh; HĐ của GV có câu hỏi thì HĐ của HS có câu trả lời cụ thể)`,
  ];

  plan.activities.forEach((act, idx) => {
    lines.push(
      `------------------------------------------------------------------------`,
      `${act.name.toUpperCase()} (${act.time})`,
      ``,
      `[CỘT 1] HOẠT ĐỘNG CỦA GIÁO VIÊN:`,
      ...act.teacherActivities.split('\n').map((l) => `  ${l}`),
      ``,
      `[CỘT 2] HOẠT ĐỘNG CỦA HỌC SINH:`,
      ...act.studentActivities.split('\n').map((l) => `  ${l}`),
      ``
    );
  });

  lines.push(
    `------------------------------------------------------------------------`,
    `IV. ĐIỀU CHỈNH SAU BÀI DẠY (nếu có)`,
    `1. Nội dung / Phương pháp cần bổ sung, điều chỉnh:`,
    `   ${plan.postLessonNotes.adjustments}`,
    `2. Mức độ tiếp thu của học sinh:`,
    `   ${plan.postLessonNotes.studentProgress}`,
    `3. Biện pháp hỗ trợ học sinh gặp khó khăn:`,
    `   ${plan.postLessonNotes.supportPlan}`,
    ``,
    `TỔ TRƯỞNG CHUYÊN MÔN                       GIÁO VIÊN GIẢNG DẠY`,
    `(Ký và ghi rõ họ tên)                      (Ký và ghi rõ họ tên)`
  );

  return lines.join('\n');
}

/**
 * Print the lesson plan cleanly in A4 page layout
 */
export function printLessonPlan(plan: LessonPlanCV2345): void {
  const printWindow = window.open('', '_blank', 'width=900,height=800');
  if (!printWindow) {
    alert('Vui lòng cho phép popup để mở trang in ấn giáo án.');
    return;
  }

  const html = generateWordHtml(plan);
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
}
