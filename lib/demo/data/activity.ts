import { DEMO_USER_ID } from '@/lib/demo/config';

export interface DemoUserSkill {
  id_usuario: string;
  id_habilidad: string;
  nivel_experiencia: number;
}

export const DEMO_USER_SKILLS: DemoUserSkill[] = [
  { id_usuario: DEMO_USER_ID, id_habilidad: 'demo-hab-react', nivel_experiencia: 5 },
  { id_usuario: DEMO_USER_ID, id_habilidad: 'demo-hab-typescript', nivel_experiencia: 5 },
  { id_usuario: DEMO_USER_ID, id_habilidad: 'demo-hab-nextjs', nivel_experiencia: 4 },
  { id_usuario: DEMO_USER_ID, id_habilidad: 'demo-hab-nodejs', nivel_experiencia: 4 },
  { id_usuario: DEMO_USER_ID, id_habilidad: 'demo-hab-postgres', nivel_experiencia: 3 },
  { id_usuario: DEMO_USER_ID, id_habilidad: 'demo-hab-aws', nivel_experiencia: 3 },
  { id_usuario: DEMO_USER_ID, id_habilidad: 'demo-hab-docker', nivel_experiencia: 3 },
  { id_usuario: DEMO_USER_ID, id_habilidad: 'demo-hab-graphql', nivel_experiencia: 3 },
  { id_usuario: DEMO_USER_ID, id_habilidad: 'demo-hab-scrum', nivel_experiencia: 4 },

  { id_usuario: 'demo-user-mateo-fernandez', id_habilidad: 'demo-hab-aws', nivel_experiencia: 5 },
  { id_usuario: 'demo-user-mateo-fernandez', id_habilidad: 'demo-hab-azure', nivel_experiencia: 5 },
  { id_usuario: 'demo-user-mateo-fernandez', id_habilidad: 'demo-hab-terraform', nivel_experiencia: 4 },
  { id_usuario: 'demo-user-mateo-fernandez', id_habilidad: 'demo-hab-kubernetes', nivel_experiencia: 4 },

  { id_usuario: 'demo-user-valentina-rios', id_habilidad: 'demo-hab-python', nivel_experiencia: 5 },
  { id_usuario: 'demo-user-valentina-rios', id_habilidad: 'demo-hab-spark', nivel_experiencia: 4 },
  { id_usuario: 'demo-user-valentina-rios', id_habilidad: 'demo-hab-sql', nivel_experiencia: 5 },
  { id_usuario: 'demo-user-valentina-rios', id_habilidad: 'demo-hab-gcp', nivel_experiencia: 3 },

  { id_usuario: 'demo-user-sebastian-ibarra', id_habilidad: 'demo-hab-react', nivel_experiencia: 4 },
  { id_usuario: 'demo-user-sebastian-ibarra', id_habilidad: 'demo-hab-nextjs', nivel_experiencia: 4 },
  { id_usuario: 'demo-user-sebastian-ibarra', id_habilidad: 'demo-hab-figma', nivel_experiencia: 3 },

  { id_usuario: 'demo-user-camila-navarro', id_habilidad: 'demo-hab-cypress', nivel_experiencia: 5 },
  { id_usuario: 'demo-user-camila-navarro', id_habilidad: 'demo-hab-playwright', nivel_experiencia: 5 },
  { id_usuario: 'demo-user-camila-navarro', id_habilidad: 'demo-hab-typescript', nivel_experiencia: 3 },

  { id_usuario: 'demo-user-andres-salazar', id_habilidad: 'demo-hab-kubernetes', nivel_experiencia: 5 },
  { id_usuario: 'demo-user-andres-salazar', id_habilidad: 'demo-hab-docker', nivel_experiencia: 5 },
  { id_usuario: 'demo-user-andres-salazar', id_habilidad: 'demo-hab-cicd', nivel_experiencia: 4 },
  { id_usuario: 'demo-user-andres-salazar', id_habilidad: 'demo-hab-terraform', nivel_experiencia: 4 },

  { id_usuario: 'demo-user-lucia-beltran', id_habilidad: 'demo-hab-figma', nivel_experiencia: 5 },
  { id_usuario: 'demo-user-joaquin-mendoza', id_habilidad: 'demo-hab-nodejs', nivel_experiencia: 5 },
  { id_usuario: 'demo-user-joaquin-mendoza', id_habilidad: 'demo-hab-java', nivel_experiencia: 4 },
  { id_usuario: 'demo-user-joaquin-mendoza', id_habilidad: 'demo-hab-postgres', nivel_experiencia: 4 },
  { id_usuario: 'demo-user-renata-villalobos', id_habilidad: 'demo-hab-scrum', nivel_experiencia: 4 },
  { id_usuario: 'demo-user-emilio-vargas', id_habilidad: 'demo-hab-aws', nivel_experiencia: 4 },
  { id_usuario: 'demo-user-isabela-cortes', id_habilidad: 'demo-hab-scrum', nivel_experiencia: 5 },
  { id_usuario: 'demo-user-tomas-aguirre', id_habilidad: 'demo-hab-scrum', nivel_experiencia: 5 },
];

export interface DemoUserCertificate {
  id_usuario_certificado: string;
  id_usuario: string;
  id_certificado: string;
  url_archivo: string | null;
  fecha_inicio: string;
  fecha_fin: string | null;
}

export const DEMO_USER_CERTIFICATES: DemoUserCertificate[] = [
  {
    id_usuario_certificado: 'demo-uc-001',
    id_usuario: DEMO_USER_ID,
    id_certificado: 'demo-cert-aws-saa',
    url_archivo: '/demo/certificados/aws-saa.pdf',
    fecha_inicio: '2024-06-14',
    fecha_fin: '2027-06-14',
  },
  {
    id_usuario_certificado: 'demo-uc-002',
    id_usuario: DEMO_USER_ID,
    id_certificado: 'demo-cert-psm',
    url_archivo: '/demo/certificados/psm-i.pdf',
    fecha_inicio: '2023-02-20',
    fecha_fin: null,
  },
  {
    id_usuario_certificado: 'demo-uc-003',
    id_usuario: DEMO_USER_ID,
    id_certificado: 'demo-cert-az-900',
    url_archivo: null,
    fecha_inicio: '2025-09-08',
    fecha_fin: '2027-09-08',
  },
  {
    id_usuario_certificado: 'demo-uc-004',
    id_usuario: 'demo-user-mateo-fernandez',
    id_certificado: 'demo-cert-aws-saa',
    url_archivo: null,
    fecha_inicio: '2023-04-11',
    fecha_fin: '2026-04-11',
  },
  {
    id_usuario_certificado: 'demo-uc-005',
    id_usuario: 'demo-user-andres-salazar',
    id_certificado: 'demo-cert-cka',
    url_archivo: null,
    fecha_inicio: '2025-01-22',
    fecha_fin: '2028-01-22',
  },
  {
    id_usuario_certificado: 'demo-uc-006',
    id_usuario: 'demo-user-valentina-rios',
    id_certificado: 'demo-cert-gcp-pde',
    url_archivo: null,
    fecha_inicio: '2024-10-03',
    fecha_fin: '2026-10-03',
  },
];

export interface DemoExperience {
  id_experiencia: string;
  id_usuario: string;
  empresa: string;
  titulo: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string | null;
  ubicacion: string;
  actual: boolean;
}

export const DEMO_EXPERIENCE: DemoExperience[] = [
  {
    id_experiencia: 'demo-exp-001',
    id_usuario: DEMO_USER_ID,
    empresa: 'KitSoft Consulting',
    titulo: 'Senior Software Engineer',
    descripcion:
      'Lidero el frente técnico de la plataforma de banca digital: definición de arquitectura, revisión de código y mentoría a cuatro personas del equipo.',
    fecha_inicio: '2022-04-01',
    fecha_fin: null,
    ubicacion: 'Monterrey, México',
    actual: true,
  },
  {
    id_experiencia: 'demo-exp-002',
    id_usuario: DEMO_USER_ID,
    empresa: 'KitSoft Consulting',
    titulo: 'Software Engineer',
    descripcion:
      'Desarrollo de interfaces en React y servicios en Node.js para proyectos de retail y manufactura.',
    fecha_inicio: '2019-03-11',
    fecha_fin: '2022-03-31',
    ubicacion: 'Monterrey, México',
    actual: false,
  },
  {
    id_experiencia: 'demo-exp-003',
    id_usuario: DEMO_USER_ID,
    empresa: 'Nortec Software',
    titulo: 'Desarrolladora Frontend Jr.',
    descripcion:
      'Primer rol profesional: mantenimiento de un portal de autoservicio y migración progresiva de jQuery a React.',
    fecha_inicio: '2017-07-03',
    fecha_fin: '2019-02-28',
    ubicacion: 'Guadalajara, México',
    actual: false,
  },
];

export interface DemoNote {
  id_nota: string;
  id_usuario: string;
  title: string;
  content: string;
  category: 'personal' | 'trabajo' | 'proyecto' | 'reunión' | 'idea';
  priority: 'alta' | 'media' | 'baja';
  created_at: string;
  updated_at: string;
  is_pinned: boolean;
}

export const DEMO_NOTES: DemoNote[] = [
  {
    id_nota: 'demo-nota-001',
    id_usuario: DEMO_USER_ID,
    title: 'Puntos para el retro del sprint 14',
    content:
      'El despliegue del viernes tardó 40 minutos por los tests de integración. Proponer paralelizar la suite y mover los tests de contrato a una etapa aparte del pipeline.',
    category: 'reunión',
    priority: 'alta',
    created_at: '2026-09-22T15:30:00.000Z',
    updated_at: '2026-09-23T10:05:00.000Z',
    is_pinned: true,
  },
  {
    id_nota: 'demo-nota-002',
    id_usuario: DEMO_USER_ID,
    title: 'Idea: caché de sesiones en el portal',
    content:
      'Revisar si conviene mover las sesiones a Redis para bajar la latencia del login. Medir primero cuánto pesa realmente la consulta actual.',
    category: 'idea',
    priority: 'media',
    created_at: '2026-09-18T09:12:00.000Z',
    updated_at: '2026-09-18T09:12:00.000Z',
    is_pinned: false,
  },
  {
    id_nota: 'demo-nota-003',
    id_usuario: DEMO_USER_ID,
    title: 'Pendientes de la migración de autenticación',
    content:
      '1. Documentar el flujo de refresh token.\n2. Validar expiración en el middleware.\n3. Agregar métricas de fallos de login.',
    category: 'proyecto',
    priority: 'alta',
    created_at: '2026-09-15T17:45:00.000Z',
    updated_at: '2026-09-20T08:22:00.000Z',
    is_pinned: true,
  },
  {
    id_nota: 'demo-nota-004',
    id_usuario: DEMO_USER_ID,
    title: 'Preparar sesión de mentoría',
    content:
      'Armar ejercicio práctico sobre manejo de estado en React para la sesión con el equipo junior del próximo martes.',
    category: 'trabajo',
    priority: 'media',
    created_at: '2026-09-11T12:00:00.000Z',
    updated_at: '2026-09-11T12:00:00.000Z',
    is_pinned: false,
  },
  {
    id_nota: 'demo-nota-005',
    id_usuario: DEMO_USER_ID,
    title: 'Curso de Kubernetes',
    content: 'Terminar los módulos 5 y 6 antes de fin de mes para presentar el examen CKA en noviembre.',
    category: 'personal',
    priority: 'baja',
    created_at: '2026-09-04T20:15:00.000Z',
    updated_at: '2026-09-04T20:15:00.000Z',
    is_pinned: false,
  },
];

export interface DemoNotification {
  id: string;
  id_usuario: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'project' | 'announcement' | 'reminder';
}

export const DEMO_NOTIFICATIONS: DemoNotification[] = [
  {
    id: 'demo-notif-001',
    id_usuario: DEMO_USER_ID,
    title: 'Nueva retroalimentación recibida',
    message: 'Mateo Fernández dejó retroalimentación sobre tu trabajo en Plataforma de Banca Digital.',
    date: '2026-09-24T14:05:00.000Z',
    read: false,
    type: 'project',
  },
  {
    id: 'demo-notif-002',
    id_usuario: DEMO_USER_ID,
    title: 'Cargabilidad por encima del objetivo',
    message: 'Tu carga asignada para octubre es de 92%. Revisa la distribución de horas con tu People Lead.',
    date: '2026-09-23T08:30:00.000Z',
    read: false,
    type: 'reminder',
  },
  {
    id: 'demo-notif-003',
    id_usuario: DEMO_USER_ID,
    title: 'Certificación próxima a vencer',
    message: 'Tu certificación AWS Solutions Architect vence el 14 de junio de 2027. Agenda tu renovación.',
    date: '2026-09-20T11:00:00.000Z',
    read: true,
    type: 'reminder',
  },
  {
    id: 'demo-notif-004',
    id_usuario: DEMO_USER_ID,
    title: 'Fuiste asignada a un nuevo proyecto',
    message: 'Se te asignaron 160 horas en Portal de Autoservicio como Desarrollador Frontend.',
    date: '2026-09-16T09:45:00.000Z',
    read: true,
    type: 'project',
  },
  {
    id: 'demo-notif-005',
    id_usuario: DEMO_USER_ID,
    title: 'Actualización de la plataforma',
    message: 'La sección de trayectoria ahora permite marcar certificados completados directamente desde el nivel.',
    date: '2026-09-10T16:20:00.000Z',
    read: true,
    type: 'announcement',
  },
];

export interface DemoFeedback {
  id_retroalimentacion: string;
  id_usuario: string;
  id_autor: string;
  id_proyecto: string;
  mensaje: string;
  valoracion: number;
  fecha: string;
  categoria: string;
}

export const DEMO_FEEDBACK: DemoFeedback[] = [
  {
    id_retroalimentacion: 'demo-retro-001',
    id_usuario: DEMO_USER_ID,
    id_autor: 'demo-user-mateo-fernandez',
    id_proyecto: 'demo-proy-banca-digital',
    mensaje:
      'Daniela sostuvo la calidad técnica del módulo de autenticación bajo mucha presión de fechas. Su documentación del flujo de tokens le ahorró días al resto del equipo.',
    valoracion: 5,
    fecha: '2026-09-24T14:00:00.000Z',
    categoria: 'Calidad técnica',
  },
  {
    id_retroalimentacion: 'demo-retro-002',
    id_usuario: DEMO_USER_ID,
    id_autor: 'demo-user-lucia-beltran',
    id_proyecto: 'demo-proy-portal-autoservicio',
    mensaje:
      'Excelente colaboración con diseño. Propuso alternativas viables cuando una interacción no era realizable en el tiempo disponible, en vez de descartarla sin más.',
    valoracion: 5,
    fecha: '2026-08-29T10:30:00.000Z',
    categoria: 'Trabajo en equipo',
  },
  {
    id_retroalimentacion: 'demo-retro-003',
    id_usuario: DEMO_USER_ID,
    id_autor: 'demo-user-camila-navarro',
    id_proyecto: 'demo-proy-banca-digital',
    mensaje:
      'Muy receptiva a los hallazgos de QA. Sugerencia: involucrar a pruebas antes en el diseño de las historias para reducir retrabajo.',
    valoracion: 4,
    fecha: '2026-07-18T16:45:00.000Z',
    categoria: 'Comunicación',
  },
  {
    id_retroalimentacion: 'demo-retro-004',
    id_usuario: DEMO_USER_ID,
    id_autor: 'demo-user-isabela-cortes',
    id_proyecto: 'demo-proy-analitica-suministro',
    mensaje:
      'Ha crecido mucho en liderazgo técnico este semestre. El siguiente paso es delegar más y dejar que el equipo tome decisiones de implementación.',
    valoracion: 4,
    fecha: '2026-06-30T09:00:00.000Z',
    categoria: 'Liderazgo',
  },
  {
    id_retroalimentacion: 'demo-retro-005',
    id_usuario: DEMO_USER_ID,
    id_autor: 'demo-user-joaquin-mendoza',
    id_proyecto: 'demo-proy-analitica-suministro',
    mensaje:
      'Sus revisiones de código son claras y siempre explican el porqué. Aprendí bastante sobre optimización de consultas trabajando con ella.',
    valoracion: 5,
    fecha: '2026-05-21T13:15:00.000Z',
    categoria: 'Calidad técnica',
  },
  {
    id_retroalimentacion: 'demo-retro-006',
    id_usuario: DEMO_USER_ID,
    id_autor: 'demo-user-renata-villalobos',
    id_proyecto: 'demo-proy-banca-digital',
    mensaje:
      'Traduce temas técnicos a lenguaje de negocio con mucha claridad en las sesiones con el cliente.',
    valoracion: 4,
    fecha: '2026-04-09T11:40:00.000Z',
    categoria: 'Comunicación',
  },
];

export interface DemoPathCertificate {
  id_certificado: string;
  completado: boolean;
}

export interface DemoPathLevel {
  id_nivel: string;
  numero: number;
  status: 'completado' | 'en_progreso' | 'pendiente';
  certificados: DemoPathCertificate[];
}

export interface DemoPath {
  id_path: string;
  id_usuario: string;
  meta: string;
  descripcion: string;
  fecha_inicio: string;
  completado: boolean;
  niveles: DemoPathLevel[];
}

export const DEMO_PATHS: DemoPath[] = [
  {
    id_path: 'demo-path-cloud',
    id_usuario: DEMO_USER_ID,
    meta: 'Arquitecta de Soluciones Cloud',
    descripcion:
      'Trayectoria para consolidar conocimientos de arquitectura en la nube y liderar migraciones de clientes enterprise.',
    fecha_inicio: '2025-01-15',
    completado: false,
    niveles: [
      {
        id_nivel: 'demo-path-cloud-n1',
        numero: 1,
        status: 'completado',
        certificados: [
          { id_certificado: 'demo-cert-az-900', completado: true },
          { id_certificado: 'demo-cert-psm', completado: true },
        ],
      },
      {
        id_nivel: 'demo-path-cloud-n2',
        numero: 2,
        status: 'completado',
        certificados: [{ id_certificado: 'demo-cert-aws-saa', completado: true }],
      },
      {
        id_nivel: 'demo-path-cloud-n3',
        numero: 3,
        status: 'en_progreso',
        certificados: [
          { id_certificado: 'demo-cert-terraform', completado: true },
          { id_certificado: 'demo-cert-cka', completado: false },
        ],
      },
      {
        id_nivel: 'demo-path-cloud-n4',
        numero: 4,
        status: 'pendiente',
        certificados: [{ id_certificado: 'demo-cert-gcp-pde', completado: false }],
      },
    ],
  },
  {
    id_path: 'demo-path-datos',
    id_usuario: DEMO_USER_ID,
    meta: 'Especialista en Plataformas de Datos',
    descripcion:
      'Complemento analítico para participar en proyectos de datos y machine learning junto al equipo de Valentina.',
    fecha_inicio: '2026-02-02',
    completado: false,
    niveles: [
      {
        id_nivel: 'demo-path-datos-n1',
        numero: 1,
        status: 'en_progreso',
        certificados: [{ id_certificado: 'demo-cert-gcp-pde', completado: false }],
      },
      {
        id_nivel: 'demo-path-datos-n2',
        numero: 2,
        status: 'pendiente',
        certificados: [],
      },
    ],
  },
];
