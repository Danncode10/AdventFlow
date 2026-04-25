"use server";

import { createClient } from "@/utils/supabase/server";

export type MemberStatus = "active" | "inactive" | "transferred_out" | "deceased" | "missing";

export interface ChurchMember {
  id: string;
  church_id: string;
  linked_profile_id: string | null;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  membership_status: MemberStatus;
  membership_date: string | null;
  baptism_date: string | null;
  contact_number: string | null;
  address: string | null;
  transfer_from: string | null;
  transfer_to: string | null;
  notes: string | null;
  added_by: string | null;
  created_at: string;
  updated_at: string;
  linked_profile?: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  } | null;
}

export interface AddMemberInput {
  first_name: string;
  last_name: string;
  middle_name?: string;
  membership_date?: string;
  baptism_date?: string;
  contact_number?: string;
  address?: string;
  transfer_from?: string;
  notes?: string;
  linked_profile_id?: string;
}

async function getClerkProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, church_id, approved_roles")
    .eq("id", user.id)
    .single();

  if (!profile?.church_id) throw new Error("No church assigned");
  if (!profile.approved_roles?.includes("Church Clerk")) {
    throw new Error("Access denied: Church Clerk role required");
  }

  return { user, profile, churchId: profile.church_id };
}

export async function getChurchMembers() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("church_id")
    .eq("id", user.id)
    .single();

  if (!profile?.church_id) return [];

  const { data, error } = await supabase
    .from("church_members")
    .select(`
      *,
      linked_profile:profiles!linked_profile_id(first_name, last_name, avatar_url)
    `)
    .eq("church_id", profile.church_id)
    .order("last_name", { ascending: true });

  if (error) throw error;
  return (data ?? []) as ChurchMember[];
}

export async function getMemberStats() {
  const members = await getChurchMembers();
  return {
    total: members.length,
    active: members.filter(m => m.membership_status === "active").length,
    inactive: members.filter(m => m.membership_status === "inactive").length,
    transferred_out: members.filter(m => m.membership_status === "transferred_out").length,
    deceased: members.filter(m => m.membership_status === "deceased").length,
    missing: members.filter(m => m.membership_status === "missing").length,
    linked: members.filter(m => m.linked_profile_id !== null).length,
  };
}

export async function addChurchMember(input: AddMemberInput) {
  const supabase = await createClient();
  const { churchId, user } = await getClerkProfile();

  const { data, error } = await supabase
    .from("church_members")
    .insert({
      church_id: churchId,
      added_by: user.id,
      first_name: input.first_name.trim(),
      last_name: input.last_name.trim(),
      middle_name: input.middle_name?.trim() || null,
      membership_date: input.membership_date || null,
      baptism_date: input.baptism_date || null,
      contact_number: input.contact_number?.trim() || null,
      address: input.address?.trim() || null,
      transfer_from: input.transfer_from?.trim() || null,
      notes: input.notes?.trim() || null,
      linked_profile_id: input.linked_profile_id || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateMemberStatus(memberId: string, status: MemberStatus, extra?: { transfer_to?: string }) {
  const supabase = await createClient();
  await getClerkProfile();

  const { error } = await supabase
    .from("church_members")
    .update({ membership_status: status, ...extra })
    .eq("id", memberId);

  if (error) throw error;
}

export async function updateChurchMember(memberId: string, updates: Partial<AddMemberInput>) {
  const supabase = await createClient();
  await getClerkProfile();

  const { error } = await supabase
    .from("church_members")
    .update({
      ...updates,
      first_name: updates.first_name?.trim(),
      last_name: updates.last_name?.trim(),
    })
    .eq("id", memberId);

  if (error) throw error;
}

export async function deleteChurchMember(memberId: string) {
  const supabase = await createClient();
  await getClerkProfile();

  const { error } = await supabase
    .from("church_members")
    .delete()
    .eq("id", memberId);

  if (error) throw error;
}

export async function linkProfileToMember(memberId: string, profileId: string) {
  const supabase = await createClient();
  await getClerkProfile();

  const { error } = await supabase
    .from("church_members")
    .update({ linked_profile_id: profileId })
    .eq("id", memberId);

  if (error) throw error;
}

export async function getChurchProfiles() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: myProfile } = await supabase
    .from("profiles")
    .select("church_id")
    .eq("id", user.id)
    .single();

  if (!myProfile?.church_id) return [];

  const { data, error } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, avatar_url, approved_roles")
    .eq("church_id", myProfile.church_id)
    .order("last_name", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getClerkDashboardData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select(`
      id, first_name, last_name, church_id, approved_roles,
      churches!church_id(name)
    `)
    .eq("id", user.id)
    .single();

  return { user, profile };
}
