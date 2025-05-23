/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import ProjectLeadHeader from '@/components/proyectos/lead/ProjectLeadHeader';
import ProjectLeadSkeleton from '@/components/proyectos/lead/ProjectLeadSkeleton';

export default function ProjectLeadPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <ProjectLeadHeader
        searchQuery=""
        setSearchQuery={() => {}}
        totalProjects={0}
        assignedUsers={0}
      />
      
      {/* Skeleton */}
      <ProjectLeadSkeleton />
    </div>
  );
}