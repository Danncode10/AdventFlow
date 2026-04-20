-- AdventFlow Vibe Checkpoint DDL
-- Timestamp: 2026-04-20 16:50
-- Project: yvrwnwrzgkuuwdmdtszo

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

CREATE TABLE public.missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    mission_id UUID REFERENCES public.missions(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.divisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    area_id UUID REFERENCES public.areas(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.churches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    division_id UUID REFERENCES public.divisions(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- [SECURITY]
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.divisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.churches ENABLE ROW LEVEL SECURITY;

-- [FUNCTIONS]
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  meta_roles TEXT[];
  pending_roles_list TEXT[];
BEGIN
  -- Extract roles from metadata
  meta_roles := ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'roles'));
  
  -- Pending roles are everything EXCEPT Member (which is auto-approved)
  pending_roles_list := ARRAY(
    SELECT r FROM unnest(meta_roles) r WHERE r != 'Member'
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
    ARRAY['Member'], -- Member is always approved
    pending_roles_list,
    '{}',
    COALESCE((NEW.raw_user_meta_data->>'onboarding_completed')::boolean, false)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- [TRIGGERS]
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
