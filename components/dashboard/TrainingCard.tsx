"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Award, Calendar, BookOpen, Target, ChevronRight } from "lucide-react";

interface PathLevel {
  id: string;
  name: string;
  completed: boolean;
  current?: boolean;
}

interface ApiPath {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  levels: PathLevel[];
  fecha_inicio?: string;
  allCertificates?: Array<{
    id: string;
    name: string;
    completed: boolean;
    level: number;
  }>;
}

interface TrajectoryData {
  id: number;
  title: string;
  description: string;
  completionPercentage: number;
  totalLevels: number;
  completedLevels: number;
  totalCertificates: number;
  completedCertificates: number;
  startDate?: string;
  type: "trajectory";
}

export default function TrainingCard() {
  const [trajectories, setTrajectories] = useState<TrajectoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrajectoryData() {
      try {
        const response = await fetch('/api/trajectory/list');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.paths) {
            // Transform trajectory data for display
            const trajectoryData: TrajectoryData[] = data.paths.slice(0, 2).map((path: ApiPath) => {
              const completedLevels = path.levels?.filter((level: PathLevel) => level.completed).length || 0;
              const totalLevels = path.levels?.length || 0;
              const completionPercentage = totalLevels > 0 ? Math.round((completedLevels / totalLevels) * 100) : 0;
              
              const completedCertificates = path.allCertificates?.filter(cert => cert.completed).length || 0;
              const totalCertificates = path.allCertificates?.length || 0;
              
              return {
                id: path.id,
                title: path.title,
                description: path.description,
                completionPercentage,
                totalLevels,
                completedLevels,
                totalCertificates,
                completedCertificates,
                startDate: path.fecha_inicio,
                type: "trajectory" as const
              };
            });
            
            setTrajectories(trajectoryData);
          }
        } else {
          console.error('Failed to fetch trajectory data');
        }
      } catch (error) {
        console.error('Error fetching trajectory data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTrajectoryData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Award className="w-5 h-5 mr-2 text-blue-500" />
            Desarrollo Profesional
          </h2>
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-sm font-medium text-gray-500 uppercase mb-4">Cargando...</h3>
          <div className="space-y-3 flex-grow">
            {[1, 2].map((i) => (
              <div key={i} className="border border-gray-100 rounded-lg p-3 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-1.5 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Award className="w-5 h-5 mr-2 text-blue-500" />
          Desarrollo Profesional
        </h2>
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <div className="space-y-3 flex-grow overflow-y-auto flex flex-col">
          {trajectories.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 flex-grow">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3 border border-blue-100">
                <Award className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-2">Comienza tu desarrollo profesional</h3>
              <p className="text-sm text-gray-500 text-center max-w-sm mb-4">
                Descubre nuestras trayectorias profesionales diseñadas para impulsar tu carrera y desarrollar nuevas habilidades.
              </p>
              <div className="flex justify-center">
                <Link 
                  href="/dashboard/trayectoria" 
                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Explorar trayectorias
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          ) : (
            trajectories.map(trajectory => (
              <div 
                key={trajectory.id}
                className="border border-gray-100 rounded-lg p-4 hover:border-gray-200 transition-all shadow-sm hover:shadow-md bg-gradient-to-br from-white to-gray-50/30"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-base mb-1">{trajectory.title}</h4>
                    <p className="text-gray-600 text-sm line-clamp-2">{trajectory.description}</p>
                  </div>
                  <div className="ml-3 flex-shrink-0">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                      <Target className="w-3 h-3 mr-1" />
                      {trajectory.completedLevels}/{trajectory.totalLevels} niveles
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <BookOpen className="w-3 h-3 mr-1" />
                      <span>{trajectory.completedCertificates}/{trajectory.totalCertificates} certificados</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>Iniciado {trajectory.startDate 
                        ? new Date(trajectory.startDate).toLocaleDateString('es-ES', { 
                            day: '2-digit',
                            month: '2-digit', 
                            year: 'numeric' 
                          })
                        : 'Fecha no disponible'
                      }</span>
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Progreso</span>
                    <span className="font-medium text-indigo-600">{trajectory.completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${trajectory.completionPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
