import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import type { Project } from '../services/types';
import { useApiService } from '../services/apiService';

interface ProjectsContextType {
  data:Project[];
  isLoad:boolean;
  err: string;
  getProjects:() => Promise<void>;
  addProject:(data:{ name: string, description: string })=> Promise<void>;
  update:(id: string|number, data:{ name: string, description: string })=> Promise<void>;
  delProject:(id: string|number)=> Promise<void>;
}
const ProjectsContext= createContext<ProjectsContextType | null>(null);

const ProjectsProvider =({ children}:{children: React.ReactNode})=> {
  const [state, setState] = useState<{
    data: Project[], isLoad: boolean, err:string
  }>({data:[], isLoad:false, err:""})
  const { onLogout } = useAuth();
  const {fetchProjects, createProject, updateProject, removeProject} = useApiService();

  const handleAuthError= useCallback((err: unknown)=> {
    if (err instanceof Error && err.message === 'Unauthorized') onLogout();
  },[onLogout]);

  const getProjects = useCallback(async () => {
   setState((prev)=>({...prev, isLoad: true, err:""}))
    try {
      const data = await fetchProjects();
      setState((prev)=>({...prev, data: data, isLoad: false}))
    } catch (err) {
      handleAuthError(err);
      setState((prev)=>({...prev, isLoad: false, err:err instanceof Error ? err.message : 'failed to load projects.' }))
    }
  }, []);

  const addProject = useCallback(async (data: { name: string, description: string }) => {
    try{
    await createProject(data);
    await getProjects();
    } catch (err){
      handleAuthError(err);
      throw err;
    }
  }, [getProjects]);

    const update = useCallback(async (id: string|number, data:{name:string, description:string }) => {
    try{
    await updateProject(id, data);
    await getProjects();
    } catch (err){
      handleAuthError(err);
      throw err;
    }
  }, [getProjects]);

  const delProject = useCallback(async (id: string|number) => {
    try{
    await removeProject(id);
    await getProjects();
    }catch(err){
      handleAuthError(err);
      throw err;
    }
  }, [getProjects]);

  return (
    <ProjectsContext.Provider value={{ ...state, getProjects, addProject, delProject, update }}>
      {children}
    </ProjectsContext.Provider>
  );
}
export default ProjectsProvider;

export const useProjects=()=> {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error('useProjects must be in proj provider');
  return ctx;
}