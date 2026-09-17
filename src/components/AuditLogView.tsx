import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  Printer,
  Download,
  Trash2,
  ArrowRight,
  Clock,
  UserCheck,
  FolderPlus,
  FolderMinus,
  FilePlus,
  FileEdit,
  FileX,
  Settings,
  Lock,
  Database,
  Calendar,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  FolderKanban,
  Layers,
  ChevronDown
} from 'lucide-react';
import { AuditLog, LogCategory, PharmacySettings } from '../types';
import { formatDateArabic } from '../utils/fileHelpers';
import { printAuditLogsReport } from '../utils/printAuditLog';

interface AuditLogViewProps {
  logs: AuditLog[];
  settings: PharmacySettings;
  isAdmin: boolean;
  onBack: () => void;
  onClearLogs: () => Promise<void>;
  onRefreshLogs: () => Promise<void>;
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({
  logs,
  settings,
  isAdmin,
  onBack,
  onClearLogs,
  onRefreshLogs,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedActionType, setSelectedActionType] = useState<string>('all'); // all, create, update, delete
  const [selectedTimeRange, setSelectedTimeRange] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Statistics
  const stats = useMemo(() => {
    const total = logs.length;
    const sectionCount = logs.filter(l => l.category === 'section').length;
    const itemCount = logs.filter(l => l.category === 'item').length;
    const securityCount = logs.filter(l => l.category === 'security' || l.category === 'settings').length;
    const backupCount = logs.filter(l => l.category === 'backup').length;
    return { total, sectionCount, itemCount, securityCount, backupCount };
  }, [logs]);

  // Filter and Sort
  const filteredLogs = useMemo(() => {
    const now = new Date().getTime();

    return logs
      .filter((log) => {
        // Category filter
        if (selectedCategory !== 'all' && log.category !== selectedCategory) {
          return false;
        }

        // Action type filter
        if (selectedActionType !== 'all') {
          if (selectedActionType === 'create' && !log.action.includes('create')) return false;
          if (selectedActionType === 'update' && !log.action.includes('update')) return false;
          if (selectedActionType === 'delete' && !log.action.includes('delete')) return false;
        }

        // Time range filter
        if (selectedTimeRange !== 'all') {
          const logTime = new Date(log.timestamp).getTime();
          const diffHours = (now - logTime) / (1000 * 60 * 60);
          if (selectedTimeRange === 'today' && diffHours > 24) return false;
          if (selectedTimeRange === 'week' && diffHours > 24 * 7) return false;
          if (selectedTimeRange === 'month' && diffHours > 24 * 30) return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = log.title.toLowerCase().includes(q);
          const matchDetails = log.details.toLowerCase().includes(q);
          const matchTarget = log.targetName?.toLowerCase().includes(q);
          const matchSection = log.sectionName?.toLowerCase().includes(q);
          const matchUser = log.performedBy.toLowerCase().includes(q);
          return matchTitle || matchDetails || matchTarget || matchSection || matchUser;
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [logs, selectedCategory, selectedActionType, selectedTimeRange, searchQuery, sortOrder]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await onRefreshLogs();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleExportCsv = () => {
    if (logs.length === 0) return;

    // Build CSV with BOM for Arabic Excel
    const headers = ['#', 'التاريخ والوقت', 'نوع الإجراء', 'التصنيف', 'المنفذ', 'العنوان', 'القسم المستهدف', 'التفاصيل'];
    const rows = filteredLogs.map((log, idx) => [
      idx + 1,
      formatDateArabic(log.timestamp).replace(/,/g, ' '),
      log.action,
      log.category,
      log.performedBy,
      `"${(log.title || '').replace(/"/g, '""')}"`,
      `"${(log.sectionName || '').replace(/"/g, '""')}"`,
      `"${(log.details || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `سجل_عمليات_الرقابة_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    printAuditLogsReport(filteredLogs, settings, selectedCategory);
  };

  const handleClear = async () => {
    if (!isAdmin) {
      alert('يتطلب مسح سجل العمليات تفعيل وضع الأدمن.');
      return;
    }
    if (window.confirm('تحذير: هل أنت متأكد من رغبتك في تفريغ سجل العمليات بالكامل؟ لا يمكن التراجع عن هذا الإجراء.')) {
      await onClearLogs();
    }
  };

  // Helper for badge color and icon
  const getActionMeta = (log: AuditLog) => {
    if (log.action === 'create_section') {
      return {
        icon: <FolderPlus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
        bg: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        label: 'إضافة قسم',
      };
    }
    if (log.action === 'update_section') {
      return {
        icon: <FolderKanban className="w-5 h-5 text-sky-600 dark:text-sky-400" />,
        bg: 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
        label: 'تعديل قسم',
      };
    }
    if (log.action === 'delete_section') {
      return {
        icon: <FolderMinus className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
        bg: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
        label: 'حذف قسم',
      };
    }
    if (log.action === 'create_item') {
      return {
        icon: <FilePlus className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
        bg: 'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
        label: 'إضافة عهدة',
      };
    }
    if (log.action === 'update_item') {
      return {
        icon: <FileEdit className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
        bg: 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        label: 'تعديل عهدة',
      };
    }
    if (log.action === 'delete_item') {
      return {
        icon: <FileX className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
        bg: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
        label: 'حذف عهدة',
      };
    }
    if (log.action === 'settings_update') {
      return {
        icon: <Settings className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
        bg: 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
        label: 'تعديل إعدادات',
      };
    }
    if (log.action === 'admin_access') {
      return {
        icon: <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
        bg: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
        label: 'دخول الأدمن',
      };
    }
    if (log.action === 'backup_export' || log.action === 'backup_import' || log.action === 'reset_data') {
      return {
        icon: <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
        bg: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
        label: 'نسخ احتياطي',
      };
    }

    return {
      icon: <ShieldCheck className="w-5 h-5 text-slate-600 dark:text-slate-400" />,
      bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
      label: 'إجراء نظام',
    };
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            id="audit-log-back-btn"
            onClick={onBack}
            className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
            title="العودة لأقسام العهد"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للعهد والأقسام</span>
          </button>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span>سجل العمليات والرقابة الإدارية (Audit Log)</span>
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                {filteredLogs.length} عملية موثقة
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              توثيق زمني غير قابل للتعديل لكل إجراءات الإضافة والحذف والتعديل التي يقوم بها الأدمن لتعزيز الشفافية
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={handleManualRefresh}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs transition-colors"
            title="تحديث السجل"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-teal-600' : ''}`} />
          </button>

          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
            title="تصدير كملف إكسل CSV"
          >
            <Download className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span className="hidden md:inline">تصدير CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
            title="طباعة تقرير الرقابة الرسمي"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>طباعة التقرير</span>
          </button>

          {isAdmin && (
            <button
              onClick={handleClear}
              className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-800/60 transition-colors"
              title="مسح سجل العمليات (صلاحية الأدمن فقط)"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => setSelectedCategory('all')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-teal-50/80 dark:bg-teal-950/40 border-teal-500 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>كافة الإجراءات</span>
            <Layers className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {stats.total}
          </div>
          <div className="text-[11px] text-teal-600 dark:text-teal-400 font-medium mt-0.5">
            إجمالي العمليات الرقابية
          </div>
        </div>

        <div
          onClick={() => setSelectedCategory('section')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            selectedCategory === 'section'
              ? 'bg-sky-50/80 dark:bg-sky-950/40 border-sky-500 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>إدارة الأقسام</span>
            <FolderKanban className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {stats.sectionCount}
          </div>
          <div className="text-[11px] text-sky-600 dark:text-sky-400 font-medium mt-0.5">
            إنشاء، تعديل، وحذف أقسام
          </div>
        </div>

        <div
          onClick={() => setSelectedCategory('item')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            selectedCategory === 'item'
              ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>المستندات والملفات</span>
            <FileEdit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {stats.itemCount}
          </div>
          <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">
            إضافة وتعديل وحذف العهد
          </div>
        </div>

        <div
          onClick={() => setSelectedCategory('security')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            selectedCategory === 'security'
              ? 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-500 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>الأمان والنظام</span>
            <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {stats.securityCount + stats.backupCount}
          </div>
          <div className="text-[11px] text-purple-600 dark:text-purple-400 font-medium mt-0.5">
            تسجيلات دخول ونسخ احتياطي
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في سجل العمليات: اسم القسم، المستند، الإجراء، أو التفاصيل..."
              className="w-full pr-10 pl-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                مسح
              </button>
            )}
          </div>

          {/* Action Type Filter */}
          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs text-slate-400 shrink-0">نوع الإجراء:</span>
            <button
              onClick={() => setSelectedActionType('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                selectedActionType === 'all'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setSelectedActionType('create')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                selectedActionType === 'create'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
              }`}
            >
              إضافة
            </button>
            <button
              onClick={() => setSelectedActionType('update')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                selectedActionType === 'update'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100'
              }`}
            >
              تعديل
            </button>
            <button
              onClick={() => setSelectedActionType('delete')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                selectedActionType === 'delete'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100'
              }`}
            >
              حذف
            </button>
          </div>

          {/* Time range & Sort */}
          <div className="flex items-center gap-2 shrink-0">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">كافة الفترات</option>
              <option value="today">اليوم (آخر 24 ساعة)</option>
              <option value="week">آخر 7 أيام</option>
              <option value="month">آخر 30 يوماً</option>
            </select>

            <button
              onClick={() => setSortOrder(s => (s === 'desc' ? 'asc' : 'desc'))}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-medium"
              title={sortOrder === 'desc' ? 'الترتيب: الأحدث أولاً' : 'الترتيب: الأقدم أولاً'}
            >
              {sortOrder === 'desc' ? 'الأحدث أولاً' : 'الأقدم أولاً'}
            </button>
          </div>
        </div>
      </div>

      {/* Audit Log Timeline / List */}
      <div className="space-y-3">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log) => {
            const meta = getActionMeta(log);

            return (
              <div
                key={log.id}
                className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className={`p-2.5 rounded-2xl shrink-0 border ${meta.bg}`}>
                    {meta.icon}
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${meta.bg}`}>
                        {meta.label}
                      </span>
                      
                      <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                        {log.title}
                      </h4>

                      {log.sectionName && (
                        <span className="px-2 py-0.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-xs font-medium border border-teal-200 dark:border-teal-800/60">
                          قسم: {log.sectionName}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-0.5">
                      {log.details}
                    </p>

                    {log.targetName && (
                      <div className="text-[11px] text-slate-400 font-medium">
                        العنصر المستهدف: <span className="text-slate-600 dark:text-slate-300 font-bold">{log.targetName}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Left metadata: User & Timestamp */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800 gap-1.5 shrink-0 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-xl">
                    <UserCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span>{log.performedBy}</span>
                  </div>

                  <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatDateArabic(log.timestamp)}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          /* Empty state */
          <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
              لا توجد عمليات تطابق البحث أو الفلاتر المحددة
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              جرب تغيير كلمات البحث أو إعادة ضبط تصفية الفترات الزمنية لعرض كافة السجلات.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedActionType('all');
                setSelectedTimeRange('all');
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs"
            >
              إعادة ضبط الفلاتر
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
