import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles } from 'lucide-react';

interface MobileInstallBannerProps {
  isInstalled: boolean;
  isInstallable: boolean;
  isIOS: boolean;
  onInstall: () => Promise<boolean>;
  onOpenModal: () => void;
}

export const MobileInstallBanner: React.FC<MobileInstallBannerProps> = ({
  isInstalled,
  isInstallable,
  isIOS,
  onInstall,
  onOpenModal,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const dismissed = sessionStorage.getItem('pwa_mobile_banner_dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  if (!isMounted || isInstalled || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('pwa_mobile_banner_dismissed', 'true');
  };

  const handleActionClick = async () => {
    if (isInstallable) {
      const success = await onInstall();
      if (!success) {
        onOpenModal();
      }
    } else {
      onOpenModal();
    }
  };

  return (
    <aside
      aria-label="تثبيت التطبيق على الجوال"
      className="fixed bottom-0 inset-x-0 z-40 p-3 sm:hidden animate-in slide-in-from-bottom duration-300 pointer-events-auto"
    >
      <div className="bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md text-white rounded-2xl border border-teal-500/30 p-3.5 shadow-2xl flex items-center justify-between gap-3">
        
        {/* App Icon + Text */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer" onClick={handleActionClick}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shrink-0 shadow-md shadow-teal-500/30">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-white truncate">تثبيت التطبيق على هاتفك</span>
              <Sparkles className="w-3 h-3 text-teal-400 shrink-0" />
            </div>
            <p className="text-[11px] text-slate-300 truncate">
              {isIOS ? 'إضافة سريعة للشاشة الرئيسية' : 'يعمل كبرنامج مستقل بدون إنترنت'}
            </p>
          </div>
        </div>

        {/* Action Button & Close */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            id="mobile-bottom-install-btn"
            onClick={handleActionClick}
            className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 active:scale-95 text-slate-950 font-black text-xs flex items-center gap-1 shadow-md shadow-teal-500/20 transition-all whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تثبيت الآن</span>
          </button>

          <button
            onClick={handleDismiss}
            title="إخفاء التنبيه"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </aside>
  );
};
