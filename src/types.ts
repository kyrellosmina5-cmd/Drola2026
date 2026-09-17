export type FileType = 'pdf' | 'image' | 'video' | 'link';

export type CustodyStatus = 'active' | 'review_needed' | 'inspected' | 'archived';

export interface CustodyItem {
  id: string;
  sectionId: string;
  title: string;
  type: FileType;
  custodyNumber?: string;
  description?: string;
  fileData?: string; // base64 or blob URL
  fileName?: string;
  fileSize?: number; // in bytes
  mimeType?: string;
  url?: string; // for links
  status: CustodyStatus;
  expiryDate?: string;
  addedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Section {
  id: string;
  name: string;
  description: string;
  iconName: string;
  color: string;
  responsiblePerson?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
  order: number;
}

export interface PharmacySettings {
  pharmacyName: string;
  branchName: string;
  licenseNumber: string;
  adminPin: string;
  enablePinProtection: boolean;
  cloudSyncUrl?: string;
  lastSyncTime?: string;
}

export interface CloudSyncState {
  status: 'synced' | 'syncing' | 'offline' | 'error';
  lastSync?: string;
  pendingChanges: number;
}

export type LogActionType =
  | 'create_section'
  | 'update_section'
  | 'delete_section'
  | 'create_item'
  | 'update_item'
  | 'delete_item'
  | 'backup_export'
  | 'backup_import'
  | 'settings_update'
  | 'admin_access'
  | 'reset_data';

export type LogCategory = 'section' | 'item' | 'settings' | 'security' | 'backup';

export interface AuditLog {
  id: string;
  action: LogActionType;
  category: LogCategory;
  title: string;
  details: string;
  performedBy: string;
  targetId?: string;
  targetName?: string;
  sectionName?: string;
  timestamp: string; // ISO string
}
