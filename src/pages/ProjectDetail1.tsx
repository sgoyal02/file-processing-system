import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/projects.css';
import { formatDate, type Project, type SavedFile } from '../services/types';
import { useApiService } from '../services/apiService';

const ProjectDetail = () => {
  const navigate = useNavigate();
  const [detailState, setDetailState] = useState<{ project: Project | null, isLoad: boolean, err: string, files: SavedFile[] }>
    ({ project: null, isLoad: false, err: "", files: [] });

  const { id } = useParams<{ id: string }>();
  console.log("id: ", id);
  const apiService = useApiService();

  useEffect(() => {
    if (!id) return;
    setDetailState((prev) => ({ ...prev, isLoad: true, err: "" }))

    Promise.all([
      apiService.fetchProjectById(id),
      apiService.fetchFiles(id)
    ]).then(([projData, fileData]) =>
      setDetailState((prev) => ({ ...prev, isLoad: false, project: projData, files: fileData }))
    )
      .catch((err) => {
        const msg = err instanceof Error ? err.message : 'Failed to get project.';
        setDetailState((prev) => ({ ...prev, isLoad: false, err: msg }))
      })
  }, [id]);

  const calcFilesStat = () => {
    const { files } = detailState;
    if (!files.length) return ({ pdf: 0, img: 0, other: 0, size: 0 })
    const pdfFiles = files.filter(f => f.name.toLowerCase().endsWith('.pdf')).length;
    const imgExt = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    const imgFIles = files.filter(f => {
      const ext = f.name.split('.').pop()?.toLowerCase();
      return ext && imgExt.includes(ext)
    }).length;
    const totalSize = files.reduce((acc, f) => acc + f.size, 0);
    return {
      pdf: (pdfFiles / files.length) * 100, img: (imgFIles / files.length) * 100,
      other: ((files.length - pdfFiles - imgFIles) / files.length) * 100,
      size: (totalSize / 1024).toFixed(1), //for kb
    };
  }

  const filesStat = calcFilesStat();

  return (
    detailState.isLoad ?
      <div className="flex-center page-state">
        <span className="loader loader--lg" />
        <p className="state-text">Loading project detail..</p>
      </div>
      : detailState.err || !detailState.project ?
        <div className="flex-center page-state">
          <div className="flex-center state-icon state-icon--err">
            <svg width="28" height="28" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <p className="state-text">{detailState.err || 'Project not found'}</p>
          <button className="btn-secondary" onClick={() => navigate('/projects')}>
            Back to Projects
          </button>
        </div>
        :
        <div className="detail-page">
          <button className="btn-back" onClick={() => navigate('/projects')}>
            <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>Back
          </button>

          <div className="detail-wrapper">
            <h1 className="detail-title">{detailState.project.name}</h1>
            <p className="detail-desc">{detailState.project.description}</p>
            <div className='flex-between detail-date'>
              <p>Created on{formatDate(detailState.project.createdAt)}</p>
             
            </div>

          </div>
          <div className='detail-grid'>
            <div className="project-card">
              <h3 className="card-name">{"Files"}</h3>
              {!detailState.files.length ?
                <div>
                  <p className="card-description" style={{marginBottom:"1rem"}}>No files attached.</p>
                  <button className="flex-center btn-open" onClick={() => navigate(`/projects/${id}/files`)}>Upload Files</button>
                </div>
                : <div>
                  <p>{`${detailState.files.length} file${detailState.files.length>1 ?'s' :''}`}</p>
                  <p>{`Total Size: ${filesStat.size} KB`}</p>
                  <div className='distribute-bar'>
                    <div className='pdf' style={{ width: `${filesStat.pdf}%` }}></div>
                    <div className='img' style={{ width: `${filesStat.img}%` }}></div>
                    <div className='other' style={{ width: `${filesStat.other}%` }}></div>
                  </div>
                  <button className="flex-center btn-open" onClick={() => navigate(`/projects/${id}/files`)}>Manage Files</button>
                </div>
              }
            </div>
            <div className="project-card">
              <h3 className="card-name">{"Jobs"}</h3>
              <p>TO Do</p>
            </div>
          </div>
        </div>
  );
}

export default ProjectDetail;