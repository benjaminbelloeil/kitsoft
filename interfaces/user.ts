import { Direccion } from '@/interfaces/address';
import { Correo, Telefono } from '@/interfaces/contact';
import { Skill } from '@/interfaces/skill';
import { Project } from '@/interfaces/project';
import { Experience } from '@/interfaces/experience';
import { Certificate } from '@/interfaces/certificate';

export interface User {
  id_usuario: string;
  nombre?: string;
  apellido?: string;
  titulo?: string;
  email?: string;
  url_avatar?: string | null;
  registered: boolean;
  role?: {
    id_nivel?: string;
    numero?: number;
    titulo?: string;
  };
  lastLogin?: string | null;
  hasLoggedIn?: boolean; // Field to track if the user has ever logged in
  ID_PeopleLead?: string | null; // Field to track assigned people lead
}

export interface UserRole {
  id_nivel: string;
  numero: number; 
  titulo: string;
}

export interface Usuario {
  id_usuario: string;
  ID_Usuario: string;
  Nombre: string;
  Apellido: string;
  Titulo: string;
  Bio: string;
  URL_Avatar: string | null;
  URL_Curriculum?: string | null;
  Fecha_Inicio_Empleo?: string | null;
  ID_PeopleLead?: string | null;
}

export interface UserProfile extends Usuario {
  direccion?: Direccion;
  telefono?: Telefono;
  correo?: Correo;
  skills?: Skill[];
  projects?: Project[];
  experience?: Experience[];
  certificates?: Certificate[];
}

// This type is used when updating a user profile
// We explicitly require ID_Usuario for identification purposes
// but mark it as readonly to indicate it shouldn't be changed
export interface UserProfileUpdate {
  readonly ID_Usuario: string;  // Required for identification but not for updating
  Nombre?: string;
  Apellido?: string;
  Titulo?: string;
  Bio?: string;
  URL_Avatar?: string | null;
  URL_Curriculum?: string | null;
  Fecha_Inicio_Empleo?: string | null;
  ID_PeopleLead?: string | null;
  direccion?: Partial<Direccion>;
  telefono?: Partial<Telefono>;
  correo?: Partial<Correo>;
}
