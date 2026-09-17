import React, { useState } from 'react';
import {
  X,
  Download,
  Smartphone,
  Laptop,
  CheckCircle2,
  ExternalLink,
  Share,
  PlusSquare,
  Sparkles,
  QrCode,
  MoreVertical
} from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerInstall?: () => Promise<boolean>;
  isInstallable: boolean;
  isIOS: boolean;
  isInstalled: boolean;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  onTriggerInstall,
  isInstallable,
  isIOS,
  isInstalled,
}) => {
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'desktop' | 'qr'>(
    isIOS ? 'ios' : 'android'
  );

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (onTriggerInstall && isInstallable) {
      const success = await onTriggerInstall();
      if (success) {
        onClose();
      }
    }
  };

  const handleOpenInNewTab = () => {
    window.open(window.location.href, '_blank');
  };

  // Generate QR Code pointing to the current app URL
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const qrApiUrl = currentUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(currentUrl)}`
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>تثبيت التطبيق على الموبايل</span>
                <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                يعمل كتطبيق جوال مستقل بشاشته الكاملة بدون إنترنت (PWA)
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

        {/* Status or Direct One-Click Install Banner */}
        {isInstalled ? (
          <div className="m-5 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-1.5">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
            <h4 className="text-sm font-black text-emerald-900 dark:text-emerald-200">
              التطبيق مثبت بالفعل ويعمل في الوضع المستقل!
            </h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              يمكنك فتحه دائماً من شاشة التطبيقات الرئيسية بهاتفك أو سطح المكتب.
            </p>
          </div>
        ) : isInstallable ? (
          <div className="m-5 p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-3 text-center">
            <p className="text-xs text-teal-900 dark:text-teal-200 font-bold">
              🎉 متصفحك يدعم التثبيت المباشر بنقرة واحدة!
            </p>
            <button
              id="modal-direct-install-btn"
              onClick={handleInstallClick}
              className="w-full py-3 px-5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-600/30 transition-all active:scale-95 cursor-pointer"
            >
              <Download className="w-5 h-5" />
              <span>تثبيت التطبيق على جهازي الآن</span>
            </button>
          </div>
        ) : null}

        {/* Navigation Tabs */}
        <div className="px-5 pt-2">
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
            <button
              onClick={() => setActiveTab('android')}
              className={`flex-1 py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'android'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>أندرويد</span>
            </button>
            <button
              onClick={() => setActiveTab('ios')}
              className={`flex-1 py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'ios'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>آيفون (iOS)</span>
            </button>
            <button
              onClick={() => setActiveTab('desktop')}
              className={`flex-1 py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'desktop'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>كمبيوتر</span>
            </button>
            <button
              onClick={() => setActiveTab('qr')}
              className={`flex-1 py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'qr'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>باركود QR</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-5 space-y-4">
          
          {/* TAB 1: Android */}
          {activeTab === 'android' && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>خطوات التثبيت على هواتف أندرويد (Chrome / Samsung / Edge):</span>
              </div>
              <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60">
                  <div className="w-6 h-6 rounded-lg bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 flex items-center justify-center font-black shrink-0">
                    1
                  </div>
                  <div className="pt-0.5">
                    افتح الرابط في متصفح <strong>Google Chrome</strong> أو <strong>Samsung Internet</strong>، واضغط على قائمة الخيارات الثلاثية (<MoreVertical className="inline w-3.5 h-3.5 mx-0.5 text-teal-600" />) أعلى أو أسفل الشاشة.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60">
                  <div className="w-6 h-6 rounded-lg bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 flex items-center justify-center font-black shrink-0">
                    2
                  </div>
                  <div className="pt-0.5">
                    اختر <strong>«تثبيت التطبيق» (Install app)</strong> أو <strong>«إضافة إلى الشاشة الرئيسية» (Add to Home screen)</strong>.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60">
                  <div className="w-6 h-6 rounded-lg bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 flex items-center justify-center font-black shrink-0">
                    3
                  </div>
                  <div className="pt-0.5">
                    اضغط <strong>«تثبيت»</strong> وسينزل التطبيق فوراً على شاشة هاتفك مع إمكانية العمل بدون إنترنت!
                  </div>
                </div>
              </div>

              <button
                onClick={handleOpenInNewTab}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>فتح التطبيق في متصفح خارجي للتثبيت</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* TAB 2: iOS */}
          {activeTab === 'ios' && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>خطوات التثبيت على أجهزة iPhone و iPad عبر Safari:</span>
              </div>
              <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60">
                  <div className="w-6 h-6 rounded-lg bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 flex items-center justify-center font-black shrink-0">
                    1
                  </div>
                  <div className="pt-0.5">
                    افتح الرابط في متصفح <strong>Safari</strong>، ثم اضغط على زر <strong>المشاركة (Share <Share className="inline w-3.5 h-3.5 text-blue-500 mx-0.5" />)</strong> في شريط الأدوات بالأسفل.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60">
                  <div className="w-6 h-6 rounded-lg bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 flex items-center justify-center font-black shrink-0">
                    2
                  </div>
                  <div className="pt-0.5">
                    مرر القائمة لأسفل واختر <strong>«إضافة إلى الشاشة الرئيسية» (Add to Home Screen <PlusSquare className="inline w-3.5 h-3.5 text-slate-600 dark:text-slate-300 mx-0.5" />)</strong>.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60">
                  <div className="w-6 h-6 rounded-lg bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 flex items-center justify-center font-black shrink-0">
                    3
                  </div>
                  <div className="pt-0.5">
                    اضغط على <strong>«إضافة» (Add)</strong> في الزاوية العلوية وسيتحول إلى تطبيق مستقل بشعار الصيدلية.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Desktop */}
          {activeTab === 'desktop' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Laptop className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>تثبيت البرنامج على أجهزة الكمبيوتر (Windows / Mac):</span>
                </div>
                <ul className="list-disc list-inside space-y-1.5 text-slate-600 dark:text-slate-400">
                  <li>في <strong>Google Chrome</strong> أو <strong>Edge</strong>: انقر على أيقونة التثبيت <Download className="inline w-3.5 h-3.5 mx-0.5 text-teal-600" /> في شريط العنوان أو من قائمة المتصفح (⠇).</li>
                  <li>سيتم إنشاء اختصار على سطح المكتب وشريط المهام وفتح البرنامج في نافذة مستقلة دون عناصر المتصفح.</li>
                </ul>
              </div>

              <button
                onClick={handleOpenInNewTab}
                className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <span>فتح التطبيق في نافذة مستقلة للتثبيت الفوري</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* TAB 4: QR Scanner for Mobile */}
          {activeTab === 'qr' && (
            <div className="text-center space-y-3">
              <div className="text-xs text-slate-600 dark:text-slate-400">
                امسح هذا الرمز بكاميرا هاتفك الجوال ليفتح التطبيق فوراً وتقوم بتثبيته:
              </div>
              {qrApiUrl && (
                <div className="inline-block p-3 bg-white rounded-2xl shadow-md border border-slate-200 dark:border-slate-700">
                  <img src={qrApiUrl} alt="App QR Code" className="w-44 h-44 mx-auto" />
                </div>
              )}
              <p className="text-[11px] text-slate-400">
                متوافق مع جميع هواتف أندرويد وآيفون
              </p>
            </div>
          )}

          {/* Features highlight */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>تشغيل فوري سريع بدون شريط المتصفح</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>حفظ مستندات العهدة للعمل دون الحاجة لإنترنت (Offline)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>مزامنة سحابية واسترجاع للبيانات عند الاتصال</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-2xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
