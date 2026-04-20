"use server";

import { createClient } from '@/utils/supabase/server';
import { verifyRateLimit } from '@/lib/ratelimit';


export async function getAllProfiles() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Check if current user has an admin role
  const { data: roles } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .eq('status', 'approved');

  const isAdmin = roles?.some(r => r.role === 'MISSION_ADMIN' || r.role === 'SYSTEM_ADMIN');

  if (!isAdmin) {
    // Regular users might only see public info
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, first_name, last_name');
    return profiles || [];
  }

  // Admin can see everything
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*');
  return profiles || [];
}

export async function getProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw error;
  return profile;
}

export async function updateProfile(updates: {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { success } = await verifyRateLimit(user.id);
  if (!success) throw new Error("Rate limit exceeded. Try again in 10 seconds.");

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}


export async function getAvailableRoles() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('available_roles')
    .select('*')
    .order('name');
  if (error) throw error;
  return data;
}

export async function requestRole(roleName: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Fetch current pending roles to avoid overwriting
  const { data: profile } = await supabase
    .from('profiles')
    .select('pending_roles, approved_roles')
    .eq('id', user.id)
    .single();

  if (!profile) throw new Error('Profile not found');

  // Check if already approved or pending
  if (profile.approved_roles?.includes(roleName) || profile.pending_roles?.includes(roleName)) {
    throw new Error('Role already processed or pending');
  }

  const updatedPending = [...(profile.pending_roles || []), roleName];

  const { error } = await supabase
    .from('profiles')
    .update({ 
      pending_roles: updatedPending 
    })
    .eq('id', user.id);

  if (error) throw error;
  return { success: true };
}

export async function requestMultipleRoles(roleNames: string[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: profile } = await supabase
    .from('profiles')
    .select('pending_roles, approved_roles')
    .eq('id', user.id)
    .single();

  if (!profile) throw new Error('Profile not found');

  // Filter out roles that are already approved or pending
  const newRoles = roleNames.filter(r => 
    !profile.approved_roles?.includes(r) && 
    !profile.pending_roles?.includes(r)
  );

  if (newRoles.length === 0) return { success: true };

  const updatedPending = [...(profile.pending_roles || []), ...newRoles];

  const { error } = await supabase
    .from('profiles')
    .update({ 
      pending_roles: updatedPending 
    })
    .eq('id', user.id);

  if (error) throw error;
  return { success: true };
}

export async function cancelPendingRole(roleName: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: profile } = await supabase
    .from('profiles')
    .select('pending_roles')
    .eq('id', user.id)
    .single();

  if (!profile) throw new Error('Profile not found');

  const updatedPending = (profile.pending_roles || []).filter((r: string) => r !== roleName);

  const { error } = await supabase
    .from('profiles')
    .update({ 
      pending_roles: updatedPending 
    })
    .eq('id', user.id);

  if (error) throw error;
  return { success: true };
}
