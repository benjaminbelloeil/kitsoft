export interface Certificate {
  ID_Certificado?: string;
  ID_Usuario?: string;
  Nombre: string;
  Emisor: string;
  Fecha_Emision: string;
  Fecha_Expiracion?: string | null;
  URL_Certificado?: string;
  Credencial_ID?: string;
}

export interface CertificatesSectionProps {
  initialCertificates?: Certificate[];
}

export interface usuario_certificado {
  id_certificado: string;
  id_usuario: string;
  url_archivo?: string | null;
  fecha_inicio: string;
  fecha_fin?: string | null;
}

export interface certificado {
  id_certificado: string;
  curso: string;
  descripcion: string;
  vigencia: number;
  url_Pagina: string;
}