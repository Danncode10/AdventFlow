# 🕊️ AdventFlow

**Every mission has its own database**, making this suite accessible to any Mission globally. By simply filling up the database, AdventFlow becomes the dedicated hub for that specific Mission's territory.

**AdventFlow** is an AI-native Next.js 15 & Supabase management suite specifically designed for the **Seventh-day Adventist Church**. It provides a secure hierarchy, financial transparency, and resource sharing capabilities for Missions, Divisions, and local congregations.


---

## 🗺️ The "SDA Mission Hub" Masterplan

### Phase 1: The Structural Foundation (The Hierarchy)
Before building features, we must define the "World" in which the data lives.
- **Mission Config**: Finalize `src/lib/mission-config.ts` with the 4-level hierarchy (Mission, Area, Division, Church).
- **Recursive Schema**: Create the structures table in Supabase.
- **The Checkpoint**: Run `npm run checkpoint` immediately after creating the table so your AI understands the parent-child relationship of the Church levels.

### Phase 2: Identity & Access (Scoped Onboarding)
We move from "Users" to "Members with Roles."
- **Multi-Role Join Table**: Create a `user_roles` table. This allows a user to be both a "Pastor" and a "Scheduler."
- **Request-to-Join Flow**: Build a searchable dropdown for all 2,000+ churches.
- **Scoped Approval Logic**: A request for "Central Church" is visible only to the Elder of that church and the Pastor of that Division.
- **Hardened RLS**: Use the "Zero-Hallucination" loop to write RLS policies that prevent a Treasurer in "Area A" from seeing the books in "Area B."

### Phase 3: The Content Engine (Blog & Resources)
The "Digital Bulletin" and theological library.
- **The Tiptap Editor**: Integrate the headless editor. Add extensions for YouTube embeds and link-pasting.
- **The "Storage Hack"**: Create the `resources` table to store Google Drive IDs.
- **Client-Side Compression**: Use `browser-image-compression` for blog cover photos to keep Supabase storage footprint tiny.
- **Fundamental Beliefs Tagging**: Hardcode the 28 Fundamental Beliefs into metadata. Every resource must be tagged for easy filtering.

### Phase 4: Church Operations (Schedules & Finances)
The utility layer that makes the app "Essential."
- **The Unified Calendar**: Build a frontend view that aggregates Mission Events, Area Events, and Local Fellowship.
- **Remittance Workflow**: Mobile-first UI for weekly Tithe/Offering entry.
- **Transparency Dashboard**: Aggregated bar charts for Mission Admins to see financial health across the territory.

### Phase 5: The "Vibe" & Home Experience
Making it feel like a "Mission Hub."
- **Daily Bible Verse**: Connect to `bible-api.com` to display a fresh verse on the Home Page.
- **The Pastor’s Quick-Action**: Home Page section for leaders showing pending approvals and missing reports.
- **Digital Branding**: Apply the "Engineering Edge" UI with SDA-specific accents (trust-worthy blues and clean white spaces).

### Phase 6: Legal, Security & Open Source
Finalizing for public use.
- **DPA Compliance**: Add Data Privacy Act (RA 10173) consent toggles and create `LEGAL.md`.
- **Open Source Readiness**: Refine `./guide.sh` for easy installation.
- **Contributor Guide**: Write `CONTRIBUTING.md` for RLS security audits.

---

## 🛠️ Technical Workflow (The DannFlow Way)

To ensure this plan succeeds, follow this loop for every feature:
1. **Draft SQL**: Write the table in Supabase.
2. **Sync**: `npm run checkpoint` + `npm run update-types`.
3. **Prompt**: "I have the new [Table Name] schema. Based on the mission-config.ts roles, build the [Feature Name] component."
4. **Verify**: Test the RLS manually to ensure security holds.

---

## 🔑 Environment Variables

Copy `.env.example` to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
NEXT_PUBLIC_SITE_NAME=AdventFlow
```

## 🤖 Vibe Coding Workflow
1. Connect **Supabase MCP** (live schema reads).
2. Connect **GitHub MCP** (history & PRs).
3. Connect **Terminal MCP** (checkpoints).
4. Always read **AGENTS.md** before starting.

---
*Built for the Mission. Optimized for the Vibe.*