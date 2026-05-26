import { projectRepo } from "./project.repository";

export const projService= {
  getAllProjects:async () => {
    return await projectRepo.findAll();
  },
  getProjectDetail:async(id:string) => {
    const project = await projectRepo.findById(id);
    if (!project) {
      throw new Error('Project not found.');
    }
    return project;
  },

  addNewProject:async(name: string, description: string) => {
    if (!name|| !description) {
      throw new Error('Name and description fields are required.');
    }
    const data = await projectRepo.create(name, description);
    return {...data,filesCount: 0,jobsCount: 0}
  },

  updateProject:async(id:string, name:string, description:string) => {
  if (!name || !description) {
    throw new Error('Name and description fields required.');
  }
  const updatedProject = await projectRepo.update(id, name, description);
  if (!updatedProject) {
    throw new Error('Project not found.');
  }
  return updatedProject;
},

  deleteProject:async (id:string) => {
    const rec = await projectRepo.delete(id);
    if (!rec) {
      throw new Error('Project not found with selected id.');
    }
    return true;
  }
};