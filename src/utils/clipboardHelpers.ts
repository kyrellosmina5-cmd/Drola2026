import { CustodyItem, Section } from '../types';
import { formatDateArabic } from './fileHelpers';

/**
 * Universal clipboard copy with modern API and reliable fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    console.warn('navigator.clipboard failed, attempting fallback:', err);
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    return successful;
  } catch (err) {
    console.error('All clipboard copy methods failed:', err);
    return false;
  }
}

/**
 * Translate custody item status to Arabic
 */
export function getStatusArabic(status?: string): string {
  switch (status) {
    case 'active':
      return 'ساري ونشط';
    case 'inspected':
      return 'تم الفحص والتصديق';
    case 'review_needed':
      return 'يحتاج مراجعة وتدقيق';
    case 'archived':
      return 'مؤرشف';
    default:
      return 'نشط';
  }
}

/**
 * Translate file type to Arabic
 */
export function getTypeArabic(type?: string): string {
  switch (type) {
    case 'pdf':
      return 'وثيقة PDF';
    case 'image':
      return 'صورة / مستند مرئي';
    case 'video':
      return 'تسجيل فيديو';
    case 'link':
      return 'رابط إلكتروني خارجي';
    default:
      return 'مستند';
  }
}

/**
 * Formats a custody item's full details for sharing via WhatsApp, Telegram, etc.
 */
export function formatCustodyItemShareText(
  item: CustodyItem,
  sectionName?: string,
  pharmacyName?: string
): string {
  const parts: string[] = [];
  parts.push(`🏥 *بيانات العهدة الصيدلية*`);
  if (pharmacyName) {
    parts.push(`🏛️ *المرفق:* ${pharmacyName}`);
  }
  parts.push(`━━━━━━━━━━━━━━━━━━━━`);
  parts.push(`📦 *الاسم:* ${item.title}`);
  if (item.custodyNumber) {
    parts.push(`🔢 *كود العهدة:* #${item.custodyNumber}`);
  }
  if (sectionName) {
    parts.push(`📁 *القسم:* ${sectionName}`);
  }
  parts.push(`📑 *النوع:* ${getTypeArabic(item.type)}`);
  parts.push(`📊 *الحالة:* ${getStatusArabic(item.status)}`);
  if (item.addedBy) {
    parts.push(`👤 *المسؤول الصيدلي:* ${item.addedBy}`);
  }
  if (item.createdAt) {
    parts.push(`📅 *تاريخ التسجيل:* ${formatDateArabic(item.createdAt)}`);
  }
  if (item.description) {
    parts.push(`📝 *البيان / الملاحظات:* ${item.description}`);
  }
  if (item.url) {
    parts.push(`🔗 *الرابط:* ${item.url}`);
  }
  parts.push(`━━━━━━━━━━━━━━━━━━━━`);
  parts.push(`منظومة مراقبة عهد الصيدلة الإلكترونية`);

  return parts.join('\n');
}

/**
 * Formats section details and inventory summary for sharing
 */
export function formatSectionShareText(
  section: Section,
  items: CustodyItem[],
  pharmacyName?: string
): string {
  const pdfCount = items.filter(i => i.type === 'pdf').length;
  const imgCount = items.filter(i => i.type === 'image').length;
  const vidCount = items.filter(i => i.type === 'video').length;
  const linkCount = items.filter(i => i.type === 'link').length;

  const parts: string[] = [];
  parts.push(`🏥 *كشف قسم العهدة الصيدلية*`);
  if (pharmacyName) {
    parts.push(`🏛️ *المرفق:* ${pharmacyName}`);
  }
  parts.push(`━━━━━━━━━━━━━━━━━━━━`);
  parts.push(`📁 *اسم القسم:* ${section.name}`);
  if (section.responsiblePerson) {
    parts.push(`👤 *المسؤول الصيدلي:* ${section.responsiblePerson}`);
  }
  if (section.location) {
    parts.push(`📍 *الموقع والمكان:* ${section.location}`);
  }
  if (section.description) {
    parts.push(`📝 *الوصف والبيان:* ${section.description}`);
  }
  parts.push(`━━━━━━━━━━━━━━━━━━━━`);
  parts.push(`📊 *إجمالي العهد المسجلة:* ${items.length} مستند`);
  parts.push(`• 📄 ملفات PDF: ${pdfCount}`);
  parts.push(`• 🖼️ صور ومستندات: ${imgCount}`);
  parts.push(`• 🎥 تسجيلات فيديو: ${vidCount}`);
  parts.push(`• 🔗 روابط إلكترونية: ${linkCount}`);

  if (items.length > 0) {
    parts.push(`\n📋 *أبرز العهد بالقسم:*`);
    items.slice(0, 7).forEach((it, idx) => {
      const codeStr = it.custodyNumber ? ` [كود: #${it.custodyNumber}]` : '';
      parts.push(`${idx + 1}. ${it.title}${codeStr} (${getStatusArabic(it.status)})`);
    });
    if (items.length > 7) {
      parts.push(`... بالإضافة إلى ${items.length - 7} عهد أخرى.`);
    }
  }

  parts.push(`━━━━━━━━━━━━━━━━━━━━`);
  parts.push(`منظومة مراقبة عهد الصيدلة الإلكترونية`);

  return parts.join('\n');
}
