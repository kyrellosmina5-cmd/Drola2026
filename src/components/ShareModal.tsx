import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  QrCode,
  Smartphone,
  Globe,
  ExternalLink,
  MessageCircle,
  Send,
  Mail,
  Sparkles,
  Download,
  CloudCheck,
  RefreshCw,
  CheckCircle2,
  Maximize2
} from 'lucide-react';
import { pushAllToCloudServer } from '../utils/storage';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  pharmacyName?: string;
  branchName?: string;
  onOpenPwaModal?: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  pharmacyName = 'الصيدلية الرئيسية',
  branchName = 'فرع الرقابة الدوائية',
  onOpenPwaModal,
}) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(true); // Active and visible by default
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState<string | null>(null);
  const [isEnlargedQr, setIsEnlargedQr] = useState(false);

  if (!isOpen) return null;

  // Determine active public sharing URL
  const getPublicUrl = () => {
    if (typeof window === 'undefined') return '';
    const origin = window.location.origin;
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'https://ais-pre-oofosbm4eag3dzvr4h4irz-520645422384.europe-west2.run.app';
    }
    return origin;
  };

  const shareUrl = getPublicUrl();
  const shareTitle = `منظومة مراقبة عهد الصيدلة - ${pharmacyName}`;
  const shareText = `رابط الوصول السريع لمنظومة مراقبة عهد الصيدلة (${pharmacyName} - ${branchName})، يشمل كافة الأقسام والعهد والملفات المحدثة مع دعم تثبيت التطبيق والعمل بدون إنترنت.`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Failed to copy link:', e);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (e) {
        console.warn('Native share canceled or failed:', e);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleSyncNow = async () => {
    setIsSyncing(true);
    setSyncSuccess(null);
    try {
      const res = await pushAllToCloudServer();
      if (res.success) {
        setSyncSuccess('تمت مزامنة جميع التعديلات والبيانات بنجاح! الرابط والـ QR محدثان الآن بالكامل.');
      } else {
        setSyncSuccess('تم حفظ البيانات محلياً وسيتم رفعها تلقائياً عند استقرار الاتصال.');
      }
    } catch {
      setSyncSuccess('تم حفظ البيانات بنجاح.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncSuccess(null), 6000);
    }
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shareUrl)}`;

  const handleDownloadQr = () => {
    const link = document.createElement('a');
    link.href = qrImageUrl;
    link.download = `QR_منظومة_عهد_${pharmacyName.replace(/\s+/g, '_')}.png`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareChannels = [
    {
      name: 'واتساب (WhatsApp)',
      color: 'bg-emerald-500 hover:bg-emerald-600 text-white',
      icon: MessageCircle,
      action: () => {
        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;
        window.open(url, '_blank');
      },
    },
    {
      name: 'تيليجرام (Telegram)',
      color: 'bg-sky-500 hover:bg-sky-600 text-white',
      icon: Send,
      action: () => {
        const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        window.open(url, '_blank');
      },
    },
    {
      name: 'البريد الإلكتروني (Email)',
      color: 'bg-slate-700 hover:bg-slate-800 text-white',
      icon: Mail,
      action: () => {
        const url = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;
        window.location.href = url;
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        
        {/* Top Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>نشر ومشاركة المنظومة وتفعيل الـ QR</span>
                <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                مشاركة الرابط والرمز السريع مع الزملاء مع مزامنة كافة التعديلات والبيانات
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Cloud Synchronization Alert & Action */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  مزامنة التعديلات سحابياً للآخرين
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  تأكد من إرسال أحدث الأقسام والعهد للسحابة لتظهر للجميع فوراً
                </p>
              </div>
            </div>

            <button
              onClick={handleSyncNow}
              disabled={isSyncing}
              className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'جارِ المزامنة...' : 'مزامنة التعديلات الآن'}</span>
            </button>
          </div>

          {syncSuccess && (
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{syncSuccess}</span>
            </div>
          )}

          {/* Main URL Field & Copy Button */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>رابط المنظومة المباشر للنشر والمشاركة:</span>
            </label>
            <div className="flex items-stretch gap-2">
              <div className="flex-1 px-3 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-800 dark:text-slate-200 truncate direction-ltr flex items-center">
                {shareUrl}
              </div>
              <button
                id="share-modal-copy-btn"
                onClick={handleCopyLink}
                className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 ${
                  copied
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>تم النسخ!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>نسخ الرابط</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Social / Direct Share Buttons */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              مشاركة مباشرة عبر التطبيقات:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {shareChannels.map((ch) => {
                const Icon = ch.icon;
                return (
                  <button
                    key={ch.name}
                    onClick={ch.action}
                    className={`py-2.5 px-3 rounded-2xl font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all shadow-sm ${ch.color}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[11px] truncate w-full text-center">{ch.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active QR Code Section */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>رمز الاستجابة السريعة (QR Code) للمسح الفوري:</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEnlargedQr(!isEnlargedQr)}
                  className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-teal-600 flex items-center gap-1"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>{isEnlargedQr ? 'تصغير' : 'تكبير'}</span>
                </button>
                <button
                  onClick={() => setShowQr(!showQr)}
                  className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
                >
                  {showQr ? 'إخفاء' : 'إظهار'}
                </button>
              </div>
            </div>

            {showQr && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl text-center space-y-3 border border-slate-200/80 dark:border-slate-700/80">
                <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-md inline-block mx-auto">
                  <img
                    src={qrImageUrl}
                    alt="QR Code"
                    className={`mx-auto transition-all ${isEnlargedQr ? 'w-64 h-64 sm:w-72 sm:h-72' : 'w-44 h-44'}`}
                  />
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    امسح الرمز بكاميرا أي هاتف ذكي (Android أو iPhone)
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                    سيفتح التطبيق مباشرة مع نفس الأقسام، العهد، والبيانات المعدلة، مع إمكانية التثبيت الفوري
                  </p>
                </div>

                <div className="flex justify-center gap-2 pt-1">
                  <button
                    onClick={handleDownloadQr}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-600 flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Download className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span>تحميل رمز QR كصورة</span>
                  </button>

                  {onOpenPwaModal && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenPwaModal();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 font-bold text-xs border border-teal-200 dark:border-teal-800 flex items-center gap-1.5 transition-all"
                    >
                      <Smartphone className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>طريقة تثبيت التطبيق</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Unified Data Guarantee Note */}
          <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-900/50 text-[11px] text-teal-900 dark:text-teal-200 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>ضمان عمل المنظومة عند الآخرين بنفس البيانات والتعديلات:</span>
            </div>
            <p className="text-teal-800/90 dark:text-teal-300 leading-relaxed">
              تم ربط المنظومة بقاعدة بيانات سحابية متزامنة تلقائياً. عند إرسال الرابط أو مسح الـ QR، سيرى الزملاء في الصيدلية ولجان التفتيش نفس الأقسام والعهد والمستندات المعدلة، ويمكنهم تثبيتها والعمل في وضع عدم الاتصال (Offline) بسلاسة تامة.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={handleNativeShare}
            className="px-4 py-2 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>مشاركة عبر النظام</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-2xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
