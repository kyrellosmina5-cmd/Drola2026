import React, { useState } from 'react';
import { AlertTriangle, Trash2, X, ShieldAlert } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  itemName: string;
  itemTypeLabel: 'قسم' | 'مستند' | 'سجل' | 'عنصر';
  warningText?: string;
  badgeInfo?: string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  itemTypeLabel,
  warningText,
  badgeInfo,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      console.error('Delete action failed:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) {
          onClose();
        }
      }}
    >
      <div 
        role="dialog"
        aria-modal="true"
        className="bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900/60 shadow-2xl w-full max-w-md my-auto overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Strip */}
        <div className="h-2 bg-gradient-to-r from-rose-500 via-rose-600 to-red-600"></div>

        <div className="p-6">
          {/* Top Header with Warning Icon & Close */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-900/60 shadow-sm">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Title & Item Name */}
          <div className="space-y-2 mb-4">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              {title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              أنت على وشك إجراء عملية حذف نهائية من سجلات العهدة. يرجى تأكيد رغبتك في حذف هذا الـ{itemTypeLabel}:
            </p>
          </div>

          {/* Highlight Target Box */}
          <div className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/40 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
                {itemTypeLabel}
              </span>
              {badgeInfo && (
                <span className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
                  {badgeInfo}
                </span>
              )}
            </div>
            <div className="text-sm font-black text-slate-900 dark:text-white break-words">
              {itemName}
            </div>
          </div>

          {/* Warning Note */}
          <div className="flex items-start gap-2 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200 dark:border-amber-900/50 mb-6">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <span>{warningText || 'هذا الإجراء نهائي ولا يمكن التراجع عنه. سيتم توثيق عملية الحذف في سجل الرقابة.'}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              id="confirm-delete-action-btn"
              type="button"
              onClick={handleConfirm}
              disabled={isDeleting}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm shadow-md shadow-rose-600/30 transition-all active:scale-95 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isDeleting ? 'جاري الحذف...' : 'نعم، حذف نهائي'}</span>
            </button>

            <button
              id="cancel-delete-action-btn"
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="py-2.5 px-5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-sm transition-colors"
            >
              إلغاء
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
