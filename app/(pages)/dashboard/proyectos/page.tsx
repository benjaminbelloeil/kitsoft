/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { 
  getProjectsByStatus, 
} from '@/app/lib/data';
import ProjectsHeader from '@/components/proyectos/projectsheader';
import ProyectosSkeleton from '@/components/proyectos/ProyectosSkeleton';
import ProjectGrid from '@/components/proyectos/ProjectGrid';
import ProjectList from '@/components/proyectos/ProjectList';
import ProjectModal from '@/components/proyectos/ProjectModal';
import EmptyProjectsState from '@/components/proyectos/EmptyProjectsState';

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const activeProjects = getProjectsByStatus('active');

  const [loading, setLoading] = useState(true);
  //Use effect para simular la carga de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Simula un retraso de 1.5 segundo para la carga
    return () => clearTimeout(timer);
  }, []);

  // If loading, show skeleton
  if (loading) {
    return <ProyectosSkeleton />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Card */}
      {/* Header simplificado con botones de cambio de vista integrados */}
      <ProjectsHeader 
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Content Section */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        {activeProjects.length === 0 ? (
          <EmptyProjectsState />
        ) : (
          viewMode === 'grid' ? (
            <ProjectGrid 
              projects={activeProjects} 
              onProjectClick={setSelectedProject} 
            />
          ) : (
            <ProjectList 
              projects={activeProjects} 
              onProjectClick={setSelectedProject} 
            />
          )
        )}

        {/* Project Modal */}
        {selectedProject && (
          <ProjectModal 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </div>
    </div>
  );
}