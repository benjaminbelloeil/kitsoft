import { DEMO_USER_ID } from '@/lib/demo/config';

export interface DemoProject {
  id_proyecto: string;
  titulo: string;
  descripcion: string;
  id_cliente: string;
  id_projectlead: string;
  fecha_inicio: string;
  fecha_fin: string | null;
  activo: boolean;
  horas_totales: number;
  color: string;
}

export const DEMO_PROJECTS: DemoProject[] = [
  {
    id_proyecto: 'demo-proy-banca-digital',
    titulo: 'Plataforma de Banca Digital',
    descripcion:
      'Rediseño del portal de banca en línea con arquitectura de microservicios, autenticación biométrica y una nueva capa de experiencia construida en Next.js.',
    id_cliente: 'demo-cliente-banorte',
    id_projectlead: 'demo-user-mateo-fernandez',
    fecha_inicio: '2026-01-12',
    fecha_fin: '2026-12-18',
    activo: true,
    horas_totales: 2400,
    color: '#A100FF',
  },
  {
    id_proyecto: 'demo-proy-analitica-suministro',
    titulo: 'Analítica de Cadena de Suministro',
    descripcion:
      'Plataforma de datos que consolida inventario, distribución y demanda para generar pronósticos semanales por región.',
    id_cliente: 'demo-cliente-bimbo',
    id_projectlead: 'demo-user-mateo-fernandez',
    fecha_inicio: '2026-03-02',
    fecha_fin: '2026-11-27',
    activo: true,
    horas_totales: 1800,
    color: '#0072CE',
  },
  {
    id_proyecto: 'demo-proy-portal-autoservicio',
    titulo: 'Portal de Autoservicio',
    descripcion:
      'Portal de autogestión para clientes corporativos con facturación en línea, seguimiento de pedidos y centro de ayuda.',
    id_cliente: 'demo-cliente-femsa',
    id_projectlead: 'demo-user-mateo-fernandez',
    fecha_inicio: '2026-05-18',
    fecha_fin: '2027-02-26',
    activo: true,
    horas_totales: 1200,
    color: '#00A39B',
  },
  {
    id_proyecto: 'demo-proy-migracion-erp',
    titulo: 'Migración Cloud ERP',
    descripcion:
      'Migración del ERP on-premise a una arquitectura híbrida en Azure, incluyendo modernización de integraciones legadas.',
    id_cliente: 'demo-cliente-cemex',
    id_projectlead: 'demo-user-mateo-fernandez',
    fecha_inicio: '2026-02-09',
    fecha_fin: '2027-01-29',
    activo: true,
    horas_totales: 3200,
    color: '#E6007E',
  },
  {
    id_proyecto: 'demo-proy-ecommerce',
    titulo: 'Modernización de E-commerce',
    descripcion:
      'Reemplazo del motor de e-commerce por una arquitectura headless con CDN global y checkout optimizado.',
    id_cliente: 'demo-cliente-liverpool',
    id_projectlead: 'demo-user-mateo-fernandez',
    fecha_inicio: '2025-02-03',
    fecha_fin: '2025-12-19',
    activo: false,
    horas_totales: 2600,
    color: '#7500C0',
  },
  {
    id_proyecto: 'demo-proy-automatizacion-qa',
    titulo: 'Automatización de Pruebas QA',
    descripcion:
      'Construcción de un framework de pruebas end-to-end que redujo el ciclo de regresión de 5 días a 6 horas.',
    id_cliente: 'demo-cliente-banorte',
    id_projectlead: 'demo-user-mateo-fernandez',
    fecha_inicio: '2025-04-14',
    fecha_fin: '2025-11-28',
    activo: false,
    horas_totales: 1400,
    color: '#D2601A',
  },
];

export interface DemoAssignment {
  id_usuario_proyecto: string;
  id_usuario: string;
  id_proyecto: string;
  id_rol: string;
  horas: number;
}

export const DEMO_ASSIGNMENTS: DemoAssignment[] = [
  // Plataforma de Banca Digital
  { id_usuario_proyecto: 'demo-up-001', id_usuario: DEMO_USER_ID, id_proyecto: 'demo-proy-banca-digital', id_rol: 'demo-rol-tech-lead', horas: 480 },
  { id_usuario_proyecto: 'demo-up-002', id_usuario: 'demo-user-sebastian-ibarra', id_proyecto: 'demo-proy-banca-digital', id_rol: 'demo-rol-frontend', horas: 520 },
  { id_usuario_proyecto: 'demo-up-003', id_usuario: 'demo-user-joaquin-mendoza', id_proyecto: 'demo-proy-banca-digital', id_rol: 'demo-rol-backend', horas: 560 },
  { id_usuario_proyecto: 'demo-up-004', id_usuario: 'demo-user-emilio-vargas', id_proyecto: 'demo-proy-banca-digital', id_rol: 'demo-rol-security', horas: 320 },
  { id_usuario_proyecto: 'demo-up-005', id_usuario: 'demo-user-camila-navarro', id_proyecto: 'demo-proy-banca-digital', id_rol: 'demo-rol-qa', horas: 300 },
  { id_usuario_proyecto: 'demo-up-006', id_usuario: 'demo-user-lucia-beltran', id_proyecto: 'demo-proy-banca-digital', id_rol: 'demo-rol-ux', horas: 220 },

  // Analítica de Cadena de Suministro
  { id_usuario_proyecto: 'demo-up-007', id_usuario: DEMO_USER_ID, id_proyecto: 'demo-proy-analitica-suministro', id_rol: 'demo-rol-backend', horas: 240 },
  { id_usuario_proyecto: 'demo-up-008', id_usuario: 'demo-user-valentina-rios', id_proyecto: 'demo-proy-analitica-suministro', id_rol: 'demo-rol-data', horas: 620 },
  { id_usuario_proyecto: 'demo-up-009', id_usuario: 'demo-user-andres-salazar', id_proyecto: 'demo-proy-analitica-suministro', id_rol: 'demo-rol-devops', horas: 380 },
  { id_usuario_proyecto: 'demo-up-010', id_usuario: 'demo-user-renata-villalobos', id_proyecto: 'demo-proy-analitica-suministro', id_rol: 'demo-rol-ba', horas: 280 },

  // Portal de Autoservicio
  { id_usuario_proyecto: 'demo-up-011', id_usuario: DEMO_USER_ID, id_proyecto: 'demo-proy-portal-autoservicio', id_rol: 'demo-rol-frontend', horas: 160 },
  { id_usuario_proyecto: 'demo-up-012', id_usuario: 'demo-user-lucia-beltran', id_proyecto: 'demo-proy-portal-autoservicio', id_rol: 'demo-rol-ux', horas: 260 },
  { id_usuario_proyecto: 'demo-up-013', id_usuario: 'demo-user-sebastian-ibarra', id_proyecto: 'demo-proy-portal-autoservicio', id_rol: 'demo-rol-frontend', horas: 340 },
  { id_usuario_proyecto: 'demo-up-014', id_usuario: 'demo-user-camila-navarro', id_proyecto: 'demo-proy-portal-autoservicio', id_rol: 'demo-rol-qa', horas: 200 },

  // Migración Cloud ERP
  { id_usuario_proyecto: 'demo-up-015', id_usuario: 'demo-user-mateo-fernandez', id_proyecto: 'demo-proy-migracion-erp', id_rol: 'demo-rol-cloud', horas: 720 },
  { id_usuario_proyecto: 'demo-up-016', id_usuario: 'demo-user-andres-salazar', id_proyecto: 'demo-proy-migracion-erp', id_rol: 'demo-rol-devops', horas: 640 },
  { id_usuario_proyecto: 'demo-up-017', id_usuario: 'demo-user-joaquin-mendoza', id_proyecto: 'demo-proy-migracion-erp', id_rol: 'demo-rol-backend', horas: 580 },
  { id_usuario_proyecto: 'demo-up-018', id_usuario: 'demo-user-renata-villalobos', id_proyecto: 'demo-proy-migracion-erp', id_rol: 'demo-rol-ba', horas: 360 },

  // Modernización de E-commerce (archivado)
  { id_usuario_proyecto: 'demo-up-019', id_usuario: DEMO_USER_ID, id_proyecto: 'demo-proy-ecommerce', id_rol: 'demo-rol-frontend', horas: 520 },
  { id_usuario_proyecto: 'demo-up-020', id_usuario: 'demo-user-sebastian-ibarra', id_proyecto: 'demo-proy-ecommerce', id_rol: 'demo-rol-frontend', horas: 480 },
  { id_usuario_proyecto: 'demo-up-021', id_usuario: 'demo-user-valentina-rios', id_proyecto: 'demo-proy-ecommerce', id_rol: 'demo-rol-data', horas: 300 },

  // Automatización de Pruebas QA (archivado)
  { id_usuario_proyecto: 'demo-up-022', id_usuario: DEMO_USER_ID, id_proyecto: 'demo-proy-automatizacion-qa', id_rol: 'demo-rol-qa', horas: 300 },
  { id_usuario_proyecto: 'demo-up-023', id_usuario: 'demo-user-camila-navarro', id_proyecto: 'demo-proy-automatizacion-qa', id_rol: 'demo-rol-qa', horas: 620 },
];

/** Skills required per project role, used by the kit-agent assignment simulation. */
export const DEMO_ROLE_REQUIREMENTS: Record<string, { id_habilidad: string; nivel_requerido: number }[]> = {
  'demo-rol-tech-lead': [
    { id_habilidad: 'demo-hab-typescript', nivel_requerido: 4 },
    { id_habilidad: 'demo-hab-react', nivel_requerido: 4 },
    { id_habilidad: 'demo-hab-aws', nivel_requerido: 3 },
  ],
  'demo-rol-frontend': [
    { id_habilidad: 'demo-hab-react', nivel_requerido: 4 },
    { id_habilidad: 'demo-hab-nextjs', nivel_requerido: 3 },
    { id_habilidad: 'demo-hab-typescript', nivel_requerido: 3 },
  ],
  'demo-rol-backend': [
    { id_habilidad: 'demo-hab-nodejs', nivel_requerido: 4 },
    { id_habilidad: 'demo-hab-postgres', nivel_requerido: 3 },
    { id_habilidad: 'demo-hab-graphql', nivel_requerido: 2 },
  ],
  'demo-rol-cloud': [
    { id_habilidad: 'demo-hab-aws', nivel_requerido: 4 },
    { id_habilidad: 'demo-hab-azure', nivel_requerido: 4 },
    { id_habilidad: 'demo-hab-terraform', nivel_requerido: 3 },
  ],
  'demo-rol-qa': [
    { id_habilidad: 'demo-hab-cypress', nivel_requerido: 4 },
    { id_habilidad: 'demo-hab-playwright', nivel_requerido: 3 },
  ],
  'demo-rol-data': [
    { id_habilidad: 'demo-hab-sql', nivel_requerido: 4 },
    { id_habilidad: 'demo-hab-spark', nivel_requerido: 3 },
    { id_habilidad: 'demo-hab-python', nivel_requerido: 4 },
  ],
  'demo-rol-devops': [
    { id_habilidad: 'demo-hab-kubernetes', nivel_requerido: 4 },
    { id_habilidad: 'demo-hab-docker', nivel_requerido: 4 },
    { id_habilidad: 'demo-hab-cicd', nivel_requerido: 3 },
  ],
  'demo-rol-ux': [{ id_habilidad: 'demo-hab-figma', nivel_requerido: 4 }],
  'demo-rol-ba': [{ id_habilidad: 'demo-hab-scrum', nivel_requerido: 3 }],
  'demo-rol-security': [{ id_habilidad: 'demo-hab-aws', nivel_requerido: 3 }],
};
