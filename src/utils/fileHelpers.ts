export function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes === 0) return '0 بايت';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatDateArabic(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateStr;
  }
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

export function downloadFile(dataUrlOrUrl: string, fileName: string) {
  const link = document.createElement('a');
  link.href = dataUrlOrUrl;
  link.download = fileName;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function printFileContent(item: {
  title: string;
  type: string;
  fileData?: string;
  url?: string;
  custodyNumber?: string;
  addedBy?: string;
  createdAt?: string;
  description?: string;
  sectionName?: string;
}) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('يرجى السماح بالنوافذ المنبثقة لطباعة المستند');
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>طباعة مستند العهدة - ${item.title}</title>
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
        }
        .header {
          border-bottom: 2px solid #0d9488;
          padding-bottom: 16px;
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .title {
          font-size: 22px;
          font-weight: 800;
          color: #0f766e;
          margin: 0;
        }
        .meta-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 24px;
        }
        .meta-table th, .meta-table td {
          border: 1px solid #cbd5e1;
          padding: 10px 14px;
          text-align: right;
          font-size: 14px;
        }
        .meta-table th {
          background-color: #f1f5f9;
          font-weight: 700;
          width: 28%;
        }
        .content-box {
          border: 1px dashed #94a3b8;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
          text-align: center;
        }
        .content-box img {
          max-width: 100%;
          max-height: 480px;
          object-fit: contain;
          border-radius: 6px;
        }
        .signatures {
          margin-top: 48px;
          display: flex;
          justify-content: space-between;
          padding: 0 32px;
        }
        .sig-block {
          text-align: center;
          font-size: 14px;
        }
        .sig-line {
          margin-top: 50px;
          border-top: 1px solid #64748b;
          width: 180px;
        }
        @media print {
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1 class="title">مراقبة عهد الصيدلة - إشعار مستند عهدة</h1>
          <p style="margin: 4px 0 0; font-size: 13px; color: #475569;">سجل توثيق العهد والمستندات الطبية والصيدلانية</p>
        </div>
        <div style="text-align: left; font-size: 12px; color: #64748b;">
          <div>تاريخ الطباعة: ${new Date().toLocaleDateString('ar-EG')}</div>
          <div>رقم الإسناد: ${item.custodyNumber || 'غير محدد'}</div>
        </div>
      </div>

      <table class="meta-table">
        <tr>
          <th>اسم المستند / العهدة</th>
          <td><strong>${item.title}</strong></td>
        </tr>
        <tr>
          <th>القسم التابع له</th>
          <td>${item.sectionName || 'عام'}</td>
        </tr>
        <tr>
          <th>نوع الملف</th>
          <td>${item.type === 'pdf' ? 'ملف PDF رسمي' : item.type === 'image' ? 'صورة توثيقية' : item.type === 'video' ? 'فيديو تدريبي/توثيقي' : 'رابط إلكتروني'}</td>
        </tr>
        ${item.custodyNumber ? `<tr><th>كود السند / العهدة</th><td><code>${item.custodyNumber}</code></td></tr>` : ''}
        ${item.addedBy ? `<tr><th>المسؤول / المدخل</th><td>${item.addedBy}</td></tr>` : ''}
        ${item.createdAt ? `<tr><th>تاريخ الإضافة</th><td>${formatDateArabic(item.createdAt)}</td></tr>` : ''}
        ${item.description ? `<tr><th>ملاحظات وتفاصيل العهدة</th><td>${item.description}</td></tr>` : ''}
        ${item.url ? `<tr><th>الرابط المرجعي</th><td style="direction: ltr; text-align: left;"><a href="${item.url}">${item.url}</a></td></tr>` : ''}
      </table>

      ${item.type === 'image' && item.fileData ? `
        <div class="content-box">
          <p style="font-weight: bold; margin-bottom: 12px;">معاينة الصورة المرفقة بالعهدة:</p>
          <img src="${item.fileData}" alt="${item.title}" />
        </div>
      ` : ''}

      ${item.type === 'pdf' && item.fileData ? `
        <div class="content-box" style="text-align: right;">
          <p><strong>ملاحظة ملف PDF:</strong> تم إرفاق ملف مستند رسمي (${item.title}).</p>
          <p style="font-size: 13px; color: #475569;">يرجى فتح ملف الـ PDF الأصلي لطباعة صفحاته كاملة باستخدام زر الطباعة داخل عارض الـ PDF.</p>
        </div>
      ` : ''}

      <div class="signatures">
        <div class="sig-block">
          <div>أمين العهدة المستلم</div>
          <div class="sig-line"></div>
        </div>
        <div class="sig-block">
          <div>الصيدلي الأول المسؤول</div>
          <div class="sig-line"></div>
        </div>
        <div class="sig-block">
          <div>مدير إدارة الصيدلية</div>
          <div class="sig-line"></div>
        </div>
      </div>

      <div style="text-align: center; margin-top: 32px;">
        <button onclick="window.print()" style="padding: 10px 24px; background: #0d9488; color: white; border: none; border-radius: 6px; font-family: Cairo; font-weight: bold; cursor: pointer;">
          طباعة الآن
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
