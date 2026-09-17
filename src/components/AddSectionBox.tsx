import React, { useState } from 'react';
import { FolderPlus, Plus, Sparkles, Sliders, CheckCircle2 } from 'lucide-react';
import { Section } from '../types';

interface AddSectionBoxProps {
  onAddSection: (section: Section) => Promise<void>;
  onOpenFullModal: () => void;
  sectionsCount: number;
}

const QUICK_SUGGESTIONS = [
  { name: 'أدوية الطوارئ والإنعاش', icon: 'HeartPulse', color: 'rose' },
  { name: 'ثلاجة الأدوية والأمصال', icon: 'Snowflake', color: 'cyan' },
  { name: 'المحاليل الوريدية', icon: 'FlaskConical', color: 'blue' },
  { name: 'العهدة المخدرة والسموم', icon: 'Lock', color: 'amber' },
  { name: 'الأنسولين والهرمونات', icon: 'Syringe', color: 'indigo' },
  { name: 'مستلزمات الغيار والتعقيم', icon: 'ShieldCheck', color: 'emerald' },
  { name: 'المضادات الحيوية الخاصة', icon: 'Pill', color: 'teal' },
];

export const AddSectionBox: React.FC<AddSectionBoxProps> = ({
  onAddSection,
  onOpenFullModal,
  sectionsCount,
}) => {
  const [sectionName, setSectionName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputError, setInputError] = useState('');

  // Auto detect best icon and color based on name
  const detectIconAndColor = (name: string): { iconName: string; color: string } => {
    const lower = name.toLowerCase();
    if (lower.includes('ثلاج') || lower.includes('تبريد') || lower.includes('حرار')) {
      return { iconName: 'Snowflake', color: 'cyan' };
    }
    if (lower.includes('طوارئ') || lower.includes('إنعاش') || lower.includes('قلب')) {
      return { iconName: 'HeartPulse', color: 'rose' };
    }
    if (lower.includes('مخدر') || lower.includes('سموم') || lower.includes('أمان') || lower.includes('خزن')) {
      return { iconName: 'Lock', color: 'amber' };
    }
    if (lower.includes('محلول') || lower.includes('محاليل') || lower.includes('وريد') || lower.includes('مختبر')) {
      return { iconName: 'FlaskConical', color: 'blue' };
    }
    if (lower.includes('أنسولين') || lower.includes('حقن') || lower.includes('مصل') || lower.includes('تطعيم')) {
      return { iconName: 'Syringe', color: 'indigo' };
    }
    if (lower.includes('مستلزم') || lower.includes('تعقيم') || lower.includes('جراح')) {
      return { iconName: 'ShieldCheck', color: 'emerald' };
    }
    if (lower.includes('مخزن') || lower.includes('مستودع') || lower.includes('كراتين')) {
      return { iconName: 'Boxes', color: 'violet' };
    }
    return { iconName: 'Pill', color: 'teal' };
  };

  const handleDirectSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = sectionName.trim();
    if (!trimmed) {
      setInputError('يرجى كتابة اسم القسم المراد إضافته');
      return;
    }

    if (trimmed.length < 2) {
      setInputError('اسم القسم يجب أن يحتوي على حرفين على الأقل');
      return;
    }

    setIsSubmitting(true);
    setInputError('');

    try {
      const { iconName, color } = detectIconAndColor(trimmed);
      const newSection: Section = {
        id: `sec-${Date.now()}`,
        name: trimmed,
        description: `قسم ${trimmed} للرقابة على العهدة والملفات المرفوعة`,
        iconName,
        color,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        order: sectionsCount + 1,
      };

      await onAddSection(newSection);
      setSectionName('');
    } catch {
      setInputError('حدث خطأ أثناء إضافة القسم، يرجى المحاولة ثانية');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectSuggestion = (suggestionName: string) => {
    setSectionName(suggestionName);
    setInputError('');
  };

  return (
    <div 
      id="main-add-section-screen-box"
      className="bg-gradient-to-br from-teal-50/90 via-white to-emerald-50/90 dark:from-slate-900 dark:via-slate-900/95 dark:to-teal-950/40 p-5 sm:p-6 rounded-3xl border-2 border-teal-500/30 dark:border-teal-500/30 shadow-xl shadow-teal-900/5 relative overflow-hidden transition-all"
    >
      {/* Visual Accent Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-teal-400/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="relative z-10 space-y-4">
        
        {/* Top Header of the Box */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-teal-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/30 shrink-0">
              <FolderPlus className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  خانة إضافة قسم عهدة جديد
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 dark:bg-teal-900/80 text-teal-800 dark:text-teal-200">
                  <Sparkles className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                  مباشر على الشاشة
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                أدخل اسم القسم فوراً ليظهر في قائمة الأقسام وتبدأ برفع وتوثيق ملفات العهدة داخله
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenFullModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-colors self-start sm:self-auto shadow-sm"
            title="تخصيص كامل (اختيار أيقونة من 25+ رمز، تحديد صيدلي العهدة، والموقع)"
          >
            <Sliders className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>تخصيص كامل (الأيقونة والمسؤول)</span>
          </button>
        </div>

        {/* Input Form Right in front of the user */}
        <form onSubmit={handleDirectSubmit} className="space-y-2">
          <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
            <div className="relative flex-1">
              <input
                id="inline-new-section-name-input"
                type="text"
                value={sectionName}
                onChange={(e) => {
                  setSectionName(e.target.value);
                  if (inputError) setInputError('');
                }}
                placeholder="اكتب اسم القسم الجديد هنا (مثال: أدوية الطوارئ، التلاجة، الأنسولين، المستلزمات...)"
                disabled={isSubmitting}
                className="w-full h-12 sm:h-13 px-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none focus:ring-4 focus:ring-teal-500/10 text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 transition-all shadow-inner"
              />
              {sectionName && (
                <button
                  type="button"
                  onClick={() => setSectionName('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-1.5 py-0.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  مسح
                </button>
              )}
            </div>

            <button
              id="inline-submit-new-section-btn"
              type="submit"
              disabled={isSubmitting || !sectionName.trim()}
              className="h-12 sm:h-13 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:pointer-events-none text-white font-bold text-sm shadow-md shadow-teal-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0"
            >
              {isSubmitting ? (
                <span>جاري الحفظ...</span>
              ) : (
                <>
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                  <span>إضافة القسم الآن</span>
                </>
              )}
            </button>
          </div>

          {inputError && (
            <p className="text-xs font-bold text-rose-600 dark:text-rose-400 px-1 animate-in fade-in duration-150">
              {inputError}
            </p>
          )}
        </form>

        {/* Quick Suggestion Pills */}
        <div className="pt-1">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>أقسام صيدلية شائعة (انقر للاختيار الفوري):</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_SUGGESTIONS.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => handleSelectSuggestion(item.name)}
                className={`text-xs px-2.5 py-1 rounded-xl font-medium transition-all border ${
                  sectionName === item.name
                    ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                    : 'bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700 hover:border-teal-400 hover:text-teal-600 dark:hover:text-teal-300'
                }`}
              >
                + {item.name}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
