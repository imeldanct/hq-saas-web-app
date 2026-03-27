

import type { User, InventoryItem, ItemRequest, Founder, Department, Notification, UserRole } from './types';

export let users: User[] = [
  { id: 'user-1', name: 'Alex Doe', email: 'alexdoe@osoft.com', role: 'staff', avatar: 'https://i.pravatar.cc/150?u=alex' },
  { id: 'user-2', name: 'Brenda Smith', email: 'brendasmith@osoft.com', role: 'admin', assignedCategories: ['Hardware and Appliances', 'Software and Licenses'], avatar: 'https://i.pravatar.cc/150?u=brenda' },
  { id: 'user-3', name: 'Charles Brown', email: 'charlesbrown@osoft.com', role: 'superAdmin', avatar: 'https://i.pravatar.cc/150?u=charles' },
  { id: 'user-4', name: 'Diana Prince', email: 'diana.prince@osoft.com', role: 'staff', avatar: 'https://i.pravatar.cc/150?u=diana' },
  { id: 'user-5', name: 'Ethan Hunt', email: 'ethan.hunt@osoft.com', role: 'admin', assignedCategories: ['Office Supplies'], avatar: 'https://i.pravatar.cc/150?u=ethan' },
];

export let inventoryItems: InventoryItem[] = [
  { id: 'item-1', name: 'MacBook Pro 16"', category: 'Hardware and Appliances', status: 'Available', imageUrl: 'https://picsum.photos/seed/1/600/400', quantity: 5, 'data-ai-hint': 'laptop computer', assignedTo: 'user-2', assignedSince: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), logs: [{date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(), action: 'Created', adminName: 'Charles Brown'}, {date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), action: 'Updated', adminName: 'Brenda Smith'}] },
  { id: 'item-2', name: 'Dell XPS 15', category: 'Hardware and Appliances', status: 'Available', imageUrl: 'https://picsum.photos/seed/2/600/400', quantity: 8, 'data-ai-hint': 'laptop computer', logs: [{ date: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(), action: 'Created', adminName: 'Charles Brown' }] },
  { id: 'item-3', name: 'Adobe Creative Cloud', category: 'Software and Licenses', status: 'Available', imageUrl: 'https://picsum.photos/seed/3/600/400', quantity: 45, 'data-ai-hint': 'software logo', logs: [{ date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), action: 'Created', adminName: 'Charles Brown' }, { date: new Date().toISOString(), action: 'Updated', adminName: 'Brenda Smith'}] },
  { id: 'item-4', name: 'Ergonomic Chair', category: 'Office Supplies', status: 'Unavailable', imageUrl: 'https://picsum.photos/seed/4/600/400', quantity: 0, 'data-ai-hint': 'office chair', logs: [{ date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), action: 'Created', adminName: 'Ethan Hunt' }] },
  { id: 'item-5', name: 'Standing Desk', category: 'Office Supplies', status: 'Available', imageUrl: 'https://picsum.photos/seed/5/600/400', quantity: 3, 'data-ai-hint': 'desk office', logs: [{ date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(), action: 'Created', adminName: 'Ethan Hunt' }] },
  { id: 'item-6', name: 'Figma License', category: 'Software and Licenses', status: 'Available', imageUrl: 'https://picsum.photos/seed/6/600/400', quantity: 20, 'data-ai-hint': 'design tool', logs: [{ date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), action: 'Created', adminName: 'Brenda Smith' }] },
  { id: 'item-7', name: 'Wireless Mouse', category: 'Hardware and Appliances', status: 'Available', imageUrl: 'https://picsum.photos/seed/7/600/400', quantity: 1, 'data-ai-hint': 'computer mouse', logs: [{ date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), action: 'Created', adminName: 'Brenda Smith' }] },
  { id: 'item-8', name: 'Notebooks (Pack of 5)', category: 'Office Supplies', status: 'Available', imageUrl: 'https://picsum.photos/seed/8/600/400', quantity: 100, 'data-ai-hint': 'notebooks office', logs: [{ date: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(), action: 'Created', adminName: 'Ethan Hunt' }] },
];

export let requests: ItemRequest[] = [
    {
        id: 'req-1',
        itemId: 'item-1',
        item: inventoryItems.find(i => i.id === 'item-1')!,
        userId: 'user-1',
        user: users.find(u => u.id === 'user-1')!,
        requestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Pending',
        reasonForNeed: 'My current laptop is failing and I need a replacement for the upcoming project.',
        department: 'Technology',
        intendedUseDuration: 'Until project completion (approx. 6 months)',
    },
    {
        id: 'req-2',
        itemId: 'item-3',
        item: inventoryItems.find(i => i.id === 'item-3')!,
        userId: 'user-4',
        user: users.find(u => u.id === 'user-4')!,
        requestDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Approved',
        reasonForNeed: 'Required for new design tasks.',
        department: 'Business Service',
        intendedUseDuration: 'Ongoing',
        resolvedBy: 'Brenda Smith',
        resolvedDate: new Date().toISOString(),
    },
    {
        id: 'req-3',
        itemId: 'item-4',
        item: inventoryItems.find(i => i.id === 'item-4')!,
        userId: 'user-1',
        user: users.find(u => u.id === 'user-1')!,
        requestDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Declined',
        reasonForNeed: 'Requesting an ergonomic chair for back support.',
        department: 'Technology',
        intendedUseDuration: 'Permanent',
        declineReason: 'Item is currently out of stock. Please check back later.',
        resolvedBy: 'Ethan Hunt',
        resolvedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
     {
        id: 'req-4',
        itemId: 'item-8',
        item: inventoryItems.find(i => i.id === 'item-8')!,
        userId: 'user-2',
        user: users.find(u => u.id === 'user-2')!,
        requestDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Pending',
        reasonForNeed: 'Need notebooks for team brainstorming session.',
        department: 'Admin',
        intendedUseDuration: '1 week',
    },
];

export let notifications: Notification[] = [
    {
        id: 'notif-1',
        userId: 'user-1',
        title: 'Request Declined: Ergonomic Chair',
        message: 'Your request for Ergonomic Chair was declined. Reason: Item is currently out of stock. Please check back later.',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        read: true,
        type: 'Request Declined',
        link: '/inventory/requests'
    },
    {
        id: 'notif-2',
        userId: 'user-4',
        title: 'Request Approved: Adobe Creative Cloud',
        message: 'Your request for Adobe Creative Cloud has been approved by Brenda Smith.',
        date: new Date().toISOString(),
        read: false,
        type: 'Request Approved',
        link: '/inventory/requests'
    }
];

export const founders: Founder[] = [
    {
      name: 'Amos Olobo',
      title: 'Founder & CEO',
      description: 'With over 13 years in IT as a software engineer, he combines deep technical expertise with a clear strategic vision. Holding a BSc in Information Technology from Atlantic International University and an ND in Computer Science from Federal Polytechnic, Idah, he focuses on guiding Osoft’s direction, fostering innovation, and building a culture of teamwork. Alongside his co-founders, he has helped develop .NET Core and API-powered solutions that position clients for long-term success while shaping Osoft as a company ready to scale.',
      imageUrl: 'https://media.licdn.com/dms/image/v2/D4D03AQEgKBeXDwCyig/profile-displayphoto-shrink_800_800/B4DZWHJXymHkAg-/0/1741729138610?e=1759363200&v=beta&t=sp55vxo3a_js8ZpXLjbJPyeHxyUK4kzrFsm4_58UJnU',
      'data-ai-hint': 'man portrait',
      profileUrl: 'https://www.linkedin.com/in/amos-olobo-3295655b/'
    },
    {
      name: 'Anyafulu Samuel',
      title: 'Co-Founder & BDE',
      description: 'Passionate about connecting people, opportunities, and technology, he drives Osoft’s market growth through strategic partnerships and client relationships. His ability to spot emerging trends ensures the company stays competitive while maintaining a human-centred approach to business. Alongside his co-founders, he has helped position Osoft as a forward-thinking IT partner trusted by organisations seeking innovative, tailored solutions.',
      imageUrl: 'https://media.licdn.com/dms/image/v2/D4D03AQGGKOmsq_aCQg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1685956079188?e=1759363200&v=beta&t=jWBuIc3osDbmXnxDKj285r7L5ArorMhA-GdEqZ26-WY',
      'data-ai-hint': 'man portrait',
      profileUrl: 'https://www.linkedin.com/in/anyafulu-samuel-a7010283/'
    },
    {
      name: 'Paul Funsho',
      title: 'Co-Founder & MD',
      description: 'His strength lies in translating strategy into execution, ensuring projects are delivered with precision and impact. With a sharp eye for operations and organisational growth, he builds systems that keep Osoft running efficiently and collaboratively. Working closely with his fellow co-founders, he has been central to establishing Osoft’s reputation for delivering dependable, scalable solutions that meet evolving client needs.',
      imageUrl: 'https://media.licdn.com/dms/image/v2/D4D03AQEEz4aaJRdy9g/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1718687461402?e=1759363200&v=beta&t=ar1cTinGOmT8n3QKENNhloEM0K_o9jMTMqTIx4UOZcA',
      'data-ai-hint': 'man portrait',
      profileUrl: 'https://www.linkedin.com/in/paul-funsho-7433a984/'
    }
];

export const departments: Department[] = [
    {
      name: "Admin",
      description: "Handles administrative support, and office management to ensure smooth company operations.",
      hod: {
        name: 'Paschaline Uzor',
        title: 'Head of Admin',
        imageUrl: 'https://media.licdn.com/dms/image/v2/D4D03AQF9KMs__YSKcg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1686343835805?e=1760572800&v=beta&t=hG-w8HT0ijeXrlgG4gwyJs8iN3VZ55ICjklI-ha2aeE',
        'data-ai-hint': 'woman portrait',
        profileUrl: 'https://www.linkedin.com/in/pascalineuzor1994/'
      },
    },
    {
      name: "Business Service",
      description: "Drives market growth through strategic partnerships and client relationships.",
      hod: {
        name: 'Ojodomo Godwin Momoh',
        title: 'Head of Business Service',
        imageUrl: 'https://media.licdn.com/dms/image/v2/D4D03AQH5nMD-jm8Euw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1662236349796?e=1760572800&v=beta&t=BBvrh8rdbmo5PANtqufDgcD4iukOn3Oy3XVV4sD-Irs',
        'data-ai-hint': 'man portrait',
        profileUrl: 'https://www.linkedin.com/in/ojodomo-godwin-momoh-43074465/'
      },
    },
    {
      name: "Finance & Account",
      description: "Manages financial planning, accounting, and reporting.",
      hod: {
        name: 'Princess Anyaleche',
        title: 'Head of Finance & Account',
        imageUrl: 'https://media.licdn.com/dms/image/v2/D4D03AQGq79PfzIxJFQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1705475155413?e=1760572800&v=beta&t=XlsBIZT1gHRYwS4fk7nz2xPYYpjXxrSPmDYRjz9UdqY',
        'data-ai-hint': 'woman portrait',
        profileUrl: 'https://www.linkedin.com/in/princess-oloriegbe-11a95466/'
      },
    },
    {
      name: "Human Resource",
      description: "Manages employee relations, recruitment, and company culture.",
      hod: {
        name: 'Boniface Anya',
        title: 'Head of Human Resource',
        imageUrl: `https://picsum.photos/seed/boniface/400/400`,
        'data-ai-hint': 'man portrait',
        profileUrl: 'https://www.linkedin.com'
      },
    },
     {
      name: "Operations",
      description: "Ensures projects are delivered with precision and impact.",
      hod: {
        name: 'Innocent Egbunu',
        title: 'Head of Operations',
        imageUrl: 'https://media.licdn.com/dms/image/v2/D4D03AQFzHQVuHiCi1Q/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1703764621288?e=1760572800&v=beta&t=HBc023xaXOrYFbW_g2b_wwCDnb3HQHBRZTs9CZMfXGo',
        'data-ai-hint': 'man portrait',
        profileUrl: 'https://www.linkedin.com/in/innocent-e-21ab4467/'
      },
    },
    {
      name: "Technology",
      description: "Responsible for building and maintaining our software products.",
      hod: {
        name: 'Emmanuel Salifu',
        title: 'Head of Technology',
        imageUrl: 'https://media.licdn.com/dms/image/v2/C4E03AQG4-xNEahICTg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1549388876731?e=1760572800&v=beta&t=6xgXDAoo-1ATRtMByijV4GrS6CfhIuF_v5JQR6Yeoh4',
        'data-ai-hint': 'man portrait',
        profileUrl: 'https://www.linkedin.com/in/emmanuel-salifu-96821117b/'
      },
    }
];


// --- Mutation Functions ---

function addLogEntry(item: InventoryItem, action: InventoryItem['logs'][0]['action'], adminName: string): InventoryItem {
    const newLog = {
        date: new Date().toISOString(),
        action: action,
        adminName: adminName,
    };
    // Make sure logs array exists
    const logs = item.logs || [];
    return {
        ...item,
        logs: [...logs, newLog]
    };
}


// --- Request Management ---
export function updateRequestStatus(requestId: string, status: ItemRequest['status'], adminName: string, declineReason?: string): ItemRequest | undefined {
    const requestIndex = requests.findIndex(r => r.id === requestId);
    if (requestIndex !== -1) {
        const request = requests[requestIndex];
        request.status = status;
        request.resolvedBy = adminName;
        request.resolvedDate = new Date().toISOString();
        if (declineReason) {
            request.declineReason = declineReason;
        }

        if (status === 'Approved') {
            const itemIndex = inventoryItems.findIndex(i => i.id === request.itemId);
            if (itemIndex !== -1 && inventoryItems[itemIndex].quantity > 0) {
                const item = inventoryItems[itemIndex];
                item.quantity -= 1;
                item.assignedTo = request.userId;
                item.assignedSince = new Date().toISOString();
                inventoryItems[itemIndex] = addLogEntry(item, 'Updated', adminName);
            }
        }
        return request;
    }
    return undefined;
}

export function returnItemToStock(itemId: string, userName: string) {
    const itemIndex = inventoryItems.findIndex(i => i.id === itemId);
    if (itemIndex !== -1) {
        const item = inventoryItems[itemIndex];
        item.quantity += 1;
        item.assignedTo = undefined;
        item.assignedSince = undefined;
        inventoryItems[itemIndex] = addLogEntry(item, 'Updated', userName);

        const relatedRequestIndex = requests.findIndex(r => r.itemId === itemId && r.status === 'Approved');
        if (relatedRequestIndex !== -1) {
            // Mark as returned or simply remove from active assignments.
            // For now, we'll just log it implicitly by making the item available.
        }
    }
}

export function createRequest(
    { itemId, userId, reasonForNeed, department, intendedUseDuration }: 
    { itemId: string; userId: string; reasonForNeed: string, department: string, intendedUseDuration: string }
) {
    const item = inventoryItems.find(i => i.id === itemId);
    const user = users.find(u => u.id === userId);

    if (!item || !user) {
        console.error('Item or user not found for new request');
        return;
    }

    const newRequest: ItemRequest = {
        id: `req-${Date.now()}`,
        itemId,
        item,
        userId,
        user,
        requestDate: new Date().toISOString(),
        status: 'Pending',
        reasonForNeed,
        department,
        intendedUseDuration,
    };
    requests.unshift(newRequest);
}

// --- Notification Management ---
export function createNotification(notification: Omit<Notification, 'id' | 'date' | 'read'>) {
    const newNotification: Notification = {
        ...notification,
        id: `notif-${Date.now()}`,
        date: new Date().toISOString(),
        read: false,
    };
    notifications.unshift(newNotification);
}

export function getUnreadRequestCount(userId: string): number {
    return notifications.filter(n => 
        n.userId === userId && 
        !n.read &&
        (n.type === 'Request Approved' || n.type === 'Request Declined' || n.type === 'New Request')
    ).length;
}

export function markNotificationsAsReadForUser(userId: string) {
    notifications.forEach(n => {
        if (n.userId === userId && !n.read && (n.type === 'Request Approved' || n.type === 'Request Declined' || n.type === 'New Request')) {
            n.read = true;
        }
    });
}

// --- User/Personnel Management ---

export function createUser(userData: Omit<User, 'id' | 'assignedCategories'>): User {
    const newUser: User = {
        id: `user-${Date.now()}`,
        ...userData,
        assignedCategories: [],
    };
    users.push(newUser);
    return newUser;
}

export function updateUserRole(userId: string, newRole: UserRole) {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        users[userIndex].role = newRole;
        // When demoting from admin, clear assigned categories
        if (newRole === 'staff') {
            users[userIndex].assignedCategories = [];
        }
    }
}

export function deleteUser(userId: string) {
    users = users.filter(u => u.id !== userId);
}

export function updateUserAssignedCategories(userId: string, categories: string[]) {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        users[userIndex].assignedCategories = categories;
    }
}

// --- Stock/Inventory Management ---
export function createNewItem(itemData: Omit<InventoryItem, 'id' | 'status' | 'logs' | 'data-ai-hint'>, adminName: string) {
    let newItem: InventoryItem = {
        id: `item-${Date.now()}`,
        ...itemData,
        status: itemData.quantity > 0 ? 'Available' : 'Unavailable',
        'data-ai-hint': 'product image',
        logs: []
    };
    newItem = addLogEntry(newItem, 'Created', adminName);
    inventoryItems.unshift(newItem);
}

export function updateExistingItem(itemData: InventoryItem, adminName: string) {
    const itemIndex = inventoryItems.findIndex(i => i.id === itemData.id);
    if (itemIndex !== -1) {
        const updatedItem = addLogEntry(itemData, 'Updated', adminName);
        inventoryItems[itemIndex] = updatedItem;
    }
}

export function deleteExistingItem(itemId: string, adminName: string) {
    // In a real app, you might "soft delete" or handle differently.
    // Here we will filter it out. We could log it first if we wanted to keep a record.
    inventoryItems = inventoryItems.filter(i => i.id !== itemId);
}

// --- Profile/Settings Management ---
export function updateUserProfileData(userId: string, updates: { name?: string; avatar?: string; }) {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        if (updates.name) users[userIndex].name = updates.name;
        if (updates.avatar) users[userIndex].avatar = updates.avatar;
    }
}
