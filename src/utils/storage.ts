import { Section, CustodyItem, PharmacySettings, AuditLog } from '../types';

const DB_NAME = 'PharmacyCustodyDB';
const DB_VERSION = 2;

// Default initial settings
export const DEFAULT_SETTINGS: PharmacySettings = {
  pharmacyName: 'صيدلية الرعاية المتكاملة',
  branchName: 'الفرع الرئيسي - قسم العهد والرقابة الدوائية',
  licenseNumber: 'PH-2026-8891',
  adminPin: '1234',
  enablePinProtection: false,
  lastSyncTime: new Date().toISOString(),
};

// Initial pharmacy custody sections
export const INITIAL_SECTIONS: Section[] = [
  {
    id: 'sec-emergency',
    name: 'عهدة أدوية الطوارئ والإنعاش',
    description: 'أدوية دولاب الصدمات (Crash Cart) وأمبولات الإنعاش القلبي والرئوي ومحاضر الاستعاضة',
    iconName: 'HeartPulse',
    color: 'emerald',
    responsiblePerson: 'د. أحمد محمود - صيدلي أول',
    location: 'جناح العناية المركزة والطوارئ',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    order: 1,
  },
  {
    id: 'sec-cold-chain',
    name: 'ثلاجة الأنسولين والأمصال (سلسلة التبريد)',
    description: 'سجلات درجات الحرارة اليومية للثلاجة ومراقبة صلاحيات الأنسولين، اللقاحات، وهرمونات النمو',
    iconName: 'Snowflake',
    color: 'teal',
    responsiblePerson: 'د. سارة خليل - مسؤولة سلسلة التبريد',
    location: 'غرفة التخزين البارد - ثلاجة A1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    order: 2,
  },
  {
    id: 'sec-narcotics',
    name: 'عهدة الأدوية المخدرة والمراقبة',
    description: 'دفاتر صرف الجداول والمؤثرات العقلية وروشتات الأطباء المعتمدة وأذون الصرف الرسمية',
    iconName: 'ShieldAlert',
    color: 'rose',
    responsiblePerson: 'د. محمد طارق - صيدلي إداري',
    location: 'الخزينة المحصنة (Safe Box)',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    order: 3,
  },
  {
    id: 'sec-inventory',
    name: 'سجلات الجرد الدوري والتسليم',
    description: 'كشوفات الجرد الربع سنوي، ومطابقة الرصيد الدفتري مع الفعلي، ومحاضر التسليم والتسلم',
    iconName: 'ClipboardCheck',
    color: 'blue',
    responsiblePerson: 'لجنة الجرد والمتابعة الدورية',
    location: 'مكتب الإدارة الصيدلية',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    order: 4,
  },
  {
    id: 'sec-equipment',
    name: 'أجهزة القياس والمعايرة والصيانة',
    description: 'عهدة أجهزة قياس السكر، أجهزة الضغط، موازين التركيبات، وشهادات المعايرة السنوية',
    iconName: 'Stethoscope',
    color: 'violet',
    responsiblePerson: 'د. حسام الدين - مهندس الأجهزة الطبية',
    location: 'المعمل وقسم الفحص السريع',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    order: 5,
  },
  {
    id: 'sec-suppliers',
    name: 'فواتير الموردين وأذون الإضافة',
    description: 'أذون استلام شركات الأدوية، فواتير التوريد الضريبية، ومستندات الإرجاع المنتهية الصلاحية',
    iconName: 'PackageCheck',
    color: 'amber',
    responsiblePerson: 'مسؤول المشتريات والمستودع',
    location: 'مستودع الاستلام الرئيسي',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    order: 6,
  }
];

// Seed items for demonstration
export const INITIAL_ITEMS: CustodyItem[] = [
  {
    id: 'item-1',
    sectionId: 'sec-emergency',
    title: 'محضر جرد دولاب الطوارئ (Crash Cart) - الربع الأول',
    type: 'pdf',
    custodyNumber: 'EMG-2026-001',
    description: 'فحص أمبولات الأدرينالين والأتروبين والتأكد من مطابقة تاريخ الصلاحية وسدادات الأمان البلاستيكية.',
    fileName: 'Crash_Cart_Audit_2026_Q1.pdf',
    fileSize: 425000,
    status: 'inspected',
    addedBy: 'د. أحمد محمود',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'item-2',
    sectionId: 'sec-emergency',
    title: 'صورة توثيق قفل الأمان ورقم السيريال لدولاب الصدمات',
    type: 'image',
    custodyNumber: 'EMG-SEAL-884',
    description: 'صورة توضيحية لسلامة القفل الأحمر وتأكيد عدم العبث بمحتويات العهدة.',
    fileName: 'seal_verification_badge.jpg',
    fileData: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230f766e"/><circle cx="300" cy="180" r="70" fill="%2314b8a6"/><text x="300" y="190" font-family="Arial" font-size="28" fill="white" text-anchor="middle" font-weight="bold">توثيق قفل العهدة رقم 884</text><text x="300" y="240" font-family="Arial" font-size="16" fill="%23ccfbf1" text-anchor="middle">صيدلية الطوارئ - سليم ومطابق</text></svg>',
    fileSize: 18400,
    status: 'active',
    addedBy: 'د. أحمد محمود',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'item-3',
    sectionId: 'sec-cold-chain',
    title: 'رابط المراقبة اللحظية لحساس حرارة الثلاجة الرقمي',
    type: 'link',
    custodyNumber: 'TEMP-SENSOR-IOT',
    description: 'بوابة المتابعة السحابية لدرجة حرارة ثلاجة الأمصال (يجب أن تظل بين 2 إلى 8 درجات مئوية).',
    url: 'https://smart-fridge.pharma-monitoring.org/sensor/A1',
    status: 'active',
    addedBy: 'د. سارة خليل',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'item-4',
    sectionId: 'sec-narcotics',
    title: 'دفتر السجلات الرسمي للمؤثرات العقلية والمسكنات المقيدة',
    type: 'pdf',
    custodyNumber: 'NARC-REG-2026',
    description: 'سجل وارد ومنصرف الأدوية الخاضعة للرقابة مع أرقام هويات المرضى وتوقيع الأطباء المشرفين.',
    fileName: 'Controlled_Substances_Register.pdf',
    fileSize: 850000,
    status: 'active',
    addedBy: 'د. محمد طارق',
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    id: 'item-5',
    sectionId: 'sec-equipment',
    title: 'فيديو توضيحي لطريقة معايرة وتنظيف جهاز فحص السكر التراكمي',
    type: 'video',
    custodyNumber: 'EQ-VID-04',
    description: 'دليل مرئي تفصيلي لخطوات المعايرة وضبط المحاليل القياسية لجهاز فحص الدم السريع.',
    fileName: 'HbA1c_Device_Calibration_Guide.mp4',
    fileSize: 3200000,
    status: 'active',
    addedBy: 'د. حسام الدين',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  }
];

// Initial audit logs to demonstrate historical administrative oversight
export const INITIAL_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    action: 'create_section',
    category: 'section',
    title: 'إضافة قسم: عهدة أدوية الطوارئ والإنعاش',
    details: 'تم تأسيس القسم وإسناد مسؤولية العهدة إلى د. أحمد محمود في جناح العناية المركزة.',
    performedBy: 'الأدمن المشرف',
    targetId: 'sec-emergency',
    targetName: 'عهدة أدوية الطوارئ والإنعاش',
    sectionName: 'عهدة أدوية الطوارئ والإنعاش',
    timestamp: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'log-2',
    action: 'create_item',
    category: 'item',
    title: 'إضافة مستند: محضر جرد دولاب الطوارئ',
    details: 'رفع ملف PDF رسمي للربع الأول مع اعتماد كود السند EMG-2026-001 وفحص أمبولات الأدرينالين.',
    performedBy: 'الأدمن المشرف',
    targetId: 'item-1',
    targetName: 'محضر جرد دولاب الطوارئ (Crash Cart) - الربع الأول',
    sectionName: 'عهدة أدوية الطوارئ والإنعاش',
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'log-3',
    action: 'create_item',
    category: 'item',
    title: 'توثيق صورة: قفل الأمان ورقم السيريال',
    details: 'رفع وتثبيت صورة توثيقية لسدادة أمان دولاب الصدمات كود EMG-SEAL-884.',
    performedBy: 'الأدمن المشرف',
    targetId: 'item-2',
    targetName: 'صورة توثيق قفل الأمان ورقم السيريال لدولاب الصدمات',
    sectionName: 'عهدة أدوية الطوارئ والإنعاش',
    timestamp: new Date(Date.now() - 86400000 * 2.5).toISOString(),
  },
  {
    id: 'log-4',
    action: 'update_section',
    category: 'section',
    title: 'تحديث بيانات قسم: ثلاجة الأنسولين والأمصال',
    details: 'تحديث جهة المسؤولية وتعيين د. سارة خليل للإشراف على سلسلة التبريد وثلاجة A1.',
    performedBy: 'الأدمن المشرف',
    targetId: 'sec-cold-chain',
    targetName: 'ثلاجة الأنسولين والأمصال (سلسلة التبريد)',
    sectionName: 'ثلاجة الأنسولين والأمصال (سلسلة التبريد)',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'log-5',
    action: 'create_item',
    category: 'item',
    title: 'إضافة رابط: المراقبة اللحظية لحساس حرارة الثلاجة',
    details: 'ربط بوابة المراقبة السحابية الذكية وتوليد رمز QR تلقائي للفحص عبر هواتف الجوال.',
    performedBy: 'الأدمن المشرف',
    targetId: 'item-3',
    targetName: 'رابط المراقبة اللحظية لحساس حرارة الثلاجة الرقمي',
    sectionName: 'ثلاجة الأنسولين والأمصال (سلسلة التبريد)',
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'log-6',
    action: 'admin_access',
    category: 'security',
    title: 'تسجيل دخول وتفعيل صلاحيات الإدمن',
    details: 'تم التحقق من هوية مسؤول النظام وتفعيل أذونات الإضافة والتعديل والحذف والرقابة.',
    performedBy: 'الأدمن المشرف',
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  }
];

// Open IndexedDB database
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains('sections')) {
        const sectionStore = db.createObjectStore('sections', { keyPath: 'id' });
        sectionStore.createIndex('order', 'order', { unique: false });
      }

      if (!db.objectStoreNames.contains('custody_items')) {
        const itemStore = db.createObjectStore('custody_items', { keyPath: 'id' });
        itemStore.createIndex('sectionId', 'sectionId', { unique: false });
        itemStore.createIndex('type', 'type', { unique: false });
      }

      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }

      if (!db.objectStoreNames.contains('audit_logs')) {
        const logStore = db.createObjectStore('audit_logs', { keyPath: 'id' });
        logStore.createIndex('timestamp', 'timestamp', { unique: false });
        logStore.createIndex('category', 'category', { unique: false });
      }
    };
  });
}

// Data access helpers with localStorage fallback
export async function getSections(): Promise<Section[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('sections', 'readonly');
      const store = transaction.objectStore('sections');
      const request = store.getAll();

      request.onsuccess = async () => {
        let results = request.result as Section[];
        const hasSeeded = typeof window !== 'undefined' ? localStorage.getItem('pharma_db_seeded') : null;
        if (!results || results.length === 0) {
          if (!hasSeeded) {
            await seedInitialData();
            if (typeof window !== 'undefined') localStorage.setItem('pharma_db_seeded', 'true');
            results = INITIAL_SECTIONS;
          } else {
            results = [];
          }
        }
        resolve(results.sort((a, b) => a.order - b.order));
      };
      request.onerror = () => reject(request.error);
    });
  } catch {
    // Fallback to localStorage
    const hasSeeded = typeof window !== 'undefined' ? localStorage.getItem('pharma_db_seeded') : null;
    const stored = localStorage.getItem('pharma_sections');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return INITIAL_SECTIONS;
      }
    }
    if (!hasSeeded) {
      localStorage.setItem('pharma_sections', JSON.stringify(INITIAL_SECTIONS));
      localStorage.setItem('pharma_db_seeded', 'true');
      return INITIAL_SECTIONS;
    }
    return [];
  }
}

export async function saveSection(section: Section): Promise<void> {
  // Sync to server in background
  if (typeof window !== 'undefined') {
    fetch('/api/sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(section),
    }).catch((err) => console.warn('Cloud sync section update failed (offline):', err));
  }

  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('sections', 'readwrite');
      const store = transaction.objectStore('sections');
      const request = store.put(section);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    const current = await getSections();
    const index = current.findIndex(s => s.id === section.id);
    if (index >= 0) {
      current[index] = section;
    } else {
      current.push(section);
    }
    localStorage.setItem('pharma_sections', JSON.stringify(current));
  }
}

export async function deleteSection(sectionId: string): Promise<void> {
  // Sync to server in background
  if (typeof window !== 'undefined') {
    fetch(`/api/sections/${sectionId}`, {
      method: 'DELETE',
    }).catch((err) => console.warn('Cloud sync delete section failed (offline):', err));
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('pharma_db_seeded', 'true');
    // Mirror to localStorage immediately
    try {
      const storedSecs = localStorage.getItem('pharma_sections');
      if (storedSecs) {
        const parsed = JSON.parse(storedSecs) as Section[];
        localStorage.setItem('pharma_sections', JSON.stringify(parsed.filter(s => s.id !== sectionId)));
      }
      const storedItems = localStorage.getItem('pharma_custody_items');
      if (storedItems) {
        const parsed = JSON.parse(storedItems) as CustodyItem[];
        localStorage.setItem('pharma_custody_items', JSON.stringify(parsed.filter(i => i.sectionId !== sectionId)));
      }
    } catch (e) {
      console.warn('localStorage sync error:', e);
    }
  }

  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['sections', 'custody_items'], 'readwrite');
      const secStore = transaction.objectStore('sections');
      const itemStore = transaction.objectStore('custody_items');
      
      secStore.delete(sectionId);

      // Also delete related items
      const index = itemStore.index('sectionId');
      const itemRequest = index.openCursor(IDBKeyRange.only(sectionId));
      itemRequest.onsuccess = (e) => {
        const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          itemStore.delete(cursor.primaryKey);
          cursor.continue();
        }
      };

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch {
    const current = await getSections();
    const updated = current.filter(s => s.id !== sectionId);
    localStorage.setItem('pharma_sections', JSON.stringify(updated));

    const items = await getCustodyItems();
    const filteredItems = items.filter(i => i.sectionId !== sectionId);
    localStorage.setItem('pharma_custody_items', JSON.stringify(filteredItems));
  }
}

export async function getCustodyItems(sectionId?: string): Promise<CustodyItem[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('custody_items', 'readonly');
      const store = transaction.objectStore('custody_items');

      if (sectionId) {
        const index = store.index('sectionId');
        const request = index.getAll(sectionId);
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      } else {
        const request = store.getAll();
        request.onsuccess = async () => {
          let results = request.result as CustodyItem[];
          const hasSeeded = typeof window !== 'undefined' ? localStorage.getItem('pharma_db_seeded') : null;
          if (!results || results.length === 0) {
            if (!hasSeeded) {
              results = INITIAL_ITEMS;
            } else {
              results = [];
            }
          }
          resolve(results);
        };
        request.onerror = () => reject(request.error);
      }
    });
  } catch {
    const hasSeeded = typeof window !== 'undefined' ? localStorage.getItem('pharma_db_seeded') : null;
    const stored = localStorage.getItem('pharma_custody_items');
    let items = hasSeeded ? [] : INITIAL_ITEMS;
    if (stored) {
      try {
        items = JSON.parse(stored);
      } catch {
        items = hasSeeded ? [] : INITIAL_ITEMS;
      }
    }
    if (sectionId) {
      return items.filter(i => i.sectionId === sectionId);
    }
    return items;
  }
}

export async function saveCustodyItem(item: CustodyItem): Promise<void> {
  // Sync to server in background
  if (typeof window !== 'undefined') {
    fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    }).catch((err) => console.warn('Cloud sync item update failed (offline):', err));
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('pharma_db_seeded', 'true');
  }
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('custody_items', 'readwrite');
      const store = transaction.objectStore('custody_items');
      const request = store.put(item);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    const current = await getCustodyItems();
    const index = current.findIndex(i => i.id === item.id);
    if (index >= 0) {
      current[index] = item;
    } else {
      current.push(item);
    }
    localStorage.setItem('pharma_custody_items', JSON.stringify(current));
  }
}

export async function deleteCustodyItem(itemId: string): Promise<void> {
  // Sync to server in background
  if (typeof window !== 'undefined') {
    fetch(`/api/items/${itemId}`, {
      method: 'DELETE',
    }).catch((err) => console.warn('Cloud sync delete item failed (offline):', err));
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('pharma_db_seeded', 'true');
    // Mirror to localStorage
    try {
      const storedItems = localStorage.getItem('pharma_custody_items');
      if (storedItems) {
        const parsed = JSON.parse(storedItems) as CustodyItem[];
        localStorage.setItem('pharma_custody_items', JSON.stringify(parsed.filter(i => i.id !== itemId)));
      }
    } catch (e) {
      console.warn('localStorage sync error on delete item:', e);
    }
  }

  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('custody_items', 'readwrite');
      const store = transaction.objectStore('custody_items');
      const request = store.delete(itemId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    const current = await getCustodyItems();
    const updated = current.filter(i => i.id !== itemId);
    localStorage.setItem('pharma_custody_items', JSON.stringify(updated));
  }
}

export async function getSettings(): Promise<PharmacySettings> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction('settings', 'readonly');
      const store = transaction.objectStore('settings');
      const request = store.get('main_settings');
      request.onsuccess = () => {
        if (request.result && request.result.value) {
          resolve(request.result.value);
        } else {
          resolve(DEFAULT_SETTINGS);
        }
      };
      request.onerror = () => resolve(DEFAULT_SETTINGS);
    });
  } catch {
    const stored = localStorage.getItem('pharma_settings');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: PharmacySettings): Promise<void> {
  // Sync to server in background
  if (typeof window !== 'undefined') {
    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    }).catch((err) => console.warn('Cloud sync settings failed (offline):', err));
  }

  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('settings', 'readwrite');
      const store = transaction.objectStore('settings');
      const request = store.put({ key: 'main_settings', value: settings });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    localStorage.setItem('pharma_settings', JSON.stringify(settings));
  }
}

async function seedInitialData(): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction(['sections', 'custody_items', 'settings', 'audit_logs'], 'readwrite');
    const secStore = transaction.objectStore('sections');
    const itemStore = transaction.objectStore('custody_items');
    const setStore = transaction.objectStore('settings');
    const logStore = transaction.objectStore('audit_logs');

    for (const sec of INITIAL_SECTIONS) {
      secStore.put(sec);
    }
    for (const item of INITIAL_ITEMS) {
      itemStore.put(item);
    }
    for (const log of INITIAL_LOGS) {
      logStore.put(log);
    }
    setStore.put({ key: 'main_settings', value: DEFAULT_SETTINGS });
  } catch (err) {
    console.error('Failed to seed initial data:', err);
  }
}

// Audit Logs Access Methods
export async function getAuditLogs(): Promise<AuditLog[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('audit_logs', 'readonly');
      const store = transaction.objectStore('audit_logs');
      const request = store.getAll();

      request.onsuccess = async () => {
        let results = request.result as AuditLog[];
        if (!results || results.length === 0) {
          // Initialize with default logs
          for (const l of INITIAL_LOGS) {
            await addAuditLog(l);
          }
          results = INITIAL_LOGS;
        }
        // Return latest first
        resolve(results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      };
      request.onerror = () => reject(request.error);
    });
  } catch {
    const stored = localStorage.getItem('pharma_audit_logs');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AuditLog[];
        return parsed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      } catch {
        return INITIAL_LOGS;
      }
    }
    localStorage.setItem('pharma_audit_logs', JSON.stringify(INITIAL_LOGS));
    return INITIAL_LOGS;
  }
}

export async function addAuditLog(
  entry: Omit<AuditLog, 'id' | 'timestamp'> & { id?: string; timestamp?: string }
): Promise<AuditLog> {
  const newLog: AuditLog = {
    id: entry.id || `log-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    timestamp: entry.timestamp || new Date().toISOString(),
    action: entry.action,
    category: entry.category,
    title: entry.title,
    details: entry.details,
    performedBy: entry.performedBy || 'الأدمن المشرف',
    targetId: entry.targetId,
    targetName: entry.targetName,
    sectionName: entry.sectionName,
  };

  // Sync log to server in background
  if (typeof window !== 'undefined') {
    fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLog),
    }).catch(() => {});
  }

  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('audit_logs', 'readwrite');
      const store = transaction.objectStore('audit_logs');
      const request = store.put(newLog);
      request.onsuccess = () => resolve(newLog);
      request.onerror = () => reject(request.error);
    });
  } catch {
    try {
      const current = await getAuditLogs();
      const updated = [newLog, ...current];
      localStorage.setItem('pharma_audit_logs', JSON.stringify(updated.slice(0, 500))); // Cap at 500 logs in localStorage
    } catch {
      // Ignore fallback error
    }
    return newLog;
  }
}

export async function clearAuditLogs(): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('audit_logs', 'readwrite');
      const store = transaction.objectStore('audit_logs');
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    localStorage.removeItem('pharma_audit_logs');
  }
}

// Full Export / Import backup function for Cloud Sync
export async function exportDatabaseBackup(): Promise<string> {
  const sections = await getSections();
  const items = await getCustodyItems();
  const settings = await getSettings();
  const logs = await getAuditLogs();

  const backupData = {
    appName: 'مراقبة عهد الصيدلة',
    version: '2.0.0',
    exportedAt: new Date().toISOString(),
    settings,
    sections,
    items,
    logs,
  };

  return JSON.stringify(backupData, null, 2);
}

export async function importDatabaseBackup(jsonString: string): Promise<{ sectionsCount: number; itemsCount: number; logsCount: number }> {
  const data = JSON.parse(jsonString);

  if (!data.sections || !Array.isArray(data.sections)) {
    throw new Error('الملف لا يحتوي على بيانات أقسام صالحة');
  }

  const db = await openDB();
  const transaction = db.transaction(['sections', 'custody_items', 'settings', 'audit_logs'], 'readwrite');
  const secStore = transaction.objectStore('sections');
  const itemStore = transaction.objectStore('custody_items');
  const setStore = transaction.objectStore('settings');
  const logStore = transaction.objectStore('audit_logs');

  // Clear existing
  secStore.clear();
  itemStore.clear();
  logStore.clear();

  for (const s of data.sections) {
    secStore.put(s);
  }

  if (data.items && Array.isArray(data.items)) {
    for (const item of data.items) {
      itemStore.put(item);
    }
  }

  if (data.logs && Array.isArray(data.logs)) {
    for (const log of data.logs) {
      logStore.put(log);
    }
  }

  if (data.settings) {
    setStore.put({ key: 'main_settings', value: data.settings });
  }

  // Also push imported data to cloud server
  if (typeof window !== 'undefined') {
    fetch('/api/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: jsonString,
    }).catch((err) => console.warn('Cloud server import failed (offline):', err));
  }

  return {
    sectionsCount: data.sections.length,
    itemsCount: (data.items || []).length,
    logsCount: (data.logs || []).length,
  };
}

// ================= CLOUD SYNC & SHARING HELPERS =================

export async function syncWithCloudServer(): Promise<{
  synced: boolean;
  sections?: Section[];
  items?: CustodyItem[];
  settings?: PharmacySettings;
  logs?: AuditLog[];
}> {
  try {
    const res = await fetch('/api/data');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.success && json.data) {
      const { sections, items, settings, logs } = json.data;

      // Update local IndexedDB
      try {
        const db = await openDB();
        const transaction = db.transaction(['sections', 'custody_items', 'settings', 'audit_logs'], 'readwrite');
        const secStore = transaction.objectStore('sections');
        const itemStore = transaction.objectStore('custody_items');
        const setStore = transaction.objectStore('settings');
        const logStore = transaction.objectStore('audit_logs');

        secStore.clear();
        itemStore.clear();
        logStore.clear();

        if (Array.isArray(sections)) {
          for (const s of sections) secStore.put(s);
        }
        if (Array.isArray(items)) {
          for (const i of items) itemStore.put(i);
        }
        if (Array.isArray(logs)) {
          for (const l of logs) logStore.put(l);
        }
        if (settings) {
          setStore.put({ key: 'main_settings', value: settings });
        }
      } catch (e) {
        console.warn('Could not update local IndexedDB cache during cloud sync:', e);
      }

      // Update localStorage mirrors
      if (typeof window !== 'undefined') {
        if (Array.isArray(sections)) localStorage.setItem('pharma_sections', JSON.stringify(sections));
        if (Array.isArray(items)) localStorage.setItem('pharma_custody_items', JSON.stringify(items));
        if (settings) localStorage.setItem('pharma_settings', JSON.stringify(settings));
        if (Array.isArray(logs)) localStorage.setItem('pharma_audit_logs', JSON.stringify(logs));
        localStorage.setItem('pharma_db_seeded', 'true');
      }

      return { synced: true, sections, items, settings, logs };
    }
  } catch (err) {
    console.warn('Cloud server sync unavailable, using local cache:', err);
  }
  return { synced: false };
}

export async function pushAllToCloudServer(): Promise<{ success: boolean; message?: string }> {
  try {
    const sections = await getSections();
    const items = await getCustodyItems();
    const settings = await getSettings();
    const logs = await getAuditLogs();

    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sections, items, settings, logs }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return { success: true, message: json.message };
  } catch (err: any) {
    console.warn('Push all to cloud failed:', err);
    return { success: false, message: err.message };
  }
}

