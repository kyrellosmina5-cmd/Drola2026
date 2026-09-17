/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Section, CustodyItem, PharmacySettings, FileType, AuditLog } from './types';
import {
  getSections,
  saveSection,
  deleteSection,
  getCustodyItems,
  saveCustodyItem,
  deleteCustodyItem,
  getSettings,
  saveSettings,
  getAuditLogs,
  addAuditLog,
  clearAuditLogs,
  INITIAL_SECTIONS,
  INITIAL_ITEMS,
} from './utils/storage';
import { Header } from './components/Header';
import { DashboardStats } from './components/DashboardStats';
import { SectionCard } from './components/SectionCard';
import { SectionDetailView } from './components/SectionDetailView';
import { AuditLogView } from './components/AuditLogView';
import { UploadModal } from './components/UploadModal';
import { SectionModal } from './components/SectionModal';
import { FilePreviewModal } from './components/FilePreviewModal';
import { CloudSyncModal } from './components/CloudSyncModal';
import { SettingsModal } from './components/SettingsModal';
import { PinModal } from './components/PinModal';
import { QrModal } from './components/QrModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { printComprehensiveReport } from './utils/printReport';
import { Plus, FolderPlus, ShieldCheck, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface DeleteConfirmTarget {
  type: 'section' | 'item';
  id: string;
  title: string;
  itemName: string;
  itemTypeLabel: 'قسم' | 'مستند';
  warningText?: string;
  badgeInfo?: string;
}

export default function App() {
  // State
  const [sections, setSections] = useState<Section[]>([]);
  const [items, setItems] = useState<CustodyItem[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [currentView, setCurrentView] = useState<'custody' | 'audit_log'>('custody');
  const [settings, setSettings] = useState<PharmacySettings>({
    pharmacyName: 'صيدلية الرعاية المتكاملة',
    branchName: 'الفرع الرئيسي - قسم العهد والرقابة الدوائية',
    licenseNumber: 'PH-2026-8891',
    adminPin: '1234',
    enablePinProtection: false,
  });

  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(true); // Default true for owner/admin convenience
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'all' | FileType>('all');

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [editingItem, setEditingItem] = useState<CustodyItem | null>(null);
  const [previewItem, setPreviewItem] = useState<CustodyItem | null>(null);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteConfirmTarget | null>(null);
  const [qrModal, setQrModal] = useState<{ isOpen: boolean; url: string; title: string }>({
    isOpen: false,
    url: '',
    title: '',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Target section for quick upload
  const [targetUploadSectionId, setTargetUploadSectionId] = useState<string | undefined>(undefined);

  // Initialize theme & online listener
  useEffect(() => {
    // Dark mode check
    const savedTheme = localStorage.getItem('pharma_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }

    // Online/offline check
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load initial data
    loadAllData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [secList, itemList, setObj, logList] = await Promise.all([
        getSections(),
        getCustodyItems(),
        getSettings(),
        getAuditLogs(),
      ]);
      setSections(secList);
      setItems(itemList);
      setSettings(setObj);
      setLogs(logList);
    } catch (err) {
      console.error('Failed to load database:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleDarkMode = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('pharma_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('pharma_theme', 'light');
    }
  };

  const handleToggleAdmin = async () => {
    if (isAdmin) {
      // Switching to view-only mode
      setIsAdmin(false);
    } else {
      // If PIN is enabled, require PIN
      if (settings.enablePinProtection) {
        setIsPinModalOpen(true);
      } else {
        setIsAdmin(true);
        await addAuditLog({
          action: 'admin_access',
          category: 'security',
          title: 'تفعيل صلاحيات الأدمن',
          details: 'تم الانتقال إلى وضع الإدارة والتحكم الكامل في إضافة وتعديل وحذف الأقسام والعهد.',
          performedBy: 'الأدمن المشرف',
        });
        const updatedLogs = await getAuditLogs();
        setLogs(updatedLogs);
      }
    }
  };

  // Section CRUD
  const handleSaveSection = async (section: Section) => {
    const isExisting = sections.some(s => s.id === section.id);
    await saveSection(section);
    
    // Log Section Action
    await addAuditLog({
      action: isExisting ? 'update_section' : 'create_section',
      category: 'section',
      title: isExisting ? `تعديل قسم: ${section.name}` : `إضافة قسم جديد: ${section.name}`,
      details: isExisting
        ? `تم تحديث بيانات القسم والمسؤول (${section.responsiblePerson || 'غير محدد'}) والأيقونة.`
        : `تم تأسيس قسم عهدة جديد وتعيين المسؤول (${section.responsiblePerson || 'غير محدد'}).`,
      targetId: section.id,
      targetName: section.name,
      sectionName: section.name,
      performedBy: 'الأدمن المشرف',
    });

    const [updated, updatedLogs] = await Promise.all([getSections(), getAuditLogs()]);
    setSections(updated);
    setLogs(updatedLogs);
    if (selectedSection && selectedSection.id === section.id) {
      setSelectedSection(section);
    }
    showToast(isExisting ? `تم تعديل بيانات قسم "${section.name}" بنجاح.` : `تمت إضافة قسم "${section.name}" بنجاح.`);
  };

  const handleDeleteSection = (sectionId: string) => {
    const targetSection = sections.find(s => s.id === sectionId);
    const attachedItems = items.filter(i => i.sectionId === sectionId);
    setDeleteTarget({
      type: 'section',
      id: sectionId,
      title: 'تأكيد حذف قسم العهدة',
      itemName: targetSection?.name || 'هذا القسم',
      itemTypeLabel: 'قسم',
      badgeInfo: `${attachedItems.length} مستند وملف مرتبط`,
      warningText: `سيتم حذف قسم "${targetSection?.name || 'هذا القسم'}" وكافة الملفات والمستندات المرتبطة به (${attachedItems.length} ملف) نهائياً من قاعدة البيانات وسجل الرقابة.`,
    });
  };

  // Custody Item CRUD
  const handleSaveCustodyItem = async (item: CustodyItem) => {
    const isExisting = items.some(i => i.id === item.id);
    const sec = sections.find(s => s.id === item.sectionId);
    await saveCustodyItem(item);

    // Log Custody Item Action
    await addAuditLog({
      action: isExisting ? 'update_item' : 'create_item',
      category: 'item',
      title: isExisting ? `تعديل مستند: ${item.title}` : `إضافة مستند: ${item.title}`,
      details: isExisting
        ? `تم تعديل بيانات العهدة كود ${item.custodyNumber} (نوع: ${item.type}) في قسم "${sec?.name || ''}".`
        : `تم رفع وتوثيق مستند عهدة جديد كود ${item.custodyNumber} (نوع: ${item.type}) في قسم "${sec?.name || ''}".`,
      targetId: item.id,
      targetName: item.title,
      sectionName: sec?.name,
      performedBy: 'الأدمن المشرف',
    });

    const [updated, updatedLogs] = await Promise.all([getCustodyItems(), getAuditLogs()]);
    setItems(updated);
    setLogs(updatedLogs);
    showToast(isExisting ? `تم تحديث مستند العهدة "${item.title}" بنجاح.` : `تمت إضافة وتوثيق "${item.title}" في العهدة بنجاح.`);
  };

  const handleDeleteCustodyItem = (itemId: string) => {
    const targetItem = items.find(i => i.id === itemId);
    const sec = sections.find(s => s.id === targetItem?.sectionId);
    setDeleteTarget({
      type: 'item',
      id: itemId,
      title: 'تأكيد حذف مستند من العهدة',
      itemName: targetItem?.title || 'هذا المستند',
      itemTypeLabel: 'مستند',
      badgeInfo: targetItem?.custodyNumber ? `كود العهدة: #${targetItem.custodyNumber}` : undefined,
      warningText: `سيتم حذف مستند "${targetItem?.title || 'هذا المستند'}" نهائياً من قسم "${sec?.name || 'العهدة'}". هذا الإجراء موثق في سجل الرقابة.`,
    });
  };

  // Unified Delete Execution (Modal confirmed)
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'section') {
      const sectionId = deleteTarget.id;
      const targetSection = sections.find(s => s.id === sectionId);
      const attachedItems = items.filter(i => i.sectionId === sectionId);

      await deleteSection(sectionId);

      // Log Section Deletion
      await addAuditLog({
        action: 'delete_section',
        category: 'section',
        title: `حذف قسم: ${targetSection?.name || sectionId}`,
        details: `تم حذف القسم وكافة مستنداته وملفاته المرفقة نهائياً (${attachedItems.length} مستند/ملف).`,
        targetId: sectionId,
        targetName: targetSection?.name,
        sectionName: targetSection?.name,
        performedBy: 'الأدمن المشرف',
      });

      const [updatedSecs, updatedItems, updatedLogs] = await Promise.all([
        getSections(),
        getCustodyItems(),
        getAuditLogs(),
      ]);
      setSections(updatedSecs);
      setItems(updatedItems);
      setLogs(updatedLogs);
      if (selectedSection && selectedSection.id === sectionId) {
        setSelectedSection(null);
      }
      showToast(`تم حذف قسم "${targetSection?.name || ''}" بنجاح.`);
    } else {
      const itemId = deleteTarget.id;
      const targetItem = items.find(i => i.id === itemId);
      const sec = sections.find(s => s.id === targetItem?.sectionId);

      await deleteCustodyItem(itemId);

      // Log Item Deletion
      await addAuditLog({
        action: 'delete_item',
        category: 'item',
        title: `حذف مستند: ${targetItem?.title || itemId}`,
        details: `تم حذف مستند العهدة كود ${targetItem?.custodyNumber || ''} نهائياً من قسم "${sec?.name || ''}".`,
        targetId: itemId,
        targetName: targetItem?.title,
        sectionName: sec?.name,
        performedBy: 'الأدمن المشرف',
      });

      const [updated, updatedLogs] = await Promise.all([getCustodyItems(), getAuditLogs()]);
      setItems(updated);
      setLogs(updatedLogs);
      showToast(`تم حذف مستند العهدة "${targetItem?.title || ''}" بنجاح.`);
    }
  };

  // Quick Upload
  const handleOpenUpload = (section?: Section) => {
    setEditingItem(null);
    setTargetUploadSectionId(section ? section.id : (selectedSection?.id || sections[0]?.id));
    setIsUploadModalOpen(true);
  };

  // Quick Edit Item
  const handleEditItem = (item: CustodyItem) => {
    setEditingItem(item);
    setTargetUploadSectionId(item.sectionId);
    setIsUploadModalOpen(true);
  };

  // Quick Section Edit
  const handleOpenEditSection = (section: Section) => {
    setEditingSection(section);
    setIsSectionModalOpen(true);
  };

  const handleOpenNewSection = () => {
    setEditingSection(null);
    setIsSectionModalOpen(true);
  };

  // Reset to default initial seed
  const handleResetData = async () => {
    for (const s of INITIAL_SECTIONS) {
      await saveSection(s);
    }
    for (const item of INITIAL_ITEMS) {
      await saveCustodyItem(item);
    }
    await addAuditLog({
      action: 'reset_data',
      category: 'backup',
      title: 'إعادة ضبط البيانات للوضع الافتراضي',
      details: 'تم استرجاع نموذج الأقسام والمستندات والعهد الافتراضية الأولية للنظام.',
      performedBy: 'الأدمن المشرف',
    });
    await loadAllData();
  };

  const handleClearAuditLogs = async () => {
    await clearAuditLogs();
    setLogs([]);
  };

  const handleRefreshLogs = async () => {
    const updated = await getAuditLogs();
    setLogs(updated);
  };

  // Print handlers
  const handlePrintAll = () => {
    printComprehensiveReport(sections, items, settings);
  };

  const handlePrintSection = (section: Section) => {
    printComprehensiveReport(sections, items, settings, section);
  };

  // Filter sections by search and type
  const filteredSections = sections.filter(sec => {
    const secItems = items.filter(i => i.sectionId === sec.id);

    // If type filter is active, only show sections that contain at least one matching item
    if (selectedTypeFilter !== 'all') {
      const hasMatchingType = secItems.some(i => i.type === selectedTypeFilter);
      if (!hasMatchingType) return false;
    }

    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    const matchesSection =
      sec.name.toLowerCase().includes(q) ||
      (sec.description && sec.description.toLowerCase().includes(q)) ||
      (sec.responsiblePerson && sec.responsiblePerson.toLowerCase().includes(q));

    const matchesAnyItem = secItems.some(
      item =>
        item.title.toLowerCase().includes(q) ||
        (item.custodyNumber && item.custodyNumber.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q))
    );

    return matchesSection || matchesAnyItem;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* App Header */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        isAdmin={isAdmin}
        onToggleAdmin={handleToggleAdmin}
        isOnline={isOnline}
        settings={settings}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onPrintAll={handlePrintAll}
        currentView={currentView}
        onSelectView={(v) => {
          setCurrentView(v);
          if (v === 'audit_log') setSelectedSection(null);
        }}
        logsCount={logs.length}
        onOpenNewSection={handleOpenNewSection}
        onOpenNewUpload={() => handleOpenUpload()}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Dedicated Audit Log Page View */}
        {currentView === 'audit_log' ? (
          <AuditLogView
            logs={logs}
            settings={settings}
            isAdmin={isAdmin}
            onBack={() => setCurrentView('custody')}
            onClearLogs={handleClearAuditLogs}
            onRefreshLogs={handleRefreshLogs}
          />
        ) : selectedSection ? (
          /* If a section is selected, show its full dedicated custody view */
          <SectionDetailView
            section={selectedSection}
            items={items.filter(i => i.sectionId === selectedSection.id)}
            isAdmin={isAdmin}
            onBack={() => setSelectedSection(null)}
            onUploadItem={handleOpenUpload}
            onEditSection={handleOpenEditSection}
            onDeleteSection={handleDeleteSection}
            onPreviewItem={(item) => setPreviewItem(item)}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteCustodyItem}
            onPrintSection={handlePrintSection}
            onShowQr={(url, title) => setQrModal({ isOpen: true, url, title })}
          />
        ) : (
          /* Main Dashboard: Stats + All Sections Grid */
          <div className="space-y-6">
            
            {/* Top Dashboard Metrics & Search */}
            <DashboardStats
              sections={sections}
              items={items}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedTypeFilter={selectedTypeFilter}
              onTypeFilterChange={setSelectedTypeFilter}
              isAdmin={isAdmin}
              onAddNewSection={handleOpenNewSection}
              onAddNewItem={() => handleOpenUpload()}
            />

            {/* Sections Grid Title & Quick Action */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>أقسام العهد الصيدلية</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                    {filteredSections.length} من أصل {sections.length}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  انقر على أيقونة أي قسم لإدارة واستعراض ورفع ملفات الـ PDF، الصور، الفيديوهات، والروابط
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="add-section-top-btn"
                  onClick={handleOpenNewSection}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm shadow-teal-600/20 transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة قسم</span>
                </button>
              </div>
            </div>

            {/* Grid of Sections */}
            {filteredSections.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredSections.map(sec => (
                  <SectionCard
                    key={sec.id}
                    section={sec}
                    items={items.filter(i => i.sectionId === sec.id)}
                    isAdmin={isAdmin}
                    onSelect={(s) => setSelectedSection(s)}
                    onEdit={handleOpenEditSection}
                    onDelete={handleDeleteSection}
                    onQuickUpload={handleOpenUpload}
                    onPrintSection={handlePrintSection}
                  />
                ))}

                {/* Add New Section Card placeholder */}
                <div
                  id="add-new-section-card"
                  onClick={handleOpenNewSection}
                  className="group border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-teal-500 rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer min-h-[220px] transition-all bg-slate-50/50 dark:bg-slate-900/30 hover:bg-teal-50/20 dark:hover:bg-teal-950/20"
                >
                  <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-teal-500 group-hover:text-white flex items-center justify-center mb-3 transition-colors shadow-sm">
                    <FolderPlus className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-bold text-slate-800 dark:text-slate-200 group-hover:text-teal-600 transition-colors">
                    إنشاء قسم عهدة جديد
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    اختر أيقونة القسم المناسبة، سمّها، وحدد صيدلي العهدة للبدء في رفع الملفات
                  </p>
                </div>
              </div>
            ) : (
              /* No matching search results */
              <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
                  لم يتم العثور على أية أقسام تطابق معايير البحث
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                  جرب البحث بكلمة أخرى أو قم بإلغاء تصفيات نوع الملف للرجوع لكافة الأقسام.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedTypeFilter('all'); }}
                  className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs"
                >
                  إعادة ضبط البحث
                </button>
              </div>
            )}

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>نظام مراقبة عهد الصيدلة - متوافق مع Android و iOS ويدعم العمل دون إنترنت (Offline-First)</span>
          </div>
          <div>
            <span>{settings.pharmacyName} • {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => { setIsUploadModalOpen(false); setEditingItem(null); }}
        onSave={handleSaveCustodyItem}
        sections={sections}
        defaultSectionId={targetUploadSectionId}
        editingItem={editingItem}
      />

      <SectionModal
        isOpen={isSectionModalOpen}
        onClose={() => { setIsSectionModalOpen(false); setEditingSection(null); }}
        onSave={handleSaveSection}
        editingSection={editingSection}
        sectionsCount={sections.length}
      />

      <FilePreviewModal
        item={previewItem}
        sectionName={sections.find(s => s.id === previewItem?.sectionId)?.name}
        onClose={() => setPreviewItem(null)}
        onDelete={handleDeleteCustodyItem}
      />

      <CloudSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        isOnline={isOnline}
        sections={sections}
        items={items}
        settings={settings}
        onDataRestored={loadAllData}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSaveSettings={async (newSet) => {
          await saveSettings(newSet);
          setSettings(newSet);
          await addAuditLog({
            action: 'settings_update',
            category: 'settings',
            title: 'تعديل إعدادات الصيدلية والرقابة',
            details: `تم تحديث بيانات المنشأة: ${newSet.pharmacyName} - ${newSet.branchName}.`,
            performedBy: 'الأدمن المشرف',
          });
          const updatedLogs = await getAuditLogs();
          setLogs(updatedLogs);
        }}
        onResetData={handleResetData}
      />

      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={async () => {
          setIsAdmin(true);
          await addAuditLog({
            action: 'admin_access',
            category: 'security',
            title: 'تسجيل دخول وتفعيل وضع الإدمن',
            details: 'تم التحقق بنجاح من الرمز السري للأدمن وتفعيل صلاحيات التعديل والحذف الكاملة.',
            performedBy: 'الأدمن المشرف',
          });
          const updatedLogs = await getAuditLogs();
          setLogs(updatedLogs);
        }}
        correctPin={settings.adminPin}
      />

      <QrModal
        isOpen={qrModal.isOpen}
        onClose={() => setQrModal({ isOpen: false, url: '', title: '' })}
        url={qrModal.url}
        title={qrModal.title}
      />

      {/* Delete Confirmation Modal (Active & Iframe-Safe) */}
      <DeleteConfirmModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title={deleteTarget?.title || 'تأكيد الحذف'}
        itemName={deleteTarget?.itemName || ''}
        itemTypeLabel={deleteTarget?.itemTypeLabel || 'عنصر'}
        warningText={deleteTarget?.warningText}
        badgeInfo={deleteTarget?.badgeInfo}
      />

      {/* Instant Action Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl border border-slate-700/50 dark:border-slate-300 font-bold text-xs sm:text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

    </div>
  );
}
