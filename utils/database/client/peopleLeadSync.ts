/**
 * People Lead Sync Utilities
 * 
 * This module provides frontend helper functions for people leads to access
 * and manage their assigned team members' profile data (certificates, curriculum,
 * experience, and skills). These functions mirror the existing profile utilities
 * but are specifically designed for people lead access patterns.
 */

// Types for people lead API responses
export interface PeopleLeadCertificate {
  titulo: string;
  institucion: string;
  fecha_obtencion: string;
  fecha_expiracion?: string;
  url?: string;
}

export interface PeopleLeadExperience {
  id_experiencia: string;
  compañia: string;
  posicion: string;
  fecha_inicio: string;
  fecha_fin?: string;
  descripcion: string;
  id_usuario: string;
  habilidades?: Array<{
    id_habilidad: string;
    titulo: string;
    nivel_experiencia: number;
  }>;
}

export interface PeopleLeadSkill {
  id_habilidad: string;
  id_usuario: string;
  nivel_experiencia: number;
  titulo: string;
}

export interface PeopleLeadCurriculum {
  url: string | null;
}

/**
 * Get certificates for a team member
 */
export async function getPeopleLeadMemberCertificates(userId: string): Promise<PeopleLeadCertificate[]> {
  try {
    const res = await fetch(`/api/people-lead/certificates?userId=${encodeURIComponent(userId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error fetching team member certificates:', errorText);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error('Exception in getPeopleLeadMemberCertificates:', error);
    return [];
  }
}

/**
 * Get curriculum URL for a team member
 */
export async function getPeopleLeadMemberCurriculum(userId: string): Promise<string | null> {
  try {
    const res = await fetch(`/api/people-lead/curriculum?userId=${encodeURIComponent(userId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error fetching team member curriculum:', errorText);
      return null;
    }

    const data: PeopleLeadCurriculum = await res.json();
    return data.url;
  } catch (error) {
    console.error('Exception in getPeopleLeadMemberCurriculum:', error);
    return null;
  }
}

/**
 * Get experience for a team member
 */
export async function getPeopleLeadMemberExperience(userId: string): Promise<PeopleLeadExperience[]> {
  try {
    const res = await fetch(`/api/people-lead/experience?userId=${encodeURIComponent(userId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error fetching team member experience:', errorText);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error('Exception in getPeopleLeadMemberExperience:', error);
    return [];
  }
}

/**
 * Get skills for a team member
 */
export async function getPeopleLeadMemberSkills(userId: string): Promise<PeopleLeadSkill[]> {
  try {
    const res = await fetch(`/api/people-lead/skills?userId=${encodeURIComponent(userId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error fetching team member skills:', errorText);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error('Exception in getPeopleLeadMemberSkills:', error);
    return [];
  }
}

/**
 * Get complete profile data for a team member
 * This aggregates all profile information (certificates, curriculum, experience, skills)
 */
export async function getPeopleLeadMemberCompleteProfile(userId: string): Promise<{
  certificates: PeopleLeadCertificate[];
  curriculum: string | null;
  experience: PeopleLeadExperience[];
  skills: PeopleLeadSkill[];
}> {
  try {
    // Fetch all data in parallel for better performance
    const [certificates, curriculum, experience, skills] = await Promise.all([
      getPeopleLeadMemberCertificates(userId),
      getPeopleLeadMemberCurriculum(userId),
      getPeopleLeadMemberExperience(userId),
      getPeopleLeadMemberSkills(userId)
    ]);

    return {
      certificates,
      curriculum,
      experience,
      skills
    };
  } catch (error) {
    console.error('Exception in getPeopleLeadMemberCompleteProfile:', error);
    return {
      certificates: [],
      curriculum: null,
      experience: [],
      skills: []
    };
  }
}

/**
 * Transform people lead experience data to match the format expected by ExperienceSection
 */
export function transformPeopleLeadExperienceForDisplay(experiences: PeopleLeadExperience[]): Array<{
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  description: string;
  isCurrentPosition: boolean;
  skills: Array<{
    id: string;
    name: string;
    level: number;
  }>;
}> {
  return experiences.map(exp => ({
    id: exp.id_experiencia,
    company: exp.compañia,
    position: exp.posicion,
    startDate: exp.fecha_inicio,
    endDate: exp.fecha_fin || null,
    description: exp.descripcion,
    isCurrentPosition: exp.fecha_fin === null,
    skills: exp.habilidades?.map(skill => ({
      id: skill.id_habilidad,
      name: skill.titulo,
      level: skill.nivel_experiencia
    })) || []
  }));
}

/**
 * Transform people lead skills data to match the format expected by SkillsSection
 */
export function transformPeopleLeadSkillsForDisplay(skills: PeopleLeadSkill[]): Array<{
  id: string;
  name: string;
  level: number;
}> {
  return skills.map(skill => ({
    id: skill.id_habilidad,
    name: skill.titulo,
    level: skill.nivel_experiencia
  }));
}

/**
 * Transform people lead certificates data to match the format expected by CertificatesSection
 */
export function transformPeopleLeadCertificatesForDisplay(certificates: PeopleLeadCertificate[]): Array<{
  id: string;
  title: string;
  description?: string;
  url?: string;
  issueDate?: string;
  expirationDate?: string;
  issuer?: string;
}> {
  return certificates.map((cert, index) => ({
    id: `cert-${index}`, // Generate ID since the new interface doesn't have id_certificado
    title: cert.titulo,
    description: undefined, // Not available in the current certificate data
    url: cert.url,
    issueDate: cert.fecha_obtencion,
    expirationDate: cert.fecha_expiracion,
    issuer: cert.institucion
  }));
}

/**
 * Check if current user is a people lead and can access the requested user's data
 * This is mainly used for frontend validation before making API calls
 */
export async function canAccessMemberData(targetUserId: string): Promise<boolean> {
  try {
    // Try to fetch the user's basic profile - if this succeeds, we have access
    const res = await fetch(`/api/people-lead/users?userId=${encodeURIComponent(targetUserId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return res.ok;
  } catch (error) {
    console.error('Exception in canAccessMemberData:', error);
    return false;
  }
}

/**
 * Get all assigned team members for the current people lead
 */
export async function getPeopleLeadTeamMembers(): Promise<Array<{
  id_usuario: string;
  nombre: string;
  apellido: string;
  titulo?: string;
  url_avatar?: string;
}>> {
  try {
    const res = await fetch('/api/people-lead/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error fetching team members:', errorText);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error('Exception in getPeopleLeadTeamMembers:', error);
    return [];
  }
}

/**
 * Utility function to format experience periods for display
 */
export function formatExperiencePeriod(startDate: string, endDate: string | null): string {
  const start = new Date(startDate);
  const startFormatted = start.toLocaleDateString('es-ES', { 
    month: 'long', 
    year: 'numeric' 
  });
  
  if (!endDate) {
    return `${startFormatted} - Presente`;
  }
  
  const end = new Date(endDate);
  const endFormatted = end.toLocaleDateString('es-ES', { 
    month: 'long', 
    year: 'numeric' 
  });
  
  return `${startFormatted} - ${endFormatted}`;
}

/**
 * Utility function to get skill level label in Spanish
 */
export function getSkillLevelLabel(level: number): string {
  switch (level) {
    case 1: return 'Principiante';
    case 2: return 'Intermedio';
    case 3: return 'Profesional';
    default: return 'Principiante';
  }
}

/**
 * Utility function to group skills by level for display
 */
export function groupSkillsByLevel(skills: Array<{ id: string; name: string; level: number }>): {
  beginner: Array<{ id: string; name: string; level: number }>;
  intermediate: Array<{ id: string; name: string; level: number }>;
  professional: Array<{ id: string; name: string; level: number }>;
} {
  return {
    beginner: skills.filter(skill => skill.level === 1),
    intermediate: skills.filter(skill => skill.level === 2),
    professional: skills.filter(skill => skill.level === 3)
  };
}