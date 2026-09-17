import React from 'react';
import {
  FolderKanban,
  FileText,
  Image as ImageIcon,
  Video,
  Link2,
  Search,
  CheckCircle2,
  Plus,
  FileUp,
  Share2
} from 'lucide-react';
import { Section, CustodyItem, FileType } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface DashboardStatsProps {
  sections: Section[];
  items: CustodyItem[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedTypeFilter: 'all' | FileType;
  onTypeFilterChange: (type: 'all' | FileType) => void;
  isAdmin: boolean;
  onAddNewSection: () => void;
  onAddNewItem?: () => void;
  onOpenShareModal?: () => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  sections,
  items,
  searchQuery,
  onSearchChange,
  selectedTypeFilter,
  onTypeFilterChange,
  isAdmin,
  onAddNewSection,
  onAddNewItem,
  onOpenShareModal,
}) => {
  const pdfCount = items.filter(i => i.type === 'pdf').length;
  const imageCount = items.filter(i => i.type === 'image').length;
  const videoCount = items.filter(i => i.type === 'video').length;
  const linkCount = items.filter(i => i.type === 'link').length;

  return (
    <div className="space-y-4">
      {/* Top Banner & Quick Add */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-l from-teal-900 via-teal-800 to-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-2 border border-teal-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            نظام رقابة وإدارة العهد الصيدلية المتكامل
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            لوحة أقسام وعهد الصيدلة
          </h2>
          <p className="text-sm text-teal-100/80 mt-1 max-w-xl">
            إدارة فورية لكافة عهد الأقسام، رفع المستندات الرسمية، الصور التوثيقية، الفيديوهات التدريبية، والروابط السحابية مع إمكانية التحميل والطباعة.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
          <button
            id="quick-add-section-btn"
            onClick={onAddNewSection}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-teal-400 hover:bg-teal-300 text-teal-950 font-bold text-sm shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة قسم عهدة جديد</span>
          </button>

          {onAddNewItem && (
            <button
              id="quick-add-item-btn"
              onClick={onAddNewItem}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <FileUp className="w-4 h-4 text-emerald-400" />
              <span>رفع مستند / عهدة</span>
            </button>
          )}

          {onOpenShareModal && (
            <button
              id="banner-share-btn"
              onClick={onOpenShareModal}
              title="نشر ومشاركة رابط المنظومة"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-white/25 font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <Share2 className="w-4 h-4 text-teal-200" />
              <span>نشر وشير</span>
            </button>
          )}

          <PWAInstallButton variant="banner" />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
        
        {/* Sections Count */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">الأقسام</div>
            <div className="text-lg font-black text-slate-900 dark:text-white">{sections.length}</div>
          </div>
        </div>

        {/* PDF Count */}
        <button
          onClick={() => onTypeFilterChange(selectedTypeFilter === 'pdf' ? 'all' : 'pdf')}
          className={`text-right p-3.5 rounded-2xl border transition-all flex items-center gap-3 ${
            selectedTypeFilter === 'pdf'
              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">ملفات PDF</div>
            <div className="text-lg font-black text-slate-900 dark:text-white">{pdfCount}</div>
          </div>
        </button>

        {/* Images Count */}
        <button
          onClick={() => onTypeFilterChange(selectedTypeFilter === 'image' ? 'all' : 'image')}
          className={`text-right p-3.5 rounded-2xl border transition-all flex items-center gap-3 ${
            selectedTypeFilter === 'image'
              ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">صور توثيق</div>
            <div className="text-lg font-black text-slate-900 dark:text-white">{imageCount}</div>
          </div>
        </button>

        {/* Videos Count */}
        <button
          onClick={() => onTypeFilterChange(selectedTypeFilter === 'video' ? 'all' : 'video')}
          className={`text-right p-3.5 rounded-2xl border transition-all flex items-center gap-3 ${
            selectedTypeFilter === 'video'
              ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">فيديوهات</div>
            <div className="text-lg font-black text-slate-900 dark:text-white">{videoCount}</div>
          </div>
        </button>

        {/* Links Count */}
        <button
          onClick={() => onTypeFilterChange(selectedTypeFilter === 'link' ? 'all' : 'link')}
          className={`text-right p-3.5 rounded-2xl border transition-all flex items-center gap-3 col-span-2 sm:col-span-1 ${
            selectedTypeFilter === 'link'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">روابط سحابية</div>
            <div className="text-lg font-black text-slate-900 dark:text-white">{linkCount}</div>
          </div>
        </button>

      </div>

      {/* Search Bar & Quick Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="بحث في الأقسام، المستندات، أرقام العهد، أو أسماء المسؤولين..."
            className="w-full pl-4 pr-10 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white placeholder-slate-400 transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full"
            >
              مسح
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => onTypeFilterChange('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              selectedTypeFilter === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            الكل ({items.length})
          </button>
          <button
            onClick={() => onTypeFilterChange('pdf')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              selectedTypeFilter === 'pdf'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            PDF ({pdfCount})
          </button>
          <button
            onClick={() => onTypeFilterChange('image')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              selectedTypeFilter === 'image'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            صور ({imageCount})
          </button>
          <button
            onClick={() => onTypeFilterChange('video')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              selectedTypeFilter === 'video'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            فيديو ({videoCount})
          </button>
          <button
            onClick={() => onTypeFilterChange('link')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              selectedTypeFilter === 'link'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            روابط ({linkCount})
          </button>
        </div>
      </div>
    </div>
  );
};
