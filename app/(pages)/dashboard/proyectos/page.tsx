/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/context/user-context';
import ProjectsHeader from '@/components/proyectos/projectsheader';
import ProyectosSkeleton from '@/components/proyectos/ProyectosSkeleton';
import ProjectGrid from '@/components/proyectos/ProjectGrid';
import ProjectList from '@/components/proyectos/ProjectList';
import ProjectModal from '@/components/proyectos/ProjectModal';
import EmptyProjectsState from '@/components/proyectos/EmptyProjectsState';

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeProjects, setActiveProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { userRole } = useUser();

  // Fetch user's active projects
  useEffect(() => {
    const fetchUserProjects = async () => {
      try {
        const response = await fetch('/api/user/proyectos?status=active');
        if (response.ok) {
          const data = await response.json();
          setActiveProjects(data);
        } else {
          console.error('Failed to fetch user projects');
        }
      } catch (error) {
        console.error('Error fetching user projects:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userRole) {
      fetchUserProjects();
    } else {
      setLoading(false);
    }
  }, [userRole]);

  // If loading, show skeleton
  if (loading) {
    return <ProyectosSkeleton />;
  }  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="min-h-screen bg-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Header Card */}
        {/* Header simplificado con botones de cambio de vista integrados */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          <ProjectsHeader 
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </motion.div>

        {/* Content Section */}
        <motion.div 
          className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          {activeProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <EmptyProjectsState />
            </motion.div>
          ) : (
            viewMode === 'grid' ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <ProjectGrid 
                  projects={activeProjects}
                  onProjectClick={setSelectedProject} 
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <ProjectList 
                  projects={activeProjects} 
                  onProjectClick={setSelectedProject} 
                />
              </motion.div>
            )
          )}

          {/* Project Modal */}
          <AnimatePresence>
            {selectedProject && (
              <ProjectModal 
                project={selectedProject} 
                onClose={() => setSelectedProject(null)} 
              />
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}