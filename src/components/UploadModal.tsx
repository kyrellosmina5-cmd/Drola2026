import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Upload,
  FileText,
  Image as ImageIcon,
  Video,
  Link2,
  CheckCircle2,
  AlertCircle,
  FileUp
} from 'lucide-react';
import { CustodyItem, Section, FileType, CustodyStatus } from '../types';
import { formatBytes, readFileAsDataUrl } from '../utils/fileHelpers';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: CustodyItem) => Promise<void>;
  sections: Section[];
  defaultSectionId?: string;
  editingItem?: CustodyItem | null;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onSave,
  sections,
  defaultSectionId,
  editingItem,
}) => {
  const [selectedType, setSelectedType] = useState<FileType>('pdf');
  const [sectionId, setSectionId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [custodyNumber, setCustodyNumber] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [addedBy, setAddedBy] = useState('');
  const [status, setStatus] = useState<CustodyStatus>('active');

  // File state
  const [fileData, setFileData] = useState<string | undefined>(undefined);
  const [fileName, setFileName] = useState<string | undefined>(undefined);
  const [fileSize, setFileSize] = useState<number | undefined>(undefined);
  const [mimeType, setMimeType] = useState<string | undefined>(undefined);

  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize or reset state
  useEffect(() => {
    if (editingItem) {
      setSelectedType(editingItem.type);
      setSectionId(editingItem.sectionId);
      setTitle(editingItem.title);
      setCustodyNumber(editingItem.custodyNumber || '');
      setDescription(editingItem.description || '');
      setUrl(editingItem.url || '');
      setAddedBy(editingItem.addedBy || '');
      setStatus(editingItem.status);
      setFileData(editingItem.fileData);
      setFileName(editingItem.fileName);
      setFileSize(editingItem.fileSize);
      setMimeType(editingItem.mimeType);
    } else {
      setSelectedType('pdf');
      setSectionId(defaultSectionId || (sections[0]?.id || ''));
      setTitle('');
      setCustodyNumber('');
      setDescription('');
      setUrl('');
      setAddedBy('');
      setStatus('active');
      setFileData(undefined);
      setFileName(undefined);
      setFileSize(undefined);
      setMimeType(undefined);
    }
    setErrorMessage('');
  }, [editingItem, defaultSectionId, sections, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = async (file: File) => {
    try {
      setErrorMessage('');
      setFileName(file.name);
      setFileSize(file.size);
      setMimeType(file.type);

      // Auto-set title if empty
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }

      const dataUrl = await readFileAsDataUrl(file);
      setFileData(dataUrl);
    } catch (err) {
      setErrorMessage('حدث خطأ أثناء قراءة الملف، يرجى المحاولة مرة أخرى.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('يرجى كتابة اسم المستند أو العهدة');
      return;
    }

    if (!sectionId) {
      setErrorMessage('يرجى اختيار القسم التابع له');
      return;
    }

    if (selectedType === 'link' && !url.trim()) {
      setErrorMessage('يرجى كتابة الرابط الإلكتروني');
      return;
    }

    setIsSubmitting(true);
    try {
      let resolvedFileData = fileData;
      let resolvedFileName = fileName;
      let resolvedFileSize = fileSize;
      let resolvedMimeType = mimeType;

      // If user is adding an item without uploading a raw file, create a standardized official digital custody slip
      if (selectedType !== 'link' && !resolvedFileData && !editingItem) {
        const recordText = `محضر استلام وتوثيق عهدة رسمية\n----------------------------------\nاسم المستند: ${title.trim()}\nالقسم: ${sections.find(s => s.id === sectionId)?.name || 'عام'}\nرقم كود العهدة: ${custodyNumber.trim() || 'سند-' + Date.now().toString().slice(-4)}\nالمسؤول: ${addedBy.trim() || 'إدارة الصيدلية'}\nالحالة: ${status}\nتاريخ التسجيل: ${new Date().toLocaleDateString('ar-EG')}\nالبيان والملاحظات: ${description.trim() || 'تم توثيق العهدة إلكترونياً بنجاح'}\n`;
        resolvedFileData = `data:text/plain;charset=utf-8,${encodeURIComponent(recordText)}`;
        resolvedFileName = `${title.trim().replace(/\s+/g, '_')}_محضر_عهدة.txt`;
        resolvedFileSize = new Blob([recordText]).size;
        resolvedMimeType = 'text/plain';
      }

      const item: CustodyItem = {
        id: editingItem ? editingItem.id : `item-${Date.now()}`,
        sectionId,
        title: title.trim(),
        type: selectedType,
        custodyNumber: custodyNumber.trim() || `سند-${Date.now().toString().slice(-4)}`,
        description: description.trim() || undefined,
        fileData: selectedType === 'link' ? undefined : resolvedFileData,
        fileName: selectedType === 'link' ? undefined : resolvedFileName,
        fileSize: selectedType === 'link' ? undefined : resolvedFileSize,
        mimeType: selectedType === 'link' ? undefined : resolvedMimeType,
        url: selectedType === 'link' ? url.trim() : undefined,
        status,
        addedBy: addedBy.trim() || 'إدارة الصيدلية',
        createdAt: editingItem ? editingItem.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await onSave(item);
      onClose();
    } catch (err) {
      setErrorMessage('فشل حفظ المستند، يرجى التحقق من المدخلات.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAcceptedFileTypes = () => {
    switch (selectedType) {
      case 'pdf':
        return '.pdf,application/pdf';
      case 'image':
        return 'image/*';
      case 'video':
        return 'video/*';
      default:
        return '*';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              {editingItem ? 'تعديل بيانات المستند / العهدة' : 'رفع مستند جديد للعهدة'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              اختر نوع الملف (PDF، صورة، فيديو، أو رابط) وأدخل تفاصيل السند
            </p>
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

          {/* Type Selector (Tabs) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              نوع الملف أو المحتوى المرفق:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              
              <button
                type="button"
                onClick={() => setSelectedType('pdf')}
                className={`flex items-center justify-center gap-2 p-3 rounded-2xl border font-bold text-xs transition-all ${
                  selectedType === 'pdf'
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-700 dark:text-rose-300 ring-2 ring-rose-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4 text-rose-500" />
                <span>ملف PDF</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedType('image')}
                className={`flex items-center justify-center gap-2 p-3 rounded-2xl border font-bold text-xs transition-all ${
                  selectedType === 'image'
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                }`}
              >
                <ImageIcon className="w-4 h-4 text-blue-500" />
                <span>صورة توثيقية</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedType('video')}
                className={`flex items-center justify-center gap-2 p-3 rounded-2xl border font-bold text-xs transition-all ${
                  selectedType === 'video'
                    ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 text-purple-700 dark:text-purple-300 ring-2 ring-purple-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                }`}
              >
                <Video className="w-4 h-4 text-purple-500" />
                <span>فيديو تدريبي</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedType('link')}
                className={`flex items-center justify-center gap-2 p-3 rounded-2xl border font-bold text-xs transition-all ${
                  selectedType === 'link'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                }`}
              >
                <Link2 className="w-4 h-4 text-emerald-500" />
                <span>رابط إلكتروني</span>
              </button>

            </div>
          </div>

          {/* File Upload Zone (For PDF, Image, Video) */}
          {selectedType !== 'link' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                الملف المرفوع:
              </label>

              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30'
                    : 'border-slate-300 dark:border-slate-700 hover:border-teal-400 bg-slate-50/60 dark:bg-slate-800/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={getAcceptedFileTypes()}
                  onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                  className="hidden"
                />

                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-2">
                  <FileUp className="w-6 h-6" />
                </div>

                {fileName ? (
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-xs mx-auto">
                      {fileName}
                    </div>
                    {fileSize && (
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        الحجم: {formatBytes(fileSize)}
                      </div>
                    )}
                    <span className="inline-block mt-2 text-xs font-bold text-teal-600 dark:text-teal-400 underline">
                      تغيير الملف
                    </span>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      انقر هنا لاختيار الملف، أو اسحبه وأفلته هنا
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      يدعم ملفات {selectedType === 'pdf' ? 'PDF الرسمية' : selectedType === 'image' ? 'الصور (JPG, PNG, WebP)' : 'الفيديوهات (MP4, MOV)'}
                    </p>
                  </div>
                )}
              </div>

              {/* Image Preview Thumbnail */}
              {selectedType === 'image' && fileData && (
                <div className="mt-2.5 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
                  <img src={fileData} alt="معاينة" className="max-h-40 rounded-xl object-contain" />
                </div>
              )}
            </div>
          )}

          {/* Link URL input */}
          {selectedType === 'link' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                الرابط الإلكتروني (URL):
              </label>
              <div className="relative">
                <Link2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/custody-doc"
                  className="w-full pr-10 pl-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-left direction-ltr text-slate-900 dark:text-white"
                  required={selectedType === 'link'}
                />
              </div>
            </div>
          )}

          {/* Title & Section Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                اسم المستند أو السند: <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: محضر استلام أدوية الطوارئ"
                className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                القسم التابع له: <span className="text-rose-500">*</span>
              </label>
              <select
                value={sectionId}
                onChange={(e) => setSectionId(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white"
                required
              >
                {sections.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Custody Code & Responsible Person */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                كود السند / رقم العهدة (اختياري):
              </label>
              <input
                type="text"
                value={custodyNumber}
                onChange={(e) => setCustodyNumber(e.target.value)}
                placeholder="مثال: EMG-2026-09"
                className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                المسؤول عن الإدخال / الصيدلي:
              </label>
              <input
                type="text"
                value={addedBy}
                onChange={(e) => setAddedBy(e.target.value)}
                placeholder="مثال: د. أحمد محمود"
                className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Status selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              حالة السند:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'active', label: 'ساري ونشط', color: 'text-emerald-600' },
                { id: 'inspected', label: 'تم الفحص والتصديق', color: 'text-teal-600' },
                { id: 'review_needed', label: 'يحتاج مراجعة', color: 'text-amber-600' },
                { id: 'archived', label: 'مؤرشف', color: 'text-slate-500' },
              ].map(s => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => setStatus(s.id as CustodyStatus)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                    status === s.id
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes / Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              ملاحظات وتفاصيل إضافية:
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="اكتب أية ملاحظات هامة تخص محضر الاستلام، حالة العبوة، تواريخ الصلاحية، إلخ..."
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white"
            />
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
              <span>{isSubmitting ? 'جاري الحفظ...' : editingItem ? 'تحديث المستند' : 'حفظ المستند بالعهدة'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
