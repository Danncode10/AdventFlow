-- Supabase Schema Snapshot
-- Generated: 2026-04-20 11:31
-- Project ID: yvrwnwrzgkuuwdmdtszo

-- ── ENUMS ──
DO $$ BEGIN
    CREATE TYPE "public"."structure_level" AS ENUM ('MISSION', 'AREA', 'DIVISION', 'CHURCH');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ── FUNCTIONS ──
CREATE OR REPLACE FUNCTION "public"."handle_new_user"()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$function$;

CREATE OR REPLACE FUNCTION "public"."rls_auto_enable"()
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
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
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

-- ── TABLES ──
CREATE TABLE IF NOT EXISTS "public"."structures" (
    "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
    "created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    "name" text NOT NULL,
    "level" structure_level NOT NULL,
    "parent_id" uuid,
    "metadata" jsonb DEFAULT '{}'::jsonb,
    CONSTRAINT "structures_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "structures_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."structures"("id") ON DELETE CASCADE,
    CONSTRAINT "structures_level_check" CHECK ((((level = 'MISSION'::structure_level) AND (parent_id IS NULL)) OR ((level = 'AREA'::structure_level) AND (parent_id IS NOT NULL)) OR ((level = 'DIVISION'::structure_level) AND (parent_id IS NOT NULL)) OR ((level = 'CHURCH'::structure_level) AND (parent_id IS NOT NULL))))
);

CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" uuid NOT NULL,
    "updated_at" timestamp with time zone,
    "full_name" text,
    "avatar_url" text,
    "structure_id" uuid,
    "is_active" boolean DEFAULT false,
    "onboarding_completed" boolean DEFAULT false,
    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE,
    CONSTRAINT "profiles_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "public"."structures"("id"),
    CONSTRAINT "profiles_full_name_length" CHECK ((char_length(full_name) >= 3))
);

CREATE TABLE IF NOT EXISTS "public"."user_roles" (
    "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
    "user_id" uuid NOT NULL,
    "role" text NOT NULL,
    "created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE,
    CONSTRAINT "user_roles_user_id_role_key" UNIQUE (user_id, role)
);

-- ── INDEXES ──
CREATE INDEX IF NOT EXISTS "idx_structures_parent_id" ON "public"."structures" USING btree (parent_id);

-- ── RLS POLICIES ──
ALTER TABLE "public"."structures" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."user_roles" ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Structures are viewable by everyone" ON "public"."structures" FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users can update their own profile" ON "public"."profiles" FOR UPDATE USING ((auth.uid() = id));
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users can view their own profile" ON "public"."profiles" FOR SELECT USING ((auth.uid() = id));
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users can view their own roles" ON "public"."user_roles" FOR SELECT USING ((auth.uid() = user_id));
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ── TRIGGERS ──
DO $$ BEGIN
    CREATE TRIGGER "on_auth_user_created" AFTER INSERT ON "auth"."users" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_user"();
EXCEPTION WHEN duplicate_object THEN null; END $$;
