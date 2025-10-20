import { Member, Task, BrandInfo } from './types';

export const DUMMY_MEMBERS: Member[] = [
  { 
    id: 'member-1', 
    name: 'Alex Johnson', 
    avatar: 'https://i.pravatar.cc/150?u=alex',
    email: 'alex.j@example.com',
    phone: '0901234567',
    facebook: 'https://facebook.com/alex.johnson',
    zalo: 'Alex J.'
  },
  { 
    id: 'member-2', 
    name: 'Maria Garcia', 
    avatar: 'https://i.pravatar.cc/150?u=maria',
    email: 'maria.g@example.com',
  },
  { 
    id: 'member-3', 
    name: 'Chen Wei', 
    avatar: 'https://i.pravatar.cc/150?u=chen',
    phone: '0987654321',
  },
  { 
    id: 'member-4', 
    name: 'Sarah O\'Connor', 
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    email: 'sarah.o@example.com',
    zalo: 'Sarah OConnor'
  },
];

export const INITIAL_ASSIGNERS: Member[] = [ DUMMY_MEMBERS[0] ];

const today = new Date();
const getFutureDate = (days: number): string => {
    const future = new Date();
    future.setDate(today.getDate() + days);
    return future.toISOString().split('T')[0];
};

export const DUMMY_TASKS: Task[] = [
  {
    id: 'task-1',
    order: 1,
    brandName: 'Quantum Inc.',
    title: 'Logo Redesign Concept',
    link: 'https://www.figma.com/community/file/1234567890',
    email: 'client.quantum@example.com',
    emailText: 'Mail Khách hàng',
    format: 'Vector (AI, SVG)',
    assignedBy: 'member-1',
    assignedTo: 'member-2',
    briefDate: getFutureDate(-5),
    deadline: getFutureDate(2),
    status: 'inprogress',
    isArchived: false,
    notes: 'Khách hàng yêu cầu 3 concept khác nhau, tập trung vào sự tối giản và hiện đại.',
  },
  {
    id: 'task-2',
    order: 2,
    brandName: 'Starlight Coffee',
    title: 'Social Media Post Graphics',
    email: 'manager@starlight.coffee',
    emailText: 'Mail Quản lý',
    format: 'JPEG, PNG',
    assignedBy: 'member-1',
    assignedTo: 'member-3',
    briefDate: getFutureDate(-2),
    deadline: getFutureDate(5),
    status: 'todo',
    isArchived: false,
  },
  {
    id: 'task-3',
    order: 3,
    brandName: 'Nebula Systems',
    title: 'Website UI Kit',
    link: 'https://www.figma.com/community/file/0987654321',
    format: 'Figma',
    assignedBy: 'member-1',
    assignedTo: 'member-2',
    briefDate: getFutureDate(-10),
    deadline: getFutureDate(10),
    status: 'todo',
    isArchived: false,
    notes: 'Làm theo style guide đã gửi qua email. Chú ý các component phải responsive.',
  },
  {
    id: 'task-4',
    order: 4,
    brandName: 'Quantum Inc.',
    title: 'Brand Guideline Document',
    format: 'PDF',
    assignedBy: 'member-1',
    assignedTo: 'member-4',
    briefDate: getFutureDate(-15),
    deadline: getFutureDate(-1),
    status: 'done',
    isArchived: false,
  },
   {
    id: 'task-5',
    order: 5,
    brandName: 'Starlight Coffee',
    title: 'Promotional Flyer',
    email: 'https://example.com/starlight-assets',
    emailText: 'Tài nguyên Brand',
    format: 'InDesign, PDF',
    assignedBy: 'member-1',
    assignedTo: 'member-3',
    briefDate: getFutureDate(-1),
    deadline: getFutureDate(3),
    status: 'inprogress',
    isArchived: false,
    notes: 'Sử dụng font và màu sắc mới nhất của brand. File tài nguyên đã đính kèm trong link brief.',
  },
   {
    id: 'task-6',
    order: 6,
    brandName: 'Nebula Systems',
    title: 'Mobile App Onboarding Screens',
    format: 'Figma',
    assignedBy: 'member-1',
    assignedTo: 'member-4',
    briefDate: getFutureDate(0),
    deadline: getFutureDate(14),
    status: 'todo',
    isArchived: false,
  },
];

export const INITIAL_BRANDS: BrandInfo[] = Array.from(new Set(DUMMY_TASKS.map(t => t.brandName)))
  .map((name, index) => ({
    name,
    avatar: `https://i.pravatar.cc/150?u=brand${index}`
  }));

export const INITIAL_FORMATS: string[] = Array.from(new Set(DUMMY_TASKS.map(t => t.format)));