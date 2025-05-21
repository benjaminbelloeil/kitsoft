import React from 'react';

const ArchivedPSkeleton: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-6 animate-pulse mx-auto sm:px-6 lg:px-8 mb-10">
            {/* Header skeleton */}
            <div className='mb-8'>
                <div className="bg-gray-50 shadow-md border border-gray-200 rounded-t-xl p-4 md:p-6 flex flex-col md:flex-row justify-between items-center">
                    {/* Icono placeholder */}
                    <div className="flex items-center mb-4 md:mb-0">
                        <div className="bg-gray-200 rounded-lg h-12 w-12 mr-4" />
                        <div className="flex flex-col">
                            <div className="bg-gray-200 h-5 w-32 mb-2 rounded" />
                            <div className="bg-gray-200 h-4 w-20 rounded" />
                        </div>
                    </div>
                    {/* Contador de proyectos placeholder */}
                    <div className="flex items-center">
                        <div className="bg-gray-200 h-6 w-44 rounded mr-4" />
                        <div className="relative">
                            <div className="bg-gray-200 rounded-lg h-14 w-34" />
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    {/* Footer Skeleton */}
                    <div className="bg-gray-50 shadow-md rounded-b-xl p-4 flex flex-col md:flex-row justify-between border-t border-x border-gray-200">
                        {/* Tareas Completadas */}
                        <div className="mb-4 md:mb-0 space-y-2">
                            <div className="flex items-center space-x-2">
                                <div className="bg-gray-200 h-6 w-40 rounded" />
                                <div className="bg-gray-200 h-5 w-32 rounded" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content skeleton */}
                {/* Estado: Vista de grid (skeleton) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    {[...Array(3)].map((_, idx) => (
                        <div key={idx} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                            <div className="bg-gray-200 p-4 rounded-t-xl">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="h-5 w-32 bg-gray-300 rounded" />
                                    <div className="h-5 w-16 bg-gray-100 rounded-full" />
                                </div>
                                <div className="h-4 w-24 bg-gray-300 rounded mb-1" />
                            </div>
                            <div className="p-5">
                                <div className="h-4 w-48 bg-gray-200 rounded mb-6" />
                                <div className="relative w-full h-24 flex flex-col justify-center">
                                    <div className="flex justify-between items-center gap-4">
                                        <div>
                                            <div className="h-4 w-32 bg-gray-100 rounded mb-1"></div>
                                            <div className="h-6 w-20 bg-gray-200 rounded"></div>
                                        </div>
                                        <div>
                                            <div className="h-4 w-32 bg-gray-100 rounded mb-1"></div>
                                            <div className="h-6 w-28 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
        </div>
    );
};

export default ArchivedPSkeleton;