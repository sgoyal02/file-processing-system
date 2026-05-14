import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate, type Project } from '../services/types';
import '../styles/projects.css'
interface ProjectCardProps {
  project: Project;
  onDelete: (id: string|number) => Promise<void>;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const navigate = useNavigate();
  const [delProj, setDelProj] = useState({ isDel: false, opneModal: false, errTxt: "" })

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    //modal work--- to do
    if (!window.confirm(`Do you want to delete ${project.name}?`)) return; //test
    setDelProj((prev) => ({ ...prev, isDel: true, errTxt: "" }))
    try {
      await onDelete(project.id);
    } catch {
      setDelProj((prev) => ({ ...prev, isDel: false, errTxt: "Del failed. Retry" }))
    }
  }

  return (
    <div className="project-card">
      <div className="flex-between">
        <h3 className="card-name">{project.name}</h3>
        <button
          className="flex-center btn btn-delete"
          onClick={handleDelete}
          disabled={delProj.isDel}
          title="Delete project"
        >
          {delProj.isDel ? (
            <span className="loader loader--sm" />
          ) : (
            <svg width={"15px"} height={"15px"} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          )}
        </button>
      </div>
      {!!delProj.errTxt && <p className="card-err">{delProj.errTxt}</p>}
      <p className="card-description" title={project.description}>{project.description}</p>

      <div className="card-stats">
        <span className="stat-item">
          <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
          </svg>
          {formatDate(project.createdAt)}
        </span>
        <span className="stat-item">
          <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>

          {project.filesCount || 0} files
        </span>
        <span className="stat-item">
          <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
          </svg>
          {project.jobsCount || 0} jobs
        </span>
      </div>

      <div className="card-action">
        <button className="flex-center btn-open" onClick={() => navigate(`/projects/${project.id}`)}
        >
          Open Project
          <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
          </svg>

        </button>
      </div>
    </div>
  );
}