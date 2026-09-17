import React from 'react';
import {
  HeartPulse,
  Snowflake,
  ShieldAlert,
  ClipboardCheck,
  Stethoscope,
  PackageCheck,
  Pill,
  Thermometer,
  FlaskConical,
  Syringe,
  FileText,
  Activity,
  AlertOctagon,
  Scale,
  ShieldCheck,
  Truck,
  Lock,
  Building2,
  UserCheck,
  Flame,
  Archive,
  Boxes,
  Microscope,
  FolderLock,
  BadgeAlert,
  FolderOpen
} from 'lucide-react';

export interface IconOption {
  name: string;
  label: string;
  component: React.ComponentType<{ className?: string; size?: number }>;
}

export const AVAILABLE_ICONS: IconOption[] = [
  { name: 'HeartPulse', label: 'طوارئ وإنعاش', component: HeartPulse },
  { name: 'Snowflake', label: 'ثلاجة وتبريد', component: Snowflake },
  { name: 'ShieldAlert', label: 'أدوية مراقبة ومخدرة', component: ShieldAlert },
  { name: 'ClipboardCheck', label: 'جرد وتدقيق', component: ClipboardCheck },
  { name: 'Stethoscope', label: 'أجهزة طبية', component: Stethoscope },
  { name: 'PackageCheck', label: 'استلام وموردين', component: PackageCheck },
  { name: 'Pill', label: 'كبسولات وأقراص', component: Pill },
  { name: 'Thermometer', label: 'حرارة ورطوبة', component: Thermometer },
  { name: 'FlaskConical', label: 'محاليل ومختبر', component: FlaskConical },
  { name: 'Syringe', label: 'حقن وأمصال', component: Syringe },
  { name: 'FileText', label: 'دفاتر وسجلات', component: FileText },
  { name: 'Activity', label: 'مؤشرات حيوية', component: Activity },
  { name: 'AlertOctagon', label: 'تحذيرات هامة', component: AlertOctagon },
  { name: 'Scale', label: 'موازين ومعايرة', component: Scale },
  { name: 'ShieldCheck', label: 'جودة وسلامة', component: ShieldCheck },
  { name: 'Truck', label: 'شحن وتوزيع', component: Truck },
  { name: 'Lock', label: 'خزينة وعهدة مغلقة', component: Lock },
  { name: 'Building2', label: 'مستودع رئيسي', component: Building2 },
  { name: 'UserCheck', label: 'تسليم وتسلم', component: UserCheck },
  { name: 'Flame', label: 'مواد قابلة للاشتعال', component: Flame },
  { name: 'Archive', label: 'أرشيف العهد السابقة', component: Archive },
  { name: 'Boxes', label: 'مخزون وكراتين', component: Boxes },
  { name: 'Microscope', label: 'فحص مجهري وتحاليل', component: Microscope },
  { name: 'FolderLock', label: 'ملفات سرية', component: FolderLock },
  { name: 'BadgeAlert', label: 'صلاحيات منتهية', component: BadgeAlert },
  { name: 'FolderOpen', label: 'قسم عام', component: FolderOpen },
];

export const COLOR_THEMES: { id: string; name: string; bg: string; text: string; ring: string; border: string; gradient: string }[] = [
  { id: 'teal', name: 'فيروزي صيدلي', bg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400', text: 'text-teal-600 dark:text-teal-400', ring: 'ring-teal-500', border: 'border-teal-500', gradient: 'from-teal-600 to-emerald-600' },
  { id: 'emerald', name: 'أخضر زمردي', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', text: 'text-emerald-600 dark:text-emerald-400', ring: 'ring-emerald-500', border: 'border-emerald-500', gradient: 'from-emerald-600 to-teal-700' },
  { id: 'blue', name: 'أزرق طبي', bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', text: 'text-blue-600 dark:text-blue-400', ring: 'ring-blue-500', border: 'border-blue-500', gradient: 'from-blue-600 to-cyan-600' },
  { id: 'indigo', name: 'نيلي ملكي', bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400', text: 'text-indigo-600 dark:text-indigo-400', ring: 'ring-indigo-500', border: 'border-indigo-500', gradient: 'from-indigo-600 to-blue-600' },
  { id: 'violet', name: 'بنفسجي', bg: 'bg-violet-500/10 text-violet-600 dark:text-violet-400', text: 'text-violet-600 dark:text-violet-400', ring: 'ring-violet-500', border: 'border-violet-500', gradient: 'from-violet-600 to-purple-600' },
  { id: 'rose', name: 'وردي أحمر', bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400', text: 'text-rose-600 dark:text-rose-400', ring: 'ring-rose-500', border: 'border-rose-500', gradient: 'from-rose-600 to-red-600' },
  { id: 'amber', name: 'عنبري ذهبي', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', text: 'text-amber-600 dark:text-amber-400', ring: 'ring-amber-500', border: 'border-amber-500', gradient: 'from-amber-600 to-yellow-600' },
  { id: 'cyan', name: 'سماوي بحري', bg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400', text: 'text-cyan-600 dark:text-cyan-400', ring: 'ring-cyan-500', border: 'border-cyan-500', gradient: 'from-cyan-600 to-teal-600' },
];

export function getSectionIcon(iconName: string): React.ComponentType<{ className?: string; size?: number }> {
  const match = AVAILABLE_ICONS.find(i => i.name === iconName);
  return match ? match.component : FolderOpen;
}

export function getColorTheme(colorId: string) {
  const match = COLOR_THEMES.find(c => c.id === colorId);
  return match || COLOR_THEMES[0];
}
