// app/dashboard/certificaciones/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';

// Datos temporales hardcodeados
const mockCertifications = [
  {
    id: '1',
    name: 'AWS Certified Solutions Architect - Associate',
    issuer: 'Amazon Web Services',
    description: 'Validación de conocimientos técnicos para diseñar y desplegar arquitecturas seguras y robustas en la plataforma AWS.',
    status: 'completed',
    category: 'cloud',
    completionDate: '2024-02-15',
    expirationDate: '2027-02-15',
    credentialID: 'AWS-ASA-12345',
    credentialURL: 'https://aws.amazon.com/verification',
    relevanceScore: 85,
    skills: ['AWS', 'Cloud Architecture', 'EC2', 'S3', 'Lambda']
  },
  {
    id: '2',
    name: 'Certified Scrum Master (CSM)',
    issuer: 'Scrum Alliance',
    description: 'Certificación que acredita conocimientos de los principios de Scrum y la habilidad para facilitar sesiones de Scrum.',
    status: 'completed',
    category: 'agile',
    completionDate: '2023-11-10',
    expirationDate: '2025-11-10',
    credentialID: 'CSM-98765',
    credentialURL: 'https://www.scrumalliance.org/certification',
    relevanceScore: 75,
    skills: ['Scrum', 'Agile', 'Project Management', 'Team Facilitation']
  },
  {
    id: '3',
    name: 'Microsoft Azure Fundamentals (AZ-900)',
    issuer: 'Microsoft',
    description: 'Certificación que demuestra conocimientos básicos sobre servicios cloud en Azure, modelos de precios y facturación.',
    status: 'in-progress',
    category: 'cloud',
    expirationDate: '2025-12-31',
    relevanceScore: 80,
    modules: [
      {
        id: 'm1',
        name: 'Conceptos de Cloud',
        description: 'Introducción a los conceptos básicos de computación en la nube',
        completed: true
      },
      {
        id: 'm2',
        name: 'Servicios de Azure Core',
        description: 'Servicios principales y productos disponibles en Azure',
        completed: true
      },
      {
        id: 'm3',
        name: 'Seguridad, Privacidad y Cumplimiento',
        description: 'Aspectos de seguridad y privacidad en Azure',
        completed: false
      },
      {
        id: 'm4',
        name: 'Precios y Soporte de Azure',
        description: 'Modelos de precios, SLAs y ciclo de vida de servicios',
        completed: false
      }
    ]
  },
  {
    id: '4',
    name: 'Google Professional Data Engineer',
    issuer: 'Google Cloud',
    description: 'Certificación que valida la capacidad para diseñar e implementar soluciones de procesamiento de datos, ML y análisis de datos.',
    status: 'in-progress',
    category: 'data',
    expirationDate: '2026-01-20',
    relevanceScore: 90,
    modules: [
      {
        id: 'm1',
        name: 'Diseño de soluciones de datos',
        description: 'Arquitectura y diseño de soluciones de procesamiento de datos',
        completed: true
      },
      {
        id: 'm2',
        name: 'Construcción de soluciones de procesamiento de datos',
        description: 'Implementación de pipelines de datos y ETL',
        completed: false
      },
      {
        id: 'm3',
        name: 'Operación de soluciones de datos',
        description: 'Monitoreo, optimización y solución de problemas',
        completed: false
      }
    ]
  },
  {
    id: '5',
    name: 'ITIL 4 Foundation',
    issuer: 'Axelos',
    description: 'Certificación que proporciona una comprensión del marco de gestión de servicios ITIL y cómo puede mejorar el trabajo y servicios.',
    status: 'completed',
    category: 'methodology',
    completionDate: '2023-08-22',
    expirationDate: null, // No expira
    credentialID: 'ITIL-F-54321',
    credentialURL: 'https://www.axelos.com/certifications/itil-certifications',
    relevanceScore: 70,
    skills: ['ITSM', 'Service Management', 'ITIL Framework']
  }
];

// Colores temporales hardcodeados
const colorClasses = {
  cloud: {
    bg: 'bg-blue-500',
    border: 'border-blue-200'
  },
  data: {
    bg: 'bg-green-500',
    border: 'border-green-200'
  },
  security: {
    bg: 'bg-red-500',
    border: 'border-red-200'
  },
  agile: {
    bg: 'bg-yellow-500',
    border: 'border-yellow-200'
  },
  development: {
    bg: 'bg-indigo-500',
    border: 'border-indigo-200'
  },
  methodology: {
    bg: 'bg-purple-500',
    border: 'border-purple-200'
  },
  accenture: {
    bg: 'bg-[#A100FF]',
    border: 'border-[#E9D5FF]'
  }
};

export default function CertificationsPage() {
  const [selectedCertification, setSelectedCertification] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'in-progress'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'relevance'>('date');
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Filtrar certificaciones según estado seleccionado
  const getCertificationsByStatus = (status: string) => {
    if (status === 'all') {
      return mockCertifications;
    }
    return mockCertifications.filter(cert => cert.status === status);
  };
  
  // Calcular progreso de certificación (simulado)
  const calculateCertificationProgress = (certificationId: string) => {
    const cert = mockCertifications.find(c => c.id === certificationId);
    if (cert && cert.modules) {
      const completedModules = cert.modules.filter(m => m.completed).length;
      return Math.round((completedModules / cert.modules.length) * 100);
    }
    return 0;
  };

  const filteredCertifications = getCertificationsByStatus(filterStatus);
  
  // Ordenar certificaciones según el criterio seleccionado
  const sortedCertifications = [...filteredCertifications].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.completionDate || b.expirationDate || '2099-12-31').getTime() - 
             new Date(a.completionDate || a.expirationDate || '2099-12-31').getTime();
    } else {
      // Por relevancia
      return b.relevanceScore - a.relevanceScore;
    }
  });

  // Cerrar el modal al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setSelectedCertification(null);
      }
    };

    if (selectedCertification) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedCertification]);

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (selectedCertification) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedCertification]);

  // Función para obtener el estado visual de la certificación
  const getCertificationStatusBadge = (certification: any) => {
    if (certification.status === 'completed') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Completada
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          En Progreso
        </span>
      );
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h1 className="text-2xl font-bold">Mis Certificaciones</h1>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Filtros y Ordenamiento */}
          <div className="flex space-x-2">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-1.5 rounded-md border border-gray-300 bg-white text-sm"
            >
              <option value="all">Todas</option>
              <option value="completed">Completadas</option>
              <option value="in-progress">En Progreso</option>
            </select>
            
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-md border border-gray-300 bg-white text-sm"
            >
              <option value="date">Ordenar por Fecha</option>
              <option value="relevance">Ordenar por Relevancia</option>
            </select>
          </div>
          
          {/* Botones de vista */}
          <div className="flex space-x-2">
            <button 
              onClick={() => setViewMode('grid')}
              className={`flex items-center px-3 py-1.5 rounded-md ${
                viewMode === 'grid' ? 'bg-[#A100FF] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
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
                viewMode === 'list' ? 'bg-[#A100FF] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
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

      {sortedCertifications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-medium mb-2">No se encontraron certificaciones</h2>
          <p className="text-gray-500 mb-6">
            No tienes certificaciones que cumplan con los filtros seleccionados.
          </p>
        </div>
      ) : (
        viewMode === 'grid' ? (
          // Vista de grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCertifications.map(certification => {
              const progress = certification.status === 'in-progress' ? 
                calculateCertificationProgress(certification.id) : 100;
              const certificationColorClasses = colorClasses[certification.category as keyof typeof colorClasses] || colorClasses.accenture;
              
              return (
                <div 
                  key={certification.id}
                  onClick={() => setSelectedCertification(certification)}
                  className={`bg-white border rounded-lg shadow-sm overflow-hidden cursor-pointer transition-transform hover:scale-105 hover:shadow-md ${certificationColorClasses.border}`}
                >
                  <div className={`h-1 ${certificationColorClasses.bg}`}></div>
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold">{certification.name}</h3>
                      <p className="text-sm text-gray-600">{certification.issuer}</p>
                    </div>
                    
                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">{certification.description}</p>
                    
                    {certification.status === 'in-progress' && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progreso</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${certificationColorClasses.bg}`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-3 flex justify-between items-center">
                      <div>
                        {certification.completionDate && certification.status === 'completed' && (
                          <span className="text-xs text-gray-500">
                            Completada: {new Date(certification.completionDate).toLocaleDateString('es-ES')}
                          </span>
                        )}
                        {certification.expirationDate && (
                          <span className="text-xs text-gray-500">
                            {certification.status === 'completed' ? "Vence" : "Vence"}: {new Date(certification.expirationDate).toLocaleDateString('es-ES')}
                          </span>
                        )}
                      </div>
                      <div>
                        {getCertificationStatusBadge(certification)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Vista de lista
          <div className="space-y-4">
            {sortedCertifications.map(certification => {
              const progress = certification.status === 'in-progress' ? 
                calculateCertificationProgress(certification.id) : 100;
              const certificationColorClasses = colorClasses[certification.category as keyof typeof colorClasses] || colorClasses.accenture;
              
              return (
                <div 
                  key={certification.id}
                  onClick={() => setSelectedCertification(certification)}
                  className="bg-white border rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="p-4 flex items-center">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{certification.name}</h3>
                          <p className="text-sm text-gray-600">{certification.issuer}</p>
                        </div>
                        {getCertificationStatusBadge(certification)}
                      </div>
                      <p className="mt-1 text-sm text-gray-700 line-clamp-1">{certification.description}</p>
                      <div className="mt-2 flex justify-between items-center">
                        {certification.status === 'in-progress' ? (
                          <div className="flex items-center">
                            <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className={`h-2 rounded-full ${certificationColorClasses.bg}`}
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500">{progress}%</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500">
                            Completada: {new Date(certification.completionDate).toLocaleDateString('es-ES')}
                          </span>
                        )}
                        
                        {certification.expirationDate && (
                          <span className="text-xs text-gray-500">
                            Vence: {new Date(certification.expirationDate).toLocaleDateString('es-ES')}
                          </span>
                        )}
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

      {/* Modal de detalle de certificación */}
      {selectedCertification && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center"
             style={{ backdropFilter: 'blur(1px)' }}>
          <div 
            ref={modalRef}
            className="bg-white rounded-lg shadow-lg" 
            style={{
              width: '600px',
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
          >
            <div className="p-6 border-b bg-white sticky top-0">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setSelectedCertification(null)}
                  className="text-gray-500 hover:text-[#A100FF] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div>
                  {getCertificationStatusBadge(selectedCertification)}
                </div>
              </div>
              
              <div className="mt-4">
                <h1 className="text-2xl font-bold">{selectedCertification.name}</h1>
                <p className="text-gray-600">{selectedCertification.issuer}</p>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Descripción</h2>
                <p className="text-gray-700">{selectedCertification.description}</p>
              </div>
              
              {selectedCertification.status === 'in-progress' && selectedCertification.modules && (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Progreso</h2>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className={`h-2.5 rounded-full ${colorClasses[selectedCertification.category as keyof typeof colorClasses]?.bg || colorClasses.accenture.bg}`}
                          style={{ width: `${calculateCertificationProgress(selectedCertification.id)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{calculateCertificationProgress(selectedCertification.id)}%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {selectedCertification.modules && selectedCertification.modules.map((module: any) => (
                      <div 
                        key={module.id} 
                        className="border rounded-lg p-4 mb-3"
                      >
                        <div className="flex items-start">
                          <div className={`mt-0.5 w-5 h-5 rounded-full flex-shrink-0 mr-3 flex items-center justify-center ${
                            module.completed ? 'bg-green-500' : 'border-2 border-gray-300'
                          }`}>
                            {module.completed && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h3 className={`font-medium ${module.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                {module.name}
                              </h3>
                            </div>
                            {module.description && (
                              <p className="mt-1 text-sm text-gray-600">{module.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-8 pt-6 border-t">
                <h2 className="text-xl font-semibold mb-4">Detalles de la Certificación</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Categoría:</span>
                    <span className="font-semibold">{selectedCertification.category}</span>
                  </div>
                  {selectedCertification.completionDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fecha de obtención:</span>
                      <span className="font-semibold">{new Date(selectedCertification.completionDate).toLocaleDateString('es-ES')}</span>
                    </div>
                  )}
                  {selectedCertification.expirationDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fecha de expiración:</span>
                      <span className="font-semibold">{new Date(selectedCertification.expirationDate).toLocaleDateString('es-ES')}</span>
                    </div>
                  )}
                  {selectedCertification.credentialID && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID de Credencial:</span>
                      <span className="font-semibold">{selectedCertification.credentialID}</span>
                    </div>
                  )}
                  {selectedCertification.credentialURL && (
                    <div className="mt-4">
                      <a 
                        href={selectedCertification.credentialURL} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[#A100FF] hover:underline flex items-center"
                      >
                        Ver credencial
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              </div>
              
              {selectedCertification.skills && selectedCertification.skills.length > 0 && (
                <div className="mt-8 pt-6 border-t">
                  <h2 className="text-xl font-semibold mb-4">Habilidades relacionadas</h2>
                  <div className="flex flex-wrap gap-2">
                    {selectedCertification.skills.map((skill: string, index: number) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}