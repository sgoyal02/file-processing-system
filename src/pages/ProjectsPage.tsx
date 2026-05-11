
import { useEffect, useState } from 'react';
// import { ProjectCard } from '../components/ProjectCard';
// import { Modal } from '../components/Modal';
// import { CreateProjectForm } from '../components/CreateProjectForm';
import '../styles/projects.css';
import { useProjects } from '../contexts/ProjectsContext';
import { ProjectCard } from '../components/ProjectCard';
import DialogModal from '../components/DialogModal';
import AddProject from '../components/AddProject';

const ProjectsPage = () => {
  const { data, isLoad, err, addProject, delProject, getProjects } = useProjects();
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    getProjects();
  }, [getProjects]);

  const handleAdd=async(data:{name: string;description:string}):Promise<{ success: boolean; msg: string }>=>{
    try{
      await addProject(data);
      return{success: true, msg:""}
    }
    catch(err){
      return {success: false, msg: err instanceof Error
      ? err.message
      : "Something went wrong"};
    }
  }

  return (
    <div className="page-wrapper">
      <h1 className="page-title">Projects</h1>
      {
        isLoad ?
          <div className='flex-center page-state'>
            <span className="loader loader--lg" />
            <p className="state-text">Loading..</p>
          </div>
          : !!err ?
            <div className='flex-center page-state'>
              <div className="flex-center state-icon state-icon--err">
                <svg width="28" height="28" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
              </div>
              <p className="state-text">{err}</p>
              <button className="btn-primary" onClick={getProjects}>Retry</button>
            </div>
            : !data.length ?
              <div className='flex-center page-state'>
                <div className="flex-center state-icon state-icon--empty">
                  <svg width="28" height="28" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor" className="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                  </svg>
                </div>
                <p className="state-text">No projects yet. Create one to get started.</p>
                <button className='btn-primary' onClick={() => setShowModal(true)}>
                  <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Create Project
                </button>
              </div>
              : <div>
                <div className='flex-between grid-header'>
                  <p className="grid-subtext">
                    {`${data.length} project${data.length !== 1 ? 's' : ''}`}
                  </p>
                  <button className='btn-primary' onClick={() => setShowModal(true)}>
                    <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Create Project
                  </button>
                </div>
                <div className="projects-grid">
                  {data.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onDelete={delProject}
                    />
                  ))}
                </div>
              </div>
      }
      {
        showModal &&
        <DialogModal isOpen={showModal} onClose={()=>setShowModal(false)} title="Add Project"
        children={<AddProject onSubmit={handleAdd} onCancel={()=>setShowModal(false)}/>}
        />
      }
    </div>
  )

}

export default ProjectsPage;