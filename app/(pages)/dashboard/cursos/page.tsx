// app/dashboard/certificaciones/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {mockCourses} from '@/app/lib/data';
import  calculateProgress  from '@/components/cursos/ProgressBar';
import CourseCard from '@/components/cursos/CourseCard';
import CourseListItem from '@/components/cursos/CourseListItem';
import CourseDetailModal from '@/components/cursos/CourseDetailModal';
import NoCoursesFound from '@/components/cursos/NoCoursesFound';
import StatusBadge from '@/components/cursos/StatusBadge';

export default function CursosPage() {
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'relevance'>('date');

  const completedCourses = mockCourses.filter(c => c.status === 'completed');
  const inProgressCourses = mockCourses.filter(c => c.status === 'in-progress');

  const sortCourses = (courses: any[]) => {
    return [...courses].sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.completionDate || b.expirationDate || '2099-12-31').getTime() - 
               new Date(a.completionDate || a.expirationDate || '2099-12-31').getTime();
      } else {
        return b.relevanceScore - a.relevanceScore;
      }
    });
  };

  useEffect(() => {
    document.body.style.overflow = selectedCourse ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedCourse]);

  const renderCourses = (courses: any[]) => {
    const sorted = sortCourses(courses);
    if (sorted.length === 0) {
      return <NoCoursesFound />;
    }

    return viewMode === 'grid' ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sorted.map(course => (
          <CourseCard 
            key={course.id} 
            course={course} 
            onClick={() => setSelectedCourse(course)}
          />
        ))}
      </div>
    ) : (
      <div className="space-y-4">
        {sorted.map(course => (
          <CourseListItem
            key={course.id}
            course={course}
            onClick={() => setSelectedCourse(course)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Mis Certificaciones</h1>
        <div className="flex items-center space-x-4">
          {/* Selector de ordenamiento */}
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Ordenar por:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'relevance')}
              className="border border-gray-300 rounded-md text-sm p-1.5 bg-white"
            >
              <option value="date">Fecha</option>
              <option value="relevance">Relevancia</option>
            </select>
          </div>
          
          {/* Selector de vista */}
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 focus:outline-none ${viewMode === 'grid' ? 'bg-gray-100' : 'bg-white'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 focus:outline-none ${viewMode === 'list' ? 'bg-gray-100' : 'bg-white'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Cursos en Curso</h2>
        {renderCourses(inProgressCourses)}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Cursos Completados</h2>
        {renderCourses(completedCourses)}
      </div>

      {/* Modal de detalles de certificado */}
      {selectedCourse && (
        <CourseDetailModal 
          course={selectedCourse} 
          onClose={() => setSelectedCourse(null)}
          StatusBadge={StatusBadge}
          calculateProgress={calculateProgress}
        />
      )}
    </div>
  );
}