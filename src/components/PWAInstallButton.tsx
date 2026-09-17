import React, { useState } from 'react';
import { Download, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'header' | 'banner' | 'card';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'header',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  const handleClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (!success) {
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  if (isInstalled && variant === 'header') {
    return (
      <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
        <span>مثبت</span>
      </div>
    );
  }

  return (
    <>
      <button
        id="pwa-install-app-btn"
        onClick={handleClick}
        title="تثبيت منظومة عهد الصيدلة كتطبيق مستقل على هاتفك أو حاسوبك"
        className={
          className ||
          (variant === 'banner'
            ? 'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-white text-teal-900 hover:bg-teal-50 font-bold text-xs shadow-md transition-all active:scale-95'
            : 'inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold transition-all active:scale-95')
        }
      >
        <Download className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
        <span>تثبيت التطبيق</span>
      </button>

      <PWAInstallModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onTriggerInstall={install}
        isInstallable={isInstallable}
        isIOS={isIOS}
        isInstalled={isInstalled}
      />
    </>
  );
};
