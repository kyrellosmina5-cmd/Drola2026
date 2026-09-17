import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Moon,
  Sun,
  Cloud,
  CloudOff,
  Printer,
  Settings,
  Lock,
  Unlock,
  RefreshCw,
  FolderArchive,
  ClipboardList,
  Plus,
  FileUp,
  Share2,
} from 'lucide-react';
import { PharmacySettings } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  isOnline: boolean;
  settings: PharmacySettings;
  onOpenSyncModal: () => void;
  onOpenSettingsModal: () => void;
  onPrintAll: () => void;
  currentView: 'custody' | 'audit_log';
  onSelectView: (view: 'custody' | 'audit_log') => void;
  logsCount: number;
  onOpenNewSection: () => void;
  onOpenNewUpload: () => void;
  onOpenShareModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  isAdmin,
  onToggleAdmin,
  isOnline,
  settings,
  onOpenSyncModal,
  onOpenSettingsModal,
  onPrintAll,
  currentView,
  onSelectView,
  logsCount,
  onOpenNewSection,
  onOpenNewUpload,
  onOpenShareModal,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-3">
          
          {/* Right side: Brand & Title */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => onSelectView('custody')}
              className="cursor-pointer relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-md shadow-teal-500/20"
            >
              <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 
                  onClick={() => onSelectView('custody')}
                  className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight cursor-pointer"
                >
                  مراقبة عهد الصيدلة
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60">
                  نظام الرقابة السحابي
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px] sm:max-w-md">
                {settings.pharmacyName} - {settings.branchName}
              </p>
            </div>
          </div>

          {/* Navigation View Switcher (Desktop & Mobile) */}
          <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200 dark:border-slate-700/80 text-xs font-bold">
            <button
              id="header-nav-custody"
              onClick={() => onSelectView('custody')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                currentView === 'custody'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FolderArchive className="w-4 h-4" />
              <span>لوحة العهد والأقسام</span>
            </button>
            <button
              id="header-nav-audit-log"
              onClick={() => onSelectView('audit_log')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                currentView === 'audit_log'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>سجل العمليات والرقابة</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 font-black">
                {logsCount}
              </span>
            </button>
          </div>

          {/* Direct Quick Add Buttons in Header */}
          <div className="flex items-center gap-1.5">
            <button
              id="header-add-section-btn"
              onClick={onOpenNewSection}
              title="إضافة قسم عهدة جديد"
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm shadow-teal-600/20 transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">إضافة قسم</span>
              <span className="sm:hidden">قسم</span>
            </button>

            <button
              id="header-add-item-btn"
              onClick={onOpenNewUpload}
              title="رفع مستند أو عهدة جديدة (PDF، صورة، فيديو، رابط)"
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-600/20 transition-all active:scale-95"
            >
              <FileUp className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">إضافة عهدة</span>
              <span className="sm:hidden">عهدة</span>
            </button>
          </div>

          {/* Left side: Controls & Badges */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Mobile View Toggle Button */}
            <button
              id="header-mobile-audit-btn"
              onClick={() => onSelectView(currentView === 'custody' ? 'audit_log' : 'custody')}
              title={currentView === 'custody' ? 'سجل عمليات الرقابة (Audit Log)' : 'لوحة العهد والأقسام'}
              className={`md:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                currentView === 'audit_log'
                  ? 'bg-teal-600 text-white border-teal-700'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>{currentView === 'custody' ? 'السجل' : 'العهد'}</span>
            </button>

            {/* Online/Offline Badge */}
            <button
              id="header-cloud-sync-btn"
              onClick={onOpenSyncModal}
              title={isOnline ? 'متصل بالسحابة (انقر لخيارات النسخ الاحتياطي والمزامنة)' : 'وضع عدم الاتصال (البيانات محفوظة محلياً بالكامل)'}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                isOnline
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60 hover:bg-amber-100'
              }`}
            >
              {isOnline ? (
                <>
                  <Cloud className="w-3.5 h-3.5 animate-pulse text-emerald-600 dark:text-emerald-400" />
                  <span className="hidden lg:inline">مزامنة سحابية</span>
                </>
              ) : (
                <>
                  <CloudOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span className="hidden lg:inline">محلي</span>
                </>
              )}
            </button>

            {/* Admin Toggle */}
            <button
              id="header-admin-toggle-btn"
              onClick={onToggleAdmin}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                isAdmin
                  ? 'bg-rose-500 text-white border-rose-600 shadow-sm shadow-rose-500/20 hover:bg-rose-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              title={isAdmin ? 'وضع الإدمن نشط (يمكنك التعديل والحذف والإضافة)' : 'انقر للتبديل لوضع الإدمن'}
            >
              {isAdmin ? (
                <>
                  <Unlock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>إدمن</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                  <span>استعراض</span>
                </>
              )}
            </button>

            {/* Print All Button */}
            {currentView === 'custody' && (
              <button
                id="header-print-all-btn"
                onClick={onPrintAll}
                title="طباعة التقرير الشامل لجميع العهد"
                className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 text-xs sm:text-sm"
              >
                <Printer className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="hidden xl:inline font-medium">طباعة التقرير</span>
              </button>
            )}

            {/* Share and Publish Button */}
            <button
              id="header-share-btn"
              onClick={onOpenShareModal}
              title="نشر ومشاركة رابط المنظومة عبر واتساب وتيليجرام وQR Code"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800/80 text-xs font-bold transition-all active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span className="hidden sm:inline">نشر وشير</span>
            </button>

            {/* PWA Install Button */}
            <PWAInstallButton variant="header" />

            {/* Settings Button */}
            <button
              id="header-settings-btn"
              onClick={onOpenSettingsModal}
              title="إعدادات الصيدلية والنسخ الاحتياطي"
              className="p-2 rounded-xl text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              id="header-theme-toggle-btn"
              onClick={onToggleDarkMode}
              title={darkMode ? 'التحويل إلى الوضع النهاري' : 'التحويل إلى الوضع الليلي'}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
