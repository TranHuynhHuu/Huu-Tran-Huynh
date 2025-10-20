export type Status = 'todo' | 'inprogress' | 'waitingfeedback' | 'feedback' | 'cancelled' | 'done';

export type View = 'manager' | 'member';

export interface Member {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  phone?: string;
  facebook?: string;
  zalo?: string;
}

export interface BrandInfo {
  name: string;
  avatar: string;
}

export interface Task {
  id: string;
  order: number;
  brandName: string;
  title: string;
  link?: string;
  email?: string; // Can be an email or a URL
  emailText?: string; // Display text for the email/link
  format: string;
  assignedBy: string; // Member ID
  assignedTo: string; // Member ID
  briefDate: string;
  deadline: string;
  status: Status;
  isArchived: boolean;
  notes?: string;
}