export interface DemoClient {
  id_cliente: string;
  nombre: string;
  direccion: string | null;
  telefono: string | null;
  correo: string | null;
  url_logo: string | null;
}

export const DEMO_CLIENTS: DemoClient[] = [
  {
    id_cliente: 'demo-cliente-banorte',
    nombre: 'Banorte',
    direccion: 'Av. Revolución 3000, Monterrey, N.L.',
    telefono: '+52 81 8319 6500',
    correo: 'contacto@banorte.demo',
    url_logo: '/demo/clients/banorte.svg',
  },
  {
    id_cliente: 'demo-cliente-cemex',
    nombre: 'Cemex',
    direccion: 'Av. Ricardo Margáin 325, San Pedro Garza García, N.L.',
    telefono: '+52 81 8888 8888',
    correo: 'contacto@cemex.demo',
    url_logo: '/demo/clients/cemex.svg',
  },
  {
    id_cliente: 'demo-cliente-bimbo',
    nombre: 'Grupo Bimbo',
    direccion: 'Prolongación Paseo de la Reforma 1000, CDMX',
    telefono: '+52 55 5268 6600',
    correo: 'contacto@bimbo.demo',
    url_logo: '/demo/clients/bimbo.svg',
  },
  {
    id_cliente: 'demo-cliente-femsa',
    nombre: 'FEMSA',
    direccion: 'Gral. Anaya 601 Pte., Monterrey, N.L.',
    telefono: '+52 81 8328 6000',
    correo: 'contacto@femsa.demo',
    url_logo: '/demo/clients/femsa.svg',
  },
  {
    id_cliente: 'demo-cliente-liverpool',
    nombre: 'Liverpool',
    direccion: 'Mario Pani 200, Santa Fe, CDMX',
    telefono: '+52 55 5268 3000',
    correo: 'contacto@liverpool.demo',
    url_logo: '/demo/clients/liverpool.svg',
  },
];

export interface DemoRoleRow {
  id_rol: string;
  nombre: string;
  descripcion: string | null;
}

export const DEMO_PROJECT_ROLES: DemoRoleRow[] = [
  { id_rol: 'demo-rol-tech-lead', nombre: 'Tech Lead', descripcion: 'Define la arquitectura y guía técnicamente al equipo' },
  { id_rol: 'demo-rol-frontend', nombre: 'Desarrollador Frontend', descripcion: 'Implementa interfaces de usuario' },
  { id_rol: 'demo-rol-backend', nombre: 'Desarrollador Backend', descripcion: 'Implementa servicios y APIs' },
  { id_rol: 'demo-rol-cloud', nombre: 'Arquitecto Cloud', descripcion: 'Diseña la infraestructura en la nube' },
  { id_rol: 'demo-rol-qa', nombre: 'QA Automation', descripcion: 'Automatiza pruebas funcionales y de regresión' },
  { id_rol: 'demo-rol-data', nombre: 'Data Engineer', descripcion: 'Construye pipelines y modelos de datos' },
  { id_rol: 'demo-rol-devops', nombre: 'DevOps Engineer', descripcion: 'Gestiona CI/CD e infraestructura' },
  { id_rol: 'demo-rol-ux', nombre: 'UX Designer', descripcion: 'Diseña la experiencia de usuario' },
  { id_rol: 'demo-rol-ba', nombre: 'Business Analyst', descripcion: 'Levanta y documenta requerimientos' },
  { id_rol: 'demo-rol-security', nombre: 'Security Engineer', descripcion: 'Revisa seguridad y cumplimiento' },
];

export interface DemoSkill {
  id_habilidad: string;
  nombre: string;
  categoria: string;
  descripcion: string;
}

export const DEMO_SKILLS: DemoSkill[] = [
  { id_habilidad: 'demo-hab-react', nombre: 'React', categoria: 'Frontend', descripcion: 'Librería para interfaces de usuario' },
  { id_habilidad: 'demo-hab-nextjs', nombre: 'Next.js', categoria: 'Frontend', descripcion: 'Framework full-stack sobre React' },
  { id_habilidad: 'demo-hab-typescript', nombre: 'TypeScript', categoria: 'Lenguajes', descripcion: 'JavaScript con tipado estático' },
  { id_habilidad: 'demo-hab-javascript', nombre: 'JavaScript', categoria: 'Lenguajes', descripcion: 'Lenguaje de programación web' },
  { id_habilidad: 'demo-hab-nodejs', nombre: 'Node.js', categoria: 'Backend', descripcion: 'Runtime de JavaScript en servidor' },
  { id_habilidad: 'demo-hab-python', nombre: 'Python', categoria: 'Lenguajes', descripcion: 'Lenguaje de propósito general' },
  { id_habilidad: 'demo-hab-java', nombre: 'Java', categoria: 'Lenguajes', descripcion: 'Lenguaje orientado a objetos' },
  { id_habilidad: 'demo-hab-aws', nombre: 'AWS', categoria: 'Cloud', descripcion: 'Amazon Web Services' },
  { id_habilidad: 'demo-hab-azure', nombre: 'Azure', categoria: 'Cloud', descripcion: 'Microsoft Azure' },
  { id_habilidad: 'demo-hab-gcp', nombre: 'Google Cloud', categoria: 'Cloud', descripcion: 'Google Cloud Platform' },
  { id_habilidad: 'demo-hab-docker', nombre: 'Docker', categoria: 'DevOps', descripcion: 'Contenerización de aplicaciones' },
  { id_habilidad: 'demo-hab-kubernetes', nombre: 'Kubernetes', categoria: 'DevOps', descripcion: 'Orquestación de contenedores' },
  { id_habilidad: 'demo-hab-terraform', nombre: 'Terraform', categoria: 'DevOps', descripcion: 'Infraestructura como código' },
  { id_habilidad: 'demo-hab-cicd', nombre: 'CI/CD', categoria: 'DevOps', descripcion: 'Integración y entrega continua' },
  { id_habilidad: 'demo-hab-postgres', nombre: 'PostgreSQL', categoria: 'Datos', descripcion: 'Base de datos relacional' },
  { id_habilidad: 'demo-hab-sql', nombre: 'SQL', categoria: 'Datos', descripcion: 'Lenguaje de consulta de datos' },
  { id_habilidad: 'demo-hab-spark', nombre: 'Apache Spark', categoria: 'Datos', descripcion: 'Procesamiento distribuido de datos' },
  { id_habilidad: 'demo-hab-figma', nombre: 'Figma', categoria: 'Diseño', descripcion: 'Herramienta de diseño de interfaces' },
  { id_habilidad: 'demo-hab-scrum', nombre: 'Scrum', categoria: 'Metodologías', descripcion: 'Marco de trabajo ágil' },
  { id_habilidad: 'demo-hab-cypress', nombre: 'Cypress', categoria: 'QA', descripcion: 'Pruebas end-to-end automatizadas' },
  { id_habilidad: 'demo-hab-playwright', nombre: 'Playwright', categoria: 'QA', descripcion: 'Automatización de navegadores' },
  { id_habilidad: 'demo-hab-graphql', nombre: 'GraphQL', categoria: 'Backend', descripcion: 'Lenguaje de consulta para APIs' },
];

export interface DemoCertificateRow {
  id_certificado: string;
  curso: string;
  descripcion: string;
  vigencia: number;
  url_Pagina: string;
}

export const DEMO_CERTIFICATE_CATALOG: DemoCertificateRow[] = [
  {
    id_certificado: 'demo-cert-aws-saa',
    curso: 'AWS Certified Solutions Architect – Associate',
    descripcion: 'Diseño de arquitecturas distribuidas y resilientes en AWS',
    vigencia: 36,
    url_Pagina: 'https://aws.amazon.com/certification/',
  },
  {
    id_certificado: 'demo-cert-az-900',
    curso: 'Microsoft Certified: Azure Fundamentals (AZ-900)',
    descripcion: 'Conceptos base de servicios y gobierno en Azure',
    vigencia: 24,
    url_Pagina: 'https://learn.microsoft.com/certifications/',
  },
  {
    id_certificado: 'demo-cert-cka',
    curso: 'Certified Kubernetes Administrator (CKA)',
    descripcion: 'Administración y operación de clústeres de Kubernetes',
    vigencia: 36,
    url_Pagina: 'https://www.cncf.io/certification/cka/',
  },
  {
    id_certificado: 'demo-cert-psm',
    curso: 'Professional Scrum Master I',
    descripcion: 'Facilitación de equipos ágiles bajo el marco Scrum',
    vigencia: 0,
    url_Pagina: 'https://www.scrum.org/',
  },
  {
    id_certificado: 'demo-cert-gcp-pde',
    curso: 'Google Cloud Professional Data Engineer',
    descripcion: 'Diseño de sistemas de datos y machine learning en GCP',
    vigencia: 24,
    url_Pagina: 'https://cloud.google.com/certification/',
  },
  {
    id_certificado: 'demo-cert-terraform',
    curso: 'HashiCorp Certified: Terraform Associate',
    descripcion: 'Infraestructura como código con Terraform',
    vigencia: 24,
    url_Pagina: 'https://www.hashicorp.com/certification/',
  },
];
