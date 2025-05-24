/* eslint-disable @typescript-eslint/no-explicit-any */
import ProjectListItem from './ProjectListItem';

interface ProjectListProps {
  projects: any[];
  onProjectClick: (project: any) => void;
}

export default function ProjectList({ projects, onProjectClick }: ProjectListProps) {
  return (
    <div className="space-y-4">
      {projects.map(project => (
        <ProjectListItem
          key={project.id}
          project={project}
          onProjectClick={onProjectClick}
        />
      ))}
    </div>
  );
}
