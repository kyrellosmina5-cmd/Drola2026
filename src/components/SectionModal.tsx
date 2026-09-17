import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { Section } from '../types';
import { AVAILABLE_ICONS, COLOR_THEMES, getSectionIcon } from '../utils/icons';

interface SectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (section: Section) => Promise<void>;
  editingSection?: Section | null;
  sectionsCount: number;
}

export const SectionModal: React.FC<SectionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingSection,
  sectionsCount,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('Pill');
  const [color, setColor] = useState('teal');
  const [responsiblePerson, setResponsiblePerson] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (editingSection) {
      setName(editingSection.name);
      setDescription(editingSection.description || '');
      setIconName(editingSection.iconName || 'Pill');
      setColor(editingSection.color || 'teal');
      setResponsiblePerson(editingSection.responsiblePerson || '');
      setLocation(editingSection.location || '');
    } else {
      setName('');
      setDescription('');
      setIconName('Pill');
      setColor('teal');
      setResponsiblePerson('');
      setLocation('');
    }
    setErrorMessage('');
  }, [editingSection, isOpen]);

  if (!isOpen) return null;

  const SelectedIconComp = getSectionIcon(iconName);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('يرجى كتابة اسم القسم');
      return;
    }

    setIsSubmitting(true);
    try {
      const section: Section = {
        id: editingSection ? editingSection.id : `sec-${Date.now()}`,
        name: name.trim(),
        description: description.trim(),
        iconName,
        color,
        responsiblePerson: responsiblePerson.trim() || undefined,
        location: location.trim() || undefined,
        createdAt: editingSection ? editingSection.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        order: editingSection ? editingSection.order : sectionsCount + 1,
      };

      await onSave(section);
      onClose();
    } catch {
      setErrorMessage('فشل حفظ القسم، يرجى المحاولة ثانية.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-xl my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-teal-500/10 text-teal-600 dark:text-teal-400`}>
              <SelectedIconComp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {editingSection ? 'تعديل بيانات القسم والأيقونة' : 'إضافة قسم عهدة جديد'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                خصص اسم القسم، اختر الأيقونة المناسبة، وحدد المسؤول
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
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section Name Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              اسم قسم العهدة: <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: عهدة المحاليل الوريدية، عهدة الترياق ومضادات السموم..."
              className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white font-bold"
              required
            />
          </div>

          {/* Icon Selector Grid */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              اختر الأيقونة المميزة للقسم:
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-44 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700">
              {AVAILABLE_ICONS.map((iconOpt) => {
                const IconC = iconOpt.component;
                const isSelected = iconName === iconOpt.name;
                return (
                  <button
                    key={iconOpt.name}
                    type="button"
                    onClick={() => setIconName(iconOpt.name)}
                    title={iconOpt.label}
                    className={`p-2.5 rounded-xl flex flex-col items-center gap-1 transition-all text-center ${
                      isSelected
                        ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30 scale-105'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <IconC className="w-5 h-5" />
                    <span className="text-[10px] font-semibold truncate w-full">{iconOpt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Theme Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              لون بطاقة وأيقونة القسم:
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {COLOR_THEMES.map((theme) => {
                const isSelected = color === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setColor(theme.id)}
                    className={`h-9 rounded-xl flex items-center justify-center border-2 transition-all ${
                      isSelected
                        ? 'border-slate-900 dark:border-white scale-110 shadow-sm'
                        : 'border-transparent opacity-80 hover:opacity-100'
                    } ${theme.bg}`}
                    title={theme.name}
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-current"></span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              وصف القسم وطبيعة العهدة:
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="اكتب نبذة مختصرة عن الأصناف التابعة لهذا القسم وإجراءات الجرد الخاصة به..."
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white"
            />
          </div>

          {/* Responsible Person & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                المسؤول عن عهدة القسم:
              </label>
              <input
                type="text"
                value={responsiblePerson}
                onChange={(e) => setResponsiblePerson(e.target.value)}
                placeholder="مثال: د. سارة خليل - صيدلي أول"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                الموقع / الغرفة / الجناح:
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="مثال: الدور الأول - غرفة الأدوية B2"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20 transition-all disabled:opacity-50 active:scale-95 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'جاري الحفظ...' : editingSection ? 'حفظ التعديلات' : 'إنشاء القسم'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
