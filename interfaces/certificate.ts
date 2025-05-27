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

// Tipo para uso exclusivo del frontend
export interface CertificateVisualData extends usuario_certificado {
	certificados: certificado,
}