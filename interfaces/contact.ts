export interface Correo {
  ID_Correo: string;
  Correo: string;
  ID_Usuario: string;
  Tipo: string;
}

export interface Telefono {
  ID_Telefono?: string;
  Codigo_Pais: string;
  Codigo_Estado: string;
  Numero: string;
  Tipo: string;
  ID_Usuario?: string;
}

export interface PhoneCodeOption {
  value: string;
  label: string;
  code: string;
}
