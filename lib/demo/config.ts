/**
 * Demo mode: lets the app run with mock data when no Supabase project is configured.
 *
 * Enabled automatically when NEXT_PUBLIC_SUPABASE_URL is absent, so a fresh clone or a
 * Vercel deploy with no env vars boots into a working demo. Set NEXT_PUBLIC_DEMO_MODE
 * explicitly to force it on or off.
 */

export const DEMO_ROLE_COOKIE = 'kitsoft_demo_role';
export const DEMO_SESSION_COOKIE = 'kitsoft_demo_session';

export const DEMO_USER_ID = 'demo-0000-0000-0000-000000000001';
export const DEMO_USER_EMAIL = 'demo.user@kitsoft.dev';

export type DemoRoleKey = 'empleado' | 'admin' | 'people-lead' | 'project-lead' | 'project-manager';

export interface DemoRole {
  key: DemoRoleKey;
  /** Matches `niveles.numero` in the real schema; the UI gates on these values. */
  numero: number;
  id_nivel: string;
  titulo: string;
  descripcion: string;
}

export const DEMO_ROLES: Record<DemoRoleKey, DemoRole> = {
  admin: {
    key: 'admin',
    numero: 1,
    id_nivel: 'demo-nivel-admin',
    titulo: 'Administrador',
    descripcion: 'Acceso completo a la gestión de usuarios y niveles',
  },
  'people-lead': {
    key: 'people-lead',
    numero: 2,
    id_nivel: 'demo-nivel-people-lead',
    titulo: 'People Lead',
    descripcion: 'Acompaña el desarrollo profesional de su equipo',
  },
  'project-lead': {
    key: 'project-lead',
    numero: 3,
    id_nivel: 'demo-nivel-project-lead',
    titulo: 'Project Lead',
    descripcion: 'Lidera la ejecución de proyectos y asigna horas',
  },
  'project-manager': {
    key: 'project-manager',
    numero: 4,
    id_nivel: 'demo-nivel-project-manager',
    titulo: 'Project Manager',
    descripcion: 'Administra el portafolio de proyectos y clientes',
  },
  empleado: {
    key: 'empleado',
    numero: 5,
    id_nivel: 'demo-nivel-empleado',
    titulo: 'Empleado',
    descripcion: 'Consulta su perfil, trayectoria y cargabilidad',
  },
};

export const DEMO_ROLE_ORDER: DemoRoleKey[] = [
  'empleado',
  'admin',
  'people-lead',
  'project-lead',
  'project-manager',
];

export const DEFAULT_DEMO_ROLE: DemoRoleKey = 'empleado';

export function isDemoMode(): boolean {
  const flag = process.env.NEXT_PUBLIC_DEMO_MODE;
  if (flag === 'true') return true;
  if (flag === 'false') return false;
  return !process.env.NEXT_PUBLIC_SUPABASE_URL;
}

export function resolveDemoRole(value: string | undefined | null): DemoRole {
  if (value && value in DEMO_ROLES) {
    return DEMO_ROLES[value as DemoRoleKey];
  }
  return DEMO_ROLES[DEFAULT_DEMO_ROLE];
}
