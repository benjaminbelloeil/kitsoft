/* eslint-disable @typescript-eslint/no-explicit-any */
import ProjectCard from './ProjectCard';

interface ProjectGridProps {
  projects: any[];
  onProjectClick: (project: any) => void;
}

export default function ProjectGrid({ projects, onProjectClick }: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map(project => (
        <ProjectCard
          key={project.id_proyecto}
          project={project}
          onProjectClick={onProjectClick}
        />
      ))}
    </div>
  );
}
