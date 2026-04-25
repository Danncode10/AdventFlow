"use server";

import { createClient } from '@/utils/supabase/server';

export async function getMissionsList() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('missions').select('id, name').order('name');
  if (error) throw error;
  return data;
}

export async function getAllMissions() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('missions')
    .select('id, name, slug, address, logo_url, created_at')
    .order('name');
  if (error) throw error;
  return data ?? [];
}

export async function getMissionBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('missions')
    .select('id, name, slug, address, logo_url, created_at')
    .eq('slug', slug)
    .single();
  if (error) throw error;
  return data;
}

export async function getAreasWithDivisions(missionId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('areas')
    .select('id, name, divisions(id, name)')
    .eq('mission_id', missionId)
    .order('name');
  if (error) throw error;
  return data ?? [];
}

export async function getDivisionsWithChurches(missionId: string) {
  const supabase = await createClient();
  // Get all areas first, then get divisions with churches
  const { data: areas, error: areaErr } = await supabase
    .from('areas')
    .select('id')
    .eq('mission_id', missionId);
  if (areaErr) throw areaErr;
  const areaIds = (areas ?? []).map((a: { id: string }) => a.id);
  if (areaIds.length === 0) return [];

  const { data, error } = await supabase
    .from('divisions')
    .select('id, name, area_id, churches(id, name)')
    .in('area_id', areaIds)
    .order('name');
  if (error) throw error;
  return data ?? [];
}

export async function getChurchesByMission(missionId: string) {
  const supabase = await createClient();
  const { data: areas, error: areaErr } = await supabase
    .from('areas')
    .select('id')
    .eq('mission_id', missionId);
  if (areaErr) throw areaErr;
  const areaIds = (areas ?? []).map((a: { id: string }) => a.id);
  if (areaIds.length === 0) return [];

  const { data: divisions, error: divErr } = await supabase
    .from('divisions')
    .select('id')
    .in('area_id', areaIds);
  if (divErr) throw divErr;
  const divIds = (divisions ?? []).map((d: { id: string }) => d.id);
  if (divIds.length === 0) return [];

  const { data, error } = await supabase
    .from('churches')
    .select('id, name, division_id')
    .in('division_id', divIds)
    .order('name');
  if (error) throw error;
  return data ?? [];
}


export async function submitOnboardingRequest(params: {
  mission_id?: string;
  area_id?: string;
  division_id?: string;
  church_id?: string;
  role: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // 1. Create a pending role request
  const { error: roleError } = await supabase
    .from('user_roles')
    .insert({
      user_id: user.id,
      role: params.role,
      status: 'pending',
      mission_id: params.mission_id,
      area_id: params.area_id,
      division_id: params.division_id,
      church_id: params.church_id
    });

  if (roleError) throw roleError;

  // 2. Update profile with the requested ID so they are associated (but pending)
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      mission_id: params.mission_id,
      area_id: params.area_id,
      division_id: params.division_id,
      church_id: params.church_id,
      structure_id: params.church_id || params.division_id || params.area_id || params.mission_id // Fallback for old code
    })
    .eq('id', user.id);

  if (profileError) throw profileError;

  return { success: true };
}
