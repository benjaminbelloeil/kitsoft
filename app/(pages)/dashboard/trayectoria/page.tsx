/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  Search,
} from 'lucide-react';
import PathSkeleton from "@/components/trajectory/TrajectorySkeleton";
import CertificateItem from '@/components/trajectory/CertificateItem';
import TrajectoryDetailModal from '@/components/trajectory/TrajectoryDetailModal';
import NoTrajectoriesFound from '@/components/trajectory/NoTrajectoriesFound';
import CareerPathVisualizer from '@/components/trajectory/CareerPathVisualizer';

// CSS styles 
const styles = `
  /* Styles for the progress bar */
  .progress-bar-fill {
    /* The width will still be set dynamically via inline style */
    height: 0.5rem;
    transition: width 0.3s ease;
  }

  /* Define different percentage widths as classes */
  .progress-10 { width: 10%; }
  .progress-20 { width: 20%; }
  .progress-30 { width: 30%; }
  .progress-40 { width: 40%; }
  .progress-50 { width: 50%; }
  .progress-60 { width: 60%; }
  .progress-70 { width: 70%; }
  .progress-80 { width: 80%; }
  .progress-90 { width: 90%; }
  .progress-100 { width: 100%; }
`;

export default function TrayectoriaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activePath, setActivePath] = useState(1);
  const [careerPaths, setCareerPaths] = useState<any[]>([]);
  const [pathsLoading, setPathsLoading] = useState(true);
  const [pathCompletionCertificates, setPathCompletionCertificates] = useState<any[]>([]);
  
  // Fetch career paths from database
  const fetchPaths = useCallback(async () => {
    try {
      const response = await fetch('/api/trajectory/list');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.paths.length > 0) {
          setCareerPaths(data.paths);
          setActivePath(data.paths[0].id); // Set first path as active
        } else {
          // If no paths found, keep empty array but stop loading
          setCareerPaths([]);
        }
      } else {
        console.error('Failed to fetch paths:', response.statusText);
        setCareerPaths([]);
      }
    } catch (error) {
      console.error('Error fetching paths:', error);
      setCareerPaths([]);
    } finally {
      setPathsLoading(false);
    }
  }, []);

  // Check for path completion and create certificates
  const checkPathCompletion = useCallback(async () => {
    try {
      const response = await fetch('/api/trajectory/path-completion', {
        method: 'POST',
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.certificates.length > 0) {
          setPathCompletionCertificates(data.certificates);
          // Refresh paths to update completion status
          fetchPaths();
        }
      }
    } catch (error) {
      console.error('Error checking path completion:', error);
    }
  }, [fetchPaths]);

  const fetchPathsAndCertificates = useCallback(async () => {
    await Promise.all([
      fetchPaths(),
      checkPathCompletion()
    ]);
  }, [fetchPaths, checkPathCompletion]);

  useEffect(() => {
    fetchPathsAndCertificates();
  }, [fetchPathsAndCertificates]);
  
  // Get only path completion certificates (not individual certificates)
  const completedCourses = pathCompletionCertificates;
  
  // Apply filters and sorting
  const filterAndSortCourses = (courses: any[]) => {
    let filteredCourses = [...courses];
    
    // Apply search filter
    if (searchTerm) {
      filteredCourses = filteredCourses.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filteredCourses;
  };
  
  // Handle course click
  const handleCourseClick = (course: any) => {
    setSelectedCourse(course);
  };
  
  // Close modal
  const closeModal = () => {
    setSelectedCourse(null);
  };

  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Simulate loading delay
    return () => clearTimeout(timer);
  }, []);
  
  // Show loading if either paths or general content is loading
  if (isLoading || pathsLoading) {
    return (
      <PathSkeleton />
    );
  }  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="min-h-screen bg-gray-50 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <style jsx global>{styles}</style>
        
        {/* Page Header */}
        <motion.div 
          className="page-header mb-8 bg-white rounded-lg border border-gray-200 shadow-sm p-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          whileHover={{ y: -2, boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
        >
          <div className="flex item-center p-2">
            <motion.div 
              className="flex items-center justify-center mb-3"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </motion.div>
            <motion.div 
              className='text-left px-4'
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                Mi Trayectoria y Certificaciones
              </h1>
              <p className="text-gray-600 text-sm mx-auto">
                Explora tu progreso en las rutas de carrera y gestiona tus certificaciones profesionales en Accenture.
              </p>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Career Path Visualizer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <CareerPathVisualizer 
            paths={careerPaths} 
            activePath={activePath} 
            onPathChange={setActivePath}
            onPathCreated={fetchPaths}
            onPathCompleted={checkPathCompletion}
          />
        </motion.div>
        
        {/* Certificates Section */}
        <motion.div 
          className="mb-3 bg-white rounded-lg border border-gray-200 shadow-sm p-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          whileHover={{ y: -2, boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
        >
          <motion.div 
            className="flex items-start justify-between border-b border-gray-200 pb-4 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex item-center">
              <motion.div 
                className="flex items-center justify-center mb-3"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4, type: "spring", stiffness: 200 }}
              >
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
              </motion.div>
              <motion.div 
                className='text-left px-4'
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <h2 className="text-lg font-bold text-gray-800">Mis Cursos Completados y Certificaciones</h2>
                <p className="text-gray-600 text-sm">Aquí puedes encontrar todos los cursos que has completado y las certificaciones obtenidas.</p>
              </motion.div>
            </div>
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {/* Removed view toggle - keeping only grid view */}
            </motion.div>
          </motion.div>
          
          {/* Filters and Search */}
          <motion.div 
            className=" flex flex-wrap gap-4 items-center mb-6 p-2 w-full pb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <motion.div 
              className="relative flex-grow w-xl"
              whileHover={{ scale: 1.02 }}
              whileFocus={{ scale: 1.02 }}
            >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all"
                  placeholder="Buscar certificaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </motion.div>
          </motion.div>
          
          {/* Certificates List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterAndSortCourses(completedCourses).map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + (index * 0.1) }}
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <CertificateItem 
                    course={course} 
                    onClick={handleCourseClick}
                    viewMode="grid"
                  />
                </motion.div>
              ))}
              
              {filterAndSortCourses(completedCourses).length === 0 && (
                <motion.div 
                  className="col-span-full"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <NoTrajectoriesFound />
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
        
        {/* Course Detail Modal */}
        <AnimatePresence>
          {selectedCourse && (
            <TrajectoryDetailModal 
              course={selectedCourse}
              onClose={closeModal}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
