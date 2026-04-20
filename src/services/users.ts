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

