import React, { useState } from 'react';
import {
  FileText,
  Image as ImageIcon,
  Video,
  Link2,
  Download,
  Printer,
  ExternalLink,
  Edit,
  Trash2,
  QrCode,
  Eye,
  CheckCircle,
  Clock,
  Archive,
  AlertTriangle,
  Copy,
  Check,
  Share2
} from 'lucide-react';
import { CustodyItem, CustodyStatus } from '../types';
import { formatBytes, formatDateArabic, downloadFile, printFileContent } from '../utils/fileHelpers';
import { copyToClipboard, formatCustodyItemShareText } from '../utils/clipboardHelpers';

interface CustodyCardProps {
  item: CustodyItem;
  sectionName?: string;
  isAdmin: boolean;
  onPreview: (item: CustodyItem) => void;
  onEdit: (item: CustodyItem) => void;
  onDelete: (itemId: string) => void;
  onShowQr: (url: string, title: string) => void;
}

export const CustodyCard: React.FC<CustodyCardProps> = ({
  item,
  sectionName,
  isAdmin,
  onPreview,
  onEdit,
  onDelete,
  onShowQr,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedDetails, setCopiedDetails] = useState(false);

  const handleCopyCode = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.custodyNumber) {
      const success = await copyToClipboard(item.custodyNumber);
      if (success) {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2200);
      }
    }
  };

  const handleCopyCustodyDetails = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = formatCustodyItemShareText(item, sectionName);
    
    // Check if mobile native share is available
    if (typeof navigator !== 'undefined' && 'share' in navigator && window.innerWidth < 768) {
      try {
        await navigator.share({
          title: item.title,
          text: text,
        });
        return;
      } catch {
        // Fallback to clipboard copy if user dismissed or share failed
      }
    }

    const success = await copyToClipboard(text);
    if (success) {
      setCopiedDetails(true);
      setTimeout(() => setCopiedDetails(false), 2500);
    }
  };

  const handleCopyLink = () => {
    if (item.url) {
      navigator.clipboard.writeText(item.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (item.type === 'link' && item.url) {
      // For links, download as an internet shortcut or text file
      const linkContent = `[InternetShortcut]\nURL=${item.url}\nTitle=${item.title}\n`;
      const blob = new Blob([linkContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      downloadFile(url, `${item.title.replace(/\s+/g, '_')}_link.url`);
      URL.revokeObjectURL(url);
    } else if (item.fileData) {
      downloadFile(item.fileData, item.fileName || `${item.title}.${item.type === 'pdf' ? 'pdf' : item.type === 'video' ? 'mp4' : 'png'}`);
    } else if (item.url) {
      window.open(item.url, '_blank');
    }
  };

  const handlePrint = () => {
    printFileContent({
      title: item.title,
      type: item.type,
      fileData: item.fileData,
      url: item.url,
      custodyNumber: item.custodyNumber,
      addedBy: item.addedBy,
      createdAt: item.createdAt,
      description: item.description,
      sectionName,
    });
  };

  const renderTypeIcon = () => {
    switch (item.type) {
      case 'pdf':
        return (
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
        );
      case 'image':
        return (
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <ImageIcon className="w-5 h-5" />
          </div>
        );
      case 'video':
        return (
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Video className="w-5 h-5" />
          </div>
        );
      case 'link':
        return (
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Link2 className="w-5 h-5" />
          </div>
        );
    }
  };

  const renderStatusBadge = (status: CustodyStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle className="w-3 h-3" />
            ساري ونشط
          </span>
        );
      case 'inspected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
            <Check className="w-3 h-3" />
            تم الفحص والتصديق
          </span>
        );
      case 'review_needed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Clock className="w-3 h-3" />
            يحتاج مراجعة
          </span>
        );
      case 'archived':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            <Archive className="w-3 h-3" />
            مؤرشف
          </span>
        );
    }
  };

  return (
    <div
      id={`custody-item-${item.id}`}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
    >
      <div>
        {/* Top bar: Type icon + title + admin actions */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {renderTypeIcon()}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                {renderStatusBadge(item.status)}
                {item.custodyNumber && (
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    title="اضغط لنسخ كود العهدة بضغطة زر إلى الحافظة"
                    className="inline-flex items-center gap-1 font-mono text-xs px-2 py-0.5 rounded-md bg-slate-100 hover:bg-teal-50 dark:bg-slate-800 dark:hover:bg-teal-950/60 text-slate-700 hover:text-teal-700 dark:text-slate-300 dark:hover:text-teal-300 border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700 font-bold transition-all active:scale-95 cursor-pointer"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400">تم نسخ الكود!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-400 hover:text-teal-600" />
                        <span>#{item.custodyNumber}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-snug">
                {item.title}
              </h4>
            </div>
          </div>

          {/* Edit/Delete Actions + Quick Copy */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              id={`share-item-${item.id}`}
              onClick={handleCopyCustodyDetails}
              title="نسخ تفاصيل العهدة لمشاركتها عبر الواتساب أو التطبيقات الخارجية"
              className={`p-1.5 rounded-lg transition-colors ${
                copiedDetails
                  ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60'
                  : 'text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/40'
              }`}
            >
              {copiedDetails ? (
                <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>
            <button
              id={`edit-item-${item.id}`}
              onClick={() => onEdit(item)}
              title="تعديل بيانات العهدة"
              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              id={`delete-item-${item.id}`}
              onClick={() => onDelete(item.id)}
              title="حذف هذا المستند نهائياً"
              className="p-1.5 text-rose-600 hover:text-rose-700 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900/60 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Thumbnail Preview for Images */}
        {item.type === 'image' && item.fileData && (
          <div
            onClick={() => onPreview(item)}
            className="mt-3 relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 cursor-pointer group h-36 flex items-center justify-center"
          >
            <img
              src={item.fileData}
              alt={item.title}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-bold text-xs">
              <Eye className="w-4 h-4" />
              <span>معاينة مكبرة</span>
            </div>
          </div>
        )}

        {/* Description / Notes */}
        {item.description && (
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
            {item.description}
          </p>
        )}

        {/* Link preview info */}
        {item.type === 'link' && item.url && (
          <div className="mt-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0 text-xs text-teal-600 dark:text-teal-400 direction-ltr text-left truncate font-mono">
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{item.url}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={handleCopyLink}
                title="نسخ الرابط"
                className="p-1 rounded text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => onShowQr(item.url!, item.title)}
                title="عرض رمز QR لمسحه بالهاتف"
                className="p-1 rounded text-slate-500 hover:text-teal-600"
              >
                <QrCode className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Meta details footer */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/70 flex items-center justify-between text-[11px] text-slate-400">
          <div>
            <span>المسؤول: </span>
            <span className="text-slate-600 dark:text-slate-300 font-semibold">{item.addedBy || 'إدارة الصيدلية'}</span>
          </div>
          <div>
            {item.fileSize ? formatBytes(item.fileSize) : formatDateArabic(item.createdAt)}
          </div>
        </div>
      </div>

      {/* Action Buttons: Preview, Download, Print */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        
        {/* Left: Preview Button */}
        <button
          id={`preview-item-${item.id}`}
          onClick={() => onPreview(item)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/60 font-bold text-xs transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>استعراض</span>
        </button>

        {/* Middle: Download Button */}
        <button
          id={`download-item-${item.id}`}
          onClick={handleDownload}
          title="تحميل الملف إلى جهازك"
          className="inline-flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">تحميل</span>
        </button>

        {/* Share & Copy Details */}
        <button
          id={`copy-details-item-${item.id}`}
          onClick={handleCopyCustodyDetails}
          title="نسخ تفاصيل العهدة كاملة للمراسلة الخارجية"
          className={`inline-flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-xl font-bold text-xs transition-colors ${
            copiedDetails
              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          {copiedDetails ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
              <span className="text-[11px]">تم النسخ!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span className="hidden sm:inline">مشاركة</span>
            </>
          )}
        </button>

        {/* Right: Print Button */}
        <button
          id={`print-item-${item.id}`}
          onClick={handlePrint}
          title="طباعة محضر السند"
          className="inline-flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs transition-colors"
        >
          <Printer className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span className="hidden sm:inline">طباعة</span>
        </button>

        {/* Delete Button */}
        <button
          id={`delete-bottom-item-${item.id}`}
          onClick={() => onDelete(item.id)}
          title="حذف هذا المستند نهائياً من العهدة"
          className="inline-flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200/80 dark:border-rose-900/50 font-bold text-xs transition-colors active:scale-95"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">حذف</span>
        </button>

      </div>
    </div>
  );
};
