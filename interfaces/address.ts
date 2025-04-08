export interface Direccion {
  ID_Direccion?: string;
  Pais: string;
  Estado: string;
  Ciudad: string;
  Tipo: string;
  ID_Usuario?: string;
  Calle?: string;
  NumeroExt?: string;
  NumeroInt?: string;
  Colonia?: string;
  Referencia?: string;
}

// For selecting countries, states, and cities in dropdown menus
export interface CountryOption {
  value: string;
  label: string;
  code: string;
}

export interface StateOption {
  value: string;
  label: string;
  countryCode: string;
  stateCode: string;
}

export interface CityOption {
  value: string;
  label: string;
}
