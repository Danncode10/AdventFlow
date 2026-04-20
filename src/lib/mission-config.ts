export type StructureLevel = 'MISSION' | 'AREA' | 'DIVISION' | 'CHURCH';

export interface MissionStructure {
  level: StructureLevel;
  name: string;
  description: string;
  roles: string[];
}

export const MISSION_HIERARCHY: Record<StructureLevel, MissionStructure> = {
  MISSION: {
    level: 'MISSION',
    name: 'Mission/Union',
    description: 'The highest administrative level. Oversees multiple Areas.',
    roles: ['MISSION_ADMIN', 'SYSTEM_ADMIN'],
  },
  AREA: {
    level: 'AREA',
    name: 'Area',
    description: 'Regional group of Divisions.',
    roles: ['AREA_COORDINATOR'],
  },
  DIVISION: {
    level: 'DIVISION',
    name: 'Division',
    description: 'Local groups of Churches.',
    roles: ['PASTOR', 'DIVISION_LEADER'],
  },
  CHURCH: {
    level: 'CHURCH',
    name: 'Local Church',
    description: 'The local congregation.',
    roles: ['ELDER', 'TREASURER', 'MEMBER', 'MEDIA_TEAM'],
  },
};

export const STRUCTURE_LEVELS: StructureLevel[] = ['MISSION', 'AREA', 'DIVISION', 'CHURCH'];
