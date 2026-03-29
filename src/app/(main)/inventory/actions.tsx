
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { login as authLogin, logout as authLogout, getAuthenticatedUser } from '@/lib/auth';
import { users, updateRequestStatus, returnItemToStock, addRequest, getOnboardingGuideByRole } from '@/lib/data';
import { z } from 'zod';
import type { CartItem } from '@/context/cart-context';

export type ActionState = {
  message?: string;
  error?: string;
}

export type PasswordActionState = {
    errors?: {
        currentPassword?: string[];
        newPassword?: string[];
        confirmPassword?: string[];
        _form?: string[];
    };
    message?: string;
}


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
    await authLogin(user.id);
    console.log('[ACTION] cookie set for user:', user.id);
    redirect('/inventory');
  } else {
    console.log('[ACTION] login failed - no user for email:', email);
    redirect('/inventory');
  }
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string;
  console.log(`[ACTION] signup (simulation) for ${email}`);
  redirect('/auth/verify');
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
  redirect('/auth/login');
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
    const emails = formData.getAll('emails');

    const schema = z.array(z.string().email()).min(1);
    const parseResult = schema.safeParse(emails.filter(e => e));

    if (!parseResult.success) {
      const invalidEmail = emails.find(e => e && !z.string().email().safeParse(e).success);
      if (invalidEmail) {
        return { error: `The address "${invalidEmail}" is not a valid email.` };
      }
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
  } catch (e: any) {
    return { error: e.message || 'You do not have permission to invite users.' };
  }
}

export async function promoteUser(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await checkSuperAdmin();
    const userId = formData.get('userId') as string;
    const newRole = formData.get('newRole') as 'admin' | 'superAdmin';
    console.log(`Promoting user: ${userId} to ${newRole}`);
    // TODO: update in DB for real app; for now, we log
    revalidatePath('/inventory/personnel');
    return { message: 'User promoted' };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function demoteUser(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await checkSuperAdmin();
    const userId = formData.get('userId') as string;
    console.log(`Demoting user: ${userId}`);
    revalidatePath('/inventory/personnel');
    return { message: 'User demoted' };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function removeUser(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await checkSuperAdmin();
    const userId = formData.get('userId') as string;
    console.log(`Removing user: ${userId}`);
    revalidatePath('/inventory/personnel');
    return { message: 'User removed' };
  } catch (e: any) {
    return { error: e.message };
  }
}

/* -------------------------
  Request management - these now mutate the mock DB
   ------------------------- */

export async function submitRequest(cart: CartItem[], reason: string) {
    try {
        const user = await getAuthenticatedUser();
        if (!user) throw new Error('Unauthorized');
        
        if (!cart.length) {
            return { error: 'Your cart is empty.' };
        }

        if (!reason) {
            return { error: 'A reason for the request is required.' };
        }

        for (const cartItem of cart) {
            for (let i = 0; i < cartItem.quantity; i++) {
                addRequest(cartItem.id, user.id, reason);
            }
        }
        
        revalidatePath('/inventory/requests');
        revalidatePath('/inventory/catalogue');

        return { message: `Successfully submitted ${cart.length} request(s).`};

    } catch (e: any) {
        console.error('[ERROR] submitRequest', e);
        return { error: e.message || 'Unable to submit request' };
    }
}

export async function approveRequest(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const user = await checkAdmin();
    const requestId = formData.get('requestId') as string;
    const note = formData.get('approvalNote') as string;
    console.log(`[ACTION] Approving request ${requestId} by ${user.name} note: ${note || 'N/A'}`);

    // Mutate mock DB in data.ts
    updateRequestStatus(requestId, 'Approved', user.name);

    revalidatePath('/inventory/requests');
    return { message: 'Request approved' };
  } catch (e: any) {
    console.error('[ERROR] approveRequest', e);
    return { error: e.message || 'Unable to approve request' };
  }
}

export async function declineRequest(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const user = await checkAdmin();
    const requestId = formData.get('requestId') as string;
    const reason = formData.get('declineReason') as string;

    if (!reason) {
      return { error: 'A reason is required to decline a request.' };
    }

    console.log(`[ACTION] Declining request ${requestId} by ${user.name} reason: ${reason}`);

    // Mutate mock DB in data.ts
    updateRequestStatus(requestId, 'Declined', user.name, reason);

    revalidatePath('/inventory/requests');
    return { message: 'Request declined' };
  } catch (e: any)
{
    console.error('[ERROR] declineRequest', e);
    return { error: e.message || 'Unable to decline request' };
  }
}

export async function returnItem(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) throw new Error('Unauthorized');

    const itemId = formData.get('itemId') as string;
    console.log(`[ACTION] User ${user.id} returning item ${itemId}`);

    // Mutate mock DB
    returnItemToStock(itemId);

    revalidatePath('/inventory/requests');
    revalidatePath('/inventory/catalogue');

    return { message: 'Item return processed.' };
  } catch (e: any) {
    console.error('[ERROR] returnItem', e);
    return { error: e.message || 'Unable to process return' };
  }
}

/* -------------------------
  User Settings
   ------------------------- */

export async function changePassword(_prevState: PasswordActionState, formData: FormData): Promise<PasswordActionState> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) throw new Error('You must be logged in to change your password.');

    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    const schema = z.object({
      currentPassword: z.string().min(1, 'Current password is required.'),
      newPassword: z.string().min(6, 'New password must be at least 6 characters.'),
      confirmPassword: z.string(),
    }).refine((data) => data.newPassword === data.confirmPassword, {
      message: "New passwords don't match.",
      path: ['confirmPassword'],
    });

    const result = schema.safeParse({ currentPassword, newPassword, confirmPassword });

    if (!result.success) {
      return { errors: result.error.flatten().fieldErrors };
    }

    // --- Password verification simulation ---
    // In a real app, you'd compare a hashed password from the database.
    if (currentPassword !== 'Password') {
      return { errors: { currentPassword: ['Incorrect current password.'] } };
    }
    // --- End simulation ---

    console.log(`(Simulation) Password for user ${user.email} has been changed successfully.`);

    revalidatePath('/inventory/settings');
    return { message: 'Password updated successfully!' };
  } catch (e: any) {
    return { errors: { _form: [e.message || 'An unexpected error occurred.'] } };
  }
}

/* -------------------------
  Onboarding Guide Generation (Role-based)
   ------------------------- */

export async function generateOnboardingContent(_prevState: any) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) throw new Error('Unauthorized');
    
    // Get the guide based on the user's role from the mock DB
    const content = getOnboardingGuideByRole(user.role);

    if (!content) {
      return { ..._prevState, content: '', error: 'No onboarding guide found for your role.' };
    }

    return { ..._prevState, content, error: '' };

  } catch(e: any) {
    console.error("Error generating content:", e);
    return { ..._prevState, content: '', error: 'There was an error generating the onboarding content. Please try again.' };
  }
}
