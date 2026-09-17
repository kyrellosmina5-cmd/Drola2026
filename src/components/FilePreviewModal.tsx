import React, { useState } from 'react';
import {
  X,
  Download,
  Printer,
  ExternalLink,
  RotateCw,
  ZoomIn,
  ZoomOut,
  FileText,
  Copy,
  Check,
  QrCode,
  Calendar,
  UserCheck,
  ShieldCheck,
  Clock,
  Sparkles,
  Trash2,
  Share2
} from 'lucide-react';
import { CustodyItem } from '../types';
import { formatBytes, formatDateArabic, downloadFile, printFileContent } from '../utils/fileHelpers';
import { copyToClipboard, formatCustodyItemShareText } from '../utils/clipboardHelpers';

interface FilePreviewModalProps {
  item: CustodyItem | null;
  sectionName?: string;
  onClose: () => void;
  onDelete?: (itemId: string) => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  item,
  sectionName,
  onClose,
  onDelete,
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedDetails, setCopiedDetails] = useState(false);

  if (!item) return null;

  const handleCopyCode = async () => {
    if (item.custodyNumber) {
      const success = await copyToClipboard(item.custodyNumber);
      if (success) {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      }
    }
  };

  const handleCopyDetails = async () => {
    const text = formatCustodyItemShareText(item, sectionName);
    if (typeof navigator !== 'undefined' && 'share' in navigator && window.innerWidth < 768) {
      try {
        await navigator.share({
          title: item.title,
          text: text,
        });
        return;
      } catch {
        // Fallback to copy
      }
    }

    const success = await copyToClipboard(text);
    if (success) {
      setCopiedDetails(true);
      setTimeout(() => setCopiedDetails(false), 2500);
    }
  };

  const handleDownload = () => {
    if (item.type === 'link' && item.url) {
      const linkContent = `[InternetShortcut]\nURL=${item.url}\nTitle=${item.title}\n`;
      const blob = new Blob([linkContent], { type: 'text/plain;charset=utf-8' });
      const u = URL.createObjectURL(blob);
      downloadFile(u, `${item.title.replace(/\s+/g, '_')}_link.url`);
      URL.revokeObjectURL(u);
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

  const handleCopyLink = () => {
    if (item.url) {
      navigator.clipboard.writeText(item.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // QR Code URL using free reliable QR API for mobile scanning
  const qrApiUrl = item.url
    ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(item.url)}`
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-4xl my-auto overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-black text-slate-900 dark:text-white truncate">
                {item.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 flex-wrap">
                <span>{sectionName || 'القسم العام'}</span>
                {item.custodyNumber && (
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    title="انقر لنسخ كود العهدة بضغطة زر"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-teal-50 dark:bg-slate-800 dark:hover:bg-teal-950 text-slate-700 hover:text-teal-700 dark:text-slate-300 font-mono font-bold transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500 stroke-[2.5]" />
                        <span className="text-emerald-600 dark:text-emerald-400 text-[11px]">تم نسخ الكود!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-400" />
                        <span>#{item.custodyNumber}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Share / Copy Details Button */}
            <button
              id="modal-share-details-btn"
              onClick={handleCopyDetails}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                copiedDetails
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              title="نسخ بيانات العهدة كاملة للمراسلة الخارجية"
            >
              {copiedDetails ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
                  <span>تم النسخ!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span className="hidden sm:inline">نسخ ومشاركة</span>
                </>
              )}
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs transition-colors"
              title="تحميل المستند"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">تحميل</span>
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/60 font-bold text-xs transition-colors"
              title="طباعة محضر السند"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">طباعة</span>
            </button>

            {/* Delete Document Button */}
            {onDelete && (
              <button
                id="modal-delete-item-btn"
                onClick={() => {
                  onDelete(item.id);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900/50 font-bold text-xs transition-colors"
                title="حذف هذا المستند نهائياً"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">حذف</span>
              </button>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-950 min-h-[300px]">
          
          {/* PDF Viewer */}
          {item.type === 'pdf' && (
            <div className="w-full h-[60vh] flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
              {item.fileData ? (
                <iframe
                  src={item.fileData}
                  title={item.title}
                  className="w-full h-full rounded-xl border-0"
                />
              ) : (
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base">
                    مستند PDF رسمي: {item.fileName || item.title}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    تم توثيق هذا الملف في عهدة الصيدلية. يمكنك تحميله أو طباعة كشف استلام رسمي خاص به.
                  </p>
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <button
                      onClick={handleDownload}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>تحميل نسخة PDF</span>
                    </button>
                    <button
                      onClick={handlePrint}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-300 transition-all"
                    >
                      <Printer className="w-4 h-4" />
                      <span>طباعة المحضر</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Image Viewer with Zoom & Rotate */}
          {item.type === 'image' && (
            <div className="relative w-full flex flex-col items-center">
              {/* Image Controls */}
              <div className="mb-3 flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm z-10">
                <button
                  onClick={() => setZoom(z => Math.min(z + 0.25, 3))}
                  className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-teal-600"
                  title="تكبير"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoom(z => Math.max(z - 0.25, 0.5))}
                  className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-teal-600"
                  title="تصغير"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setRotation(r => (r + 90) % 360)}
                  className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-teal-600"
                  title="تدوير"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono px-2 text-slate-400">
                  {Math.round(zoom * 100)}%
                </span>
              </div>

              {/* Image Container */}
              <div className="overflow-auto max-h-[60vh] max-w-full flex items-center justify-center p-2">
                <img
                  src={item.fileData}
                  alt={item.title}
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    transition: 'transform 0.2s ease-in-out',
                  }}
                  className="max-h-[50vh] max-w-full object-contain rounded-xl shadow-md"
                />
              </div>
            </div>
          )}

          {/* Video Viewer */}
          {item.type === 'video' && (
            <div className="w-full max-w-2xl bg-black rounded-2xl overflow-hidden shadow-xl flex items-center justify-center">
              {item.fileData ? (
                <video
                  src={item.fileData}
                  controls
                  autoPlay
                  className="w-full max-h-[55vh] rounded-2xl"
                >
                  متصفحك لا يدعم تشغيل هذا الفيديو.
                </video>
              ) : (
                <div className="p-8 text-center text-white space-y-3">
                  <p className="font-bold text-base">فيديو توثيقي مسجل</p>
                  <p className="text-xs text-slate-400">الملف: {item.fileName || item.title}</p>
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>تحميل الفيديو</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Link Viewer & Mobile QR Code */}
          {item.type === 'link' && (
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 text-center space-y-4 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <ExternalLink className="w-7 h-7" />
              </div>

              <div>
                <h4 className="font-black text-lg text-slate-900 dark:text-white mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 font-mono direction-ltr break-all bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  {item.url}
                </p>
              </div>

              {/* QR Code for Mobile Scanning */}
              {qrApiUrl && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col items-center gap-2">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>امسح بالهاتف لفتح الرابط مباشرة (Android / iOS):</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl shadow-sm">
                    <img src={qrApiUrl} alt="QR Code" className="w-40 h-40" />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'تم النسخ' : 'نسخ الرابط'}</span>
                </button>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  <span>فتح الرابط الآن</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

        </div>

        {/* Metadata Footer Details */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-400 block">المسؤول عن الإدخال:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{item.addedBy || 'إدارة الصيدلية'}</span>
          </div>
          <div>
            <span className="text-slate-400 block">تاريخ الإضافة:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{formatDateArabic(item.createdAt)}</span>
          </div>
          <div>
            <span className="text-slate-400 block">الحجم / النوع:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {item.fileSize ? formatBytes(item.fileSize) : item.type.toUpperCase()}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">حالة العهدة:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {item.status === 'active' ? 'ساري ونشط' : item.status === 'inspected' ? 'تم الفحص والتصديق' : 'قيد المتابعة'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
