import React, { useState } from 'react';
import { X, CheckCircle2, Shield, Building2, Key, RotateCcw } from 'lucide-react';
import { PharmacySettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PharmacySettings;
  onSaveSettings: (settings: PharmacySettings) => Promise<void>;
  onResetData: () => Promise<void>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onResetData,
}) => {
  const [pharmacyName, setPharmacyName] = useState(settings.pharmacyName);
  const [branchName, setBranchName] = useState(settings.branchName);
  const [licenseNumber, setLicenseNumber] = useState(settings.licenseNumber);
  const [adminPin, setAdminPin] = useState(settings.adminPin);
  const [enablePinProtection, setEnablePinProtection] = useState(settings.enablePinProtection);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveSettings({
      ...settings,
      pharmacyName: pharmacyName.trim() || 'صيدلية الرعاية المتكاملة',
      branchName: branchName.trim() || 'الفرع الرئيسي',
      licenseNumber: licenseNumber.trim(),
      adminPin: adminPin.trim() || '1234',
      enablePinProtection,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  const handleResetConfirm = async () => {
    if (window.confirm('هل أنت متأكد من إعادة ضبط البيانات الافتراضية؟ سيتم استرجاع نماذج الأقسام والعهد الأساسية.')) {
      await onResetData();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                إعدادات المنصة والصيدلية
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                تخصيص بيانات التقرير المطبوع وحماية لوحة الإدمن
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {savedSuccess && (
            <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>تم حفظ الإعدادات بنجاح!</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              اسم الصيدلية أو المستشفى:
            </label>
            <input
              type="text"
              value={pharmacyName}
              onChange={(e) => setPharmacyName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              الفرع أو القسم المسؤول:
            </label>
            <input
              type="text"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              رقم ترخيص الصيدلية:
            </label>
            <input
              type="text"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white font-mono"
            />
          </div>

          {/* Admin Security PIN */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  تفعيل رمز المرور (PIN) لوضع الإدمن
                </label>
                <p className="text-[11px] text-slate-400">
                  عند التفعيل، يُطلب رمز PIN للتبديل لوضع الإدمن لمنع التعديل غير المصرح به
                </p>
              </div>
              <input
                type="checkbox"
                checked={enablePinProtection}
                onChange={(e) => setEnablePinProtection(e.target.checked)}
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
              />
            </div>

            {enablePinProtection && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  رمز PIN للإدمن (افتراضي: 1234):
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    maxLength={8}
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    className="w-full pr-9 pl-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Reset button */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <button
              type="button"
              onClick={handleResetConfirm}
              className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>استعادة النماذج الافتراضية</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              حفظ التغييرات
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
