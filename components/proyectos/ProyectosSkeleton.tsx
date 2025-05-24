import React from 'react';
import { motion } from 'framer-motion';

export default function ProyectosSkeleton() {
    const shimmer = {
        animate: {
            backgroundPosition: '200% 0',
        },
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
        },
    };
    
    return (
        <div className="min-h-screen bg-white">
            {/* Header skeleton - Matching ProjectsHeader structure */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-[1400px] mx-auto py-6 px-4 sm:px-6 lg:px-8 mb-8"
            >
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 relative overflow-hidden">
                    <div className="flex flex-col md:flex-row gap-6 justify-between">
                        <div className="flex items-center">
                            <motion.div 
                                className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 w-12 h-12 rounded-lg mr-4"
                                style={{ backgroundSize: '200% 100%' }}
                                animate={shimmer.animate}
                                transition={shimmer.transition}
                            />
                            <div>
                                <motion.div 
                                    className="h-7 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-48 mb-2"
                                    style={{ backgroundSize: '200% 100%' }}
                                    animate={shimmer.animate}
                                    transition={shimmer.transition}
                                />
                                <motion.div 
                                    className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-64"
                                    style={{ backgroundSize: '200% 100%' }}
                                    animate={shimmer.animate}
                                    transition={shimmer.transition}
                                />
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                            <div className="flex gap-3">
                                <motion.div 
                                    className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-20"
                                    style={{ backgroundSize: '200% 100%' }}
                                    animate={shimmer.animate}
                                    transition={shimmer.transition}
                                />
                                <motion.div 
                                    className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-20"
                                    style={{ backgroundSize: '200% 100%' }}
                                    animate={shimmer.animate}
                                    transition={shimmer.transition}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    {/* Footer Skeleton */}
                    <div className="bg-gray-50 shadow-md rounded-b-xl p-4 flex flex-col md:flex-row justify-between border-t border-x border-gray-200">
                        {/* Tareas Completadas */}
                        <div className="mb-4 md:mb-0 space-y-2">
                            <div className="bg-gray-200 h-4 w-32 rounded" />
                            <div className="flex items-center space-x-2">
                                <div className="bg-gray-200 h-6 w-20 rounded" />
                                <div className="bg-gray-200 h-5 w-12 rounded" />
                            </div>
                        </div>

                        {/* Vencimientos Próximos */}
                        <div className="mb-4 md:mb-0 space-y-2">
                            <div className="bg-gray-200 h-4 w-32 rounded" />
                            <div className="bg-gray-200 h-6 w-24 rounded" />
                        </div>

                        {/* Cargabilidad Media */}
                        <div className="mb-4 md:mb-0 space-y-2">
                            <div className="bg-gray-200 h-4 w-32 rounded" />
                            <div className="bg-gray-200 h-6 w-20 rounded" />
                        </div>

                        {/* Botones de Vista */}
                        <div className="flex items-center justify-end space-x-2">
                            <div className="bg-gray-200 h-8 w-12 rounded" />
                            <div className="bg-gray-200 h-8 w-12 rounded" />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Content skeleton - Matching actual projects grid */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-8"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.3 + idx * 0.1 }}
                            className="bg-white rounded-xl shadow-md overflow-hidden"
                        >
                            {/* Project color header */}
                            <motion.div 
                                className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 p-4 rounded-t-xl h-20"
                                style={{ backgroundSize: '200% 100%' }}
                                animate={shimmer.animate}
                                transition={shimmer.transition}
                            />
                            
                            <div className="p-5">
                                {/* Description */}
                                <motion.div 
                                    className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-full mb-2"
                                    style={{ backgroundSize: '200% 100%' }}
                                    animate={shimmer.animate}
                                    transition={shimmer.transition}
                                />
                                <motion.div 
                                    className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4 mb-6"
                                    style={{ backgroundSize: '200% 100%' }}
                                    animate={shimmer.animate}
                                    transition={shimmer.transition}
                                />
                                
                                {/* Stats */}
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <motion.div 
                                            className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-16 mb-1"
                                            style={{ backgroundSize: '200% 100%' }}
                                            animate={shimmer.animate}
                                            transition={shimmer.transition}
                                        />
                                        <motion.div 
                                            className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-12"
                                            style={{ backgroundSize: '200% 100%' }}
                                            animate={shimmer.animate}
                                            transition={shimmer.transition}
                                        />
                                    </div>
                                    <div>
                                        <motion.div 
                                            className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-20 mb-1"
                                            style={{ backgroundSize: '200% 100%' }}
                                            animate={shimmer.animate}
                                            transition={shimmer.transition}
                                        />
                                        <motion.div 
                                            className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-16"
                                            style={{ backgroundSize: '200% 100%' }}
                                            animate={shimmer.animate}
                                            transition={shimmer.transition}
                                        />
                                    </div>
                                </div>
                                
                                {/* Team avatars */}
                                <div className="flex -space-x-2 overflow-hidden">
                                    {[1, 2, 3, 4].map((member, index) => (
                                        <motion.div 
                                            key={index}
                                            className="inline-block h-7 w-7 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 ring-2 ring-white"
                                            style={{ backgroundSize: '200% 100%' }}
                                            animate={shimmer.animate}
                                            transition={shimmer.transition}
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}