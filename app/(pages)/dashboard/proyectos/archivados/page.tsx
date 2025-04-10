'use client';

import { userData } from "@/app/lib/data";
import { useState, useEffect, useRef } from 'react';
import {
  getProjectsByStatus,
  calculateProjectProgress,
} from '@/app/lib/data';
import ArchivedProjectsHeader from '@/components/proyectos/archivados/archivedprojectsheader';
import ArchivedProjectsSkeleton from '@/components/proyectos/archivados/ArchivedPSkeleton';

export default function ArchivedProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const modalRef = useRef<HTMLDivElement>(null);

  const archivedProjects = getProjectsByStatus('archived');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setSelectedProject(null);
      }
    };

    if (selectedProject) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedProject]);

  useEffect(() => {
    document.body.style.overflow = selectedProject ? 'hidden' : 'unset';
    document.body.style.overflow = selectedProject ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  const getStrokeColor = (color: string) => {
    switch (color) {
      case 'emerald': return '#10B981';
      case 'blue': return '#3B82F6';
      case 'purple': return '#A855F7';
      case 'accenture':
      default: return '#A100FF';
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-md mb-6 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#A100FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold">Proyectos Archivados</h1>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center px-3 py-1.5 rounded-md ${
                  viewMode === 'grid' ? 'bg-[#A100FF] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center px-3 py-1.5 rounded-md ${
                  viewMode === 'list' ? 'bg-[#A100FF] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Lista
              </button>
            </div>
          </div>
        </div>

        {archivedProjects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-6 text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-medium mb-2">No hay proyectos archivados</h2>
            <p className="text-gray-500 mb-6">
              No has archivado ningún proyecto todavía.
            </p>
          </div>
        ) : (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {archivedProjects.map(project => {
                const progress = calculateProjectProgress(project.id);
                const strokeColor = getStrokeColor(project.color);

                return (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="bg-[#A100FF] p-4 rounded-t-xl">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-gray-800">
                          Archivado
                        </span>
                      </div>
                      <p className="text-sm text-white opacity-90">{project.client}</p>
                    </div>

                    <div className="p-5">
                      <p className="text-gray-700 text-sm mb-6 line-clamp-2">{project.description}</p>

                      <div className="mt-4 flex justify-between items-center">
                        <div className="relative w-16 h-16">
                          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#E6E6E6" strokeWidth="10" />
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="none"
                              stroke={strokeColor}
                              strokeWidth="10"
                              strokeDasharray={`${2 * Math.PI * 45 * progress / 100} ${2 * Math.PI * 45 * (100 - progress) / 100}`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg font-bold">
                            {progress}%
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500 mb-1">Tareas completadas</span>
                          <span className="font-medium">
                            {project.tasks.filter(t => t.completed).length}/{project.tasks.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {archivedProjects.map(project => {
                const progress = calculateProjectProgress(project.id);
                const strokeColor = getStrokeColor(project.color);

                return (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className="bg-white rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-all overflow-hidden"
                  >
                    <div className="bg-[#A100FF] p-4 rounded-t-xl">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-gray-800">
                          Archivado
                        </span>
                      </div>
                      <p className="text-sm text-white opacity-90">{project.client}</p>
                    </div>

                    <div className="p-5 flex items-center">
                      <div className="relative w-16 h-16 flex-shrink-0 mr-6">
                        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="#E6E6E6" strokeWidth="10" />
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke={strokeColor}
                            strokeWidth="10"
                            strokeDasharray={`${2 * Math.PI * 45 * progress / 100} ${2 * Math.PI * 45 * (100 - progress) / 100}`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg font-bold">
                          {progress}%
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 line-clamp-2">{project.description}</p>
                        <div className="mt-2">
                          <span className="text-sm text-gray-500">
                            Tareas completadas: {project.tasks.filter(t => t.completed).length}/{project.tasks.length}
                          </span>
                        </div>
                      </div>

                      <div className="ml-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}
