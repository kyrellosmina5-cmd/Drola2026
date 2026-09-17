import React from 'react';
import { X, QrCode, ExternalLink, Smartphone } from 'lucide-react';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

export const QrModal: React.FC<QrModalProps> = ({
  isOpen,
  onClose,
  url,
  title,
}) => {
  if (!isOpen || !url) return null;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-sm p-5 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              مسح الرمز بالهاتف الذكي
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-3">
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate px-2">
            {title}
          </p>

          <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm inline-block mx-auto">
            <img src={qrImageUrl} alt="QR Code" className="w-48 h-48 mx-auto" />
          </div>

          <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-[11px] text-teal-800 dark:text-teal-300 flex items-center justify-center gap-1.5 font-medium">
            <Smartphone className="w-3.5 h-3.5" />
            <span>وجه كاميرا هاتف Android أو iPhone نحو الشاشة للفتح الفوري</span>
          </div>

          <div className="text-[11px] text-slate-500 font-mono direction-ltr break-all bg-slate-50 dark:bg-slate-800 p-2 rounded-xl">
            {url}
          </div>
        </div>

        <div className="pt-2 flex gap-2">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-1.5"
          >
            <span>فتح الرابط الآن</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
