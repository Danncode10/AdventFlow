export type StructureLevel = 'MISSION' | 'AREA' | 'DIVISION' | 'CHURCH';

export interface MissionRole {
  id: string;
  label: string;
  requiresApproval: boolean;
  approverLevel: StructureLevel;
  description: string;
}

export interface MissionStructure {
  level: StructureLevel;
  name: string;
  description: string;
  roles: MissionRole[];
}

export const MISSION_HIERARCHY: Record<StructureLevel, MissionStructure> = {
  MISSION: {
    level: 'MISSION',
    name: 'Mission/Union',
    description: 'The highest administrative level. Oversees multiple Areas.',
    roles: [
      { id: 'SYSTEM_ADMIN', label: 'System Admin', requiresApproval: true, approverLevel: 'MISSION', description: 'Full system access.' },
      { id: 'MISSION_ADMIN', label: 'Mission Admin', requiresApproval: true, approverLevel: 'MISSION', description: 'Mission Headquarters administration.' },
      { id: 'PASTOR', label: 'Pastor', requiresApproval: true, approverLevel: 'MISSION', description: 'Assigned to a district or mission post.' },
    ],
  },
  AREA: {
    level: 'AREA',
    name: 'Area',
    description: 'Regional group of Divisions.',
    roles: [
      { id: 'AREA_COORDINATOR', label: 'Area Coordinator', requiresApproval: true, approverLevel: 'MISSION', description: 'Oversees a regional area.' },
    ],
  },
  DIVISION: {
    level: 'DIVISION',
    name: 'Division',
    description: 'Local groups of Churches.',
    roles: [
      { id: 'DIVISION_LEADER', label: 'Division Leader', requiresApproval: true, approverLevel: 'AREA', description: 'Leads a local division/district.' },
    ],
  },
  CHURCH: {
    level: 'CHURCH',
    name: 'Local Church',
    description: 'The local congregation.',
    roles: [
      { id: 'ELDER', label: 'Elder', requiresApproval: true, approverLevel: 'DIVISION', description: 'Spiritual leader of the local church.' },
      { id: 'TREASURER', label: 'Treasurer', requiresApproval: true, approverLevel: 'CHURCH', description: 'Manages local church finances.' },
      { id: 'CLERK', label: 'Clerk', requiresApproval: true, approverLevel: 'CHURCH', description: 'Manages church records.' },
      { id: 'MEDIA_TEAM', label: 'Media Team', requiresApproval: true, approverLevel: 'CHURCH', description: 'Manages digital bulletin and resources.' },
      { id: 'SCHEDULER', label: 'Scheduler', requiresApproval: true, approverLevel: 'CHURCH', description: 'Manages church calendars.' },
      { id: 'MEMBER', label: 'Member', requiresApproval: false, approverLevel: 'CHURCH', description: 'Baseline church membership.' },
    ],
  },
};

export const STRUCTURE_LEVELS: StructureLevel[] = ['MISSION', 'AREA', 'DIVISION', 'CHURCH'];
