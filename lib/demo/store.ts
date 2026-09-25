import { DEMO_PEOPLE, type DemoPerson } from '@/lib/demo/data/people';
import { DEMO_CLIENTS, DEMO_PROJECT_ROLES, DEMO_SKILLS, DEMO_CERTIFICATE_CATALOG } from '@/lib/demo/data/catalog';
import { DEMO_PROJECTS, DEMO_ASSIGNMENTS, type DemoProject, type DemoAssignment } from '@/lib/demo/data/projects';
import {
  DEMO_USER_SKILLS,
  DEMO_USER_CERTIFICATES,
  DEMO_EXPERIENCE,
  DEMO_NOTES,
  DEMO_NOTIFICATIONS,
  DEMO_FEEDBACK,
  DEMO_PATHS,
  type DemoUserSkill,
  type DemoUserCertificate,
  type DemoExperience,
  type DemoNote,
  type DemoNotification,
  type DemoFeedback,
  type DemoPath,
} from '@/lib/demo/data/activity';

export interface DemoStore {
  people: DemoPerson[];
  clients: typeof DEMO_CLIENTS;
  roles: typeof DEMO_PROJECT_ROLES;
  skills: typeof DEMO_SKILLS;
  certificateCatalog: typeof DEMO_CERTIFICATE_CATALOG;
  projects: DemoProject[];
  assignments: DemoAssignment[];
  userSkills: DemoUserSkill[];
  userCertificates: DemoUserCertificate[];
  experience: DemoExperience[];
  notes: DemoNote[];
  notifications: DemoNotification[];
  feedback: DemoFeedback[];
  paths: DemoPath[];
  sequence: number;
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function seed(): DemoStore {
  return {
    people: clone(DEMO_PEOPLE),
    clients: clone(DEMO_CLIENTS),
    roles: clone(DEMO_PROJECT_ROLES),
    skills: clone(DEMO_SKILLS),
    certificateCatalog: clone(DEMO_CERTIFICATE_CATALOG),
    projects: clone(DEMO_PROJECTS),
    assignments: clone(DEMO_ASSIGNMENTS),
    userSkills: clone(DEMO_USER_SKILLS),
    userCertificates: clone(DEMO_USER_CERTIFICATES),
    experience: clone(DEMO_EXPERIENCE),
    notes: clone(DEMO_NOTES),
    notifications: clone(DEMO_NOTIFICATIONS),
    feedback: clone(DEMO_FEEDBACK),
    paths: clone(DEMO_PATHS),
    sequence: 0,
  };
}

// Pinned to globalThis so writes survive hot reloads in dev and module re-evaluation
// between requests on the same serverless instance.
const globalRef = globalThis as typeof globalThis & { __kitsoftDemoStore?: DemoStore };

export function getStore(): DemoStore {
  if (!globalRef.__kitsoftDemoStore) {
    globalRef.__kitsoftDemoStore = seed();
  }
  return globalRef.__kitsoftDemoStore;
}

export function resetStore(): DemoStore {
  globalRef.__kitsoftDemoStore = seed();
  return globalRef.__kitsoftDemoStore;
}

export function nextId(prefix: string): string {
  const store = getStore();
  store.sequence += 1;
  return `${prefix}-${store.sequence.toString().padStart(4, '0')}`;
}
