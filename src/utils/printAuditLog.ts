import { AuditLog, PharmacySettings } from '../types';
import { formatDateArabic } from './fileHelpers';

export function printAuditLogsReport(
  logs: AuditLog[],
  settings: PharmacySettings,
  filterCategory?: string
) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('يرجى السماح بالنوافذ المنبثقة لطباعة تقرير سجل العمليات');
    return;
  }

  const categoryTitle =
    filterCategory && filterCategory !== 'all'
      ? ` - تصنيف: ${
          filterCategory === 'section'
            ? 'إدارة الأقسام'
            : filterCategory === 'item'
            ? 'المستندات والملفات'
            : filterCategory === 'security'
            ? 'الأمان والصلاحيات'
            : 'النسخ الاحتياطي'
        }`
      : '';

  const reportTitle = `سجل الرقابة الإدارية وتتبع العمليات${categoryTitle}`;

  const html = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>${reportTitle}</title>
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
          font-size: 12px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #0f766e;
          padding-bottom: 14px;
          margin-bottom: 18px;
        }
        .pharmacy-title {
          font-size: 19px;
          font-weight: 800;
          color: #0f766e;
          margin: 0 0 4px;
        }
        .report-title {
          font-size: 15px;
          font-weight: 700;
          margin: 0;
          color: #1e293b;
        }
        .meta-info {
          font-size: 11px;
          color: #475569;
          text-align: left;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 14px;
          margin-bottom: 24px;
        }
        th, td {
          border: 1px solid #cbd5e1;
          padding: 7px 10px;
          text-align: right;
          vertical-align: top;
        }
        th {
          background-color: #f1f5f9;
          font-weight: 700;
          font-size: 11px;
          color: #334155;
        }
        .badge {
          display: inline-block;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: bold;
        }
        .badge-create { background: #dcfce7; color: #15803d; }
        .badge-update { background: #e0f2fe; color: #0369a1; }
        .badge-delete { background: #ffe4e6; color: #be123c; }
        .badge-security { background: #f3e8ff; color: #7e22ce; }
        .badge-backup { background: #fef3c7; color: #b45309; }
        .signatures {
          margin-top: 36px;
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
          margin-top: 45px;
          border-top: 1px solid #94a3b8;
          width: 170px;
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
          <p style="margin: 0; font-size: 12px; color: #475569;">
            ${settings.branchName} ${settings.licenseNumber ? `• ترخيص رقم: ${settings.licenseNumber}` : ''}
          </p>
          <h2 class="report-title" style="margin-top: 6px;">${reportTitle}</h2>
        </div>
        <div class="meta-info">
          <div><strong>تاريخ الطباعة:</strong> ${new Date().toLocaleDateString('ar-EG')}</div>
          <div><strong>الوقت:</strong> ${new Date().toLocaleTimeString('ar-EG')}</div>
          <div><strong>عدد العمليات الموثقة:</strong> ${logs.length} عملية</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 5%;">#</th>
            <th style="width: 15%;">التاريخ والوقت</th>
            <th style="width: 12%;">نوع الإجراء</th>
            <th style="width: 12%;">المنفذ</th>
            <th style="width: 20%;">عنوان الإجراء والهدف</th>
            <th style="width: 36%;">التفاصيل والملاحظات الرقابية</th>
          </tr>
        </thead>
        <tbody>
          ${logs.map((log, idx) => {
            const isCreate = log.action.includes('create');
            const isDelete = log.action.includes('delete');
            const isUpdate = log.action.includes('update');
            const isSecurity = log.action.includes('admin') || log.action.includes('settings');
            const badgeClass = isCreate
              ? 'badge-create'
              : isDelete
              ? 'badge-delete'
              : isUpdate
              ? 'badge-update'
              : isSecurity
              ? 'badge-security'
              : 'badge-backup';

            const actionLabel =
              log.action === 'create_section'
                ? 'إضافة قسم'
                : log.action === 'update_section'
                ? 'تعديل قسم'
                : log.action === 'delete_section'
                ? 'حذف قسم'
                : log.action === 'create_item'
                ? 'إضافة مستند'
                : log.action === 'update_item'
                ? 'تعديل مستند'
                : log.action === 'delete_item'
                ? 'حذف مستند'
                : log.action === 'backup_export'
                ? 'تصدير نسخة'
                : log.action === 'backup_import'
                ? 'استيراد نسخة'
                : log.action === 'settings_update'
                ? 'تعديل إعدادات'
                : log.action === 'admin_access'
                ? 'دخول إدمن'
                : 'إجراء نظام';

            return `
              <tr>
                <td style="text-align: center; color: #64748b;">${idx + 1}</td>
                <td style="font-size: 11px; white-space: nowrap;">${formatDateArabic(log.timestamp)}</td>
                <td><span class="badge ${badgeClass}">${actionLabel}</span></td>
                <td><strong>${log.performedBy}</strong></td>
                <td>
                  <strong>${log.title}</strong>
                  ${log.sectionName ? `<div style="font-size: 10px; color: #0d9488;">قسم: ${log.sectionName}</div>` : ''}
                </td>
                <td style="color: #334155;">${log.details}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>

      <div class="signatures">
        <div class="sig-box">
          <div>مسؤول إدارة النظام والرقابة</div>
          <div class="sig-line"></div>
        </div>
        <div class="sig-box">
          <div>الصيدلي الأول المشرف</div>
          <div class="sig-line"></div>
        </div>
        <div class="sig-box">
          <div>مدير إدارة التفتيش والرقابة الدوائية</div>
          <div class="sig-line"></div>
        </div>
      </div>

      <div style="text-align: center; margin-top: 28px;">
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
