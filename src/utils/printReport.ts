import { Section, CustodyItem, PharmacySettings } from '../types';
import { formatDateArabic } from './fileHelpers';

export function printComprehensiveReport(
  sections: Section[],
  items: CustodyItem[],
  settings: PharmacySettings,
  specificSection?: Section
) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('يرجى السماح بالنوافذ المنبثقة لطباعة التقرير');
    return;
  }

  const sectionsToPrint = specificSection ? [specificSection] : sections;
  const title = specificSection
    ? `كشف جرد ومراقبة عهدة - ${specificSection.name}`
    : `التقرير الشامل لمراقبة عهد الصيدلة`;

  const html = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Cairo', sans-serif;
          margin: 0;
          padding: 24px;
          color: #0f172a;
          background: #ffffff;
          font-size: 13px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #0f766e;
          padding-bottom: 16px;
          margin-bottom: 20px;
        }
        .pharmacy-title {
          font-size: 20px;
          font-weight: 800;
          color: #0f766e;
          margin: 0 0 4px;
        }
        .report-title {
          font-size: 16px;
          font-weight: 700;
          margin: 0;
          color: #1e293b;
        }
        .meta-info {
          font-size: 11px;
          color: #475569;
          text-align: left;
        }
        .section-block {
          margin-bottom: 24px;
          page-break-inside: avoid;
        }
        .section-header {
          background-color: #f1f5f9;
          padding: 8px 12px;
          border-radius: 6px;
          font-weight: 700;
          font-size: 14px;
          color: #0f766e;
          margin-bottom: 8px;
          border-right: 4px solid #0d9488;
          display: flex;
          justify-content: space-between;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 12px;
        }
        th, td {
          border: 1px solid #cbd5e1;
          padding: 8px 10px;
          text-align: right;
        }
        th {
          background-color: #f8fafc;
          font-weight: 700;
          font-size: 12px;
          color: #334155;
        }
        .badge {
          display: inline-block;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: bold;
        }
        .signatures {
          margin-top: 40px;
          display: flex;
          justify-content: space-between;
          padding: 0 20px;
          page-break-inside: avoid;
        }
        .sig-box {
          text-align: center;
          font-weight: 600;
        }
        .sig-line {
          margin-top: 50px;
          border-top: 1px solid #94a3b8;
          width: 180px;
        }
        @media print {
          button { display: none !important; }
        }
      </style>
    </head>
    <body>
      
      <div class="header">
        <div>
          <h1 class="pharmacy-title">${settings.pharmacyName}</h1>
          <p style="margin: 0; font-size: 12px; color: #475569;">${settings.branchName} ${settings.licenseNumber ? `• ترخيص رقم: ${settings.licenseNumber}` : ''}</p>
          <h2 class="report-title" style="margin-top: 6px;">${title}</h2>
        </div>
        <div class="meta-info">
          <div><strong>تاريخ الإصدار:</strong> ${new Date().toLocaleDateString('ar-EG')}</div>
          <div><strong>وقت التقرير:</strong> ${new Date().toLocaleTimeString('ar-EG')}</div>
          <div><strong>إجمالي الأقسام:</strong> ${sectionsToPrint.length}</div>
        </div>
      </div>

      ${sectionsToPrint.map(sec => {
        const secItems = items.filter(i => i.sectionId === sec.id);
        return `
          <div class="section-block">
            <div class="section-header">
              <span>قسم: ${sec.name}</span>
              <span style="font-size: 12px; color: #64748b;">
                ${sec.responsiblePerson ? `المسؤول: ${sec.responsiblePerson}` : ''} 
                ${sec.location ? `(${sec.location})` : ''} 
                • عدد العهد: ${secItems.length}
              </span>
            </div>

            ${secItems.length > 0 ? `
              <table>
                <thead>
                  <tr>
                    <th style="width: 12%;">كود السند</th>
                    <th style="width: 28%;">اسم المستند / العهدة</th>
                    <th style="width: 12%;">النوع</th>
                    <th style="width: 16%;">المسؤول</th>
                    <th style="width: 14%;">الحالة</th>
                    <th style="width: 18%;">ملاحظات</th>
                  </tr>
                </thead>
                <tbody>
                  ${secItems.map(item => `
                    <tr>
                      <td style="font-family: monospace;">${item.custodyNumber || '-'}</td>
                      <td><strong>${item.title}</strong></td>
                      <td>${item.type === 'pdf' ? 'ملف PDF' : item.type === 'image' ? 'صورة توثيق' : item.type === 'video' ? 'فيديو' : 'رابط إلكتروني'}</td>
                      <td>${item.addedBy || '-'}</td>
                      <td>${item.status === 'active' ? 'ساري ونشط' : item.status === 'inspected' ? 'تم الفحص' : item.status === 'review_needed' ? 'يحتاج مراجعة' : 'مؤرشف'}</td>
                      <td style="color: #475569; font-size: 11px;">${item.description || item.url || '-'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            ` : `
              <p style="padding: 10px; color: #64748b; font-style: italic; margin: 0;">لا توجد مستندات مسجلة في هذا القسم حالياً.</p>
            `}
          </div>
        `;
      }).join('')}

      <div class="signatures">
        <div class="sig-box">
          <div>أمين العهدة والمستودع</div>
          <div class="sig-line"></div>
        </div>
        <div class="sig-box">
          <div>الصيدلي الأول المشرف</div>
          <div class="sig-line"></div>
        </div>
        <div class="sig-box">
          <div>مدير إدارة التفتيش الصيدلي</div>
          <div class="sig-line"></div>
        </div>
      </div>

      <div style="text-align: center; margin-top: 32px;">
        <button onclick="window.print()" style="padding: 10px 24px; background: #0d9488; color: white; border: none; border-radius: 6px; font-family: Cairo; font-weight: bold; cursor: pointer;">
          طباعة التقرير
        </button>
      </div>

      <script>
        window.onload = function() {
          setTimeout(() => { window.print(); }, 400);
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
