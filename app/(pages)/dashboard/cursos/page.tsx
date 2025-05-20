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
import { FiBookOpen, FiFilter, FiSearch, FiCheckCircle, FiClock } from 'react-icons/fi';

export default function CursosPage() {
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'relevance'>('date');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const completedCourses = mockCourses.filter(c => c.status === 'completed');
  const inProgressCourses = mockCourses.filter(c => c.status === 'in-progress');

  // Extract all unique categories
  const categories = Array.from(new Set(mockCourses.map(course => course.category)));

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

  // Filter courses based on search term and category
  const filterCourses = (courses: any[]) => {
    return courses.filter(course => {
      const matchesSearch = searchTerm === '' || 
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.issuer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = categoryFilter === null || course.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  };

  useEffect(() => {
    document.body.style.overflow = selectedCourse ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedCourse]);

  const renderCourses = (courses: any[], status: 'in-progress' | 'completed') => {
    const filtered = filterCourses(courses);
    const sorted = sortCourses(filtered);
    
    if (sorted.length === 0) {
      return <NoCoursesFound />;
    }

    return viewMode === 'grid' ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sorted.map((course) => (
          <div key={course.id} className="transition-all duration-300 hover:-translate-y-1">
            <CourseCard 
              course={course} 
              onClick={() => setSelectedCourse(course)}
            />
          </div>
        ))}
      </div>
    ) : (
      <div className="space-y-4">
        {sorted.map((course) => (
          <div key={course.id} className="transition-all duration-300 hover:-translate-x-1">
            <CourseListItem
              course={course}
              onClick={() => setSelectedCourse(course)}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-7xl">
      {/* Header Section with Card */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg mb-10 overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          {/* Left side - Purple gradient */}
          <div className="bg-gradient-to-br from-[#A100FF] to-[#8500D4] w-full sm:w-2/5 p-8 text-white">
            <div className="flex items-start mb-6">
              <div className="bg-white/20 p-3 rounded-xl mr-4">
                <FiBookOpen className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Mis Certificaciones</h1>
                <p className="opacity-80">
                  Gestiona y visualiza todos tus cursos y certificaciones profesionales 
                </p>
              </div>
            </div>
            
            <div className="mt-8">
              <div className="flex items-center mb-2">
                <FiClock className="w-5 h-5 mr-2" />
                <span className="text-lg font-medium">En Progreso: {inProgressCourses.length}</span>
              </div>
              <div className="flex items-center">
                <FiCheckCircle className="w-5 h-5 mr-2" />
                <span className="text-lg font-medium">Completados: {completedCourses.length}</span>
              </div>
            </div>
          </div>
          
          {/* Right side - Controls and filters */}
          <div className="w-full sm:w-3/5 p-8">
            <div className="mb-8">
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por título, emisor o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:ring-2 focus:ring-[#A100FF20] focus:border-[#A100FF]"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              {/* Category filter */}
              <div className="flex-1">
                <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <div className="relative">
                  <select
                    id="categoryFilter"
                    value={categoryFilter || ''}
                    onChange={(e) => setCategoryFilter(e.target.value || null)}
                    className="appearance-none block w-full pl-3 pr-10 py-2 border border-gray-200 rounded-lg bg-white 
                    focus:ring-2 focus:ring-[#A100FF20] focus:border-[#A100FF]"
                  >
                    <option value="">Todas las categorías</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                    <FiFilter className="w-4 h-4" />
                  </div>
                </div>
              </div>
              
              {/* Sorting options */}
              <div className="flex-1">
                <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                  Ordenar por
                </label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'relevance')}
                  className="block w-full pl-3 pr-10 py-2 border border-gray-200 rounded-lg bg-white
                  focus:ring-2 focus:ring-[#A100FF20] focus:border-[#A100FF]"
                >
                  <option value="date">Fecha</option>
                  <option value="relevance">Relevancia</option>
                </select>
              </div>
              
              {/* View mode toggle */}
              <div className="flex-0">
                <label className="block text-sm font-medium text-gray-700 mb-1">Vista</label>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`transition p-2 focus:outline-none ${viewMode === 'grid' 
                      ? 'bg-[#A100FF] text-white' 
                      : 'hover:bg-gray-100 text-gray-600'}`}
                    aria-label="Vista de cuadrícula"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`transition p-2 focus:outline-none ${viewMode === 'list' 
                      ? 'bg-[#A100FF] text-white' 
                      : 'hover:bg-gray-100 text-gray-600'}`}
                    aria-label="Vista de lista"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses in Progress */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <div className="relative">
            <div className="absolute -z-10 w-10 h-10 rounded-full bg-[#A100FF10]"></div>
            <FiClock className="w-6 h-6 text-[#A100FF]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Cursos en Progreso</h2>
        </div>
        {renderCourses(inProgressCourses, 'in-progress')}
      </section>

      {/* Completed Courses */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <div className="relative">
            <div className="absolute -z-10 w-10 h-10 rounded-full bg-green-100"></div>
            <FiCheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Cursos Completados</h2>
        </div>
        {renderCourses(completedCourses, 'completed')}
      </section>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <CourseDetailModal 
          course={selectedCourse} 
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </div>
  );
}