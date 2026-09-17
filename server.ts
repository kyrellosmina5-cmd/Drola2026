import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'pharmacy_db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial fallback dataset if no database exists yet
const INITIAL_DB = {
  sections: [
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
  ],
  items: [
    {
      id: 'item-1',
      sectionId: 'sec-emergency',
      title: 'محضر جرد دولاب الطوارئ (Crash Cart) - الربع الأول',
      type: 'pdf',
      custodyNumber: 'EMG-2026-001',
      description: 'فحص أمبولات الأدرينالين والأتروبين والتأكد من مطابقة تاريخ الصلاحية وسدادات الأمان البلاستيكية.',
      fileData: 'data:application/pdf;base64,JVBERi0xLjQKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFsgMSAwIFIgXQovQ291bnQgMQo+PgplbmRvYmoKMSAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDQgMCBSCi9NZWRpYUJveCBbMCAwIDYxMiA3OTJdCi9SZXNvdXJjZXMgPDwKPj4KPj4KZW5kb2JqCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMDAwIDAwMDAwIG4gCjAwMDAwMDAwMDAgMDAwMDAgbiAKMDAwMDAwMDAwOSAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDUKL1Jvb3QgNCAwIFIKPj4Kc3RhcnR4cmVmCjExOAolJUVPRg==',
      fileName: 'محضر_جرد_طوارئ_2026.pdf',
      fileSize: 245760,
      mimeType: 'application/pdf',
      status: 'inspected',
      expiryDate: '2027-01-15',
      addedBy: 'د. أحمد محمود',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'item-2',
      sectionId: 'sec-emergency',
      title: 'معايرة جهاز الصدمات الكهربائية (Defibrillator)',
      type: 'image',
      custodyNumber: 'EMG-2026-002',
      description: 'ملصق الاعتماد الفني والفحص الكهروميكانيكي من الإدارة الهندسية.',
      fileData: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="%230f172a"/><circle cx="300" cy="200" r="100" fill="%230d9488" opacity="0.3"/><path d="M220 200 L270 200 L290 140 L320 260 L340 180 L360 200 L380 200" stroke="%232dd4bf" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><text x="50%" y="340" fill="%23ffffff" font-size="20" font-family="sans-serif" text-anchor="middle" font-weight="bold">Defibrillator Calibration Passed</text></svg>',
      fileName: 'معايرة_جهاز_الصدمات.svg',
      fileSize: 184320,
      mimeType: 'image/svg+xml',
      status: 'active',
      addedBy: 'د. حسام الدين',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'item-3',
      sectionId: 'sec-cold-chain',
      title: 'رابط المراقبة اللحظية لحرارة الثلاجة عبر الحساس الذكي (IoT)',
      type: 'link',
      custodyNumber: 'COLD-2026-001',
      description: 'لوحة القياس المتصلة بحساس درجات الحرارة والرطوبة الذكي لمراقبة +2 إلى +8 مئوية 24/7.',
      url: 'https://sensors.pharmacy-custody.com/temp-log/unit-A1',
      status: 'active',
      addedBy: 'د. سارة خليل',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'item-4',
      sectionId: 'sec-narcotics',
      title: 'محضر استلام وتكهين روشتات الجدول الأول - شهر يناير',
      type: 'pdf',
      custodyNumber: 'NAR-2026-001',
      description: 'محضر الصرف المعتمد من مدير التفتيش الصيدلي ورئيس القسم مع الأرقام المسلسلة للأذون.',
      fileData: 'data:application/pdf;base64,JVBERi0xLjQKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFsgMSAwIFIgXQovQ291bnQgMQo+PgplbmRvYmoKMSAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDQgMCBSCi9NZWRpYUJveCBbMCAwIDYxMiA3OTJdCi9SZXNvdXJjZXMgPDwKPj4KPj4KZW5kb2JqCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMDAwIDAwMDAwIG4gCjAwMDAwMDAwMDAgMDAwMDAgbiAKMDAwMDAwMDAwOSAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDUKL1Jvb3QgNCAwIFIKPj4Kc3RhcnR4cmVmCjExOAolJUVPRg==',
      fileName: 'محضر_المخدرات_يناير_2026.pdf',
      fileSize: 312000,
      mimeType: 'application/pdf',
      status: 'inspected',
      addedBy: 'د. محمد طارق',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ],
  settings: {
    pharmacyName: 'صيدلية الرعاية المتكاملة',
    branchName: 'الفرع الرئيسي - قسم العهد والرقابة الدوائية',
    licenseNumber: 'PH-2026-8891',
    adminPin: '1234',
    enablePinProtection: false,
    lastSyncTime: new Date().toISOString(),
  },
  logs: [
    {
      id: 'log-seed-1',
      action: 'admin_access',
      category: 'security',
      title: 'بدء تشغيل منظومة عهد الصيدلة',
      details: 'تم بدء تشغيل المنظومة وتفعيل المزامنة السحابية المركزية لجميع العهد والأقسام.',
      performedBy: 'النظام السحابي',
      timestamp: new Date().toISOString(),
    }
  ],
  updatedAt: new Date().toISOString()
};

// Helper: Read DB
function readDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading database file, using fallback:', err);
  }
  // Initialize and write default
  writeDatabase(INITIAL_DB);
  return INITIAL_DB;
}

// Helper: Write DB
function writeDatabase(data: any) {
  try {
    data.updatedAt = new Date().toISOString();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing to database file:', err);
    return false;
  }
}

// Initial DB check
readDatabase();

// Middleware
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// CORS for preview/external clients
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// ================= API ROUTES =================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    name: 'Pharmacy Custody System API',
  });
});

// GET Full Database (For synchronizing all clients)
app.get('/api/data', (req, res) => {
  try {
    const db = readDatabase();
    res.json({
      success: true,
      data: db,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST Full Database (Sync / Save all modifications)
app.post('/api/data', (req, res) => {
  try {
    const incoming = req.body;
    if (!incoming || typeof incoming !== 'object') {
      return res.status(400).json({ success: false, error: 'Invalid payload' });
    }

    const current = readDatabase();
    const updated = {
      sections: Array.isArray(incoming.sections) ? incoming.sections : current.sections,
      items: Array.isArray(incoming.items) ? incoming.items : current.items,
      settings: incoming.settings || current.settings,
      logs: Array.isArray(incoming.logs) ? incoming.logs : current.logs,
      updatedAt: new Date().toISOString(),
    };

    writeDatabase(updated);
    res.json({
      success: true,
      message: 'تمت مزامنة وحفظ جميع التعديلات سحابياً بنجاح',
      updatedAt: updated.updatedAt,
      counts: {
        sections: updated.sections.length,
        items: updated.items.length,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Upsert Section
app.post('/api/sections', (req, res) => {
  try {
    const section = req.body;
    if (!section || !section.id || !section.name) {
      return res.status(400).json({ success: false, error: 'بيانات القسم غير مكتملة' });
    }

    const db = readDatabase();
    const index = db.sections.findIndex((s: any) => s.id === section.id);
    if (index >= 0) {
      db.sections[index] = { ...db.sections[index], ...section, updatedAt: new Date().toISOString() };
    } else {
      db.sections.push({ ...section, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }

    writeDatabase(db);
    res.json({ success: true, section });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete Section
app.delete('/api/sections/:id', (req, res) => {
  try {
    const { id } = req.params;
    const db = readDatabase();
    db.sections = db.sections.filter((s: any) => s.id !== id);
    // Also remove items belonging to this section
    db.items = db.items.filter((i: any) => i.sectionId !== id);

    writeDatabase(db);
    res.json({ success: true, deletedId: id });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Upsert Custody Item
app.post('/api/items', (req, res) => {
  try {
    const item = req.body;
    if (!item || !item.id || !item.title || !item.sectionId) {
      return res.status(400).json({ success: false, error: 'بيانات العهدة غير مكتملة' });
    }

    const db = readDatabase();
    const index = db.items.findIndex((i: any) => i.id === item.id);
    if (index >= 0) {
      db.items[index] = { ...db.items[index], ...item, updatedAt: new Date().toISOString() };
    } else {
      db.items.push({ ...item, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }

    writeDatabase(db);
    res.json({ success: true, item });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete Custody Item
app.delete('/api/items/:id', (req, res) => {
  try {
    const { id } = req.params;
    const db = readDatabase();
    db.items = db.items.filter((i: any) => i.id !== id);

    writeDatabase(db);
    res.json({ success: true, deletedId: id });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update Settings
app.post('/api/settings', (req, res) => {
  try {
    const settings = req.body;
    const db = readDatabase();
    db.settings = { ...db.settings, ...settings, lastSyncTime: new Date().toISOString() };
    writeDatabase(db);
    res.json({ success: true, settings: db.settings });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Append Audit Log
app.post('/api/logs', (req, res) => {
  try {
    const log = req.body;
    const db = readDatabase();
    if (!db.logs) db.logs = [];
    db.logs.unshift({
      ...log,
      id: log.id || `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: log.timestamp || new Date().toISOString(),
    });
    // Keep last 500 logs
    if (db.logs.length > 500) {
      db.logs = db.logs.slice(0, 500);
    }
    writeDatabase(db);
    res.json({ success: true, log });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Backup Export
app.get('/api/export', (req, res) => {
  try {
    const db = readDatabase();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=pharmacy_custody_backup_${new Date().toISOString().slice(0, 10)}.json`);
    res.send(JSON.stringify(db, null, 2));
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Backup Import
app.post('/api/import', (req, res) => {
  try {
    const incoming = req.body;
    if (!incoming || !Array.isArray(incoming.sections)) {
      return res.status(400).json({ success: false, error: 'الملف غير متطابق مع بنية بيانات عهد الصيدلة' });
    }

    const updated = {
      sections: incoming.sections,
      items: Array.isArray(incoming.items) ? incoming.items : [],
      settings: incoming.settings || readDatabase().settings,
      logs: Array.isArray(incoming.logs) ? incoming.logs : [],
      updatedAt: new Date().toISOString(),
    };

    writeDatabase(updated);
    res.json({
      success: true,
      message: 'تم استيراد وحفظ النسخة الاحتياطية بنجاح في السحابة',
      sectionsCount: updated.sections.length,
      itemsCount: updated.items.length,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Reset Database
app.post('/api/reset', (req, res) => {
  try {
    writeDatabase(INITIAL_DB);
    res.json({ success: true, message: 'تمت استعادة البيانات الافتراضية بنجاح' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ================= VITE OR STATIC SERVING =================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Pharmacy Custody Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
