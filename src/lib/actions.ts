

'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { login as authLogin, logout as authLogout, getAuthenticatedUser } from './auth';
import { users, updateRequestStatus, returnItemToStock, createRequest, inventoryItems as allInventoryItems, createNotification, notifications as allNotifications, updateUserRole, deleteUser, createNewItem, updateExistingItem, deleteExistingItem, updateUserAssignedCategories, updateUserProfileData, createUser, markNotificationsAsReadForUser } from './data';
import type { UserRole, ItemStatus, InventoryItem, User } from './types';
import { passwordSchema } from './schemas';
import { z } from 'zod';


export type ActionState = {
  message?: string;
  error?: string;
};


/* -------------------------
  Server-side auth helpers
   ------------------------- */

async function checkSuperAdmin() {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');
  if (user.role !== 'superAdmin') {
    throw new Error('Forbidden: requires superAdmin');
  }
  return user;
}

async function checkAdmin() {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error('Unauthorized');
  if (user.role !== 'admin' && user.role !== 'superAdmin') {
    throw new Error('Forbidden: requires admin');
  }
  return user;
}

/* -------------------------
  Onboarding / Auth flows
   ------------------------- */

export async function login(formData: FormData) {
  const email = (formData.get('email') as string) || '';
  console.log('[ACTION] login attempt for', email);

  const user = users.find(u => u.email === email);
  if (user) {
    // In a real app, you would also verify the password here.
    await authLogin(user.id);
    console.log('[ACTION] cookie set for user:', user.id);
    redirect('/inventory');
  } else {
    console.log('[ACTION] login failed - no user for email:', email);
    // It's better to redirect to login with an error message.
    redirect('/auth/login?error=Invalid+credentials');
  }
}

export async function handleSignIn(userData: { email: string; name: string; avatar?: string; }) {
    if (!userData.email || !userData.name) {
        throw new Error('Email and name are required for sign-in.');
    }

    let user = users.find(u => u.email === userData.email);

    if (!user) {
        // User doesn't exist, create a new one with 'staff' role by default
        console.log(`[ACTION] Creating new user for ${userData.email}`);
        user = createUser({
            name: userData.name,
            email: userData.email,
            avatar: userData.avatar || `https://i.pravatar.cc/150?u=${userData.email}`,
            role: 'staff',
        });
    }

    await authLogin(user.id);
    console.log(`[ACTION] Session created for user ${user.id} (${user.email})`);
    redirect('/inventory');
}

export async function signup(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string; // In a real app, hash this securely.

    if (!name || !email || !password) {
        redirect('/auth/signup?error=All+fields+are+required');
        return;
    }

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        redirect('/auth/signup?error=User+with+this+email+already+exists');
        return;
    }

    console.log(`(Simulation) Creating new user via email/password for ${email}`);
    createUser({
        name,
        email,
        avatar: `https://i.pravatar.cc/150?u=${email}`,
        role: 'staff'
    });

    // Automatically log in the user after signup for this prototype.
    // In a real app, you'd send a verification email.
    const newUser = users.find(u => u.email === email);
    if (newUser) {
        await authLogin(newUser.id);
        redirect('/auth/verify');
    } else {
        // This should not happen if createUser is successful
        redirect('/auth/signup?error=Could+not+create+account');
    }
}

export async function verifyOtp(formData: FormData) {
  const otp = formData.get('otp') as string;
  if (otp && otp.length === 4 && /^\d+$/.test(otp)) {
    redirect('/auth/success');
  } else {
    redirect('/auth/verify?error=Invalid+code');
  }
}

export async function logout() {
  await authLogout();
  redirect('/');
}

/* -------------------------
  Invite / promote / demote / remove
   ------------------------- */

async function sendInvitationEmail(email: string, token: string) {
  const signupLink = `https://your-app-domain.com/auth/signup?token=${token}`;
  console.log(`(Simulation) Sending invite to: ${email} with link: ${signupLink}`);
}

export async function inviteUser(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await checkSuperAdmin();
    const emailsString = formData.get('emails') as string || '';
    const emails = emailsString.split(',').map(e => e.trim()).filter(e => e);

    const schema = z.array(z.string().email()).min(1);
    const parseResult = schema.safeParse(emails);

    if (!parseResult.success) {
      return { error: 'Please provide at least one valid email address.' };
    }

    for (const email of parseResult.data) {
      const inviteToken = crypto.randomUUID();
      console.log(`(Simulation) Storing invite token ${inviteToken} for ${email} in database.`);
      await sendInvitationEmail(email, inviteToken);
    }

    revalidatePath('/inventory/personnel');
    const count = parseResult.data.length;
    return { message: `Successfully sent ${count} invitation${count > 1 ? 's' : ''}.` };
  } catch (e) {
    const error = e as Error;
    return { error: error.message || 'You do not have permission to invite users.' };
  }
}

export async function promoteUser(prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const admin = await checkSuperAdmin();
    const userId = formData.get('userId') as string;
    const newRole = formData.get('newRole') as UserRole;
    if (admin.id === userId) throw new Error('Cannot change your own role.');
    if (!['admin', 'superAdmin'].includes(newRole)) throw new Error('Invalid role specified.');

    const userToUpdate = users.find(u => u.id === userId);
    if (!userToUpdate) throw new Error('User not found.');

    console.log(`Promoting user: ${userId} to ${newRole}`);
    updateUserRole(userId, newRole);

    revalidatePath('/inventory/personnel');
    return { message: `User ${userToUpdate.name} promoted to ${newRole}.` };
  } catch (e) {
    const error = e as Error;
    return { error: error.message };
  }
}

export async function demoteUser(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const admin = await checkSuperAdmin();
    const userId = formData.get('userId') as string;
    if (admin.id === userId) throw new Error('Cannot change your own role.');
    
    const userToUpdate = users.find(u => u.id === userId);
    if (!userToUpdate) throw new Error('User not found.');
    if (userToUpdate.role === 'staff') return { error: 'User is already at the lowest role.' };
    
    const newRole: UserRole = userToUpdate.role === 'superAdmin' ? 'admin' : 'staff';

    console.log(`Demoting user: ${userId} to ${newRole}`);
    updateUserRole(userId, newRole);

    revalidatePath('/inventory/personnel');
    return { message: `User ${userToUpdate.name} demoted to ${newRole}.` };
  } catch (e) {
    const error = e as Error;
    return { error: error.message };
  }
}

export async function removeUser(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const admin = await checkSuperAdmin();
    const userId = formData.get('userId') as string;
    if (admin.id === userId) throw new Error('Cannot remove yourself.');
    const userToDelete = users.find(u => u.id === userId);
    if (!userToDelete) throw new Error('User not found.');
    
    console.log(`Removing user: ${userId}`);
    deleteUser(userId);

    revalidatePath('/inventory/personnel');
    return { message: `User ${userToDelete.name} has been removed.` };
  } catch (e) {
    const error = e as Error;
    return { error: error.message };
  }
}


export async function assignCategories(_prevState: ActionState, formData: FormData): Promise<ActionState> {
    try {
        await checkSuperAdmin();
        const userId = formData.get('userId') as string;
        const categories = formData.getAll('categories') as string[];

        updateUserAssignedCategories(userId, categories);
        revalidatePath('/inventory/personnel');
        return { message: 'Assigned categories updated successfully.' };
    } catch (e) {
      const error = e as Error;
      return { error: error.message };
    }
}

/* -------------------------
  Request management
   ------------------------- */
export async function submitRequest(_prevState: ActionState, formData: FormData): Promise<ActionState> {
    try {
        const user = await getAuthenticatedUser();
        if (!user) throw new Error('You must be logged in to make a request.');

        const itemIds = formData.getAll('itemIds[]') as string[];
        const reasonForNeed = formData.get('reasonForNeed') as string;
        const department = formData.get('department') as string;
        const intendedUseDuration = formData.get('intendedUseDuration') as string;

        if (!reasonForNeed || !department || !intendedUseDuration) {
            return { error: 'Please fill out all required fields.' };
        }
        if (itemIds.length === 0) {
            return { error: 'Your cart is empty or no item was specified.' };
        }

        console.log(`[ACTION] User ${user.id} requesting items: ${itemIds.join(', ')}`);

        for (const itemId of itemIds) {
            const item = allInventoryItems.find(i => i.id === itemId);
            if (!item) continue;
            createRequest({ 
                itemId, 
                userId: user.id, 
                reasonForNeed,
                department,
                intendedUseDuration
            });

            // Find admins for the category and superAdmins, and create a notification
            const categoryAdmins = users.filter(u => 
                (u.role === 'admin' && u.assignedCategories?.includes(item.category)) || u.role === 'superAdmin'
            );

            for (const admin of categoryAdmins) {
                createNotification({
                    userId: admin.id,
                    title: `New Request: ${item.name}`,
                    message: `${user.name} has requested ${item.name}.`,
                    type: 'New Request',
                    link: '/inventory/requests'
                });
            }
        }

        revalidatePath('/inventory/requests');
        revalidatePath('/(main)/layout');
        return { message: 'Your request has been submitted successfully.' };

    } catch (e) {
      const error = e as Error;
      console.error('[ERROR] submitRequest', error);
      return { error: error.message || 'Failed to submit request.' };
    }
}

export async function approveRequest(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const admin = await checkAdmin();
    const requestId = formData.get('requestId') as string;
    const note = formData.get('approvalNote') as string;
    console.log(`[ACTION] Approving request ${requestId} by ${admin.name} note: ${note || 'N/A'}`);

    const updatedRequest = updateRequestStatus(requestId, 'Approved', admin.name);

    if (updatedRequest) {
        createNotification({
            userId: updatedRequest.userId,
            title: `Request Approved: ${updatedRequest.item.name}`,
            message: `Your request for ${updatedRequest.item.name} has been approved by ${admin.name}. ${note || ''}`,
            type: 'Request Approved',
            link: '/inventory/requests'
        });
    }

    revalidatePath('/inventory/requests');
    revalidatePath('/inventory/catalogue');
    revalidatePath('/inventory/profile');
    revalidatePath('/(main)/layout');
    return { message: 'Request approved' };
  } catch (e) {
    const error = e as Error;
    console.error('[ERROR] approveRequest', error);
    return { error: error.message || 'Unable to approve request' };
  }
}

export async function declineRequest(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const admin = await checkAdmin();
    const requestId = formData.get('requestId') as string;
    const reason = formData.get('declineReason') as string;

    if (!reason) {
      return { error: 'A reason is required to decline a request.' };
    }

    console.log(`[ACTION] Declining request ${requestId} by ${admin.name} reason: ${reason}`);
    
    const updatedRequest = updateRequestStatus(requestId, 'Declined', admin.name, reason);
    
    if (updatedRequest) {
        createNotification({
            userId: updatedRequest.userId,
            title: `Request Declined: ${updatedRequest.item.name}`,
            message: `Your request for ${updatedRequest.item.name} was declined. Reason: ${reason}`,
            type: 'Request Declined',
            link: '/inventory/requests'
        });
    }

    revalidatePath('/inventory/requests');
    revalidatePath('/inventory/profile');
    revalidatePath('/(main)/layout');
    return { message: 'Request declined' };
  } catch (e) {
    const error = e as Error;
    console.error('[ERROR] declineRequest', error);
    return { error: error.message || 'Unable to decline request' };
  }
}

export async function returnItem(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) throw new Error('Unauthorized');

    const itemId = formData.get('itemId') as string;
    console.log(`[ACTION] User ${user.id} returning item ${itemId}`);

    returnItemToStock(itemId, user.name);

    revalidatePath('/inventory/requests');
    revalidatePath('/inventory/catalogue');
    revalidatePath('/inventory/profile');
    revalidatePath('/inventory/stock');

    return { message: 'Item return processed.' };
  } catch (e) {
    const error = e as Error;
    console.error('[ERROR] returnItem', error);
    return { error: error.message || 'Unable to process return' };
  }
}

/* -------------------------
  Stock Management
   ------------------------- */
export async function createOrUpdateItem(formData: FormData): Promise<ActionState> {
    try {
        const admin = await checkAdmin();
        const id = formData.get('id') as string | null;
        const name = formData.get('name') as string;
        const quantity = Number(formData.get('quantity') as string);
        const category = formData.get('category') as string;
        const imageUrl = formData.get('imageUrl') as string;

        const status: ItemStatus = quantity > 0 ? 'Available' : 'Unavailable';

        if (id) {
            // Update
            const existingItem = allInventoryItems.find(i => i.id === id);
            if (!existingItem) throw new Error("Item not found");
            const updatedItemData: InventoryItem = { ...existingItem, name, quantity, category, imageUrl, status };
            updateExistingItem(updatedItemData, admin.name);
            revalidatePath('/inventory/stock');
            return { message: `"${name}" has been updated.`};
        } else {
            // Create
            const newItem = { name, quantity, category, imageUrl };
            createNewItem(newItem, admin.name);
            revalidatePath('/inventory/stock');
            return { message: `"${name}" has been added to inventory.`};
        }
    } catch (e) {
      const error = e as Error;
      return { error: error.message };
    }
}

export async function deleteItem(formData: FormData): Promise<ActionState> {
    try {
        const admin = await checkAdmin();
        const itemId = formData.get('itemId') as string;
        
        const itemToDelete = allInventoryItems.find(i => i.id === itemId);
        if (!itemToDelete) throw new Error("Item not found");
        
        deleteExistingItem(itemId, admin.name);
        revalidatePath('/inventory/stock');
        return { message: `"${itemToDelete.name}" has been deleted.`};

    } catch (e) {
      const error = e as Error;
      return { error: error.message };
    }
}


/* -------------------------
  User Settings
   ------------------------- */
export async function markRequestsAsRead(userId: string) {
    try {
        if (!userId) return;
        markNotificationsAsReadForUser(userId);
        revalidatePath('/(main)/layout'); 
        console.log(`[ACTION] Marked request notifications as read for user ${userId}`);
    } catch (e) {
      const error = e as Error;
      console.error('[ERROR] markRequestsAsRead', error);
    }
}

export type PasswordChangeState = {
  message?: string;
  errors?: z.inferFlattenedErrors<typeof passwordSchema>;
};

export async function changePassword(_prevState: PasswordChangeState, formData: FormData): Promise<PasswordChangeState> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) throw new Error('You must be logged in to change your password.');

    const result = passwordSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!result.success) {
      return { errors: result.error.flatten() };
    }

    // This is a mock password check
    if (result.data.currentPassword !== 'Password') {
       return { errors: { formErrors: [], fieldErrors: { currentPassword: ['Incorrect current password.'] } } };
    }

    console.log(`(Simulation) Password for user ${user.email} has been changed successfully.`);

    revalidatePath('/inventory/settings');
    return { message: 'Password updated successfully!' };
  } catch (e) {
    const error = e as Error;
    return { errors: { formErrors: [error.message || 'An unexpected error occurred.'], fieldErrors: {} } };
  }
}

export async function updateProfile(formData: FormData): Promise<ActionState> {
    try {
        const userId = formData.get('userId') as string;
        const displayName = formData.get('displayName') as string;
        const avatar = formData.get('avatar') as string | null;

        if (!userId) throw new Error("User ID not found");
        
        const updates: { name?: string, avatar?: string } = {};
        if (displayName) updates.name = displayName;
        if (avatar) updates.avatar = avatar;

        if (Object.keys(updates).length > 0) {
            updateUserProfileData(userId, updates);
        }

        revalidatePath('/inventory/settings');
        revalidatePath('/(main)/layout'); // To update header avatar
        return { message: 'Profile updated successfully!' };

    } catch (e) {
      const error = e as Error;
      return { error: error.message };
    }
}
