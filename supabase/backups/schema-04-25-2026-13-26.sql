-- =============================================================================
-- VIBE CHECKPOINT — Full DDL Snapshot
-- Project  : NELM_management_system (yvrwnwrzgkuuwdmdtszo)
-- Captured : 2026-04-25 13:26
-- =============================================================================

-- -----------------------------------------------------------------------------
-- EXTENSIONS
-- -----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


-- -----------------------------------------------------------------------------
-- ENUMS
-- -----------------------------------------------------------------------------
CREATE TYPE public.role_status AS ENUM (
  'pending',
  'approved',
  'rejected'
);

CREATE TYPE public.structure_level AS ENUM (
  'MISSION',
  'AREA',
  'DIVISION',
  'CHURCH'
);


-- -----------------------------------------------------------------------------
-- TABLES
-- -----------------------------------------------------------------------------

-- missions
CREATE TABLE public.missions (
  id          UUID NOT NULL DEFAULT uuid_generate_v4(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  name        TEXT NOT NULL,
  slug        TEXT,
  logo_url    TEXT,
  address     TEXT,
  settings    JSONB DEFAULT '{}'::jsonb,
  CONSTRAINT missions_pkey PRIMARY KEY (id),
  CONSTRAINT missions_slug_key UNIQUE (slug)
);

-- areas
CREATE TABLE public.areas (
  id           UUID NOT NULL DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ DEFAULT now(),
  mission_id   UUID NOT NULL,
  name         TEXT NOT NULL,
  province     TEXT,
  headquarters TEXT,
  CONSTRAINT areas_pkey PRIMARY KEY (id),
  CONSTRAINT areas_mission_id_fkey FOREIGN KEY (mission_id) REFERENCES public.missions(id) ON DELETE CASCADE
);

-- divisions
CREATE TABLE public.divisions (
  id            UUID NOT NULL DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ DEFAULT now(),
  area_id       UUID NOT NULL,
  name          TEXT NOT NULL,
  district_code TEXT,
  CONSTRAINT divisions_pkey PRIMARY KEY (id),
  CONSTRAINT divisions_area_id_fkey FOREIGN KEY (area_id) REFERENCES public.areas(id) ON DELETE CASCADE
);

-- churches
CREATE TABLE public.churches (
  id                   UUID NOT NULL DEFAULT gen_random_uuid(),
  created_at           TIMESTAMPTZ DEFAULT now(),
  division_id          UUID NOT NULL,
  name                 TEXT NOT NULL,
  address              TEXT,
  location_coordinates POINT,
  established_date     DATE,
  CONSTRAINT churches_pkey PRIMARY KEY (id),
  CONSTRAINT churches_division_id_fkey FOREIGN KEY (division_id) REFERENCES public.divisions(id) ON DELETE CASCADE
);

-- available_roles
CREATE TABLE public.available_roles (
  id          UUID NOT NULL DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT available_roles_pkey PRIMARY KEY (id),
  CONSTRAINT available_roles_name_key UNIQUE (name)
);

-- profiles
-- Note: ordinal positions 3, 5, 14 are dropped columns (gaps intentional).
CREATE TABLE public.profiles (
  id                   UUID NOT NULL,
  updated_at           TIMESTAMPTZ,
  avatar_url           TEXT,
  is_active            BOOLEAN DEFAULT false,
  onboarding_completed BOOLEAN DEFAULT false,
  first_name           TEXT,
  last_name            TEXT,
  mission_id           UUID,
  area_id              UUID,
  division_id          UUID,
  church_id            UUID,
  approved_roles       TEXT[] DEFAULT '{}'::text[],
  pending_roles        TEXT[] DEFAULT '{}'::text[],
  rejected_roles       TEXT[] DEFAULT '{}'::text[],
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_mission_id_fkey  FOREIGN KEY (mission_id)  REFERENCES public.missions(id),
  CONSTRAINT profiles_area_id_fkey     FOREIGN KEY (area_id)     REFERENCES public.areas(id),
  CONSTRAINT profiles_division_id_fkey FOREIGN KEY (division_id) REFERENCES public.divisions(id),
  CONSTRAINT profiles_church_id_fkey   FOREIGN KEY (church_id)   REFERENCES public.churches(id)
);

-- user_roles
CREATE TABLE public.user_roles (
  id               UUID NOT NULL DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL,
  role             TEXT NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  is_approved      BOOLEAN DEFAULT false,
  approved_by      UUID,
  approved_at      TIMESTAMPTZ,
  status           public.role_status NOT NULL DEFAULT 'pending'::role_status,
  rejected_by      UUID,
  rejected_at      TIMESTAMPTZ,
  rejection_reason TEXT,
  CONSTRAINT user_roles_pkey PRIMARY KEY (id),
  CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role),
  CONSTRAINT user_roles_user_id_fkey    FOREIGN KEY (user_id)     REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT user_roles_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.profiles(id),
  CONSTRAINT user_roles_rejected_by_fkey FOREIGN KEY (rejected_by) REFERENCES public.profiles(id)
);


-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- -----------------------------------------------------------------------------

ALTER TABLE public.missions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.areas           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.divisions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.churches        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.available_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles      ENABLE ROW LEVEL SECURITY;

-- missions
CREATE POLICY "Missions are viewable by everyone" ON public.missions
  AS PERMISSIVE FOR SELECT TO public USING (true);

CREATE POLICY "Public Read Missions" ON public.missions
  AS PERMISSIVE FOR SELECT TO public USING (true);

-- areas
CREATE POLICY "Public Read Areas" ON public.areas
  AS PERMISSIVE FOR SELECT TO public USING (true);

-- divisions
CREATE POLICY "Public Read Divisions" ON public.divisions
  AS PERMISSIVE FOR SELECT TO public USING (true);

-- churches
CREATE POLICY "Public Read Churches" ON public.churches
  AS PERMISSIVE FOR SELECT TO public USING (true);

-- available_roles
CREATE POLICY "Allow public read for all roles" ON public.available_roles
  AS PERMISSIVE FOR SELECT TO authenticated USING (true);

-- profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  AS PERMISSIVE FOR SELECT TO public USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  AS PERMISSIVE FOR UPDATE TO public USING (auth.uid() = id);

-- user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
  AS PERMISSIVE FOR SELECT TO public USING (auth.uid() = user_id);

CREATE POLICY "Users can view approval status" ON public.user_roles
  AS PERMISSIVE FOR SELECT TO public USING (auth.uid() = user_id);


-- -----------------------------------------------------------------------------
-- FUNCTIONS
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
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
    ARRAY['Member'], -- Standard Title Case for consistency
    pending_roles_list,
    '{}',
    COALESCE((NEW.raw_user_meta_data->>'onboarding_completed')::boolean, false)
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.rls_auto_enable()
RETURNS event_trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'pg_catalog'
AS $function$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
    IF cmd.schema_name IS NOT NULL
      AND cmd.schema_name IN ('public')
      AND cmd.schema_name NOT IN ('pg_catalog','information_schema')
      AND cmd.schema_name NOT LIKE 'pg_toast%'
      AND cmd.schema_name NOT LIKE 'pg_temp%'
    THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
    ELSE
      RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
    END IF;
  END LOOP;
END;
$function$;


-- -----------------------------------------------------------------------------
-- TRIGGERS
-- -----------------------------------------------------------------------------

-- Fires handle_new_user() after a new auth user is inserted
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- -----------------------------------------------------------------------------
-- VERIFICATION CHECKLIST
-- ✅ Tables    : missions, areas, divisions, churches, available_roles, profiles, user_roles
-- ✅ Enums     : role_status, structure_level
-- ✅ RLS       : ENABLED on all 7 public tables (not forced)
-- ✅ Policies  : 10 policies across 6 tables
-- ✅ Functions : handle_new_user (trigger fn), rls_auto_enable (event trigger fn)
-- ✅ Triggers  : on_auth_user_created → auth.users → handle_new_user()
-- ✅ Core arch : profiles table ✓ | handle_new_user function ✓
-- =============================================================================
