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
