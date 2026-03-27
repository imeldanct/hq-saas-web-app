

export type UserRole = "staff" | "admin" | "superAdmin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  assignedCategories?: string[];
}

export type ItemStatus = "Available" | "Unavailable";

export interface InventoryLogEntry {
  date: string; // ISO Date string
  action: 'Created' | 'Updated' | 'Deleted';
  adminName: string;
}

export interface InventoryItem {
  id: string;
  name:string;
  category: string;
  status: ItemStatus;
  imageUrl: string;
  quantity: number;
  'data-ai-hint'?: string;
  assignedTo?: string; // User ID
  assignedSince?: string; // ISO Date string
  logs: InventoryLogEntry[];
}

export type RequestStatus = "Pending" | "Approved" | "Declined";

export interface ItemRequest {
  id: string;
  itemId: string;
  item: InventoryItem;
  userId: string;
  user: User;
  requestDate: string; // ISO Date string
  status: RequestStatus;
  reasonForNeed: string;
  department: string;
  intendedUseDuration: string;
  declineReason?: string;
  resolvedBy?: string; // Admin User
  resolvedDate?: string; // ISO Date string
}

export type NotificationType = "Request Approved" | "Request Declined" | "New Request" | "System";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  date: string; // ISO Date string
  read: boolean;
  type: NotificationType;
  link: string;
}

export interface Founder {
    name: string;
    title: string;
    description: string;
    imageUrl: string;
    'data-ai-hint'?: string;
    profileUrl?: string;
}

export interface Department {
    name: string;
    description: string;
    hod: {
      name: string;
      title: string;
      imageUrl?: string;
      'data-ai-hint'?: string;
      profileUrl?: string;
    };
    staff?: User[];
}

    

    
