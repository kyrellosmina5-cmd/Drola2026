import React from 'react';
import {
  FileText,
  Image as ImageIcon,
  Video,
  Link2,
  Edit2,
  Trash2,
  Plus,
  Printer,
  ChevronLeft,
  MapPin,
  UserCheck
} from 'lucide-react';
import { Section, CustodyItem } from '../types';
import { getSectionIcon, getColorTheme } from '../utils/icons';

interface SectionCardProps {
  section: Section;
  items: CustodyItem[];
  isAdmin: boolean;
  onSelect: (section: Section) => void;
  onEdit: (section: Section) => void;
  onDelete: (sectionId: string) => void;
  onQuickUpload: (section: Section) => void;
  onPrintSection: (section: Section) => void;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  section,
  items,
  isAdmin,
  onSelect,
  onEdit,
  onDelete,
  onQuickUpload,
  onPrintSection,
}) => {
  const IconComponent = getSectionIcon(section.iconName);
  const theme = getColorTheme(section.color);

  const pdfCount = items.filter(i => i.type === 'pdf').length;
  const imgCount = items.filter(i => i.type === 'image').length;
  const vidCount = items.filter(i => i.type === 'video').length;
  const linkCount = items.filter(i => i.type === 'link').length;
  const totalCount = items.length;

  return (
    <div
      id={`section-card-${section.id}`}
      className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm hover:shadow-md hover:border-teal-500/50 dark:hover:border-teal-500/40 transition-all flex flex-col justify-between"
    >
      {/* Top Header: Icon, Badge, Admin Controls */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          
          {/* Main Section Icon Button */}
          <button
            onClick={() => onSelect(section)}
            title={`فتح قسم ${section.name}`}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 active:scale-95 shadow-sm ${theme.bg}`}
          >
            <IconComponent className="w-7 h-7 sm:w-8 sm:h-8" />
          </button>

          {/* Right Action Icons (Edit, Delete, Print) */}
          <div className="flex items-center gap-1">
            <button
              id={`print-section-${section.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onPrintSection(section);
              }}
              title="طباعة تقرير جرد هذا القسم"
              className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/40 rounded-xl transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              id={`edit-section-${section.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(section);
              }}
              title="تعديل اسم القسم، الأيقونة، أو بيانات العهدة"
              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            <button
              id={`delete-section-${section.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(section.id);
              }}
              title="حذف هذا القسم وكافة ملفاته نهائياً"
              className="p-1.5 text-rose-600 hover:text-rose-700 bg-rose-50/70 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200/80 dark:border-rose-900/50 rounded-xl transition-all active:scale-95"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Section Title & Description */}
        <div className="cursor-pointer" onClick={() => onSelect(section)}>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
              {section.name}
            </h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {totalCount} ملف
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 min-h-[2.25rem]">
            {section.description || 'لا يوجد وصف مضاف لهذا القسم'}
          </p>
        </div>

        {/* Meta info (Responsible person & Location) */}
        {(section.responsiblePerson || section.location) && (
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1 text-xs text-slate-500 dark:text-slate-400">
            {section.responsiblePerson && (
              <div className="flex items-center gap-1.5 truncate">
                <UserCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                <span className="truncate">{section.responsiblePerson}</span>
              </div>
            )}
            {section.location && (
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{section.location}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Content Types summary pills & Open action */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        
        {/* Micro Badges */}
        <div className="flex items-center gap-1.5 text-xs">
          {pdfCount > 0 && (
            <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold" title="ملفات PDF">
              <FileText className="w-3 h-3" />
              {pdfCount}
            </span>
          )}
          {imgCount > 0 && (
            <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold" title="صور">
              <ImageIcon className="w-3 h-3" />
              {imgCount}
            </span>
          )}
          {vidCount > 0 && (
            <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 font-bold" title="فيديو">
              <Video className="w-3 h-3" />
              {vidCount}
            </span>
          )}
          {linkCount > 0 && (
            <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold" title="روابط">
              <Link2 className="w-3 h-3" />
              {linkCount}
            </span>
          )}
          {totalCount === 0 && (
            <span className="text-slate-400 text-xs">فارغ حالياً</span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            id={`quick-upload-${section.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onQuickUpload(section);
            }}
            title="إضافة ورفع عهدة جديدة في هذا القسم"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/60 font-bold text-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة عهدة</span>
          </button>

          <button
            id={`open-section-${section.id}`}
            onClick={() => onSelect(section)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:bg-teal-700 dark:hover:bg-teal-200 transition-colors"
          >
            <span>استعراض</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
