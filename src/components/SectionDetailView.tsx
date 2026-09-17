import React, { useState } from 'react';
import {
  ArrowRight,
  Plus,
  Printer,
  Edit2,
  Trash2,
  Search,
  FileText,
  Image as ImageIcon,
  Video,
  Link2,
  Filter,
  UserCheck,
  MapPin,
  Calendar,
  AlertCircle,
  Share2,
  Check
} from 'lucide-react';
import { Section, CustodyItem, FileType } from '../types';
import { getSectionIcon, getColorTheme } from '../utils/icons';
import { copyToClipboard, formatSectionShareText } from '../utils/clipboardHelpers';
import { CustodyCard } from './CustodyCard';

interface SectionDetailViewProps {
  section: Section;
  items: CustodyItem[];
  isAdmin: boolean;
  onBack: () => void;
  onUploadItem: (section: Section) => void;
  onEditSection: (section: Section) => void;
  onDeleteSection: (sectionId: string) => void;
  onPreviewItem: (item: CustodyItem) => void;
  onEditItem: (item: CustodyItem) => void;
  onDeleteItem: (itemId: string) => void;
  onPrintSection: (section: Section) => void;
  onShowQr: (url: string, title: string) => void;
}

export const SectionDetailView: React.FC<SectionDetailViewProps> = ({
  section,
  items,
  isAdmin,
  onBack,
  onUploadItem,
  onEditSection,
  onDeleteSection,
  onPreviewItem,
  onEditItem,
  onDeleteItem,
  onPrintSection,
  onShowQr,
}) => {
  const [activeType, setActiveType] = useState<'all' | FileType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSection, setCopiedSection] = useState(false);

  const handleCopySectionDetails = async () => {
    const text = formatSectionShareText(section, items);

    if (typeof navigator !== 'undefined' && 'share' in navigator && window.innerWidth < 768) {
      try {
        await navigator.share({
          title: `كشف قسم ${section.name}`,
          text: text,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    const success = await copyToClipboard(text);
    if (success) {
      setCopiedSection(true);
      setTimeout(() => setCopiedSection(false), 2500);
    }
  };

  const IconComponent = getSectionIcon(section.iconName);
  const theme = getColorTheme(section.color);

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesType = activeType === 'all' || item.type === activeType;
    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.custodyNumber && item.custodyNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.addedBy && item.addedBy.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesType && matchesSearch;
  });

  const pdfCount = items.filter(i => i.type === 'pdf').length;
  const imgCount = items.filter(i => i.type === 'image').length;
  const vidCount = items.filter(i => i.type === 'video').length;
  const linkCount = items.filter(i => i.type === 'link').length;

  return (
    <div className="space-y-6">
      
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex items-center justify-between gap-4">
        <button
          id="back-to-sections-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-all"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة لجميع الأقسام</span>
        </button>

        {/* Section Actions */}
        <div className="flex items-center gap-2">
          <button
            id="share-section-report-btn"
            onClick={handleCopySectionDetails}
            title="نسخ تفاصيل القسم وحصر عهده للمراسلة عبر واتساب وتيليجرام"
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border font-bold text-xs sm:text-sm transition-all ${
              copiedSection
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {copiedSection ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
                <span>تم نسخ الكشف!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="hidden sm:inline">نسخ ومشاركة الكشف</span>
              </>
            )}
          </button>

          <button
            id="print-section-report-btn"
            onClick={() => onPrintSection(section)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Printer className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span className="hidden sm:inline">طباعة كشف العهدة</span>
          </button>

          <button
            id="edit-current-section-btn"
            onClick={() => onEditSection(section)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 font-bold text-xs sm:text-sm hover:bg-blue-100 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            <span className="hidden sm:inline">تعديل القسم</span>
          </button>

          <button
            id="delete-current-section-btn"
            onClick={() => onDeleteSection(section.id)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 hover:bg-rose-100 font-bold text-xs sm:text-sm transition-colors"
            title="حذف هذا القسم بالكامل"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">حذف القسم</span>
          </button>

          <button
            id="upload-to-section-btn"
            onClick={() => onUploadItem(section)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>رفع ملف جديد</span>
          </button>
        </div>
      </div>

      {/* Section Hero Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            
            {/* Section Large Icon */}
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${theme.bg}`}>
              <IconComponent className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {section.name}
                </h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  {items.length} مستند مسجل
                </span>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
                {section.description || 'لا يوجد وصف تفصيلي لهذا القسم'}
              </p>

              {/* Responsible Person & Location */}
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-500 dark:text-slate-400">
                {section.responsiblePerson && (
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>المسؤول: <strong className="text-slate-700 dark:text-slate-300">{section.responsiblePerson}</strong></span>
                  </div>
                )}
                {section.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>الموقع: {section.location}</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Counts breakdown card */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shrink-0">
            <div className="text-center px-3 border-l border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-400 font-medium">PDF</div>
              <div className="text-base font-black text-rose-600 dark:text-rose-400">{pdfCount}</div>
            </div>
            <div className="text-center px-3 border-l border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-400 font-medium">صور</div>
              <div className="text-base font-black text-blue-600 dark:text-blue-400">{imgCount}</div>
            </div>
            <div className="text-center px-3 border-l border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-400 font-medium">فيديو</div>
              <div className="text-base font-black text-purple-600 dark:text-purple-400">{vidCount}</div>
            </div>
            <div className="text-center px-3">
              <div className="text-xs text-slate-400 font-medium">روابط</div>
              <div className="text-base font-black text-emerald-600 dark:text-emerald-400">{linkCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Filters & Local Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Type selector tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveType('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              activeType === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            كافة الملفات ({items.length})
          </button>
          <button
            onClick={() => setActiveType('pdf')}
            className={`flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              activeType === 'pdf'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>PDF ({pdfCount})</span>
          </button>
          <button
            onClick={() => setActiveType('image')}
            className={`flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              activeType === 'image'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>صور ({imgCount})</span>
          </button>
          <button
            onClick={() => setActiveType('video')}
            className={`flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              activeType === 'video'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>فيديو ({vidCount})</span>
          </button>
          <button
            onClick={() => setActiveType('link')}
            className={`flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              activeType === 'link'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>روابط ({linkCount})</span>
          </button>
        </div>

        {/* Section Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث داخل هذا القسم..."
            className="w-full pl-3 pr-9 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Custody Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map(item => (
            <CustodyCard
              key={item.id}
              item={item}
              sectionName={section.name}
              isAdmin={isAdmin}
              onPreview={onPreviewItem}
              onEdit={onEditItem}
              onDelete={onDeleteItem}
              onShowQr={onShowQr}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">
            لا توجد مستندات مسجلة في هذا القسم بعد
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
            يمكنك رفع ملفات الـ PDF الرسمية، الصور، الفيديوهات التوضيحية، أو إضافة روابط سحابية مهمة لحفظ وتوثيق العهدة.
          </p>
          <button
            onClick={() => onUploadItem(section)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>رفع أول مستند في {section.name}</span>
          </button>
        </div>
      )}

    </div>
  );
};
