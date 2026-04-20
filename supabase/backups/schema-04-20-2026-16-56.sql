-- AdventFlow Vibe Checkpoint DDL
-- Timestamp: 2026-04-20 16:56
-- Project: yvrwnwrzgkuuwdmdtszo
-- Fix: Enforced case-insensitive filtering for auto-approved 'MEMBER' role.

-- [TABLES]
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    mission_id UUID REFERENCES public.missions(id),
    area_id UUID REFERENCES public.areas(id),
    division_id UUID REFERENCES public.divisions(id),
    church_id UUID REFERENCES public.churches(id),
    approved_roles TEXT[] DEFAULT '{}',
    pending_roles TEXT[] DEFAULT '{}',
    rejected_roles TEXT[] DEFAULT '{}',
    onboarding_completed BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- [FUNCTIONS]
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  meta_roles TEXT[];
  pending_roles_list TEXT[];
BEGIN
  -- Extract roles from metadata, ensure we handle potential nulls
  IF (NEW.raw_user_meta_data->'roles') IS NOT NULL THEN
    meta_roles := ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'roles'));
  ELSE
    meta_roles := '{}';
  END IF;
  
  -- Pending roles: 
  -- 1. Filter out anything that matches 'Member' (Case Insensitive)
  -- 2. Remove duplicates
  pending_roles_list := ARRAY(
    SELECT DISTINCT r 
    FROM unnest(meta_roles) r 
    WHERE upper(trim(r)) != 'MEMBER'
  );

  INSERT INTO public.profiles (
    id, 
    first_name, 
    last_name, 
    avatar_url,
    mission_id,
    area_id,
    division_id,
    church_id,
    approved_roles,
    pending_roles,
    rejected_roles,
    onboarding_completed
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'avatar_url',
    (NEW.raw_user_meta_data->>'mission_id')::uuid,
    (NEW.raw_user_meta_data->>'area_id')::uuid,
    (NEW.raw_user_meta_data->>'division_id')::uuid,
    (NEW.raw_user_meta_data->>'church_id')::uuid,
    ARRAY['Member'], -- Use standard Title Case for consistency
    pending_roles_list,
    '{}',
    COALESCE((NEW.raw_user_meta_data->>'onboarding_completed')::boolean, false)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- [SUMMARY]
-- Profiles refactored to approved_roles, pending_roles, rejected_roles.
-- Member role is auto-approved and filtered from pending using case-insensitive check.
