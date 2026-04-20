# 🏗️ Database Architecture & Schema

This document outlines the core structural foundation of the **AdventFlow** database. The architecture is designed to be **multi-tenant via database isolation**, meaning each Mission congregation operates on its own dedicated Supabase instance.

## 🏛️ Central Hierarchy (The Mission Tree)

The system uses a recursive structure to manage the SDA organizational hierarchy.

### 1. `missions`
The root identity of the database instance.
- **Purpose**: Identifies which Mission this database belongs to (e.g., Northern Luzon Mission).
- **Key Fields**: `name`, `slug`, `settings`.

### 2. `structures`
The recursive organizational tree.
- **Hierarchical Levels**: `MISSION` → `AREA` → `DIVISION` → `CHURCH`.
- **Relationship**: Uses `parent_id` (Self-referencing) and `mission_id`.
- **Constraint**: Strict level enforcement (e.g., an `AREA` must have a parent).

---

## 👤 User Identity & Roles

### 3. `profiles`
Extends the standard `auth.users` table.
- **Linkage**: Connected to a specific level in the `structures` table via `structure_id`.
- **Onboarding**: Includes flags for `is_active` and `onboarding_completed`.

### 4. `user_roles`
Junction table for role assignments.
- **Multi-Role Support**: A single user can hold multiple roles (e.g., Pastor + Media Team).
- **Security**: Directly referenced by RLS policies to restrict data access by role and structure.

---

## 🛡️ Security & Privacy

### Row Level Security (RLS)
All tables have RLS enabled by default.
- **Privacy**: User profiles are only viewable by the user themselves or authorized administrators.
- **Public Data**: The `structures` and `missions` tables are readable for onboarding purposes but restricted for updates.

### Automatic RLS Enforcement
The system includes a trigger `rls_auto_enable` that automatically enables RLS on any new table created in the `public` schema.

---

## 🔄 The Zero-Hallucination Loop
To maintain a 1:1 map between the code and the live database:
1. **Schema Change**: Applied via Supabase Dashboard or MCP.
2. **Snapshot**: Run `npm run checkpoint` to save DDL in `supabase/backups/`.
3. **Type Sync**: Run `npm run update-types` to refresh `src/types/supabase.ts`.
