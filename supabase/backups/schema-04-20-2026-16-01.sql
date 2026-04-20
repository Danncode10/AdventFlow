-- AdventFlow Vibe Checkpoint DDL
-- Generated: 2026-04-20 16:01
-- Project: yvrwnwrzgkuuwdmdtszo

-- 1. Enums
CREATE TYPE public.role_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.structure_level AS ENUM ('MISSION', 'AREA', 'DIVISION', 'CHURCH');

-- 2. Tables
CREATE TABLE public.missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    address TEXT,
    settings JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE public.structures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    name TEXT NOT NULL,
    level public.structure_level NOT NULL,
    parent_id UUID REFERENCES public.structures(id),
    mission_id UUID REFERENCES public.missions(id),
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    updated_at TIMESTAMPTZ,
    avatar_url TEXT,
    structure_id UUID REFERENCES public.structures(id),
    is_active BOOLEAN DEFAULT false,
    onboarding_completed BOOLEAN DEFAULT false,
    first_name TEXT,
    last_name TEXT
);

CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    role TEXT NOT NULL,
    status public.role_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    approved_by UUID REFERENCES public.profiles(id),
    approved_at TIMESTAMPTZ,
    rejected_by UUID REFERENCES public.profiles(id),
    rejected_at TIMESTAMPTZ,
    rejection_reason TEXT,
    is_approved BOOLEAN DEFAULT false -- Legacy column
);

-- 3. RLS Policies
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Missions are viewable by everyone" ON public.missions FOR SELECT USING (true);

ALTER TABLE public.structures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Structures are viewable by everyone" ON public.structures FOR SELECT USING (true);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view approval status" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- 4. Triggers (Auth -> Profile trigger assumed exists)
-- Note: Function definitions omitted for brevity in snapshot but are present in trigger list.
