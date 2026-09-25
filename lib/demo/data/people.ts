import { DEMO_USER_ID, DEMO_USER_EMAIL, DEMO_ROLES, type DemoRoleKey } from '@/lib/demo/config';

export interface DemoPerson {
  id_usuario: string;
  nombre: string;
  apellido: string;
  titulo: string;
  bio: string;
  url_avatar: string;
  url_curriculum: string | null;
  fecha_inicio_empleo: string;
  email: string;
  id_peoplelead: string | null;
  nivel: DemoRoleKey;
  activo: boolean;
  ultimo_acceso: string;
}

export const DEMO_PEOPLE: DemoPerson[] = [
  {
    id_usuario: DEMO_USER_ID,
    nombre: 'Daniela',
    apellido: 'Ortega',
    titulo: 'Senior Software Engineer',
    bio: 'Ingeniera de software con 6 años de experiencia en aplicaciones web de alta escala. Especializada en React, TypeScript y arquitecturas serverless. Me interesa la mentoría técnica y la mejora continua de procesos de entrega.',
    url_avatar: '/demo/avatars/daniela-ortega.svg',
    url_curriculum: '/demo/cv-daniela-ortega.pdf',
    fecha_inicio_empleo: '2019-03-11',
    email: DEMO_USER_EMAIL,
    id_peoplelead: 'demo-user-isabela-cortes',
    nivel: 'empleado',
    activo: true,
    ultimo_acceso: '2026-09-24T09:12:00.000Z',
  },
  {
    id_usuario: 'demo-user-mateo-fernandez',
    nombre: 'Mateo',
    apellido: 'Fernández',
    titulo: 'Cloud Architect',
    bio: 'Arquitecto de soluciones cloud enfocado en migraciones a AWS y Azure para clientes de banca y retail.',
    url_avatar: '/demo/avatars/mateo-fernandez.svg',
    url_curriculum: null,
    fecha_inicio_empleo: '2017-08-01',
    email: 'mateo.fernandez@kitsoft.dev',
    id_peoplelead: 'demo-user-isabela-cortes',
    nivel: 'project-lead',
    activo: true,
    ultimo_acceso: '2026-09-25T07:41:00.000Z',
  },
  {
    id_usuario: 'demo-user-valentina-rios',
    nombre: 'Valentina',
    apellido: 'Ríos',
    titulo: 'Data Engineer',
    bio: 'Construye pipelines de datos y modelos analíticos sobre Databricks y BigQuery.',
    url_avatar: '/demo/avatars/valentina-rios.svg',
    url_curriculum: null,
    fecha_inicio_empleo: '2021-01-18',
    email: 'valentina.rios@kitsoft.dev',
    id_peoplelead: 'demo-user-isabela-cortes',
    nivel: 'empleado',
    activo: true,
    ultimo_acceso: '2026-09-24T16:03:00.000Z',
  },
  {
    id_usuario: 'demo-user-sebastian-ibarra',
    nombre: 'Sebastián',
    apellido: 'Ibarra',
    titulo: 'Frontend Developer',
    bio: 'Desarrollador frontend con foco en accesibilidad y sistemas de diseño.',
    url_avatar: '/demo/avatars/sebastian-ibarra.svg',
    url_curriculum: null,
    fecha_inicio_empleo: '2022-06-06',
    email: 'sebastian.ibarra@kitsoft.dev',
    id_peoplelead: 'demo-user-isabela-cortes',
    nivel: 'empleado',
    activo: true,
    ultimo_acceso: '2026-09-23T11:27:00.000Z',
  },
  {
    id_usuario: 'demo-user-camila-navarro',
    nombre: 'Camila',
    apellido: 'Navarro',
    titulo: 'QA Automation Lead',
    bio: 'Lidera la estrategia de automatización de pruebas y calidad de entrega.',
    url_avatar: '/demo/avatars/camila-navarro.svg',
    url_curriculum: null,
    fecha_inicio_empleo: '2018-11-12',
    email: 'camila.navarro@kitsoft.dev',
    id_peoplelead: 'demo-user-isabela-cortes',
    nivel: 'empleado',
    activo: true,
    ultimo_acceso: '2026-09-25T08:55:00.000Z',
  },
  {
    id_usuario: 'demo-user-andres-salazar',
    nombre: 'Andrés',
    apellido: 'Salazar',
    titulo: 'DevOps Engineer',
    bio: 'Automatiza pipelines de CI/CD e infraestructura como código con Terraform.',
    url_avatar: '/demo/avatars/andres-salazar.svg',
    url_curriculum: null,
    fecha_inicio_empleo: '2020-02-24',
    email: 'andres.salazar@kitsoft.dev',
    id_peoplelead: 'demo-user-isabela-cortes',
    nivel: 'empleado',
    activo: true,
    ultimo_acceso: '2026-09-22T14:18:00.000Z',
  },
  {
    id_usuario: 'demo-user-lucia-beltran',
    nombre: 'Lucía',
    apellido: 'Beltrán',
    titulo: 'UX Designer',
    bio: 'Diseñadora de producto centrada en investigación con usuarios y prototipado rápido.',
    url_avatar: '/demo/avatars/lucia-beltran.svg',
    url_curriculum: null,
    fecha_inicio_empleo: '2021-09-01',
    email: 'lucia.beltran@kitsoft.dev',
    id_peoplelead: 'demo-user-isabela-cortes',
    nivel: 'empleado',
    activo: true,
    ultimo_acceso: '2026-09-24T18:40:00.000Z',
  },
  {
    id_usuario: 'demo-user-joaquin-mendoza',
    nombre: 'Joaquín',
    apellido: 'Mendoza',
    titulo: 'Backend Developer',
    bio: 'Desarrolla servicios distribuidos en Node.js y Java con foco en rendimiento.',
    url_avatar: '/demo/avatars/joaquin-mendoza.svg',
    url_curriculum: null,
    fecha_inicio_empleo: '2020-07-13',
    email: 'joaquin.mendoza@kitsoft.dev',
    id_peoplelead: 'demo-user-isabela-cortes',
    nivel: 'empleado',
    activo: true,
    ultimo_acceso: '2026-09-25T06:22:00.000Z',
  },
  {
    id_usuario: 'demo-user-renata-villalobos',
    nombre: 'Renata',
    apellido: 'Villalobos',
    titulo: 'Business Analyst',
    bio: 'Traduce necesidades de negocio en requerimientos accionables para los equipos.',
    url_avatar: '/demo/avatars/renata-villalobos.svg',
    url_curriculum: null,
    fecha_inicio_empleo: '2022-03-07',
    email: 'renata.villalobos@kitsoft.dev',
    id_peoplelead: 'demo-user-isabela-cortes',
    nivel: 'empleado',
    activo: true,
    ultimo_acceso: '2026-09-23T09:05:00.000Z',
  },
  {
    id_usuario: 'demo-user-tomas-aguirre',
    nombre: 'Tomás',
    apellido: 'Aguirre',
    titulo: 'Project Manager',
    bio: 'Gestiona el portafolio de proyectos y la relación con clientes estratégicos.',
    url_avatar: '/demo/avatars/tomas-aguirre.svg',
    url_curriculum: null,
    fecha_inicio_empleo: '2016-05-02',
    email: 'tomas.aguirre@kitsoft.dev',
    id_peoplelead: null,
    nivel: 'project-manager',
    activo: true,
    ultimo_acceso: '2026-09-25T08:10:00.000Z',
  },
  {
    id_usuario: 'demo-user-isabela-cortes',
    nombre: 'Isabela',
    apellido: 'Cortés',
    titulo: 'People Lead',
    bio: 'Acompaña el crecimiento profesional de 9 personas del equipo de ingeniería.',
    url_avatar: '/demo/avatars/isabela-cortes.svg',
    url_curriculum: null,
    fecha_inicio_empleo: '2015-10-19',
    email: 'isabela.cortes@kitsoft.dev',
    id_peoplelead: null,
    nivel: 'people-lead',
    activo: true,
    ultimo_acceso: '2026-09-25T07:02:00.000Z',
  },
  {
    id_usuario: 'demo-user-emilio-vargas',
    nombre: 'Emilio',
    apellido: 'Vargas',
    titulo: 'Security Engineer',
    bio: 'Responsable de revisiones de seguridad y cumplimiento en proyectos de banca.',
    url_avatar: '/demo/avatars/emilio-vargas.svg',
    url_curriculum: null,
    fecha_inicio_empleo: '2019-12-02',
    email: 'emilio.vargas@kitsoft.dev',
    id_peoplelead: 'demo-user-isabela-cortes',
    nivel: 'admin',
    activo: true,
    ultimo_acceso: '2026-09-25T05:48:00.000Z',
  },
];

export const DEMO_LEVELS = Object.values(DEMO_ROLES).map((role) => ({
  id_nivel: role.id_nivel,
  numero: role.numero,
  titulo: role.titulo,
  descripcion: role.descripcion,
}));

export function findPerson(id: string): DemoPerson | undefined {
  return DEMO_PEOPLE.find((person) => person.id_usuario === id);
}

export function personDisplayName(person: DemoPerson): string {
  return `${person.nombre} ${person.apellido}`;
}
