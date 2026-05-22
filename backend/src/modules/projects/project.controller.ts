import { Request, Response } from 'express';
import { projService } from './project.service';
import { sendError, sendSuccess } from '../../response';

export const projController = {
    //all fetch
  getAll:async (req:Request, res:Response) => {
    try {
    const data = await projService.getAllProjects();
      sendSuccess(res, data, 'Projects fetch success',200);
    }catch (err) {
      sendError(res, err instanceof Error ? err.message : 'db fetch failure',500);
    }
  },

  //get by proj id
  getById: async(req:Request, res:Response) => {
    const id = req.params.id as string;  // ! not working ??, as sString only
    try {
      const project = await projService.getProjectDetail(id);
      sendSuccess(res, project, 'Project fetch success', 200);
    } catch (err) {
      const errMsg = err instanceof Error?err.message:'';
      const code = errMsg=== 'Project not found.' ? 404 : 500;
      sendError(res, errMsg||'Failed to fetch project detail', code);
    }
  },
//new proj
  create:async(req:Request, res:Response) => {
    const {name, description} = req.body;
    try {
    const newProject = await projService.addNewProject(name,description);
      sendSuccess(res,newProject, 'Project added successfully', 201);
    } catch (err) {
      const errMsg= err instanceof Error ? err.message : '';
      const code = errMsg=== 'Name and description fields are required.'?400: 500;
      sendError(res, errMsg ||'Failed to add new project', code);
    }
  },

  //del
  delete:async (req:Request, res:Response) => {
    const id = req.params.id as string;
    try {
      await projService.deleteProject(id);
      sendSuccess(res,null, 'Project delete success', 200);
    } catch (err) {
      const errMsg=err instanceof Error ? err.message : '';
      const code =errMsg ==='Project not found with selected id.'? 404 : 500;
      sendError(res, errMsg || 'Del failure', code);
    }
  }
};